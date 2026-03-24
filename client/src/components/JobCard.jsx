export default function JobCard({ job }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">

      <h3 className="text-lg font-semibold">{job.position}</h3>

      <p className="text-gray-600">{job.company}</p>

      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
        {job.status}
      </span>

    </div>
  );
}