"use client";

import {
  BookOpenText,
  CheckCircle2,
  CircleDollarSign,
  FilePenLine,
  FileText,
  Send,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { contentItems, formatCurrency } from "@/lib/paygate-data";

type ReportStatus = "Draft" | "Published";

type CreatorReport = {
  id: string;
  title: string;
  category: string;
  priceUsdc: number;
  preview: string;
  fullContent: string;
  status: ReportStatus;
  unlocks: number;
};

const initialReports: CreatorReport[] = [
  ...contentItems.map((item) => ({
    id: item.slug,
    title: item.title,
    category: item.category,
    priceUsdc: item.priceUsdc,
    preview: item.preview,
    fullContent: item.fullContent,
    status: "Published" as ReportStatus,
    unlocks: item.paidUnlocks,
  })),
  {
    id: "draft-agent-checkout",
    title: "Agent Checkout UX Notes",
    category: "UX",
    priceUsdc: 0.07,
    preview: "Patterns for making AI-agent purchase review clear before any Base approval.",
    fullContent: "Premium notes will include payment cap defaults, receipt copy, and failure states.",
    status: "Draft",
    unlocks: 0,
  },
];

const emptyForm = {
  title: "",
  category: "Research",
  priceUsdc: "0.10",
  preview: "",
  fullContent: "",
};

export default function CreatorWorkspace() {
  const [reports, setReports] = useState(initialReports);
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(initialReports[0].id);
  const [notice, setNotice] = useState("Ready");

  const selectedReport = reports.find((report) => report.id === selectedId) ?? reports[0];
  const totals = useMemo(
    () => ({
      published: reports.filter((report) => report.status === "Published").length,
      drafts: reports.filter((report) => report.status === "Draft").length,
      revenue: reports.reduce((sum, report) => sum + report.priceUsdc * report.unlocks, 0),
    }),
    [reports],
  );

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const price = Number.parseFloat(form.priceUsdc);
    const draft: CreatorReport = {
      id: `draft-${Date.now()}`,
      title: form.title.trim() || "Untitled PayGate report",
      category: form.category.trim() || "Research",
      priceUsdc: Number.isFinite(price) ? price : 0.1,
      preview: form.preview.trim() || "Draft preview pending.",
      fullContent: form.fullContent.trim() || "Draft premium content pending.",
      status: "Draft",
      unlocks: 0,
    };

    setReports((current) => [draft, ...current]);
    setSelectedId(draft.id);
    setForm(emptyForm);
    setNotice("Draft saved");
  }

  function publishSelected() {
    setReports((current) =>
      current.map((report) =>
        report.id === selectedReport.id ? { ...report, status: "Published" } : report,
      ),
    );
    setNotice("Report published");
  }

  return (
    <section className="creator-workspace">
      <aside className="creator-sidebar">
        <div className="panel-heading">
          <p className="eyebrow">Creator console</p>
          <h1>Publishing desk</h1>
        </div>

        <div className="stat-stack compact-stats">
          <Metric icon={<BookOpenText size={20} />} label="Published" value={String(totals.published)} />
          <Metric icon={<FilePenLine size={20} />} label="Drafts" value={String(totals.drafts)} />
          <Metric icon={<CircleDollarSign size={20} />} label="Revenue" value={formatCurrency(totals.revenue)} />
        </div>

        <div className="notice-pill">
          <CheckCircle2 size={17} />
          {notice}
        </div>
      </aside>

      <section className="editor-surface">
        <form className="editor-form" onSubmit={saveDraft}>
          <div className="toolbar">
            <div>
              <p className="eyebrow">New report</p>
              <h2>Draft premium content</h2>
            </div>
            <button className="primary-action" type="submit">
              <FileText size={17} />
              Save draft
            </button>
          </div>

          <div className="form-grid">
            <label>
              <span>Title</span>
              <input
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Base creator market brief"
                value={form.title}
              />
            </label>
            <label>
              <span>Category</span>
              <input
                onChange={(event) => updateField("category", event.target.value)}
                placeholder="Research"
                value={form.category}
              />
            </label>
            <label>
              <span>Price USDC</span>
              <input
                inputMode="decimal"
                onChange={(event) => updateField("priceUsdc", event.target.value)}
                placeholder="0.10"
                value={form.priceUsdc}
              />
            </label>
          </div>

          <label className="wide-field">
            <span>Preview</span>
            <textarea
              onChange={(event) => updateField("preview", event.target.value)}
              placeholder="Public summary shown before payment."
              rows={3}
              value={form.preview}
            />
          </label>

          <label className="wide-field">
            <span>Premium content</span>
            <textarea
              onChange={(event) => updateField("fullContent", event.target.value)}
              placeholder="Paid report body unlocked after x402 payment."
              rows={7}
              value={form.fullContent}
            />
          </label>
        </form>

        <div className="report-management">
          <div className="toolbar">
            <div>
              <p className="eyebrow">Inventory</p>
              <h2>Reports</h2>
            </div>
            <button
              className="wallet-button"
              disabled={selectedReport.status === "Published"}
              onClick={publishSelected}
              type="button"
            >
              <Send size={17} />
              Publish
            </button>
          </div>

          <div className="management-grid">
            <div className="report-list" aria-label="Creator reports">
              {reports.map((report) => (
                <button
                  className={report.id === selectedReport.id ? "selected" : ""}
                  key={report.id}
                  onClick={() => setSelectedId(report.id)}
                  type="button"
                >
                  <strong>{report.title}</strong>
                  <span>{report.status}</span>
                </button>
              ))}
            </div>

            <article className="report-inspector">
              <div className="report-meta">
                <span>{selectedReport.category}</span>
                <span>{selectedReport.status}</span>
              </div>
              <h3>{selectedReport.title}</h3>
              <p>{selectedReport.preview}</p>
              <div className="inspector-footer">
                <b>{formatCurrency(selectedReport.priceUsdc)}</b>
                <span>{selectedReport.unlocks} unlocks</span>
              </div>
            </article>
          </div>
        </div>
      </section>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="metric-card">
      <span className="metric-icon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
