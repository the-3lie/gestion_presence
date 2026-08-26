import { PrismaClient, Sexe } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', passwordHash, role: 'ADMIN' }
  });

  const agents = [
    {
      matricule: '7334',
      nom: 'PHOSO',
      postnom: 'NZABA',
      prenom: 'MARCIA',
      sexe: Sexe.FEMININ,
      contact: '008999089',
      adresse: 'LUBUMBASHI',
      entreprise: 'Mon Entreprise',
      service: 'INFORMATIQUE',
      departement: 'Programmation',
      fonction: 'Directeur Général',
      niveauEtude: 'G3',
      dateEngagement: new Date('2014-09-24')
    },
    {
      matricule: '1234',
      nom: 'YESANGULE',
      postnom: 'KABAMBA',
      prenom: 'JEAN-PIERRE',
      sexe: Sexe.MASCULIN,
      contact: '',
      adresse: '',
      entreprise: 'Mon Entreprise',
      service: 'RH',
      departement: 'Administration',
      fonction: 'Agent',
      niveauEtude: 'G3',
      dateEngagement: new Date('2020-01-10')
    }
  ];

  for (const a of agents) {
    await prisma.personnel.upsert({
      where: { matricule: a.matricule },
      update: {},
      create: a
    });
  }

  console.log('Seed terminé. Connexion: admin / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
