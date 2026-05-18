# Revue ingénieur (`/plan-eng-review`)

**Date** : 2026-05-18  
**Entrées** : `docs/problem-statement.md`, `docs/plan-ceo-review.md` (approche **B**, SELECTIVE EXPANSION, pas d’extensions cherry-pick).  
**Contexte** : dépôt **sans code applicatif** à ce stade — revue de **faisabilité d’exécution**, limites API, architecture cible, tests et risques opérationnels.

---

## Doc design (prérequis skill)

La commande skill `~/.gstack/projects/$SLUG/*-design-*.md` ne retourne pas de fichier pour cette branche. Les documents **`docs/problem-statement.md`** et **`docs/plan-ceo-review.md`** jouent le rôle de source de vérité produit + trajectoire ; pas de blocage pour poursuivre.

---

## Step 0 — Scope challenge

1. **Code existant** : aucun service, aucune intégration Meta dans ce repo. Pas de duplication à éviter côté implémentation locale — seulement réutiliser **SDK / libs officielles** Meta et patterns éprouvés (OAuth, refresh token, webhooks si applicable plus tard).
2. **Minimum viable technique** (aligné wedge CEO) : **auth Meta** → **sync partielle** (posts récents + commentaires) → **inbox priorisée** → **génération brouillon** (LLM ou règles + FAQ) → **validation** → **envoi unitaire** via API. Tout le reste (analytics avancées, multi-comptes équipe, mobile natif) est **différable**.
3. **Complexité (8+ fichiers / 2+ services)** : le **document de plan** ne déclenche pas le STOP skill (pas de liste de fichiers). En revanche, **l’implémentation** de l’approche B dépassera vite 8 fichiers — c’est **normal** ; le risque est la **découpe** (monolithe vs services). Voir section Architecture.
4. **Search** : non exécutée ici (connaissance in-distribution). Recommandation : avant codage, vérifier la doc Meta **Graph API** (version courante, quotas, champs `comments`, permissions `instagram_manage_comments` / équivalents selon produit exact).
5. **TODOS.md** : croisé. Les P1 CEO (permissions + observation pilote) **bloquent** une estimation honnête des scopes OAuth ; les P2 (machine d’état, pitch) **complètent** l’eng — pas de conflit.
6. **Complétude** : avec assistant de code, viser **couverture de tests forte dès le début** sur auth, persistance tokens, machine d’état brouillon, et clients API (mocks). Pas de « happy path only » sur les chemins Meta.
7. **Distribution** : non définie dans les docs produit. À trancher : hébergeur (Vercel / Fly / autre), secrets (vault), CI. Voir **NOT in scope** et question interactive sur la **stack**.

---

## NOT in scope (explicitement différé)

| Élément | Rationale |
|--------|-----------|
| Envoi automatique en masse, file d’attente sans humain | Produit v1 — aligné problem statement |
| App mobile native | Coût ; web responsive suffit pour pilote |
| Intégration e-com profonde (Shopify sync SKU) hors lien URL/FAQ | Wedge = commentaires + brouillons ; ERP plus tard |
| Webhooks Meta temps réel (si non nécessaires au MVP) | Complexité ops + vérif signature ; polling contrôlé possible en v1 |
| SOC2 / ISO complète | Préco sécurité de base (secrets, audit log) sans certification |
| Choix d’hébergeur et pipeline CI/CD détaillé | Dépend du choix de stack — documenté comme suite |

---

## What already exists

| Élément | Réutilisation |
|--------|----------------|
| Meta Graph API + flux OAuth business | **À intégrer** — ne pas réinventer ; utiliser doc + SDK officiels |
| Modèles LLM pour brouillons | **Fournisseur externe** (OpenAI, etc.) — wrapper interne minimal, prompts versionnés |
| Business Suite / Instagram natif | **Concurrent** — le produit doit aporter inbox + brouillons + traçabilité |

---

## 1 — Architecture review

### Vue d’ensemble (approche B)

```
┌─────────────┐     HTTPS      ┌──────────────────┐
│   Browser   │ ─────────────► │  App web (MVP)   │
│  (utilisateur)│ ◄──────────── │  + session user  │
└─────────────┘                └────────┬─────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
            ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
            │ Supabase      │   │ Job / queue   │   │ Meta Graph    │
            │ Postgres+RLS  │   │ (sync léger,  │   │ OAuth +       │
            │ comptes,      │   │  optionnel    │   │ comments,     │
            │ drafts,       │   │  v1)          │   │ posts, envoi  │
            │ audit         │   │               │   │               │
            └───────────────┘   └───────────────┘   └───────────────┘
                                        │
                                        ▼
                                ┌───────────────┐
                                │ Fournisseur   │
                                │ LLM (brouillons)│
                                └───────────────┘
```

