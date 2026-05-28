import {
  ArrowLeft,
  Clock3,
  FileText,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import UnlockPanel from "./unlock-panel";
import { formatCurrency } from "@/lib/paygate-data";
import { findContentBySlug } from "@/lib/paygate-store";

type ContentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params;
  const item = findContentBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="reader-shell">
      <header className="reader-header">
        <Link className="back-link" href="/">
          <ArrowLeft size={17} />
          PayGate
        </Link>
        <button className="wallet-button" type="button">
          <ShieldCheck size={18} />
          Base Account
        </button>
      </header>

      <section className="reader-layout">
        <article className="reader-article">
          <div className={`reader-cover ${item.coverTone}`} aria-hidden="true">
            <FileText size={42} />
            <span>{item.category}</span>
          </div>

          <div className="article-meta">
            <span>
              <UserRound size={16} />
              {item.creator}
            </span>
            <span>
              <Clock3 size={16} />
              {item.readTime}
            </span>
          </div>

          <h1>{item.title}</h1>
          <p className="article-preview">{item.preview}</p>

          <div className="locked-section">
            <div>
              <LockKeyhole size={22} />
              <h2>Premium section</h2>
            </div>
            <p>{item.lockedSummary}</p>
          </div>
        </article>

        <aside className="paywall-panel">
          <div className="price-block">
            <span>Unlock price</span>
            <strong>{formatCurrency(item.priceUsdc)}</strong>
          </div>
          <div className="receipt-note">
            <ReceiptText size={18} />
            <span>USDC receipt recorded for creator analytics.</span>
          </div>
          <UnlockPanel slug={item.slug} title={item.title} />
        </aside>
      </section>
    </main>
  );
}
