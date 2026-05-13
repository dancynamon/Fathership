"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CarrierAcceptButton({ shipmentId }: { shipmentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function accept() {
    setLoading(true);
    try {
      const res = await fetch(`/api/loads/${shipmentId}/accept`, { method: "POST" });
      if (res.ok) {
        router.push(`/carrier/mine`);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <button className="btn-brand" onClick={accept} disabled={loading}>
      {loading ? "Accepting…" : "Accept"}
    </button>
  );
}
