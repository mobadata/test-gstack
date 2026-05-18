# Revue CEO — `/plan-ceo-review`

**Plan examiné :** `docs/problem-statement.md`  
**Date :** 2026-05-15  
**Branche Git :** dépôt non initialisé (pas de `.git` au moment de la revue)  
**Contexte :** document stratégique post–Office Hours ; pas encore de code ni d’architecture implémentée.

---

## Audit système (pré-revue)

- `git` : indisponible (pas de dépôt).
- Fichiers projet : `docs/problem-statement.md` (+ ce fichier).
- `CLAUDE.md` / `TODOS.md` : absents.
- Doc design gstack `~/.gstack/projects/gstack-instagram/*-design-*.md` : non requis ici ; le **problem statement** joue le rôle de source de vérité produit (équivalent synthétique aux livrables office hours).

---

## Step 0A — Challenge des prémices

1. **Bon problème ?** Oui si le résultat utilisateur est « **moins de temps jusqu’à une réponse utile et sûre** sur les commentaires à fort enjeu commercial », pas « un nouvel agrégateur de stats Instagram ». Les stats servent surtout à **prioriser** ; la valeur différenciante est **inbox + brouillons + validation** (déjà verrouillé dans le plan).
2. **Outcome réel :** temps gagné, **ventes / confiance** sauvées sur questions produit, **réduction du risque** (mauvaise réponse, restriction Meta). Le plan est **relativement direct** ; le piège serait de **sur-construire** la partie analytics avant d’avoir bouclé le **pilote Dioum**.
3. **Si on ne fait rien :** le statu quo (natif + fatigue + abandon) reste ; la douleur est **réelle mais non quantifiée au-delà de N=1** tant qu’il n’y a pas d’observation directe ni de pilote payant ou engagé.

**Prémices à valider hors doc :**

| Prémisse | Risque si fausse |
|----------|------------------|
| Les e-coms accepteront OAuth Meta et les friction App Review | Adoption bloquée avant la 1re valeur |
| La valeur durable n’est pas « texte IA générique » | Obsolescence par les produits Meta + IA intégrée (déjà identifié dans le plan) |
| « Brouillons + validation » suffit pour différencier v1 | Concurrence fonctionnelle avec Business Suite + outils social existants |

---

## Step 0B — Levier code existant

**Aucun code** dans le dépôt. Rien à réutiliser encore : le plan est cohérent avec un **greenfield** ; la prochaine décision est **quelle surface minimale** shipper pour apprendre (voir 0C-bis).

---

## Step 0C — Dream state (12 mois)

```
  AUJOURD’HUI                         CE PLAN (trajectoire)              IDÉAL 12 MOIS
  ─────────────────────────────────  ─────────────────────────────────  ───────────────────────────────
  Idée structurée, N=1, pas de       MVP : inbox commentaires +         Couche « commerce » : priorité
  produit, douleur verbalisée      brouillons + validation +          argent, équipes, audit, playbooks
  par Dioum                          métriques utiles à la prio          SKU, conformité, multi-canal
```

Le plan actuel **avance** vers l’idéal **si** la couche durable (argent sur la table, responsabilité, SKU) devient le **cœur** et non un add-on.

---

## Step 0C-bis — Pistes d’implémentation (obligatoire)

### APPROACH A — « Apprendre sans logiciel »

- **Résumé :** Pilote **Dioum** avec **observation 30 min** + **modèle** (Notion / tableur) : file de commentaires copiés ou screenshot, **réponses manuelles** guidées par checklist FAQ ; pas d’intégration Meta au début.
- **Effort :** S (équipe) / CC faible.
- **Risque :** Faible technique ; **très élevé** sur la **fatigue** : peu scalable, ne valide pas l’API ni l’OAuth.
- **Pour :** Valide **urgence** et **workflow** réel à coût nul.
- **Contre :** Ne prouve pas la **faisabilité produit** ni la **rétention** sur un outil.
- **Réutilise :** Rien côté repo.

### APPROACH B — « MVP produit aligné problem-statement » (recommandé)

- **Résumé :** **Application web** dédiée : connexion **compte professionnel Instagram** (flux Meta documenté), **liste des médias + métriques de base**, **file commentaires** (lots paginés type contraintes API, ex. pagination commentaires), **génération de brouillons** (règles + FAQ + option LLM), **validation obligatoire** puis **envoi** via API **un par un** ou par petits lots validés (pas de masse non supervisée).
- **Effort :** M.
- **Risque :** Moyen (App Review, tokens, quotas, **changement de politique** Meta).
- **Pour :** Aligné wedge ; **apprentissage** sur stack réelle ; chemin vers **abonnement**.
- **Contre :** Coût OAuth + conformité ; courbe **App Review** non négligeable.
- **Réutilise :** N/A code ; s’appuie sur **docs officielles** Instagram Graph (commentaires, modération, limites de requêtes).

### APPROACH C — « Plateforme SaaS complète »

