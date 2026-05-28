import crypto from "node:crypto";
import type { PayGateContent } from "./paygate-store";

type PaymentRequirement = {
  scheme: "exact";
  network: string;
  asset: "USDC";
  amount: string;
  payTo: string;
  resource: string;
  description: string;
};

type PaymentVerification =
  | {
      ok: true;
      mode: "demo" | "facilitator";
      network: string;
      paymentPayloadHash?: string;
      facilitatorReference?: string;
      payerAddress?: string;
      paymentResponse?: string;
    }
  | {
      ok: false;
      reason: string;
    };

export function paymentRequirement(item: PayGateContent, resourceUrl: string): PaymentRequirement {
  return {
    scheme: "exact",
    network: process.env.PAYGATE_X402_NETWORK || "eip155:84532",
    asset: "USDC",
    amount: item.priceUsdc.toFixed(2),
    payTo: process.env.X402_RECEIVING_ADDRESS || item.creatorAddress,
    resource: resourceUrl,
    description: `Unlock ${item.title} for ${item.priceUsdc.toFixed(2)} USDC on Base Sepolia.`,
  };
}

export function paymentRequiredBody(item: PayGateContent, resourceUrl: string) {
  const requirement = paymentRequirement(item, resourceUrl);
  return {
    error: "payment_required",
    x402Version: 1,
    description: requirement.description,
    accepts: [requirement],
  };
}

export async function verifyPayment(
  request: Request,
  item: PayGateContent,
  resourceUrl: string,
): Promise<PaymentVerification> {
  const demoPayment = request.headers.get("x-demo-payment");
  const paymentHeader = request.headers.get("x-payment");
  const mode = process.env.PAYGATE_PAYMENT_MODE || "demo";
  const requirement = paymentRequirement(item, resourceUrl);

  if (demoPayment && mode !== "strict") {
    return {
      ok: true,
      mode: "demo",
      network: requirement.network,
      paymentPayloadHash: hashPayload(demoPayment),
      payerAddress: "demo-paygate-reader",
      paymentResponse: encodePaymentResponse({
        mode: "demo",
        network: requirement.network,
        amount: requirement.amount,
        resource: requirement.resource,
      }),
    };
  }

  if (!paymentHeader) {
    return { ok: false, reason: "payment_header_missing" };
  }

  const facilitatorUrl = process.env.X402_FACILITATOR_URL;
  if (!facilitatorUrl) {
    return { ok: false, reason: "facilitator_not_configured" };
  }

  const paymentPayload = decodePaymentHeader(paymentHeader);
  const verifyBody = {
    x402Version: 1,
    paymentPayload,
    paymentRequirements: requirement,
  };

  const verifyResult = await callFacilitator(`${facilitatorUrl}/verify`, verifyBody);
  if (!verifyResult.ok) {
    return { ok: false, reason: verifyResult.reason };
  }

  const settleResult = await callFacilitator(`${facilitatorUrl}/settle`, verifyBody);
  if (!settleResult.ok) {
    return { ok: false, reason: settleResult.reason };
  }

  const responsePayload = {
    verify: verifyResult.body,
    settle: settleResult.body,
  };

  return {
    ok: true,
    mode: "facilitator",
    network: requirement.network,
    paymentPayloadHash: hashPayload(paymentHeader),
    facilitatorReference: referenceFrom(settleResult.body),
    payerAddress: payerFrom(paymentPayload),
    paymentResponse: encodePaymentResponse(responsePayload),
  };
}

function hashPayload(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function decodePaymentHeader(paymentHeader: string) {
  try {
    return JSON.parse(paymentHeader) as unknown;
  } catch {
    try {
      return JSON.parse(Buffer.from(paymentHeader, "base64url").toString("utf8")) as unknown;
    } catch {
      return paymentHeader;
    }
  }
}

async function callFacilitator(url: string, body: unknown) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    const json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    const ok = response.ok && json.valid !== false && json.success !== false && !json.error;
    return ok
      ? { ok: true as const, body: json }
      : { ok: false as const, reason: String(json.error || json.reason || response.statusText) };
  } catch (error) {
    return {
      ok: false as const,
      reason: error instanceof Error ? error.message : "facilitator_request_failed",
    };
  }
}

function referenceFrom(value: unknown) {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const record = value as Record<string, unknown>;
  return String(record.txHash || record.transactionHash || record.reference || record.id || "");
}

function payerFrom(value: unknown) {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const record = value as Record<string, unknown>;
  return String(record.from || record.payer || record.address || "");
}

function encodePaymentResponse(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}
