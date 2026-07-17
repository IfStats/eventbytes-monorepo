import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres.twhbjaybtatssmeyjhgb:25123Akunnia@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?workaround=supabase-pooler.prisma';

const adapter = new PrismaPg(
  new Pool({
    connectionString,
  }),
);

const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear dependent rows first to satisfy foreign-key constraints.
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.organizer.deleteMany();

  const categoryNames = [
    'Music',
    'Business',
    'Education',
    'Food',
    'Sports',
    'Comedy',
    'Theatre',
    'Gaming',
  ];

  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.create({
        data: { name },
      }),
    ),
  );

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const organizer = await prisma.organizer.create({
    data: {
      email: 'demo-organizer@eventbytes.app',
      password: passwordHash,
    },
  });

  const now = new Date();
  const day = 24 * 60 * 60 * 1000;

  await prisma.event.createMany({
    data: [
      {
        title: 'City Lights Music Fest',
        date: new Date(now.getTime() + 3 * day),
        location: 'Lagos Arena',
        description: 'An outdoor evening concert with top local artists.',
        isFeatured: true,
        organizerId: organizer.id,
        categoryId: categories.find((c) => c.name === 'Music')!.id,
      },
      {
        title: 'Startup Growth Summit',
        date: new Date(now.getTime() + 5 * day),
        location: 'Victoria Island Conference Hall',
        description: 'Workshops and talks for startup founders.',
        isFeatured: true,
        organizerId: organizer.id,
        categoryId: categories.find((c) => c.name === 'Business')!.id,
      },
      {
        title: 'Future of Learning Expo',
        date: new Date(now.getTime() + 8 * day),
        location: 'Tech Hub Center',
        description: 'Panels on digital learning and edtech trends.',
        isFeatured: true,
        organizerId: organizer.id,
        categoryId: categories.find((c) => c.name === 'Education')!.id,
      },
      {
        title: 'Weekend Food Carnival',
        date: new Date(now.getTime() + 10 * day),
        location: 'Freedom Park',
        description: 'Street food vendors and live cooking demos.',
        isFeatured: false,
        organizerId: organizer.id,
        categoryId: categories.find((c) => c.name === 'Food')!.id,
      },
      {
        title: 'Indie Game Night',
        date: new Date(now.getTime() + 12 * day),
        location: 'Pixel Lounge',
        description: 'Playable demos and creator Q and A sessions.',
        isFeatured: false,
        organizerId: organizer.id,
        categoryId: categories.find((c) => c.name === 'Gaming')!.id,
      },
    ],
  });

  console.log('Seed complete: categories, organizer, and events created.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
