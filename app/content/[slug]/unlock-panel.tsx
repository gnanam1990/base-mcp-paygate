"use client";

import { CheckCircle2, LockKeyhole, ReceiptText } from "lucide-react";
import { useState } from "react";

type UnlockState =
  | {
      status: "idle";
    }
  | {
      status: "payment_required";
      challenge: string;
    }
  | {
      status: "unlocked";
      fullContent: string;
      receiptId: string;
    }
  | {
      status: "error";
      message: string;
    };

export default function UnlockPanel({ slug, title }: { slug: string; title: string }) {
  const [state, setState] = useState<UnlockState>({ status: "idle" });
  const [busy, setBusy] = useState(false);

  async function requestUnlock() {
    setBusy(true);
    try {
      const challengeResponse = await fetch(`/api/paygate/content/${slug}/full`);
      const challenge = await challengeResponse.json();

      if (challengeResponse.status !== 402) {
        throw new Error("Expected x402 payment challenge.");
      }

      setState({
        status: "payment_required",
        challenge: challenge.description ?? "Payment required for premium content.",
      });

      const unlockResponse = await fetch(`/api/paygate/content/${slug}/full`, {
        headers: {
          "x-demo-payment": "accepted",
        },
      });

      if (!unlockResponse.ok) {
        throw new Error("Unlock failed after demo payment.");
      }

      const unlocked = await unlockResponse.json();
      setState({
        status: "unlocked",
        fullContent: unlocked.fullContent,
        receiptId: unlocked.receipt.id,
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Unlock failed.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="unlock-flow">
      <button className="primary-action full-width" disabled={busy} onClick={requestUnlock} type="button">
        <LockKeyhole size={17} />
        {busy ? "Processing" : "Request x402 unlock"}
      </button>

      {state.status === "payment_required" && (
        <div className="flow-state">
          <ReceiptText size={18} />
          <span>{state.challenge}</span>
        </div>
      )}

      {state.status === "unlocked" && (
        <div className="unlocked-content">
          <div className="flow-state success">
            <CheckCircle2 size={18} />
            <span>Unlocked {title}</span>
          </div>
          <p>{state.fullContent}</p>
          <code>{state.receiptId}</code>
        </div>
      )}

      {state.status === "error" && <p className="error-text">{state.message}</p>}
    </div>
  );
}
