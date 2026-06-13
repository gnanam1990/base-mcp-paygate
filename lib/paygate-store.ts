import fs from "node:fs";
import path from "node:path";
import { contentItems, type ContentItem, type ContentStatus, type CreatorReport } from "./paygate-data";

export type PayGateContent = ContentItem & {
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
};

export type PayGateReceipt = {
  id: string;
  slug: string;
  title: string;
  amountUsdc: number;
  asset: "USDC";
  network: string;
  creatorAddress: string;
  payerAddress?: string;
  paymentMode: "demo" | "facilitator";
  paymentPayloadHash?: string;
  facilitatorReference?: string;
  createdAt: string;
};

type PayGateDb = {
  contents: PayGateContent[];
  receipts: PayGateReceipt[];
};

type DraftInput = {
  title: string;
  category: string;
  priceUsdc: number;
  preview: string;
  fullContent: string;
};

const defaultCreator = {
  name: "KRATOS Research",
  address: "0x1111111111111111111111111111111111111111",
};

const seedDraft: PayGateContent = {
  slug: "draft-agent-checkout",
  title: "Agent Checkout UX Notes",
  creator: defaultCreator.name,
  creatorAddress: defaultCreator.address,
  category: "UX",
  readTime: "5 min",
  priceUsdc: 0.07,
  preview: "Patterns for making AI-agent purchase review clear before any Base approval.",
  lockedSummary: "Premium notes include payment cap defaults, receipt copy, and failure states.",
  fullContent: "Premium notes will include payment cap defaults, receipt copy, and failure states.",
  coverTone: "mint",
  paidUnlocks: 0,
  revenueUsdc: 0,
  status: "Draft",
  createdAt: "2026-05-28T00:00:00.000Z",
  updatedAt: "2026-05-28T00:00:00.000Z",
};

function dbPath() {
  if (process.env.PAYGATE_DATA_FILE) {
    return process.env.PAYGATE_DATA_FILE;
  }
  return process.env.VERCEL
    ? path.join("/tmp", "paygate-db.json")
    : path.join(/*turbopackIgnore: true*/ process.cwd(), ".data", "paygate-db.json");
}

function seedDb(): PayGateDb {
  const createdAt = "2026-05-28T00:00:00.000Z";
  return {
    contents: [
      ...contentItems.map((item) => ({
        ...item,
        status: "Published" as const,
        createdAt,
        updatedAt: createdAt,
      })),
      seedDraft,
    ],
    receipts: [],
  };
}

function readDb(): PayGateDb {
  const file = dbPath();
  if (!fs.existsSync(file)) {
    const initial = seedDb();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(initial, null, 2));
    return initial;
  }

  return JSON.parse(fs.readFileSync(file, "utf8")) as PayGateDb;
}

function writeDb(db: PayGateDb) {
  const file = dbPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `paygate-report-${Date.now()}`;
}