### Flux principal (brouillon → envoi)

```
[Commentaire IG] ──sync──► [Inbox row] ──► [Générer brouillon] ──► draft:pending_review
                                                              │
                         utilisateur ◄── UI validation ◄──────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         [Rejeter]      [Éditer texte]   [Approuver]
              │               │               │
              ▼               ▼               ▼
        draft:rejected   draft:edited   draft:approved
                                              │
                                              ▼
                                    [POST envoi Meta]
                                              │
                         ┌────────────────────┴────────────────────┐
                         ▼                                         ▼
                   message:sent                              erreur API / rate
                   + audit log                             → retry / message erreux UX
```

### Couplage et blast radius

- **Token Meta** : secret à fort blast radius — stockage chiffré, rotation, scope minimal, jamais loggué en clair.
- **LLM** : pas dans le chemin critique d’auth ; timeout + fallback « brouillon vide / template » pour éviter blocage inbox.
- **SPOF** : compte Meta / app Meta en review — documenter mode dégradé (lecture seule, pas d’envoi).

### Défaillance production (exemples)

| Codepath | Défaillance réaliste | Prévu dans plan |
|----------|---------------------|-----------------|
| Refresh token | Expiré / révoqué | Réauth UX + alerte |
| Sync commentaires | Rate limit 429 | Backoff + file limitée |
| Envoi après validation | API erreur média | Rollback état + message utilisateur |
| LLM | Timeout / refus | Brouillon partiel ou suggestion manuelle |

### Distribution

Artefact binaire non requis pour MVP web ; **stack** : Next.js + Supabase — prévoir **Vercel** (ou équivalent) + projet Supabase, variables d’environnement (clés service **uniquement serveur** pour Meta), CI minimal sur `lint` + `test`.

**Décision utilisateur (post-revue, 2026-05-18)** : stack **Next.js + Supabase** (Postgres hébergé, auth optionnelle côté Supabase ou hybride avec session app ; à préciser en implémentation). Proche de l’option **A** (monorepo Next.js) avec **BaaS** pour accélérer persistance + politiques **RLS** sur les tables `accounts`, `drafts`, `audit_log`.

**Finding résolu** : le blocage « stack non fixée » est levé pour la planification ; reste à documenter **RLS** (multi-tenant futur), **Edge Functions** vs routes Next pour secrets Meta, et **migrations** (Supabase CLI).

---

## 2 — Code quality review

**No issues, moving on** — pas de codebase à auditer. Recommandation pour l’implémentation : arborescence explicite (`/app` ou `/src`, `/lib/meta`, `/lib/llm`, `/db`), pas de logique Meta dans les composants UI, validation d’entrée (Zod ou équivalent) sur toutes les routes API.

---

## 3 — Test review

**Framework** : stack choisie **Next.js + Supabase** — cible outillage : **TypeScript + Vitest** (unit) + **Playwright** (E2E flux critique) + **Supabase** migrations / types générés si besoin.

### Diagramme de couverture (cible à la livraison MVP)

```
CODE PATHS (cible)                         USER FLOWS
[+] OAuth / callback Meta                  [+] Connexion compte IG
  ├── [GAP] succès premier login             ├── [GAP] [→E2E] happy path OAuth
  ├── [GAP] erreur consent / refus           └── [GAP] [→E2E] refus permissions
  └── [GAP] state CSRF invalide
[+] Stockage token (chiffré)                 [+] Session web
  ├── [GAP] encrypt/decrypt roundtrip       └── [GAP] expiration session
  └── [GAP] rotation refresh
[+] Sync posts + commentaires              [+] Inbox
  ├── [GAP] pagination API                  ├── [GAP] [→E2E] affichage lot priorisé
  ├── [GAP] 429 backoff                     └── [GAP] rafraîchissement partiel
  └── [GAP] données vides
[+] draft: génération                      [+] Brouillon
  ├── [GAP] prompt + parse                  ├── [GAP] [→EVAL] qualité brouillon (si LLM)
  ├── [GAP] timeout LLM                     └── [GAP] double clic « générer »
  └── [GAP] erreur fournisseur
[+] draft → envoi                          [+] Validation → envoi
  ├── [GAP] transition états                ├── [GAP] [→E2E] valider et envoyer
  ├── [GAP] rejet / édition                 └── [GAP] [→E2E] rejeter
  └── [GAP] erreur envoi Meta

COVERAGE actuelle : 0% (pas de code)  |  Cible première release : chemins critiques E2E + unit sur machine d’état + mocks client Meta
```

