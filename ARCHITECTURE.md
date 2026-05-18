# Architecture — gstack-instagram

Document de **référence technique** du dépôt. Il décrit **comment** le système est construit et connecté.  
Les intentions produit et les décisions de revue restent dans : `docs/problem-statement.md`, `docs/plan-ceo-review.md`, `docs/plan-eng-review.md`.

**Dernière mise à jour** : 2026-05-18 (aligné sur la revue ingénieur — stack figée **Next.js + Supabase**).

---

## 1. Stack & hébergement (cible MVP)

| Couche | Choix | Rôle |
|--------|--------|------|
| UI | **Next.js** (App Router) | Pages auth, inbox, détail commentaire, validation |
| API & logique métier | **Route Handlers** / **Server Actions** Next (à trancher fichier par fichier) | Jamais d’appel Meta avec secret depuis le navigateur |
| Données | **Supabase** (Postgres) | Comptes liés, tokens chiffrés, brouillons, audit |
| Auth produit | **Supabase Auth** (optionnel v1) ou session applicative minimale | À préciser à l’implémentation ; l’essentiel v1 est **OAuth Meta** + session |
| Jobs | **Polling léger** (cron Vercel / route protégée / queue minimale) | Sync posts + commentaires ; **pas** de webhooks Meta en v1 |
| Intégration externe | **Instagram Graph API** (doc officielle Meta) | OAuth, lecture médias/commentaires, envoi de réponse après validation |
| LLM | Fournisseur externe (ex. OpenAPI) | Brouillons uniquement ; **timeout + fallback** ; pas sur le chemin critique OAuth |

**Hébergement cible** : **Vercel** (ou équivalent) pour l’app Next ; projet **Supabase** dédié ; variables d’environnement **serveur uniquement** pour les secrets Meta et LLM.

---

## 2. Vue d’ensemble (diagramme)

```
┌─────────────┐     HTTPS      ┌──────────────────┐
│   Browser   │ ─────────────► │  Next.js (MVP)   │
│             │ ◄───────────── │  + session user  │
└─────────────┘                └────────┬─────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              ▼                         ▼                         ▼
      ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
      │ Supabase      │         │ Job / cron    │         │ Meta Graph    │
      │ Postgres +    │         │ (sync MVP)    │         │ OAuth +       │
      │ RLS           │         │               │         │ posts,        │
      │               │         │               │         │ comments,     │
      │ accounts,     │         │               │         │ reply         │
      │ drafts,       │         │               │         │               │
      │ audit_log     │         │               │         │               │
      └───────────────┘         └───────────────┘         └───────────────┘
                                        │
                                        ▼
                                ┌───────────────┐
                                │ LLM (drafts)  │
                                └───────────────┘
```

---

## 3. Flux principal (données & états)

### 3.1 Chaîne métier v1

1. Utilisateur connecte **Instagram** (OAuth Meta, compte **professionnel** / flux documenté).
2. **Sync** : récupération paginée des **posts récents** et **commentaires** associés (polling ; backoff sur **429**).
3. **Inbox** : lignes priorisées (règles v1 simples ; pas « tout le graphe Instagram »).
4. **Brouillon** : génération via **règles + FAQ** et/ou **LLM** (sortie non fiable → jamais d’envoi sans humain).
5. **Validation** : l’humain **rejette**, **édite** ou **approuve**.
6. **Envoi** : appel Graph **unitaire** (ou petit lot **entièrement validé**), puis **audit log**.

### 3.2 Machine d’états (brouillon / réponse)

États cibles (affiner les noms en implémentation) :

| État | Signification |
|------|-----------------|
| `pending_review` | Brouillon proposé, en attente d’action utilisateur |
| `edited` | Texte modifié par l’utilisateur avant envoi |
| `rejected` | Brouillon/refus, pas d’envoi |
| `approved` | Validé par l’humain, prêt pour l’appel Meta |
| `sent` | Réponse publiée côté Instagram |
| `failed` | Erreur API Meta ou autre ; message UX + retry manuel / automatique limité |

**Règles** : aucune transition vers `sent` sans passage explicite par une action humaine de validation ; idempotence sur l’envoi (clé métier ou contrainte DB selon design).

---

## 4. Modèle de données (ébauche)

