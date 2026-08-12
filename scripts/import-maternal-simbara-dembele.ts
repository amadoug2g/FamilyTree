import { PrismaClient } from "@prisma/client";

// Import de la genealogie maternelle (cote Hamet), transcrite depuis
// GENEALOGIE_SIMBARA_DEMBELE_1.pdf. Connexions uniquement (pas de biographies).
// Les comptes d'enfants non nommes dans le document source ("9 enfants",
// "8 enfants", etc.) sont conserves en note sur le parent plutot que
// transformes en fiches individuelles.

const prisma = new PrismaClient();

type Gender = "MALE" | "FEMALE" | "UNKNOWN";

type PersonDef = {
  key: string;
  firstName: string;
  lastName?: string;
  clanName?: string;
  gender?: Gender;
  isDeceased?: boolean;
  birthPlace?: string;
  deathPlace?: string;
  notes?: string;
};

const DEMBELE = "Dembélé";

const people: PersonDef[] = [
  // G2 - racine connue de la lignee
  { key: "hamady_simbara", firstName: "Hamady", lastName: DEMBELE, clanName: "Simbara", gender: "MALE" },

  // G3
  { key: "hamet_hamady", firstName: "Hamet", lastName: DEMBELE, gender: "MALE" },
  { key: "moussa_hamady", firstName: "Moussa", lastName: DEMBELE, gender: "MALE" },

  // G4 - enfants de Hamet Hamady
  {
    key: "djiby_hamet", firstName: "Djiby", lastName: DEMBELE, gender: "MALE", isDeceased: true,
    birthPlace: "Youpe Hamady",
    notes: "A quitté le village de Youpe Hamady pour émigrer ; mort loin de sa famille. A eu 2 femmes (Dado Malado et Coumbou Loume) et 10 enfants au total.",
  },
  { key: "bocar_hamet", firstName: "Bocar", lastName: DEMBELE, gender: "MALE" },
  { key: "demba_hamet", firstName: "Demba", lastName: DEMBELE, gender: "MALE" },
  { key: "salif_hamet", firstName: "Salif", lastName: DEMBELE, gender: "MALE" },
  { key: "moustapha_hamet", firstName: "Moustapha", lastName: DEMBELE, gender: "MALE" },
  { key: "guelle_hamet", firstName: "Guéllé", lastName: DEMBELE, gender: "FEMALE" },
  { key: "korka_hamet", firstName: "Korka", lastName: DEMBELE, gender: "FEMALE" },

  // G4 - enfants de Moussa Hamady
  { key: "daouda_moussa", firstName: "Daouda", lastName: DEMBELE, gender: "MALE" },
  { key: "khadidia_moussa", firstName: "Khadidia", lastName: DEMBELE, gender: "FEMALE" },
  { key: "coumba_moussa", firstName: "Coumba", lastName: DEMBELE, gender: "FEMALE", notes: "À trouver — aucune autre information dans le document source." },
  { key: "penda_moussa", firstName: "Penda", lastName: DEMBELE, gender: "FEMALE", notes: "À trouver — aucune autre information dans le document source." },
  { key: "haby_moussa", firstName: "Haby", lastName: DEMBELE, gender: "FEMALE" },

  // Epouses nommees de Djiby Hamet (n'entrent pas dans le sang Dembele)
  { key: "dado_malado", firstName: "Dado", lastName: "Malado", gender: "FEMALE" },
  { key: "coumbou_loume", firstName: "Coumbou", lastName: "Loume", gender: "FEMALE" },

  // G5 - enfants de Djiby Hamet & Dado Malado (1ere femme)
  { key: "hamady_djiby", firstName: "Hamady", lastName: DEMBELE, gender: "MALE" },
  { key: "samba_djiby", firstName: "Samba", lastName: DEMBELE, gender: "MALE" },
  { key: "djoulde_djiby", firstName: "Djoulde", lastName: DEMBELE, gender: "MALE" },
  { key: "saada_djiby", firstName: "Saada", lastName: DEMBELE, gender: "UNKNOWN" },
  { key: "coly_djiby", firstName: "Coly", lastName: DEMBELE, gender: "MALE", notes: "2 femmes (non nommées dans le document source)." },
  { key: "coumba_djiby", firstName: "Coumba", lastName: DEMBELE, gender: "FEMALE" },
  { key: "taco_djiby", firstName: "Taco", lastName: DEMBELE, gender: "FEMALE" },

  // G6 - enfants de Hamady Djiby
  { key: "bocar_dembele_hamady", firstName: "Bocar", lastName: DEMBELE, gender: "MALE" },
  { key: "souleymane_hamady", firstName: "Souleymane", lastName: DEMBELE, gender: "MALE" },
  { key: "alassane_hamady", firstName: "Alassane", lastName: DEMBELE, gender: "MALE" },

  // G6 - enfants de Samba Djiby (1ere femme puis 2eme femme, non nommees)
  { key: "fatmata_samba", firstName: "Fatmata", lastName: DEMBELE, gender: "FEMALE", notes: "Mère : 1ère femme de Samba Djiby (non nommée)." },
  { key: "oumar_samba", firstName: "Oumar", lastName: DEMBELE, gender: "MALE", notes: "Mère : 2ème femme de Samba Djiby (non nommée)." },
  { key: "coumba_samba", firstName: "Coumba", lastName: DEMBELE, gender: "FEMALE", notes: "Mère : 2ème femme de Samba Djiby (non nommée)." },
  { key: "taco_samba", firstName: "Taco", lastName: DEMBELE, gender: "FEMALE", notes: "Mère : 2ème femme de Samba Djiby (non nommée)." },

  // G6 - enfants de Djoulde Djiby
  { key: "daouada_djoulde", firstName: "Daouada", lastName: DEMBELE, gender: "UNKNOWN" },
  {
    key: "hadji_djoulde", firstName: "Hadji", lastName: DEMBELE, gender: "FEMALE",
    notes: "Installée aux Mureaux (France). Genre déduit : son fils porte le nom de famille Camara (celui du père).",
  },

  // G7 - enfants de Hadji Djoulde
  { key: "abdoul_camara", firstName: "Abdoul", lastName: "Camara", gender: "MALE", notes: "Installé aux Mureaux (France)." },
  { key: "oumar_djoulde", firstName: "Oumar", lastName: DEMBELE, gender: "MALE" },
  { key: "alassane_djoulde", firstName: "Alassane", lastName: DEMBELE, gender: "MALE" },
  { key: "younousse_djoulde", firstName: "Younousse", lastName: DEMBELE, gender: "MALE" },

  // G6 - enfants de Saada Djiby
  { key: "fatmata_saada", firstName: "Fatmata", lastName: DEMBELE, gender: "FEMALE" },
  { key: "coumba_saada", firstName: "Coumba", lastName: DEMBELE, gender: "FEMALE" },
  { key: "penda_saada", firstName: "Penda", lastName: DEMBELE, gender: "FEMALE" },
  { key: "samba_lala_saada", firstName: "Samba Lala", lastName: DEMBELE, gender: "MALE", notes: "Installé à Creil (France)." },

  // G6 - enfants de Coly Djiby
  { key: "moussa_coly", firstName: "Moussa", lastName: DEMBELE, gender: "MALE" },
  { key: "maimouna_coly", firstName: "Maimouna", lastName: DEMBELE, gender: "FEMALE" },
  { key: "khadidia_coly", firstName: "Khadidia", lastName: DEMBELE, gender: "FEMALE" },

  // Mari de Coumba Djiby (2eme mariage) - n'entre pas dans le sang Dembele
  {
    key: "mamoudou_mari_coumba", firstName: "Mamoudou", gender: "MALE",
    notes: "2ème mari de Coumba Djiby. A fait la guerre 14-18.",
  },

  // G6 - enfants de Coumba Djiby & Mamoudou (2eme mariage)
  { key: "dobale_coumba", firstName: "Dobale", lastName: DEMBELE, gender: "UNKNOWN" },
  { key: "hawa_coumba", firstName: "Hawa", lastName: DEMBELE, gender: "FEMALE" },
  { key: "sidy_coumba", firstName: "Sidy", lastName: DEMBELE, gender: "MALE" },

  // G7 - enfants de Dobale et Hawa
  { key: "amadou_toure", firstName: "Amadou", lastName: "Touré", gender: "MALE", notes: "Installé à Nanterre (France)." },
  { key: "hamady_soumare", firstName: "Hamady", lastName: "Soumaré", gender: "MALE" },

  // G8 - enfants de Amadou Touré
  { key: "cola_toure", firstName: "Cola", lastName: "Touré", gender: "UNKNOWN" },
  { key: "alassane_toure", firstName: "Alassane", lastName: "Touré", gender: "MALE" },
  { key: "ibrahima_toure", firstName: "Ibrahima", lastName: "Touré", gender: "MALE" },

  // G8 - enfants de Hamady Soumaré
  { key: "hawa_soumare", firstName: "Hawa", lastName: "Soumaré", gender: "FEMALE" },
  { key: "mariam_soumare", firstName: "Mariam", lastName: "Soumaré", gender: "FEMALE" },
  { key: "mamadou_soumare", firstName: "Mamadou", lastName: "Soumaré", gender: "MALE" },

  // Mari de Taco Djiby - n'entre pas dans le sang Dembele
  { key: "ali_mari_taco", firstName: "Ali", gender: "MALE" },

  // G6 - enfants de Taco Djiby & Ali
  { key: "maimouna_ali", firstName: "Maïmouna", lastName: "Ali", gender: "FEMALE", notes: "Mariée à Samba Ali." },
  { key: "abdoulaye_ali", firstName: "Abdoulaye", lastName: "Ali", gender: "MALE" },
  { key: "ouleye_ali", firstName: "Ouleye", lastName: "Ali", gender: "FEMALE" },
  { key: "djadduru_ali", firstName: "Djadduru", lastName: "Ali", gender: "UNKNOWN", notes: "À trouver — aucune autre information dans le document source." },
  { key: "djeynaba_ali", firstName: "Djeynaba", lastName: "Ali", gender: "FEMALE" },
  { key: "amadou_ali", firstName: "Amadou", lastName: "Ali", gender: "MALE", notes: "À trouver — aucune autre information dans le document source." },

  // Mari de Maimouna Ali
  { key: "samba_ali_mari", firstName: "Samba", lastName: "Ali", gender: "MALE" },

  // G7 - enfants de Maimouna Ali & Samba Ali
  { key: "aminata_maimouna", firstName: "Aminata", gender: "FEMALE" },
  { key: "mariame_maimouna", firstName: "Mariame", gender: "FEMALE", notes: "Installée à Bobigny (France)." },
  { key: "amadou_maimouna", firstName: "Amadou", gender: "MALE" },
  { key: "safiatou_maimouna", firstName: "Safiatou", gender: "FEMALE" },
  { key: "issa_maimouna", firstName: "Issa", gender: "MALE" },
  { key: "djeynaba_haby_maimouna", firstName: "Djeynaba & Haby", gender: "FEMALE", notes: "Jumelles." },

  // G8 - enfants de Mariame (Bobigny)
  { key: "diamelle_mariame", firstName: "Diamelle", gender: "UNKNOWN" },
  { key: "mamadou_mariame", firstName: "Mamadou", gender: "MALE" },
  { key: "amadou_mariame", firstName: "Amadou", gender: "MALE" },
  { key: "abdoulaye_mariame", firstName: "Abdoulaye", gender: "MALE" },

  // G7 - enfants de Abdoulaye Ali
  { key: "moussa_abdoulaye_ali", firstName: "Moussa", gender: "MALE" },
  { key: "jakaria_abdoulaye_ali", firstName: "Jakaria", gender: "MALE" },
  { key: "mansourou_abdoulaye_ali", firstName: "Mansourou", gender: "MALE" },
  { key: "habsatou_abdoulaye_ali", firstName: "Habsatou", gender: "FEMALE" },
  { key: "ali_abdoulaye_ali", firstName: "Ali", gender: "MALE" },

  // Enfant de Djeynaba Ali
  { key: "moussa_djeynaba_ali", firstName: "Moussa", gender: "MALE", notes: "Installé aux Mureaux (France)." },

  // G5 - enfants de Djiby Hamet & Coumbou Loume (2eme femme)
  { key: "penda_djiby", firstName: "Penda", lastName: DEMBELE, gender: "FEMALE" },
  { key: "djenaba_djiby", firstName: "Djenaba", lastName: DEMBELE, gender: "FEMALE" },
  { key: "debbou_djiby", firstName: "Debbou", lastName: DEMBELE, gender: "FEMALE", notes: "À trouver — aucune autre information dans le document source." },

  // G6 - enfants de Penda Djiby
  { key: "marieme_penda", firstName: "Marième", gender: "FEMALE" },
  { key: "abdoulaye_penda", firstName: "Abdoulaye", gender: "MALE" },
  { key: "alassane_ndongo_penda", firstName: "Alassane", lastName: "Ndongo", gender: "MALE", notes: "Installé à Creil (France)." },
  { key: "debbou_penda", firstName: "Debbou", gender: "FEMALE" },

  // Enfant de Djenaba Djiby
  { key: "hamady_djenaba", firstName: "Hamady", gender: "MALE" },

  // G5 - enfants de Bocar Hamet
  { key: "abdoulaye_bocar", firstName: "Abdoulaye", lastName: DEMBELE, gender: "MALE" },

  // G6 - enfants de Abdoulaye Bocar
  { key: "bilali_abdoulaye", firstName: "Bilali", lastName: DEMBELE, gender: "MALE" },
  { key: "daouda_abdoulaye", firstName: "Daouda", lastName: DEMBELE, gender: "MALE" },
  { key: "djiby_abdoulaye", firstName: "Djiby", lastName: DEMBELE, gender: "MALE", notes: "Installé à Creil (France)." },
  { key: "aissata_abdoulaye", firstName: "Aïssata", lastName: DEMBELE, gender: "FEMALE", notes: "Installée à Creil (France)." },
  { key: "saada_abdoulaye", firstName: "Saada", lastName: DEMBELE, gender: "UNKNOWN" },

  // G5 - enfant de Demba Hamet
  { key: "marieme_demba", firstName: "Marième", lastName: DEMBELE, gender: "FEMALE" },

  // G6 - enfants de Marième Demba
  { key: "mamadou_marieme", firstName: "Mamadou", lastName: DEMBELE, gender: "MALE" },
  { key: "samba_marieme", firstName: "Samba", lastName: DEMBELE, gender: "MALE" },
  { key: "demba_marieme", firstName: "Demba", lastName: DEMBELE, gender: "MALE" },
  {
    key: "diokhe_marieme", firstName: "Diokhe", lastName: DEMBELE, gender: "UNKNOWN",
    notes: "Installée à Pierrefitte (France). A eu 9 enfants (7 garçons et 2 filles) non nommés dans le document source.",
  },

  // G5 - enfants de Salif Hamet
  { key: "bocar_salif", firstName: "Bocar", lastName: DEMBELE, gender: "MALE" },
  { key: "saada_salif", firstName: "Saada", lastName: DEMBELE, gender: "UNKNOWN" },

  // G5 - enfant de Moustapha Hamet
  { key: "marieme_moustapha", firstName: "Marième", lastName: DEMBELE, gender: "FEMALE" },

  // G5 - enfant de Guéllé Hamet
  { key: "daya_guelle", firstName: "Daya", lastName: DEMBELE, gender: "FEMALE" },

  // G6 - enfants de Daya Guelle
  { key: "nilla_daya", firstName: "Nilla", gender: "UNKNOWN" },
  { key: "aissata_daya", firstName: "Aïssata", gender: "FEMALE" },
  { key: "coumba_daya", firstName: "Coumba", gender: "FEMALE" },
  { key: "salif_daya", firstName: "Salif", gender: "MALE" },
  { key: "moussa_daya", firstName: "Moussa", gender: "MALE" },

  // G5 - enfant de Korka Hamet
  { key: "hamady_faco", firstName: "Hamady", lastName: "Faco", gender: "MALE" },

  // G6 - enfant de Hamady Faco
  { key: "hamidou_coulibaly", firstName: "Hamidou", lastName: "Coulibaly", gender: "MALE" },

  // G5 - enfants de Daouda Moussa
  { key: "adama_daouda", firstName: "Adama", lastName: DEMBELE, gender: "FEMALE" },
  { key: "diamelle_daouada", firstName: "Diamelle", lastName: DEMBELE, gender: "FEMALE" },
  { key: "dembo_daouada", firstName: "Dembo", lastName: DEMBELE, gender: "MALE" },

  // G6 - enfants de Diamelle Daouada
  { key: "mamadou_diamelle", firstName: "Mamadou", lastName: DEMBELE, gender: "MALE" },
  { key: "samba_diamelle", firstName: "Samba", lastName: DEMBELE, gender: "MALE", isDeceased: true, notes: "Décédé jeune." },
  { key: "boudou_diamelle", firstName: "Boudou", lastName: DEMBELE, gender: "FEMALE", notes: "Installée à Dakar. A eu 1 fille non nommée dans le document source." },
  { key: "coumba_diamelle", firstName: "Coumba", lastName: DEMBELE, gender: "FEMALE", notes: "Installée à Tambacounda / France (mention ambiguë dans le document source). A eu 2 filles non nommées." },
  { key: "ousmane_diamelle", firstName: "Ousmane", lastName: DEMBELE, gender: "MALE", notes: "Installé à Levallois-Perret (France). A eu 9 enfants non nommés dans le document source." },

  // G7 - enfants de Mamadou Diamelle
  {
    key: "samba_cisse_mamadou", firstName: "Samba", lastName: "Cissé", gender: "MALE",
    notes: "Installé à Creil (France). A eu 5 enfants (2 garçons et 3 filles) non nommés dans le document source. Mamadou (son père) a eu 8 enfants au total, seul Samba Cissé est nommé.",
  },

  // G4 - enfant de Khadidia Moussa (union avec Salif Hamet, cousin germain)
  // (aucun enfant nommé pour cette union dans le document source)

  // G5 - enfant de Haby Moussa
  { key: "hamady_haby", firstName: "Hamady", lastName: DEMBELE, gender: "MALE" },

  // G6 - enfants de Hamady Haby
  { key: "amadou_hamady_haby", firstName: "Amadou", lastName: DEMBELE, gender: "MALE" },
  { key: "fode_hamady_haby", firstName: "Fodé", lastName: DEMBELE, gender: "MALE" },
  { key: "coumba_hamady_haby", firstName: "Coumba", lastName: DEMBELE, gender: "FEMALE" },
];

