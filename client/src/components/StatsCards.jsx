export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

      <Card title="Total Jobs" value={stats.total} color="bg-blue-500" />
      <Card title="Applied" value={stats.applied} color="bg-yellow-500" />
      <Card title="Interviews" value={stats.interview} color="bg-purple-500" />
      <Card title="Offers" value={stats.offer} color="bg-green-500" />
      <Card title="Rejected" value={stats.rejected} color="bg-red-500" />

    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`p-4 rounded-lg text-white ${color}`}>
      <h2 className="text-sm">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}