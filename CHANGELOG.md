# Changelog

Toutes les dates sont en UTC (YYYY-MM-DD).

## 0.1.0.0 — 2026-05-19

### Ajouté

- Application Next.js (App Router) : page d’accueil et **inbox** commentaires (variante UI C) avec données mockées.
- Modèle de domaine **brouillon** (`lib/domain/draft-state.ts`) : libellés FR, règles d’édition et d’approbation (y compris rejeu après échec).
- Clients Supabase (`lib/supabase/client.ts`, `lib/supabase/server.ts`) et exemple d’environnement `.env.local.example`.
- Schéma SQL initial Supabase avec RLS (`supabase/migrations/`).
- Documentation produit et architecture (`ARCHITECTURE.md`, `docs/`, `TODOS.md`).

### Corrigé

- Typage explicite du callback `setAll` des cookies côté serveur Supabase pour satisfaire `next build` / TypeScript strict.