const parentages: { parent: string; child: string; type: "FATHER" | "MOTHER" | "GUARDIAN" }[] = [
  { parent: "hamady_simbara", child: "hamet_hamady", type: "FATHER" },
  { parent: "hamady_simbara", child: "moussa_hamady", type: "FATHER" },

  { parent: "hamet_hamady", child: "djiby_hamet", type: "FATHER" },
  { parent: "hamet_hamady", child: "bocar_hamet", type: "FATHER" },
  { parent: "hamet_hamady", child: "demba_hamet", type: "FATHER" },
  { parent: "hamet_hamady", child: "salif_hamet", type: "FATHER" },
  { parent: "hamet_hamady", child: "moustapha_hamet", type: "FATHER" },
  { parent: "hamet_hamady", child: "guelle_hamet", type: "FATHER" },
  { parent: "hamet_hamady", child: "korka_hamet", type: "FATHER" },

  { parent: "moussa_hamady", child: "daouda_moussa", type: "FATHER" },
  { parent: "moussa_hamady", child: "khadidia_moussa", type: "FATHER" },
  { parent: "moussa_hamady", child: "coumba_moussa", type: "FATHER" },
  { parent: "moussa_hamady", child: "penda_moussa", type: "FATHER" },
  { parent: "moussa_hamady", child: "haby_moussa", type: "FATHER" },

  // Djiby Hamet & Dado Malado (1ere femme)
  { parent: "djiby_hamet", child: "hamady_djiby", type: "FATHER" },
  { parent: "dado_malado", child: "hamady_djiby", type: "MOTHER" },
  { parent: "djiby_hamet", child: "samba_djiby", type: "FATHER" },
  { parent: "dado_malado", child: "samba_djiby", type: "MOTHER" },
  { parent: "djiby_hamet", child: "djoulde_djiby", type: "FATHER" },
  { parent: "dado_malado", child: "djoulde_djiby", type: "MOTHER" },
  { parent: "djiby_hamet", child: "saada_djiby", type: "FATHER" },
  { parent: "dado_malado", child: "saada_djiby", type: "MOTHER" },
  { parent: "djiby_hamet", child: "coly_djiby", type: "FATHER" },
  { parent: "dado_malado", child: "coly_djiby", type: "MOTHER" },
  { parent: "djiby_hamet", child: "coumba_djiby", type: "FATHER" },
  { parent: "dado_malado", child: "coumba_djiby", type: "MOTHER" },
  { parent: "djiby_hamet", child: "taco_djiby", type: "FATHER" },
  { parent: "dado_malado", child: "taco_djiby", type: "MOTHER" },

  // Djiby Hamet & Coumbou Loume (2eme femme)
  { parent: "djiby_hamet", child: "penda_djiby", type: "FATHER" },
  { parent: "coumbou_loume", child: "penda_djiby", type: "MOTHER" },
  { parent: "djiby_hamet", child: "djenaba_djiby", type: "FATHER" },
  { parent: "coumbou_loume", child: "djenaba_djiby", type: "MOTHER" },
  { parent: "djiby_hamet", child: "debbou_djiby", type: "FATHER" },
  { parent: "coumbou_loume", child: "debbou_djiby", type: "MOTHER" },

  // Hamady Djiby (G6)
  { parent: "hamady_djiby", child: "bocar_dembele_hamady", type: "FATHER" },
  { parent: "hamady_djiby", child: "souleymane_hamady", type: "FATHER" },
  { parent: "hamady_djiby", child: "alassane_hamady", type: "FATHER" },

  // Samba Djiby (G6)
  { parent: "samba_djiby", child: "fatmata_samba", type: "FATHER" },
  { parent: "samba_djiby", child: "oumar_samba", type: "FATHER" },
  { parent: "samba_djiby", child: "coumba_samba", type: "FATHER" },
  { parent: "samba_djiby", child: "taco_samba", type: "FATHER" },

  // Djoulde Djiby (G6)
  { parent: "djoulde_djiby", child: "daouada_djoulde", type: "FATHER" },
  { parent: "djoulde_djiby", child: "hadji_djoulde", type: "FATHER" },

  // Hadji Djoulde (G7)
  { parent: "hadji_djoulde", child: "abdoul_camara", type: "MOTHER" },
  { parent: "hadji_djoulde", child: "oumar_djoulde", type: "MOTHER" },
  { parent: "hadji_djoulde", child: "alassane_djoulde", type: "MOTHER" },
  { parent: "hadji_djoulde", child: "younousse_djoulde", type: "MOTHER" },

  // Saada Djiby (G6)
  { parent: "saada_djiby", child: "fatmata_saada", type: "GUARDIAN" },
  { parent: "saada_djiby", child: "coumba_saada", type: "GUARDIAN" },
  { parent: "saada_djiby", child: "penda_saada", type: "GUARDIAN" },
  { parent: "saada_djiby", child: "samba_lala_saada", type: "GUARDIAN" },

  // Coly Djiby (G6)
  { parent: "coly_djiby", child: "moussa_coly", type: "FATHER" },
  { parent: "coly_djiby", child: "maimouna_coly", type: "FATHER" },
  { parent: "coly_djiby", child: "khadidia_coly", type: "FATHER" },

  // Coumba Djiby & Mamoudou (2eme mariage) -> G6
  { parent: "coumba_djiby", child: "dobale_coumba", type: "MOTHER" },
  { parent: "mamoudou_mari_coumba", child: "dobale_coumba", type: "FATHER" },
  { parent: "coumba_djiby", child: "hawa_coumba", type: "MOTHER" },
  { parent: "mamoudou_mari_coumba", child: "hawa_coumba", type: "FATHER" },
  { parent: "coumba_djiby", child: "sidy_coumba", type: "MOTHER" },
  { parent: "mamoudou_mari_coumba", child: "sidy_coumba", type: "FATHER" },

  // Dobale & Hawa (G7)
  { parent: "dobale_coumba", child: "amadou_toure", type: "GUARDIAN" },
  { parent: "hawa_coumba", child: "hamady_soumare", type: "MOTHER" },

  // Amadou Touré (G8)
  { parent: "amadou_toure", child: "cola_toure", type: "FATHER" },
  { parent: "amadou_toure", child: "alassane_toure", type: "FATHER" },
  { parent: "amadou_toure", child: "ibrahima_toure", type: "FATHER" },

  // Hamady Soumaré (G8)
  { parent: "hamady_soumare", child: "hawa_soumare", type: "FATHER" },
  { parent: "hamady_soumare", child: "mariam_soumare", type: "FATHER" },
  { parent: "hamady_soumare", child: "mamadou_soumare", type: "FATHER" },

  // Taco Djiby & Ali -> G6
  { parent: "taco_djiby", child: "maimouna_ali", type: "MOTHER" },
  { parent: "ali_mari_taco", child: "maimouna_ali", type: "FATHER" },
  { parent: "taco_djiby", child: "abdoulaye_ali", type: "MOTHER" },
  { parent: "ali_mari_taco", child: "abdoulaye_ali", type: "FATHER" },
  { parent: "taco_djiby", child: "ouleye_ali", type: "MOTHER" },
  { parent: "ali_mari_taco", child: "ouleye_ali", type: "FATHER" },
  { parent: "taco_djiby", child: "djadduru_ali", type: "MOTHER" },
  { parent: "ali_mari_taco", child: "djadduru_ali", type: "FATHER" },
  { parent: "taco_djiby", child: "djeynaba_ali", type: "MOTHER" },
  { parent: "ali_mari_taco", child: "djeynaba_ali", type: "FATHER" },
  { parent: "taco_djiby", child: "amadou_ali", type: "MOTHER" },
  { parent: "ali_mari_taco", child: "amadou_ali", type: "FATHER" },

  // Maimouna Ali & Samba Ali -> G7
  { parent: "maimouna_ali", child: "aminata_maimouna", type: "MOTHER" },
  { parent: "samba_ali_mari", child: "aminata_maimouna", type: "FATHER" },
  { parent: "maimouna_ali", child: "mariame_maimouna", type: "MOTHER" },
  { parent: "samba_ali_mari", child: "mariame_maimouna", type: "FATHER" },
  { parent: "maimouna_ali", child: "amadou_maimouna", type: "MOTHER" },
  { parent: "samba_ali_mari", child: "amadou_maimouna", type: "FATHER" },
  { parent: "maimouna_ali", child: "safiatou_maimouna", type: "MOTHER" },
  { parent: "samba_ali_mari", child: "safiatou_maimouna", type: "FATHER" },
  { parent: "maimouna_ali", child: "issa_maimouna", type: "MOTHER" },
  { parent: "samba_ali_mari", child: "issa_maimouna", type: "FATHER" },
  { parent: "maimouna_ali", child: "djeynaba_haby_maimouna", type: "MOTHER" },
  { parent: "samba_ali_mari", child: "djeynaba_haby_maimouna", type: "FATHER" },

  // Mariame (G8, Bobigny)
  { parent: "mariame_maimouna", child: "diamelle_mariame", type: "GUARDIAN" },
  { parent: "mariame_maimouna", child: "mamadou_mariame", type: "GUARDIAN" },
  { parent: "mariame_maimouna", child: "amadou_mariame", type: "GUARDIAN" },
  { parent: "mariame_maimouna", child: "abdoulaye_mariame", type: "GUARDIAN" },

  // Abdoulaye Ali (G7)
  { parent: "abdoulaye_ali", child: "moussa_abdoulaye_ali", type: "FATHER" },
  { parent: "abdoulaye_ali", child: "jakaria_abdoulaye_ali", type: "FATHER" },
  { parent: "abdoulaye_ali", child: "mansourou_abdoulaye_ali", type: "FATHER" },
  { parent: "abdoulaye_ali", child: "habsatou_abdoulaye_ali", type: "FATHER" },
  { parent: "abdoulaye_ali", child: "ali_abdoulaye_ali", type: "FATHER" },

  // Djeynaba Ali
  { parent: "djeynaba_ali", child: "moussa_djeynaba_ali", type: "MOTHER" },

  // Penda Djiby (G6)
  { parent: "penda_djiby", child: "marieme_penda", type: "MOTHER" },
  { parent: "penda_djiby", child: "abdoulaye_penda", type: "MOTHER" },
  { parent: "penda_djiby", child: "alassane_ndongo_penda", type: "MOTHER" },
  { parent: "penda_djiby", child: "debbou_penda", type: "MOTHER" },

  // Djenaba Djiby
  { parent: "djenaba_djiby", child: "hamady_djenaba", type: "MOTHER" },

  // Bocar Hamet (G5)
  { parent: "bocar_hamet", child: "abdoulaye_bocar", type: "FATHER" },

  // Abdoulaye Bocar (G6)
  { parent: "abdoulaye_bocar", child: "bilali_abdoulaye", type: "FATHER" },
  { parent: "abdoulaye_bocar", child: "daouda_abdoulaye", type: "FATHER" },
  { parent: "abdoulaye_bocar", child: "djiby_abdoulaye", type: "FATHER" },
  { parent: "abdoulaye_bocar", child: "aissata_abdoulaye", type: "FATHER" },
  { parent: "abdoulaye_bocar", child: "saada_abdoulaye", type: "FATHER" },

  // Demba Hamet (G5)
  { parent: "demba_hamet", child: "marieme_demba", type: "FATHER" },

  // Marième Demba (G6)
  { parent: "marieme_demba", child: "mamadou_marieme", type: "MOTHER" },
  { parent: "marieme_demba", child: "samba_marieme", type: "MOTHER" },
  { parent: "marieme_demba", child: "demba_marieme", type: "MOTHER" },
  { parent: "marieme_demba", child: "diokhe_marieme", type: "MOTHER" },

  // Salif Hamet (G5)
  { parent: "salif_hamet", child: "bocar_salif", type: "FATHER" },
  { parent: "salif_hamet", child: "saada_salif", type: "FATHER" },

  // Moustapha Hamet (G5)
  { parent: "moustapha_hamet", child: "marieme_moustapha", type: "FATHER" },

  // Guéllé Hamet (G5)
  { parent: "guelle_hamet", child: "daya_guelle", type: "MOTHER" },

  // Daya Guelle (G6)
  { parent: "daya_guelle", child: "nilla_daya", type: "MOTHER" },
  { parent: "daya_guelle", child: "aissata_daya", type: "MOTHER" },
  { parent: "daya_guelle", child: "coumba_daya", type: "MOTHER" },
  { parent: "daya_guelle", child: "salif_daya", type: "MOTHER" },
  { parent: "daya_guelle", child: "moussa_daya", type: "MOTHER" },

  // Korka Hamet (G5)
  { parent: "korka_hamet", child: "hamady_faco", type: "MOTHER" },

  // Hamady Faco (G6)
  { parent: "hamady_faco", child: "hamidou_coulibaly", type: "FATHER" },

  // Daouda Moussa (G5)
  { parent: "daouda_moussa", child: "adama_daouda", type: "FATHER" },
  { parent: "daouda_moussa", child: "diamelle_daouada", type: "FATHER" },
  { parent: "daouda_moussa", child: "dembo_daouada", type: "FATHER" },

  // Diamelle Daouada (G6)
  { parent: "diamelle_daouada", child: "mamadou_diamelle", type: "MOTHER" },
  { parent: "diamelle_daouada", child: "samba_diamelle", type: "MOTHER" },
  { parent: "diamelle_daouada", child: "boudou_diamelle", type: "MOTHER" },
  { parent: "diamelle_daouada", child: "coumba_diamelle", type: "MOTHER" },
  { parent: "diamelle_daouada", child: "ousmane_diamelle", type: "MOTHER" },

  // Mamadou Diamelle (G7)
  { parent: "mamadou_diamelle", child: "samba_cisse_mamadou", type: "FATHER" },

  // Haby Moussa (G5)
  { parent: "haby_moussa", child: "hamady_haby", type: "MOTHER" },

  // Hamady Haby (G6)
  { parent: "hamady_haby", child: "amadou_hamady_haby", type: "FATHER" },
  { parent: "hamady_haby", child: "fode_hamady_haby", type: "FATHER" },
  { parent: "hamady_haby", child: "coumba_hamady_haby", type: "FATHER" },
];

