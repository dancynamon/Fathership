// Small HTTP helpers tailored for carrier APIs:
// - per-request timeout (carrier APIs occasionally hang)
// - in-memory OAuth2 client_credentials token cache (FedEx-style)
// - structured errors that include carrier name + status

export class CarrierError extends Error {
  constructor(
    public carrier: string,
    message: string,
    public status?: number,
    public body?: string,
  ) {
    super(`[${carrier}] ${message}${status ? ` (HTTP ${status})` : ""}`);
    this.name = "CarrierError";
  }
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit & { timeoutMs?: number; carrier: string },
): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), init.timeoutMs ?? 8_000);
  try {
    const res = await fetch(url, { ...init, signal: ctl.signal });
    const text = await res.text();
    if (!res.ok) {
      throw new CarrierError(init.carrier, `Request failed`, res.status, text.slice(0, 500));
    }
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new CarrierError(init.carrier, "Request timed out");
    }
    if (err instanceof CarrierError) throw err;
    throw new CarrierError(init.carrier, err?.message ?? "Network error");
  } finally {
    clearTimeout(timer);
  }
}

type CachedToken = { token: string; expiresAt: number };
const tokenCache = new Map<string, CachedToken>();

export async function getOAuthToken(opts: {
  carrier: string;
  cacheKey: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scope?: string;
  // Some carriers expect creds in body, others in Basic auth; default body.
  authStyle?: "body" | "basic";
}): Promise<string> {
  const cached = tokenCache.get(opts.cacheKey);
  if (cached && cached.expiresAt > Date.now() + 30_000) {
    return cached.token;
  }

  const body = new URLSearchParams();
  body.set("grant_type", "client_credentials");
  if (opts.scope) body.set("scope", opts.scope);
  const headers: Record<string, string> = {
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json",
  };
  if (opts.authStyle === "basic") {
    const basic = Buffer.from(`${opts.clientId}:${opts.clientSecret}`).toString("base64");
    headers.authorization = `Basic ${basic}`;
  } else {
    body.set("client_id", opts.clientId);
    body.set("client_secret", opts.clientSecret);
  }

  const data = await fetchJson<{ access_token: string; expires_in?: number; token_type?: string }>(
    opts.tokenUrl,
    {
      method: "POST",
      headers,
      body: body.toString(),
      timeoutMs: 6_000,
      carrier: opts.carrier,
    },
  );

  if (!data.access_token) {
    throw new CarrierError(opts.carrier, "OAuth response missing access_token");
  }
  const lifetime = (data.expires_in ?? 3300) * 1000;
  tokenCache.set(opts.cacheKey, {
    token: data.access_token,
    expiresAt: Date.now() + lifetime,
  });
  return data.access_token;
}

export function inDollarsCents(value: number | string | undefined): number {
  if (value == null) return 0;
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}
