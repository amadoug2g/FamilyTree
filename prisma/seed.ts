import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Donnees d'exemple, purement fictives, pour visualiser la structure
// (une personne, ses parents, son union, un enfant). A supprimer une
// fois que la vraie famille est renseignee - voir README.md.
async function main() {
  const grandPere = await prisma.person.create({
    data: {
      firstName: "Amadou",
      lastName: "Diallo",
      clanName: "Diallo",
      gender: "MALE",
      birthDateText: "vers 1930",
      birthPlace: "Fouta-Toro, Senegal",
      isDeceased: true,
      deathDateText: "vers 2005",
      bio: "[EXEMPLE] Personne fictive illustrant la structure du site.",
    },
  });

  const grandMere = await prisma.person.create({
    data: {
      firstName: "Aissatou",
      lastName: "Ba",
      clanName: "Ba",
      gender: "FEMALE",
      birthDateText: "vers 1935",
      birthPlace: "Podor, Senegal",
      isDeceased: true,
      bio: "[EXEMPLE] Personne fictive illustrant la structure du site.",
    },
  });

  await prisma.union.create({
    data: {
      personAId: grandPere.id,
      personBId: grandMere.id,
      status: "MARRIED",
      startDateText: "vers 1955",
    },
  });

  const pere = await prisma.person.create({
    data: {
      firstName: "Ibrahima",
      lastName: "Diallo",
      clanName: "Diallo",
      gender: "MALE",
      birthDateText: "vers 1958",
      bio: "[EXEMPLE] Fils d'Amadou et Aissatou.",
    },
  });

  await prisma.parentage.createMany({
    data: [
      { parentId: grandPere.id, childId: pere.id, parentType: "FATHER" },
      { parentId: grandMere.id, childId: pere.id, parentType: "MOTHER" },
    ],
  });

  console.log("Donnees d'exemple creees. Modifie ou supprime-les depuis /people.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