const unions: { a: string; b: string; status?: "MARRIED" | "DIVORCED" | "WIDOWED" | "UNKNOWN"; notes?: string }[] = [
  { a: "djiby_hamet", b: "dado_malado", status: "MARRIED", notes: "1ère femme." },
  { a: "djiby_hamet", b: "coumbou_loume", status: "MARRIED", notes: "2ème femme." },
  { a: "coumba_djiby", b: "mamoudou_mari_coumba", status: "MARRIED", notes: "2ème mariage de Coumba Djiby." },
  { a: "taco_djiby", b: "ali_mari_taco", status: "MARRIED" },
  { a: "maimouna_ali", b: "samba_ali_mari", status: "MARRIED" },
  { a: "khadidia_moussa", b: "salif_hamet", status: "MARRIED", notes: "Cousins germains (enfants des deux frères Hamet Hamady et Moussa Hamady)." },
];

async function main() {
  const idByKey: Record<string, string> = {};

  for (const p of people) {
    const person = await prisma.person.create({
      data: {
        firstName: p.firstName,
        lastName: p.lastName,
        clanName: p.clanName,
        gender: p.gender ?? "UNKNOWN",
        isDeceased: p.isDeceased ?? false,
        birthPlace: p.birthPlace,
        deathPlace: p.deathPlace,
        notes: p.notes,
      },
    });
    idByKey[p.key] = person.id;
  }

  for (const r of parentages) {
    await prisma.parentage.create({
      data: {
        parentId: idByKey[r.parent],
        childId: idByKey[r.child],
        parentType: r.type,
      },
    });
  }

  for (const u of unions) {
    await prisma.union.create({
      data: {
        personAId: idByKey[u.a],
        personBId: idByKey[u.b],
        status: u.status ?? "UNKNOWN",
        notes: u.notes,
      },
    });
  }

  console.log(
    `Import terminé : ${people.length} personnes, ${parentages.length} liens parent-enfant, ${unions.length} unions.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
