import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import CreatorWorkspace from "./creator-workspace";
import { listCreatorReports } from "@/lib/paygate-store";

export const dynamic = "force-dynamic";

export default function CreatorPage() {
  const initialReports = listCreatorReports();

  return (
    <main className="creator-shell">
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
      <CreatorWorkspace initialReports={initialReports} />
    </main>
  );
}
