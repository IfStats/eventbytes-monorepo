export default function RevenueCard({ stats }: { stats: any }) {
  return (
    <div className="flex gap-4">
      <div className="p-4 bg-white rounded border">
        <p className="text-xs text-gray-500">Gross</p>
        <p className="font-bold">${stats?.total_gross?.toFixed(2) || '0.00'}</p>
      </div>
      <div className="p-4 bg-white rounded border">
        <p className="text-xs text-gray-500">Net</p>
        <p className="font-bold">${stats?.total_net?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
}
