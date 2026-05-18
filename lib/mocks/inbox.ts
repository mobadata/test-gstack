import type { DraftStatus } from "@/lib/domain/draft-state";

export type InboxSeverity = "high" | "medium" | "low";

export interface InboxRow {
  id: string;
  severity: InboxSeverity;
  context: string;
  excerpt: string;
  draftPreview: string;
  draftBody: string;
  draftStatus: DraftStatus;
}

/** Données de démo pour l’UI inbox (remplacées par Supabase + sync Meta). */
export const inboxRows: InboxRow[] = [
  {
    id: "1",
    severity: "high",
    context: "Post « Nouvelle collection » — @cliente_marie",
    excerpt: "Le colis est arrivé abîmé, que faites-vous ?",
    draftPreview: "Bonjour Marie, nous sommes désolés pour ce désagrément…",
    draftBody:
      "Bonjour Marie, nous sommes désolés pour ce désagrément. Pouvez-vous nous envoyer une photo de l’emballage et du colis abîmé à support@… ? Nous vous proposerons un retour ou un avoir sous 48 h.",
    draftStatus: "pending_review",
  },
  {
    id: "2",
    severity: "medium",
    context: "Reel promo — @curieux_du_net",
    excerpt: "C’est dispo en magasin aussi ?",
    draftPreview: "Oui, la promo est valable en ligne et en boutique…",
    draftBody:
      "Oui, la promo est valable en ligne et en boutique participantes. La liste des magasins est sur notre site, rubrique « Points de vente ».",
    draftStatus: "pending_review",
  },
  {
    id: "3",
    severity: "low",
    context: "Story — @fanclub",
    excerpt: "Merci pour la qualité, toujours au top !",
    draftPreview: "Merci beaucoup pour votre message, ça nous touche…",
    draftBody:
      "Merci beaucoup pour votre message, ça nous touche ! Belle journée à vous.",
    draftStatus: "edited",
  },
];
