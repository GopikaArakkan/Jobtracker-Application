import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { fetchJobs, updateJob, deleteJob } from "../redux/jobsSlice";

export default function JobList() {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);

  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const getDaysAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffTime = Math.abs(now - past);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleResumeUpload = async (jobId, file) => {
    const formData = new FormData();
    formData.append("resume", file);

    try {
      await api.put(`/api/jobs/${jobId}/resume`, formData);
      alert("Resume uploaded");
      dispatch(fetchJobs());
    } catch (err) {
      alert("Upload failed");
    }
  };

  if (!jobs || jobs.length === 0) {
    return <p className="text-gray-400">No jobs added yet.</p>;
  }

  return (
    <div className="space-y-4">

      <div className="flex gap-5">
        {/* FILTER */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border bg-gray-700 text-white p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-700 border text-white p-2 rounded w-full"
        />
      </div>

      <div className="max-h-[490px] overflow-y-auto pr-2">

        {jobs
          .filter((job) =>
            filterStatus === "All" ? true : job.status === filterStatus
          )
          .filter((job) =>
            job.company.toLowerCase().includes(search.toLowerCase())
          )
          .map((job) => (
            <div
              key={job._id}
              className="bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition mb-4"
            >

              {/* TOP */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-200">
                    {job.company}
                  </h3>

                  <p className="text-gray-200">
                    {job.role} • {job.location}
                  </p>

                  <p className="text-sm p-1 text-gray-200">
                    {getDaysAgo(job.updatedAt)} days ago
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
                  {job.status}
                </span>
              </div>

              {/* ✅ FIXED SECTION (NO FLOATS) */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 mt-3">

                {/* STATUS */}
                <select
                  value={job.status}
                  onChange={(e) =>
                    dispatch(updateJob({ id: job._id, status: e.target.value }))
                  }
                  className="bg-gray-800 text-white p-2 rounded w-full md:w-auto"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/* FILE */}
                <div className="border bg-gray-800 text-white p-2 rounded w-full md:flex-1">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      handleResumeUpload(job._id, e.target.files[0])
                    }
                  />

                  {job.resume && (
                    <a
                      href={`http://localhost:5000/${job.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 ml-2"
                    >
                      Download
                    </a>
                  )}
                </div>

                {/* DELETE */}
                <div className="md:ml-auto">
                  <button
                    onClick={() => dispatch(deleteJob(job._id))}
                    className="bg-red-500 text-white px-4 py-2 rounded w-full md:w-auto"
                  >
                    Delete
                  </button>
                </div>

              </div>

            </div>
          ))}
      </div>
    </div>
  );
}