### Artefact test plan (QA)

Fichier généré pour `/qa` et `/qa-only` :

`~/.gstack/projects/gstack-instagram/moussaba-no-branch-eng-review-test-plan-20260518-094602.md`

---

## 4 — Performance review

**No issues, moving on** — pas de chemins chauds implémentés. **Directives** : pagination stricte des commentaires ; pas de N+1 sur liste inbox (requêtes agrégées ou clés étrangères indexées) ; cache court des métadonnées posts si besoin ; limiter taille payload LLM.

---

## Failure modes (synthèse)

| Flux | Test futur | Gestion erreur | UX |
|------|-------------|----------------|-----|
| OAuth | E2E | redirect erreur | message clair + retry |
| Sync | unit + int mock | backoff | indicateur « dernière sync » |
| LLM | eval + unit timeout | catch + fallback | « brouillon indisponible » |
| Envoi | E2E + mock API | idempotency key si possible | état explicite + retry manuel |

**Critical gap** tant que non implémenté : **envoi sans test E2E** + **token en clair** = interdit — à traiter avant tout pilote externe.

---

## Worktree parallelization

| Workstream | Modules (indicatif) | Dépend de |
|------------|---------------------|-----------|
| A — Auth Meta + persistance compte | `lib/meta`, `db` | — |
| B — Modèle données inbox + drafts | `db`, `lib/domain` | schéma minimal partagé avec A |
| C — UI inbox + file d’actions | `app` ou `ui` | A (session), B (API) |
| D — Intégration LLM brouillon | `lib/llm` | B (contrat draft) |

**Lanes** : **Lane 1** : A → B (schéma compte + tokens d’abord). **Lane 2** : D en parallèle une fois le type `Draft` stable (contrat). **Lane 3** : C après API stable.  
**Conflit** : A et B touchent `db/migrations` — **séquentiel** ou coordination sur migrations.

---

## Implementation Tasks

Synthese des taches d’ingénierie (en plus des TODOS CEO). Efforts indicatifs.

- [ ] **T1 (P1, human: ~4h / CC: ~45min)** — **Stack & repo** — Choisir stack (voir question interactive) + initialiser repo (package.json, linter, CI minimal).
  - Surfaced by: Architecture — absence de stack documentée
  - Files: racine projet, `README` ou `ARCHITECTURE.md`
  - Verify: `npm test` ou équivalent passe (smoke)

- [ ] **T2 (P1, human: ~6h / CC: ~1h)** — **Meta OAuth + stockage token** — Flux callback, scopes alignés T1 CEO, chiffrement au repos.
  - Surfaced by: Architecture + Failure modes
  - Files: `lib/meta/*`, `db/*`
  - Verify: tests unit + mock Graph API

- [ ] **T3 (P1, human: ~4h / CC: ~40min)** — **Machine d’état draft** — États `pending_review | edited | approved | rejected | sent | failed` + transitions idempotentes.
  - Surfaced by: CEO T3 + Test diagram
  - Files: `lib/domain/*` ou `models/*`
  - Verify: tests unit sur toutes transitions

- [ ] **T4 (P2, human: ~3h / CC: ~30min)** — **Sync commentaires (polling MVP)** — Pagination, backoff 429, persistance id externe.
  - Surfaced by: Architecture
  - Files: `lib/meta/sync*`, job léger
  - Verify: int test avec fixture JSON API

- [ ] **T5 (P2, human: ~2h / CC: ~25min)** — **Playwright E2E** — OAuth mocké ou compte test sandbox + valider envoi simulé.
  - Surfaced by: Test review
  - Files: `e2e/*`
  - Verify: `npx playwright test`

---

## Outside voice (optionnel)

Non exécuté dans cette session (outil `codex` / sous-agent non invoqués). Peut être relancé après gel de la stack.

---

## Suite

1. ~~Répondre à la **question interactive** (choix de stack).~~ **Fait** : Next.js + Supabase.  
2. Ajouter `ARCHITECTURE.md` (ou section README) : schéma Next ↔ Supabase ↔ Meta Graph ; **RLS** par `user_id` ; où vivent les **secrets** Meta (variables serveur uniquement).  
3. Agrégation `/autoplan` : fichier `tasks-eng-review-*.jsonl` dans `~/.gstack/projects/gstack-instagram/` (**déjà écrit** : `tasks-eng-review-20260518-094602.jsonl`).
