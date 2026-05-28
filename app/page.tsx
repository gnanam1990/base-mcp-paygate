import {
  Activity,
  ArrowUpRight,
  BookOpenText,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  LockKeyhole,
  ReceiptText,
  Search,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import {
  contentItems,
  creatorStats,
  featuredContent,
  formatCurrency,
  formatNumber,
  recentActivity,
} from "@/lib/paygate-data";

const navItems = ["Dashboard", "Content", "Payments", "MCP", "Docs"];

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            PG
          </div>
          <div>
            <p className="eyebrow">Base MCP Suite</p>
            <h1>PayGate</h1>
          </div>
        </div>
        <nav className="nav-tabs" aria-label="PayGate sections">
          {navItems.map((item, index) => (
            <a className={index === 0 ? "active" : ""} href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
        </nav>
        <button className="wallet-button" type="button">
          <WalletCards size={18} />
          Base Account
        </button>
      </header>

      <section className="workspace-grid">
        <aside className="control-panel" aria-labelledby="creator-desk">
          <div className="panel-heading">
            <p className="eyebrow">Creator desk</p>
            <h2 id="creator-desk">USDC paywall operations</h2>
          </div>

          <div className="stat-stack">
            <MetricCard
              icon={<CircleDollarSign size={20} />}
              label="Revenue"
              value={formatCurrency(creatorStats.revenueUsdc)}
              accent="green"
            />
            <MetricCard
              icon={<ReceiptText size={20} />}
              label="Paid unlocks"
              value={formatNumber(creatorStats.paidUnlocks)}
              accent="blue"
            />
            <MetricCard
              icon={<BookOpenText size={20} />}
              label="Published"
              value={formatNumber(creatorStats.publishedCount)}
              accent="amber"
            />
          </div>

          <div className="status-strip">
            <span>
              <ShieldCheck size={18} /> Base Sepolia
            </span>
            <span>
              <CheckCircle2 size={18} /> x402 ready
            </span>
          </div>

          <div className="activity-list">
            <div className="section-title">
              <Activity size={18} />
              <h3>Recent receipts</h3>
            </div>
            {recentActivity.map((activity) => (
              <div className="activity-row" key={`${activity.title}-${activity.time}`}>
                <div>
                  <strong>{activity.title}</strong>
                  <span>{activity.time}</span>
                </div>
                <b>{activity.amount}</b>
              </div>
            ))}
          </div>
        </aside>

        <section className="main-workspace" id="content">
          <div className="toolbar">
            <div>
              <p className="eyebrow">Content inventory</p>
              <h2>Premium reports</h2>
            </div>
            <div className="search-box">
              <Search size={17} />
              <span>Search reports, creators, topics</span>
            </div>
          </div>

          <div className="feature-layout">
            <article className="featured-report">
              <ReportCover tone={featuredContent.coverTone} category={featuredContent.category} />
              <div className="featured-copy">
                <div className="report-meta">
                  <span>{featuredContent.category}</span>
                  <span>{featuredContent.readTime}</span>
                </div>
                <h2>{featuredContent.title}</h2>
                <p>{featuredContent.preview}</p>
                <div className="report-actions">
                  <Link className="primary-action" href={`/content/${featuredContent.slug}`}>
                    Open paywall
                    <ArrowUpRight size={17} />
                  </Link>
                  <span className="price-pill">{formatCurrency(featuredContent.priceUsdc)}</span>
                </div>
              </div>
            </article>

            <div className="mcp-panel" id="mcp">
              <div className="section-title">
                <LockKeyhole size={18} />
                <h3>MCP tools</h3>
              </div>
              <ul>
                <li>search_paygate_content</li>
                <li>get_paygate_preview</li>
                <li>get_paygate_purchase_url</li>
                <li>get_paygate_creator_stats</li>
              </ul>
            </div>
          </div>

          <div className="content-grid">
            {contentItems.map((item) => (
              <Link className="content-card" href={`/content/${item.slug}`} key={item.slug}>
                <ReportCover tone={item.coverTone} category={item.category} compact />
                <div className="card-body">
                  <div className="report-meta">
                    <span>{item.category}</span>
                    <span>{item.readTime}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.preview}</p>
                  <div className="card-footer">
                    <span>{formatCurrency(item.priceUsdc)}</span>
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "green" | "blue" | "amber";
}) {
  return (
    <div className={`metric-card ${accent}`}>
      <span className="metric-icon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function ReportCover({
  tone,
  category,
  compact = false,
}: {
  tone: string;
  category: string;
  compact?: boolean;
}) {
  return (
    <div className={`report-cover ${tone} ${compact ? "compact" : ""}`} aria-hidden="true">
      <FileText size={compact ? 24 : 34} />
      <span>{category}</span>
      <div className="cover-bars">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
