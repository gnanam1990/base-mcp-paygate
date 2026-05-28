export type ContentItem = {
  slug: string;
  title: string;
  creator: string;
  creatorAddress: string;
  category: string;
  readTime: string;
  priceUsdc: number;
  preview: string;
  lockedSummary: string;
  fullContent: string;
  coverTone: "ink" | "mint" | "amber" | "rose";
  paidUnlocks: number;
  revenueUsdc: number;
};

export const contentItems: ContentItem[] = [
  {
    slug: "base-agent-commerce-map",
    title: "Base Agent Commerce Map",
    creator: "KRATOS Research",
    creatorAddress: "0x1111111111111111111111111111111111111111",
    category: "Agent economy",
    readTime: "8 min",
    priceUsdc: 0.1,
    preview:
      "A practical map of the x402 services, wallets, and MCP tools that make agent payments work on Base.",
    lockedSummary:
      "The premium section ranks the highest-leverage product wedges, launch channels, and first 20 integrations.",
    fullContent:
      "Premium insight: start with content and API services because they create low-risk, repeatable x402 transactions before moving into DeFi execution. The first partner targets should be creators, data providers, and tool builders already distributing research publicly.",
    coverTone: "ink",
    paidUnlocks: 48,
    revenueUsdc: 4.8,
  },
  {
    slug: "x402-pricing-playbook",
    title: "x402 Pricing Playbook",
    creator: "PayGate Desk",
    creatorAddress: "0x2222222222222222222222222222222222222222",
    category: "Payments",
    readTime: "6 min",
    priceUsdc: 0.05,
    preview:
      "A compact model for setting per-read and per-query prices that feel natural to humans and agents.",
    lockedSummary:
      "The premium section includes starter price bands, refund policy notes, and conversion benchmarks.",
    fullContent:
      "Premium insight: price early reports between 0.03 and 0.25 USDC, keep the first unlock frictionless, and expose maxPayment recommendations in every agent-facing purchase response.",
    coverTone: "mint",
    paidUnlocks: 73,
    revenueUsdc: 3.65,
  },
  {
    slug: "creator-airdrop-launch",
    title: "Creator Airdrop Launch Kit",
    creator: "Base Builders Lab",
    creatorAddress: "0x3333333333333333333333333333333333333333",
    category: "Launch",
    readTime: "10 min",
    priceUsdc: 0.15,
    preview:
      "A launch checklist for creators who want real Base mainnet usage, public proof, and repeat transactions.",
    lockedSummary:
      "The premium section contains launch copy, demo video structure, and public analytics targets.",
    fullContent:
      "Premium insight: ship three paid pieces, invite five public testers, publish receipt screenshots, and post a one-minute demo where an assistant discovers, pays for, and summarizes premium content.",
    coverTone: "amber",
    paidUnlocks: 31,
    revenueUsdc: 4.65,
  },
  {
    slug: "mcp-plugin-spec-notes",
    title: "MCP Plugin Spec Notes",
    creator: "Agent Ops",
    creatorAddress: "0x4444444444444444444444444444444444444444",
    category: "MCP",
    readTime: "7 min",
    priceUsdc: 0.08,
    preview:
      "Field notes for turning app actions into assistant-readable tools, previews, and purchase URLs.",
    lockedSummary:
      "The premium section includes tool naming rules and response shapes for paid content access.",
    fullContent:
      "Premium insight: keep read tools deterministic, make paid resources explicit, return human-readable summaries beside URLs, and never hide a transaction behind a generic action label.",
    coverTone: "rose",
    paidUnlocks: 26,
    revenueUsdc: 2.08,
  },
];

export const featuredContent = contentItems[0];

export const creatorStats = {
  revenueUsdc: contentItems.reduce((sum, item) => sum + item.revenueUsdc, 0),
  paidUnlocks: contentItems.reduce((sum, item) => sum + item.paidUnlocks, 0),
  publishedCount: contentItems.length,
  conversionRate: 18.4,
};

export const recentActivity = [
  { title: "Base Agent Commerce Map", time: "2 min ago", amount: "+0.10 USDC" },
  { title: "x402 Pricing Playbook", time: "12 min ago", amount: "+0.05 USDC" },
  { title: "Creator Airdrop Launch Kit", time: "29 min ago", amount: "+0.15 USDC" },
];

export function findContentBySlug(slug: string) {
  return contentItems.find((item) => item.slug === slug);
}

export function toPublicContent(item: ContentItem) {
  return {
    slug: item.slug,
    title: item.title,
    creator: item.creator,
    creatorAddress: item.creatorAddress,
    category: item.category,
    readTime: item.readTime,
    priceUsdc: item.priceUsdc,
    preview: item.preview,
    lockedSummary: item.lockedSummary,
    paidUnlocks: item.paidUnlocks,
    revenueUsdc: item.revenueUsdc,
  };
}

export function publicContentItems() {
  return contentItems.map(toPublicContent);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 1 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