Les noms de tables sont indicatifs ; les migrations Supabase feront foi.

| Entité | Rôle |
|--------|------|
| `users` | Utilisateur de l’app (lien Supabase Auth si utilisé) |
| `instagram_accounts` | Compte IG lié, identifiants Meta, **tokens chiffrés**, scopes, expiration |
| `media` | Posts IG synchronisés (id externe, métriques de base utiles à la **priorisation**) |
| `comments` | Commentaires IG (id externe, texte, auteur, lien `media_id`, statut sync) |
| `drafts` | Brouillons + **état** + lien `comment_id` + contenu + horodatage |
| `audit_log` | Qui a validé/rejeté/envoyé quoi, quand (traçabilité pilote et prod) |

**Indexation** : index sur clés externes Meta et sur `(user_id, …)` pour listes inbox.

---

## 5. Sécurité & isolation

- **Secrets Meta** : uniquement côté serveur (env / Supabase secrets) ; **jamais** exposés au client.
- **Tokens** : stockage **chiffré au repos** ; refresh / réauth documentés ; pas de log en clair.
- **RLS Supabase** : politiques par **`user_id`** (ou équivalent) — un utilisateur ne lit **pas** les comptes / brouillons / audit d’un autre.
- **LLM** : contenu des commentaires traité comme **donnée non fiable** (prompt injection) ; pas d’action sensible déclenchée uniquement par le modèle.
- **Menaces classiques** : **IDOR** sur routes API — vérifier systématiquement le lien ressource ↔ utilisateur connecté.

---

## 6. Intégration Meta (bornes)

- **In scope v1** : flux documentés **Graph API** pour compte professionnel / cas couvert par le pilote ; pagination ; gestion **429** / timeouts ; messages d’erreur utilisateur clairs.
- **Hors scope v1** (sauf réouverture explicite) : **webhooks** temps réel ; **Marketing API** / commentaires **ads** mélangés au flux organique ; envoi **massif non supervisé** ; multi-tenant « agence » complète.

**Avant première PR sensible** : valider sur la **doc Meta à jour** les permissions exactes (`instagram_manage_comments`, etc.) et les endpoints pour **reply** vs **private reply** (règles différentes).

---

## 7. Arborescence cible (suggestion)

À adapter lors du bootstrap repo (`T1` plan eng) :

```text
app/                 # routes UI + layouts (ex. app/inbox/)
app/api/             # Route Handlers (Meta callback, sync, send) — à ajouter
components/        # UI réutilisable (ex. components/inbox/)
lib/supabase/        # clients navigateur + serveur (@supabase/ssr)
lib/meta/            # client Graph, OAuth, erreurs typées — à ajouter
lib/llm/             # appels brouillon, timeouts, fallbacks — à ajouter
lib/domain/          # machine d’états, règles (brouillon côté TS)
supabase/migrations/ # schéma Postgres + RLS (fichiers SQL versionnés)
e2e/                 # Playwright — chemins critiques — à ajouter
```

**Règle** : pas de logique Meta dans les composants React « dumb » ; validation des entrées (ex. **Zod**) sur les routes API.

---

## 8. Tests & qualité (rappel)

- **Unit** : machine d’états, chiffrement/roundtrip token (mock), règles de priorisation.
- **Int** : client Meta **mocké** (fixtures JSON erreurs 429, 400 policy).
- **E2E** : OAuth (mock ou compte test), flux **valider → envoi** (ou envoi mocké) — **bloquant** avant pilote externe réel (cf. plan eng).

---

## 9. Évolution de ce document

Mettre à jour **ARCHITECTURE.md** à chaque changement structurant :

- nouveau flux (webhooks, multi-compte) ;
- changement de stack ou de schéma DB ;
- nouvelle surface Meta (ads, DM, etc.).

Les **revues** (`plan-*-review.md`) peuvent rester des **snapshots datés** ; ce fichier reste la **carte à jour** du système.

---

## 10. Références internes

| Document | Contenu |
|----------|---------|
| `docs/problem-statement.md` | Produit, wedge, pilote, risques *métier* |
| `docs/plan-ceo-review.md` | Décisions CEO (approche B, scope) |
| `docs/plan-eng-review.md` | Revue technique détaillée, tâches T1–T5, diagrammes source |