function uniqueSlug(title: string, contents: PayGateContent[]) {
  const base = slugify(title);
  let candidate = base;
  let count = 2;
  while (contents.some((item) => item.slug === candidate)) {
    candidate = `${base}-${count}`;
    count += 1;
  }
  return candidate;
}

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.ceil(words / 180))} min`;
}

function toPublicContent(item: PayGateContent) {
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
    coverTone: item.coverTone,
  };
}

export function listPublishedContent() {
  return readDb()
    .contents.filter((item) => item.status === "Published")
    .map(toPublicContent);
}

export function listCreatorReports(): CreatorReport[] {
  return readDb().contents.map((item) => ({
    id: item.slug,
    title: item.title,
    category: item.category,
    priceUsdc: item.priceUsdc,
    preview: item.preview,
    fullContent: item.fullContent,
    status: item.status,
    unlocks: item.paidUnlocks,
  }));
}

export function findContentBySlug(slug: string) {
  return readDb().contents.find((item) => item.slug === slug && item.status === "Published");
}

export function findPublicContentBySlug(slug: string) {
  const item = findContentBySlug(slug);
  return item ? toPublicContent(item) : undefined;
}

export function findAnyContentBySlug(slug: string) {
  return readDb().contents.find((item) => item.slug === slug);
}

export function getCreatorStats(address?: string) {
  const db = readDb();
  const contents = address
    ? db.contents.filter((item) => item.creatorAddress.toLowerCase() === address.toLowerCase())
    : db.contents;
  return {
    revenueUsdc: contents.reduce((sum, item) => sum + item.revenueUsdc, 0),
    paidUnlocks: contents.reduce((sum, item) => sum + item.paidUnlocks, 0),
    publishedCount: contents.filter((item) => item.status === "Published").length,
    draftCount: contents.filter((item) => item.status === "Draft").length,
    conversionRate: 18.4,
  };
}

export function getRecentActivity() {
  const db = readDb();
  const receipts = db.receipts
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  if (receipts.length > 0) {
    return receipts.map((receipt) => ({
      title: receipt.title,
      time: new Date(receipt.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: `+${receipt.amountUsdc.toFixed(2)} USDC`,
    }));
  }

  return db.contents
    .filter((item) => item.status === "Published")
    .slice(0, 3)
    .map((item) => ({
      title: item.title,
      time: "Seeded",
      amount: `+${item.revenueUsdc.toFixed(2)} USDC`,
    }));
}

export function createDraft(input: DraftInput) {
  const db = readDb();
  const now = new Date().toISOString();
  const slug = uniqueSlug(input.title, db.contents);
  const coverTones: PayGateContent["coverTone"][] = ["ink", "mint", "amber", "rose"];
  const draft: PayGateContent = {
    slug,
    title: input.title,
    creator: defaultCreator.name,
    creatorAddress: defaultCreator.address,
    category: input.category,
    readTime: estimateReadTime(input.fullContent),
    priceUsdc: input.priceUsdc,
    preview: input.preview,
    lockedSummary: input.preview,
    fullContent: input.fullContent,
    coverTone: coverTones[db.contents.length % coverTones.length],
    paidUnlocks: 0,
    revenueUsdc: 0,
    status: "Draft",
    createdAt: now,
    updatedAt: now,
  };

  db.contents.unshift(draft);
  writeDb(db);
  return toCreatorReport(draft);
}

export function publishContent(slug: string) {
  const db = readDb();
  const item = db.contents.find((content) => content.slug === slug);
  if (!item) {
    return undefined;
  }

  item.status = "Published";
  item.updatedAt = new Date().toISOString();
  writeDb(db);
  return toCreatorReport(item);
}

export function recordPaidUnlock(
  slug: string,
  payment: Omit<PayGateReceipt, "id" | "slug" | "title" | "amountUsdc" | "asset" | "creatorAddress" | "createdAt">,
) {
  const db = readDb();
  const item = db.contents.find((content) => content.slug === slug);
  if (!item) {
    return undefined;
  }

  const receipt: PayGateReceipt = {
    id: `paygate-${slug}-${Date.now()}`,
    slug,
    title: item.title,
    amountUsdc: item.priceUsdc,
    asset: "USDC",
    network: payment.network,
    creatorAddress: item.creatorAddress,
    payerAddress: payment.payerAddress,
    paymentMode: payment.paymentMode,
    paymentPayloadHash: payment.paymentPayloadHash,
    facilitatorReference: payment.facilitatorReference,
    createdAt: new Date().toISOString(),
  };

  item.paidUnlocks += 1;
  item.revenueUsdc = Number((item.revenueUsdc + item.priceUsdc).toFixed(6));
  item.updatedAt = receipt.createdAt;
  db.receipts.unshift(receipt);
  writeDb(db);
  return receipt;
}

function toCreatorReport(item: PayGateContent): CreatorReport {
  return {
    id: item.slug,
    title: item.title,
    category: item.category,
    priceUsdc: item.priceUsdc,
    preview: item.preview,
    fullContent: item.fullContent,
    status: item.status,
    unlocks: item.paidUnlocks,
  };
}
