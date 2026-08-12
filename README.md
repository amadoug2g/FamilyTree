# FamilyTree

Un site pour retracer la genealogie de notre famille : les liens de parente,
mais aussi l'histoire, la biographie, les photos et les souvenirs de chaque
personne.

Aujourd'hui la consultation est publique (n'importe qui avec le lien peut
regarder l'arbre), mais modifier quoi que ce soit (ajouter une personne, un
lien, une photo, un souvenir) demande un mot de passe partage. C'est une
protection minimale pour la phase de remplissage ; elle sera remplacee par de
vrais comptes nominatifs quand le reste de la famille rejoindra le site.

## Stack technique

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [Prisma](https://www.prisma.io) + PostgreSQL
- Photos sur [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) en
  production, avec repli automatique sur le disque local (`public/uploads/`)
  quand aucun token Blob n'est configure (pratique en developpement)

## Demarrer en local

Prerequis : [Node.js](https://nodejs.org) 20+ et une base PostgreSQL
accessible (locale via Docker/`postgresql`, ou distante).

```bash
npm install
cp .env.example .env   # puis renseigne DATABASE_URL, AUTH_SECRET, SITE_EDIT_PASSWORD
npm run db:migrate      # cree les tables
npm run dev
```

Le site est alors disponible sur http://localhost:3000. La consultation ne
demande rien ; pour modifier, va sur `/login` avec le mot de passe defini dans
`SITE_EDIT_PASSWORD`.

### Donnees d'exemple (optionnel)

```bash
npm run db:seed
```

Personnes **fictives**, marquees `[EXEMPLE]` dans leur biographie — a
supprimer avant de saisir de vraies donnees.

### Import de la genealogie maternelle

`scripts/import-maternal-simbara-dembele.ts` recree en une fois l'arbre
transcrit depuis le PDF `GENEALOGIE_SIMBARA_DEMBELE` (branche Hamet Hamady,
~123 personnes, connexions uniquement, sans biographies) :

```bash
npm run db:import-maternal
```

A executer sur une base vide (il ne fait pas de mise a jour, seulement des
creations).

## Modele de donnees

Toute la structure vit dans `prisma/schema.prisma` :

- **Person** : prenom, nom, nom de clan/lignage (yettoore), genre, dates et
  lieux de naissance/deces (avec une version texte pour les dates
  approximatives, tres frequentes en genealogie orale), biographie, notes.
- **Parentage** : lien parent -> enfant, avec un role (pere / mere / tuteur).
  Un enfant peut avoir plusieurs parents enregistres, un parent plusieurs
  enfants.
- **Union** : mariage entre deux personnes, avec statut (marie, divorce,
  veuf/veuve) et dates. Une personne peut avoir plusieurs unions, pour
  representer la polygamie.
- **Photo** : rattachee a une personne, avec legende et marqueur "photo de
  profil".
- **Memory** (souvenir) : une anecdote texte rattachee a une personne, avec
  le nom de son auteur. Pense pour les contributions familiales futures.

## Fonctionnement actuel

- `/people` : liste et recherche de toutes les personnes (public)
- `/people/[id]` : fiche d'une personne — biographie, photos, parents,
  enfants, conjoint(e)s, souvenirs (public en lecture)
- `/people/new`, `/people/[id]/edit`, et tous les formulaires d'ajout/suppression
  sur une fiche : reserves aux personnes connectees (`/login`)

Les liens de parente et les unions se font en choisissant une personne deja
existante dans une liste deroulante : cree d'abord les personnes concernees,
puis relie-les entre elles.

## Deployer sur Vercel

1. Sur [vercel.com](https://vercel.com), depuis le dashboard : onglet
   **Storage** -> **Create Database** -> choisir un Postgres (ex. Neon) ->
   le connecter au projet une fois cree (etape 3). Toujours dans **Storage**,
   creer aussi un **Blob** store et le connecter au meme projet.
2. **Add New** -> **Project** -> importer le depot GitHub `amadoug2g/FamilyTree`.
   Vercel detecte Next.js automatiquement.
3. Dans **Environment Variables** du projet, en plus de `DATABASE_URL` et
   `BLOB_READ_WRITE_TOKEN` (ajoutees automatiquement si tu as connecte le
   Postgres et le Blob store a l'etape 1), ajoute :
   - `AUTH_SECRET` : une valeur aleatoire (ex. genere avec `openssl rand -hex 32`)
   - `SITE_EDIT_PASSWORD` : le mot de passe pour modifier l'arbre
4. **Deploy**. Le build execute automatiquement les migrations Prisma sur la
   base de production (`prisma migrate deploy`, voir `package.json`).
5. Une fois en ligne, execute une seule fois l'import de la genealogie
   (en local, avec `DATABASE_URL` pointant vers la base de production) :
   ```bash
   DATABASE_URL="<url de production>" npm run db:import-maternal
   ```

## Prochaines etapes possibles

1. **Visualisation graphique de l'arbre** (aujourd'hui les liens de parente
   existent en base mais s'affichent seulement sous forme de listes sur
   chaque fiche).
2. **Comptes utilisateurs nominatifs** pour remplacer le mot de passe
   partage quand le reste de la famille rejoindra le site.
3. **Export / sauvegarde** de la base et des photos, pour garantir que la
   memoire familiale ne depend pas d'un seul service technique.

## Notes de developpement

```bash
npm run lint          # verification du code
npm run build         # build de production (genere le client Prisma, applique les migrations, build Next)
npm run db:studio     # interface graphique pour explorer la base (Prisma Studio)
```