- **Résumé :** Multi-tenant, **rôles équipe**, analytics avancées, automations multiples, intégrations tierces dès le départ.
- **Effort :** XL.
- **Risque :** Élevé sans traction ; dilue le **wedge** ; same **dépendance Meta**.
- **Pour :** Story investisseur long terme si levée.
- **Contre :** **Trop tôt** sans preuve paiement ou engagement ferme ; recoupe des produits matures.

**RECOMMANDATION :** **Approach B** — meilleur ratio **apprentissage / risque** pour valider une offre **abonnement** alignée sur le document ; A peut précéder B de **quelques jours** sans exclure B ; C à **reporter** après traction.

---

## Step 0F — Modes (à confirmer après choix 0C-bis)

| Mode | Usage ici |
|------|-----------|
| **SCOPE EXPANSION** | Si tu veux **rajouter** vision large (multi-réseaux, IA avancée, marketplace…) avant d’avoir un client payant. |
| **SELECTIVE EXPANSION** (défaut suggéré) | **Garder** le wedge du problem statement **et** décider explicitement des **petites extensions** (ex. export CSV, règles de priorité, 2e compte). |
| **HOLD SCOPE** | Figé strict sur le problem statement ; revue **rigueur** quand une spec technique existe. |
| **SCOPE REDUCTION** | Couper tout sauf **une** brique (ex. **inbox seule** sans stats, ou **stats seules** sans reply) pour shipper en quelques jours. |

**Suggestion :** **SELECTIVE EXPANSION** : le cadrage Office Hours est déjà sain ; la valeur CEO est de **cherry-picker** 2–3 extensions à fort levier sans refaire une cathédrale.

---

## Sections 1 à 11 (revue « pré-code »)

Le skill exige les sections ; en l’absence de code/endpoints, voici l’**évaluation stratégique** et les **risques à spécifier** plus tard.

### 1 — Architecture

- **Cible probable :** client web + backend avec **stockage tokens chiffré**, workers pour **sync commentaires / médias**, service **LLM** optionnel pour brouillons, file d’**envoi** après validation.
- **Couplage fort :** **Meta** (disponibilité, quotas, changements de champs). Mitigation : **couche d’adaptation** API versionnée, feature flags, dégradation gracieuse.
- **Diagramme (cible logique) :**

```
  [Utilisateur] --> [Web app]
        |                |
        v                v
   [Auth session]   [Backend API] <---> [DB]
                          |
            +-------------+-------------+
            v             v             v
      [Meta Graph API] [LLM provider] [Jobs sync]
```

**Pas de « no issues »** : absence de choix explicite (stack, hébergeur, modèle multi-tenant ou non) = **ambiguïté** à trancher en spec.

### 2 — Error & rescue (intention design)

À détailler quand les chemins existent : timeouts Meta, **429**, token expiré, commentaire supprimé côté Instagram, réponse refusée par modération, **sortie LLM invalide**. Principe : **aucune** publication sans **validation humaine** en v1.

### 3 — Sécurité / menaces

- **OAuth** : vol de token = prise de compte ; exiger **chiffrement au repos**, rotation, **scopes minimaux**.
- **Multi-tenant (si B évolue) :** **IDOR** classique ; isolation stricte par `instagram_business_account_id` lié à l’utilisateur.
- **LLM :** **prompt injection** via contenu de commentaires ; traiter le texte commentaire comme **donnée non fiable** ; pas d’exécution d’actions sensibles sur seule base modèle.
- **Conformité :** CGU Meta, consentements, logs d’audit pour **qui a validé** quelle réponse.

### 4 — Data flow & UX

- Chemins : **vide** (pas de commentaires), **partial** (pagination 50 max côté Graph selon cas), **conflit** (commentaire déjà répondu ailleurs), **stale** (post supprimé).
- UX : éviter de **reproduire la masse** ; **lots** + **priorisation** (déjà dans le problem statement).

### 5 — Qualité / maintenabilité

Trop tôt pour le style de code ; imposer **contrats** sur les intégrations Meta et des **tests de contrat** mockés.

### 6 — Tests

Priorité future : **tests d’intégration** sandbox Meta si disponible ; tests unitaires sur **règles de priorisation** et **machine d’état** brouillon → validé → envoyé.

### 7 — Performance

Pagination, **backoff** sur 429, cache **lecture seule** des médias ; ne pas poller agressivement.

### 8 — Observabilité

Traces par **compte** et par **job de sync** ; métrique « temps jusqu’à première réponse utile » (alignée succès pilote).

### 9 — Déploiement

Variables d’environnement secrets, URL de callback OAuth stable, procédure **rollback** (feature flag « envoi désactivé »).

### 10 — Futur / réversibilité

Le plan admet un risque **« moins indispensable »** ; réversibilité moyenne si tout repose sur une **fine couche** Meta sans données propriétaires (historique enrichi, tags internes) = **dette stratégique**.

### 11 — Design (UI)

**DESIGN_SCOPE : oui** (écrans connexion, inbox, détail post, file de validation). Pas de pixels ici ; exiger plus tard **états** vides / erreur / chargement / **permission refusée**.

---

## NOT in scope (explicite)

