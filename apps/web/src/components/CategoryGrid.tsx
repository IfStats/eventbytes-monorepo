type Category = {
  id: number;
  name: string;
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl font-bold mb-8">Popular Categories</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <span className="mb-2 text-3xl">🎟️</span>
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
