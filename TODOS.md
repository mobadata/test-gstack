# TODOS — suite revue CEO (`/plan-ceo-review`)

Source : `docs/plan-ceo-review.md` — approche **B**, mode **SELECTIVE EXPANSION**, pas d’extension cherry-pick.

## P1

- [ ] **T1** — Documenter permissions Meta + parcours App Review pour gestion / réponse aux commentaires (scopes, limites API, cas ads vs organique).
- [ ] **T2** — Observation pilote (ex. Dioum) : session 30 min + grille (abandon, types de commentaires ignorés).

## P2

- [ ] **T3** — Spec machine d’état : brouillon → validé → envoyé ; sécurité tokens et logs d’audit.
- [ ] **T4** — Rédiger l’argumentaire « pourquoi pas Business Suite seul » (pitch + onboarding).

---

## Suite revue eng (`/plan-eng-review`)

Source : `docs/plan-eng-review.md` — artefact test : `~/.gstack/projects/gstack-instagram/moussaba-no-branch-eng-review-test-plan-20260518-094602.md` — tâches JSONL : `tasks-eng-review-20260518-094602.jsonl`.

### P1 (ingénierie)

- [x] **E1** — Stack tranchée : **Next.js + Supabase** (voir `docs/plan-eng-review.md`). Reste : rédiger `ARCHITECTURE.md` (RLS, secrets Meta, migrations).
- [ ] **E2** — OAuth Meta + stockage token **chiffré** ; alignement scopes avec **T1** (doc permissions / App Review).
- [ ] **E3** — Implémenter la **machine d’état** brouillon + tests unit sur toutes les transitions.

### P2 (ingénierie)

- [ ] **E4** — Sync commentaires (polling MVP) : pagination, backoff 429, tests d’intégration mockés.
- [ ] **E5** — **Playwright** (ou équivalent) : E2E minimum sur OAuth (mock/sandbox) + validation → envoi.
