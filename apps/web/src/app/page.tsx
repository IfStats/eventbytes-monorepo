import CategoryGrid from '@/components/CategoryGrid';
import FeaturedEvents from '@/components/FeaturedEvents';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const featuredEvents = await prisma.event.findMany({
    where: { isFeatured: true },
    take: 3,
    orderBy: { date: 'asc' },
    select: {
      id: true,
      title: true,
      date: true,
      location: true,
    },
  });

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <FeaturedEvents events={featuredEvents} />
      <CategoryGrid categories={categories} />
    </main>
  );
}
