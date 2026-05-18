"use client";

import { useMemo, useState } from "react";
import type { InboxRow } from "@/lib/mocks/inbox";
import type { DraftStatus } from "@/lib/domain/draft-state";
import {
  canHumanApprove,
  draftStatusLabelFr,
  isTerminalDraftStatus,
} from "@/lib/domain/draft-state";

const severityStyles: Record<
  InboxRow["severity"],
  { label: string; className: string }
> = {
  high: { label: "Urgent", className: "bg-[var(--severity-high-bg)] text-[var(--severity-high-fg)]" },
  medium: {
    label: "Modéré",
    className: "bg-[var(--severity-medium-bg)] text-[var(--severity-medium-fg)]",
  },
  low: { label: "Faible", className: "bg-[var(--severity-low-bg)] text-[var(--severity-low-fg)]" },
};

interface InboxViewProps {
  rows: InboxRow[];
}

export function InboxView({ rows }: InboxViewProps) {
  const [selectedId, setSelectedId] = useState(rows[0]?.id ?? "");
  const [localStatuses, setLocalStatuses] = useState<Record<string, DraftStatus>>(() =>
    Object.fromEntries(rows.map((r) => [r.id, r.draftStatus]))
  );
  const [draftBodies, setDraftBodies] = useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((r) => [r.id, r.draftBody]))
  );

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? rows[0],
    [rows, selectedId]
  );

  if (!selected) {
    return (
      <p className="p-6 text-sm text-[var(--inbox-muted)]">Aucun commentaire à traiter.</p>
    );
  }

  const status = localStatuses[selected.id] ?? selected.draftStatus;
  const body = draftBodies[selected.id] ?? selected.draftBody;
  const terminal = isTerminalDraftStatus(status);
  const canApprove = canHumanApprove(status);

  function setStatusForSelected(next: DraftStatus) {
    setLocalStatuses((prev) => ({ ...prev, [selected.id]: next }));
  }

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex-1 overflow-auto border border-[var(--inbox-border)] bg-[var(--inbox-surface)]">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--inbox-surface)] shadow-[inset_0_-1px_0_var(--inbox-border)]">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--inbox-muted)]">
              <th className="px-3 py-2 w-[100px]">Sévérité</th>
              <th className="px-3 py-2 w-[22%]">Contexte</th>
              <th className="px-3 py-2 w-[28%]">Commentaire</th>
              <th className="px-3 py-2 w-[30%]">Brouillon</th>
              <th className="px-3 py-2 w-[120px]">Décision</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowStatus = localStatuses[row.id] ?? row.draftStatus;
              const isSel = row.id === selected.id;
              return (
                <tr
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(row.id);
                    }
                  }}
                  className={`cursor-pointer border-t border-[var(--inbox-border)] transition-colors ${
                    isSel ? "bg-[var(--inbox-row-selected)]" : "hover:bg-[var(--inbox-row-hover)]"
                  }`}
                >
                  <td className="px-3 py-2 align-top">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${severityStyles[row.severity].className}`}
                    >
                      {severityStyles[row.severity].label}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top text-[13px] text-[var(--inbox-text)]">
                    {row.context}
                  </td>
                  <td className="px-3 py-2 align-top text-[13px] text-[var(--inbox-muted)]">
                    {row.excerpt}
                  </td>
                  <td className="px-3 py-2 align-top text-[13px] text-[var(--inbox-text)]">
                    <span className="line-clamp-2">{row.draftPreview}</span>
                  </td>
                  <td className="px-3 py-2 align-top text-[12px] text-[var(--inbox-muted)]">
                    {draftStatusLabelFr(rowStatus)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="mt-3 shrink-0 border border-[var(--inbox-border)] bg-[var(--inbox-surface)] p-4">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-[var(--inbox-text)]">Brouillon — réponse</h2>
          <span className="text-xs text-[var(--inbox-muted)]">
            {selected.context} · {draftStatusLabelFr(status)}
          </span>
        </div>
        <textarea
          className="mb-3 min-h-[120px] w-full resize-y rounded border border-[var(--inbox-border)] bg-[#fafafa] px-3 py-2 text-[13px] text-[var(--inbox-text)] outline-none focus:border-[var(--inbox-accent)] focus:ring-1 focus:ring-[var(--inbox-accent)] disabled:opacity-60"
          value={body}
          disabled={terminal}
          onChange={(e) => {
            setDraftBodies((prev) => ({ ...prev, [selected.id]: e.target.value }));
            if (status === "pending_review") {
              setStatusForSelected("edited");
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={terminal}
            onClick={() => setStatusForSelected("rejected")}
            className="rounded border border-[var(--inbox-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--inbox-text)] hover:bg-[var(--inbox-row-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refuser
          </button>
          <button
            type="button"
            disabled={terminal || !canApprove}
            onClick={() => setStatusForSelected("approved")}
            className="rounded bg-[var(--inbox-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Valider & envoyer
          </button>
        </div>
        <p className="mt-2 text-[11px] text-[var(--inbox-muted)]">
          Maquette MVP : les actions mettent à jour l’état local uniquement. Persistance Supabase + envoi Meta à brancher
          sur des server actions.
        </p>
      </section>
    </div>
  );
}
