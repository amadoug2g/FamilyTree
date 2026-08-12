# FamilyTree

Un site pour retracer la genealogie de notre famille : les liens de parente,
mais aussi l'histoire, la biographie, les photos et les souvenirs de chaque
personne.

Aujourd'hui c'est un outil pour construire et remplir l'arbre seul. Plus tard,
il pourra etre ouvert au reste de la famille pour consultation, puis pour
contribution (ajout de souvenirs, de photos).

## Stack technique

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [Prisma](https://www.prisma.io) + SQLite (base de donnees dans un simple
  fichier, `prisma/dev.db`, pas de serveur a gerer)
- Photos stockees sur disque, dans `public/uploads/`

Pas de systeme de comptes/authentification pour l'instant : c'est un outil a
usage personnel pendant la phase de remplissage. A ajouter avant d'ouvrir
l'acces au reste de la famille (voir "Prochaines etapes" plus bas).

## Demarrer en local

Prerequis : [Node.js](https://nodejs.org) 20 ou plus recent.

```bash
npm install
npm run db:migrate   # cree la base de donnees SQLite locale
npm run dev
```

Le site est alors disponible sur http://localhost:3000.

### Donnees d'exemple (optionnel)

Pour voir a quoi ressemble une petite famille deja renseignee (grands-parents,
parent, union, biographie) :

```bash
npm run db:seed
```

Ce sont des personnes **fictives**, clairement marquees `[EXEMPLE]` dans leur
biographie. Supprime-les depuis la fiche de chaque personne (bouton
"Modifier" puis "Supprimer la fiche") une fois que tu commences a renseigner
ta vraie famille.

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

- `/people` : liste et recherche de toutes les personnes
- `/people/new` : creer une fiche
- `/people/[id]` : fiche d'une personne (biographie, photos, parents,
  enfants, conjoint(e)s, souvenirs) avec formulaires pour tout enrichir
  directement depuis la page
- `/people/[id]/edit` : modifier ou supprimer une fiche

Les liens de parente et les unions se font en choisissant une personne deja
existante dans une liste deroulante : cree d'abord les personnes concernees,
puis relie-les entre elles.

## Prochaines etapes possibles

Dans l'ordre ou elles deviendront probablement utiles :

1. **Visualisation graphique de l'arbre** (aujourd'hui les liens de parente
   existent en base mais s'affichent seulement sous forme de listes sur
   chaque fiche).
2. **Comptes utilisateurs et droits d'acces** avant d'inviter la famille :
   au minimum un mot de passe partage ou un lien prive ; a terme, des comptes
   nominatifs avec droits de lecture pour tous et d'ecriture pour certains.
3. **Hebergement permanent** : ce projet tourne aujourd'hui en local. Pour le
   rendre accessible a la famille, il faudra le deployer (par exemple sur un
   petit serveur ou service cloud) et passer les photos sur un stockage
   durable (le stockage disque actuel ne convient pas a un hebergement
   "serverless" comme Vercel, qui ne conserve pas les fichiers uploades).
4. **Export / sauvegarde** de la base et des photos, pour garantir que la
   memoire familiale ne depend pas d'un seul service technique.

## Notes de developpement

```bash
npm run lint          # verification du code
npm run build         # build de production
npm run db:studio     # interface graphique pour explorer la base (Prisma Studio)
```
