# Problem statement — Instagram commentaires & métriques (e-com)

Document issu des **Office Hours** (mode startup, stade pré-produit). Synthèse validée dans la conversation produit.

---

## Produit (v1)

Outil pour **marques e-com** : connecter Instagram, voir **publications + métriques** (likes, partages, commentaires), centraliser les **commentaires**, produire des **brouillons de réponses** avec **validation humaine** avant envoi.

**Décision explicite** : en v1, **pas d’envoi automatique en masse** — au maximum **brouillons + validation**.

---

## Problème

Les équipes passent en moyenne **~42–58 minutes par jour** dans Instagram et/ou Meta Business Suite (et parfois d’autres outils type calendrier social) pour suivre publications et commentaires.

Le volume perçu comme **« énorme »** mène à un **abandon** du flux : la personne arrête avant d’avoir traité ce qui compte.

Les **questions produit** dans les commentaires (infos sur un article ou un produit posté) restent **sans réponse ou en retard** → opportunités commerciales ou relationnelles perdues, frustration côté audience.

**Statu quo** : Instagram natif + Business Suite / notifications / parfois Excel, Notion, VA, ou outils type Later–Hootsuite–Buffer. Coût = temps + parfois abonnement outil, avec une **peur** combinée : spam, réponses génériques, **restriction ou blocage de compte** si l’automation est mal conçue.

---

## Utilisateur pilote & preuve actuelle

**Profil prioritaire** : petites **marques e-commerce**.

**Persona concret nommé** : **Dioum** — entrepreneur / commerçant qui publie du contenu produit sur Instagram ; manque de temps pour **lire et répondre** aux commentaires ; des personnes demandent des **infos sur les produits** postés ; la latence de traitement est un problème réel.

**Preuve de demande** : à ce stade, **personne n’a dit mot pour mot** « je paie si tu me le livres ». Signaux présents : **N=1** (Dioum), **signaux faibles** (discussions vues sur **Reddit**). La preuve suivante à obtenir : **observation directe** (session sans assistance) + **pilote** (14 jours) avec engagement de temps ou prix symbolique.

---

## Wedge v1 (validé)

1. **Inbox commentaires priorisée** (petits lots, pas « tout Instagram » d’un coup) pour éviter la surcharge cognitive et l’abandon.
2. **Brouillons** alignés FAQ / fiches produit.
3. **Validation humaine** obligatoire avant envoi — pas d’envoi massif non supervisé.

**Hors scope v1** : envoi automatique en masse ; promesse type « bot entièrement autonome ».

---

## Risque stratégique (futur)

Hypothèse discutée : dans ~3 ans, avec l’évolution d’**Instagram** et l’**IA** intégrée aux produits grand public, une partie de la valeur « tableau de bord + texte » peut devenir **moins indispensable** si le produit ne se différencie pas.

**Pistes de couche plus durable** (à explorer au-delà du wedge) : tri orienté **« argent sur la table »**, **responsabilité** (qui valide quoi), **playbooks par SKU**, **historique / équipe / conformité interne** — plutôt que seulement « un modèle qui écrit du texte ».

---

## Critères de succès du pilote (brouillon)

- Réduction du temps jusqu’à une **première réponse utile** sur les commentaires prioritaires.
- **Zéro** incident de réputation lié à une réponse inappropriée en production.
- Le pilote **ne lâche pas** le flux au milieu parce que l’interface reproduit la même « masse » ingérable (succès UX = **découpage + priorisation**).

---

## Prochaines actions (déjà alignées en session)

1. **30 minutes** d’observation avec Dioum (ou équivalent) : **silence**, notes sur le moment exact d’abandon et le type de commentaires ignorés en premier.
2. Proposition de **pilote 14 jours** : routine fixe (ex. chaque matin : **N commentaires prioritaires + brouillons**), validation systématique avant envoi.
3. Obtenir au minimum un **engagement de temps** sérieux, idéalement un **prix pilote** ou un engagement écrit sur la valeur perçue en fin de période.

---

## Contexte projet

Dépôt **gstack-instagram** : ce document pose le cadre produit avant implémentation technique (API Instagram / Meta, conformité aux politiques plateforme, etc.).
