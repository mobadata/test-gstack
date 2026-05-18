/**
 * États brouillon / réponse (aligné ARCHITECTURE.md §3.2).
 * Les transitions serveur (Meta, audit) ne vivent pas ici — seulement la logique pure.
 */

export const DRAFT_STATUSES = [
  "pending_review",
  "edited",
  "rejected",
  "approved",
  "sent",
  "failed",
] as const;

export type DraftStatus = (typeof DRAFT_STATUSES)[number];

export function isTerminalDraftStatus(status: DraftStatus): boolean {
  return status === "sent" || status === "rejected";
}

export function canHumanApprove(status: DraftStatus): boolean {
  return status === "pending_review" || status === "edited";
}

export function draftStatusLabelFr(status: DraftStatus): string {
  const labels: Record<DraftStatus, string> = {
    pending_review: "À valider",
    edited: "Modifié",
    rejected: "Refusé",
    approved: "Approuvé",
    sent: "Envoyé",
    failed: "Échec",
  };
  return labels[status];
}
