import Link from "next/link";
import { InboxView } from "@/components/inbox/inbox-view";
import { inboxRows } from "@/lib/mocks/inbox";

export default function InboxPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--inbox-bg)] text-[var(--inbox-text)]">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--inbox-border)] bg-[var(--inbox-surface)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "var(--inbox-accent)" }}
            aria-hidden
          >
            G
          </div>
          <div>
            <p className="text-sm font-semibold">Inbox commentaires</p>
            <p className="text-[11px] text-[var(--inbox-muted)]">Brouillons à valider avant envoi Instagram</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="inbox-search">
            Rechercher
          </label>
          <input
            id="inbox-search"
            type="search"
            placeholder="Rechercher…"
            className="w-[min(100%,220px)] rounded border border-[var(--inbox-border)] bg-[#fafafa] px-3 py-1.5 text-sm outline-none focus:border-[var(--inbox-accent)]"
            disabled
            title="Bientôt : recherche serveur"
          />
          <Link
            href="/"
            className="rounded border border-[var(--inbox-border)] px-3 py-1.5 text-sm hover:bg-[var(--inbox-row-hover)]"
          >
            Accueil
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-4 min-h-0">
        <InboxView rows={inboxRows} />
      </main>
    </div>
  );
}