- Envoi **massif non supervisé** (déjà hors scope v1 dans le problem statement).
- **Ads Instagram** via Graph « organique » seul (cas marketing souvent **hors** flux standard ; à traiter plus tard si besoin).
- Multi-réseaux (TikTok, etc.) avant **preuve** sur Instagram.

---

## What already exists

- Rien dans le repo ; **concurrence / statu quo** : Instagram natif, Business Suite, outils social (Later, Hootsuite, Buffer, etc.).

---

## Dream state delta

| Zone | Delta après exécution du plan (si B réussit) |
|------|-----------------------------------------------|
| Preuve | De N=1 verbal à **usage mesuré** sur un produit |
| Différenciation | De « idée générique Instagram » vers **workflow e-com commentaires** |
| Moat potentiel | Données **internes** (SKU, FAQ, qui a validé) plutôt que « un LLM public » |

---

## Error & Rescue Registry (brouillon conceptuel)

| Codepath (futur) | Risque | Secouru ? | Action cible |
|------------------|--------|-----------|----------------|
| `POST reply` Meta | 429 / timeout | Oui | Backoff, file, message utilisateur |
| `POST reply` Meta | 400 policy | Oui | Message explicite + doc lien |
| Génération brouillon LLM | JSON / texte incohérent | Oui | Ne jamais auto-publier ; brouillon vide + log |
| Token OAuth | expiré | Oui | Re-auth guidée |

---

## Failure Modes Registry (brouillon)

| Codepath | Défaillance | Secouru ? | Test ? | Utilisateur voit ? |
|----------|-------------|-----------|--------|---------------------|
| Sync commentaires | quota / timeout | à définir | futur | état dégradé clair |
| Envoi après validation | commentaire supprimé | à définir | futur | « plus disponible » |

---

## Implementation Tasks (synthèse revue CEO)

- [ ] **T1 (P1, humain : ~4h / CC : ~30min)** — Recherche produit — Documenter permissions Meta minimales + flux App Review pour « manage comments » + reply après validation.
- [ ] **T2 (P1, humain : ~2h / CC : ~20min)** — Pilote — Session observation Dioum + grille de notes (abandon, types de commentaires ignorés).
- [ ] **T3 (P2, humain : ~1j / CC : ~1h)** — Spec — Machine d’état brouillon → validé → envoyé + exigences sécurité (tokens, scopes, logs).
- [ ] **T4 (P2, humain : ~2h / CC : ~15min)** — Positionnement — Paragraphe « pourquoi pas Business Suite seul » pour pitch et onboarding.

---

## Références paysage (recherche rapide)

- Instagram Graph API : **modération / réponses** documentées ; contraintes type **pagination** (ex. bornes sur les commentaires), permissions dédiées (`instagram_manage_comments`, etc.).
- **Private replies** : règles de fenêtre temporelle côté Meta (à ne pas confondre avec « réponse publique commentaire »).
- Commentaires sur **certaines surfaces ads** : souvent **autre API** (Marketing) ; risque de **scope creep** si tu vises ads + organique le même jour.

---

## Décisions utilisateur (session)

| Étape | Choix |
|-------|--------|
| **0C-bis — Approche** | **B** — MVP produit (app web + Meta + inbox + brouillons + validation). |
| **0F — Mode** | **SELECTIVE EXPANSION** — baseline = `docs/problem-statement.md`, extensions évaluées à la carte. |
| **Cherry-pick** | **Aucune extension** pour l’instant : scope figé sur le wedge actuel (inbox priorisée, brouillons, validation, stats utiles). |

---

## Step 0D (SELECTIVE EXPANSION) — Synthèse sans extension acceptée

- **Scan 10x (informationnel) :** « Copilote e-com » qui classe les commentaires par **impact CA estimé**, suggère réponses **avec sources** (lien fiche produit), mesure **temps gagné** par semaine — à ne pas confondre avec le MVP immédiat.
- **Delights possibles (reportés) :** export CSV, règles mots-clés « question produit », multi-comptes, audit validateurs, digest email matinal (tous **non** retenus pour l’instant).
- **CEO plan fichier séparé** (`~/.gstack/.../ceo-plans/`) : optionnel ; décisions déjà tracées **ici** ; pas d’expansion acceptée donc pas d’obligation de dupliquer en `ceo-plans/` pour cette session.

---

## MEGA PLAN REVIEW — COMPLETION SUMMARY (condensé)

| Zone | Résultat |
|------|----------|
| Mode | **SELECTIVE EXPANSION** |
| Approche | **B** (MVP Meta-aligned) |
| Cherry-picks | **0** acceptés |
| Sections 1–11 | Traitées en **mode stratégie pré-code** (voir corps du document) |
| JSONL tasks | Écrit sous `~/.gstack/projects/gstack-instagram/tasks-ceo-review-*.jsonl` (sans `jq`, via Python) |
| jq | **Absent** sur la machine : pour agrégation `/autoplan` optimale, installer `jq` |

---

## GSTACK REVIEW REPORT

| Run | Skill | Statut |
|-----|--------|--------|
| 2026-05-15 | plan-ceo-review | **Terminé** — approche **B**, mode **SELECTIVE**, cherry-pick **aucun** |
