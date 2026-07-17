const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Create Categories
  const categories = [
    { name: 'Music' }, { name: 'Business' }, { name: 'Education' },
    { name: 'Food' }, { name: 'Sports' }, { name: 'Comedy' },
    { name: 'Theatre' }, { name: 'Gaming' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: 'some-id' }, // This logic is simplified for safety
      update: {},
      create: cat,
    });
  }

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
