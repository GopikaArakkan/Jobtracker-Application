import { useEffect, useState } from "react";
import api from "../api/axios";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
   ChartDataLabels
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [page, setPage] = useState(1);
  const jobsPerPage = 5;
  const [activity, setActivity] = useState([]);
 
const fetchActivity = async () => {
    try {
      const res = await api.get("/api/admin/activity");
      setActivity(res.data);
    } catch {
      console.error("Failed to fetch activity");
    }
  };
 useEffect(() => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    setError("You are not authorized to view admin data");
    return;
  }

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/api/admin/stats");
      setStats(data);
    } catch {
      setError("Failed to load admin stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch {
      console.error("Failed to load users");
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/admin/jobs");
      setJobs(res.data);
    } catch {
      console.error("Failed to load jobs");
    }
  };

  const loadData = () => {
    fetchStats();
    fetchUsers();
    fetchJobs();
    fetchActivity();
  };

  loadData();

  const interval = setInterval(loadData, 5000);

  return () => clearInterval(interval);

}, []);


  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!stats) {
    return <p className="text-center mt-10">Loading admin dashboard...</p>;
  }

  // ✅ SAFE: stats exists here
  const labels = stats.statusStats.map((s) => s._id);
  const counts = stats.statusStats.map((s) => s.count);

  const barData = {
  labels,
  datasets: [
    {
      label: "Jobs Count",
      data: counts,
      backgroundColor: [
        "#22c55e", // Interview
        "#3b82f6", // Offer
        "#ef4444", // Rejected
        "#f59e0b", // Applied
      ],
      borderRadius: 6,
      borderSkipped: false
    },
  ],
};

  const pieData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#ef4444",
          "#f59e0b",
        ],
      },
    ],
  };

const handleDeleteUser = async (id) => {
  if (!window.confirm("Delete this user?")) return;

  await api.delete(`/api/admin/users/${id}`);

  setUsers(users.filter((u) => u._id !== id));

  fetchActivity(); // ⭐ refresh real activity
};

const paginatedJobs = jobs.slice(
  (page - 1) * jobsPerPage,
  page * jobsPerPage
);

const handleDeleteJob = async (id) => {
  if (!window.confirm("Delete this job?")) return;

  await api.delete(`/api/admin/jobs/${id}`);

  setJobs(jobs.filter((j) => j._id !== id));

  fetchActivity(); // ⭐ refresh activity
};

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-green-500 p-6 rounded">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-yellow-400 p-6 rounded">
          <h2 className="text-xl font-bold">Total Jobs</h2>
          <p className="text-3xl font-bold">{stats.totalJobs}</p>
        </div>
      </div>

     <h2 className="text-2xl mb-4">Jobs by Status</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

  <div className="bg-gray-800 p-6 rounded h-96 flex flex-col">
    <h3 className="text-xl mb-4">Jobs Status (Bar)</h3>

    <div className="flex-1">
     <Bar
  data={barData}
  options={{
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#e5e7eb"
        },
        grid: {
          color: "rgba(255,255,255,0.05)"
        }
      },
      y: {
        ticks: {
          color: "#e5e7eb"
        },
        grid: {
          color: "rgba(255,255,255,0.05)"
        }
        
      }
    }
  }}
/>
    </div>

  </div>

  <div className="bg-gray-800 p-6 rounded h-96 flex flex-col">
    <h3 className="text-xl mb-4">Jobs Status (Pie)</h3>

   <div className="flex-1 flex items-center justify-between">
    <div className="space-y-3 text-sm">

  <div className="flex items-center gap-2">
    <div className="w-15 h-3 bg-yellow-500 rounded"></div>
    <span>Applied: {counts[labels.indexOf("Applied")] || 0}</span>
  </div><br/>

  <div className="flex items-center gap-2">
    <div className="w-15 h-3 bg-green-500 rounded"></div>
    <span>Interview: {counts[labels.indexOf("Interview")] || 0}</span>
  </div><br/>

  <div className="flex items-center gap-2">
    <div className="w-15 h-3 bg-blue-500 rounded"></div>
    <span>Offer: {counts[labels.indexOf("Offer")] || 0}</span>
  </div><br/>

  <div className="flex items-center gap-2">
    <div className="w-15 h-3 bg-red-500 rounded"></div>
    <span>Rejected: {counts[labels.indexOf("Rejected")] || 0}</span>
  </div>

</div>
   <Pie
  data={pieData}
  options={{
    maintainAspectRatio: false,
    plugins: {
      legend: {
  display: false
},
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 14
        },
        formatter: (value, context) => {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return percentage + "%";
        }
      }
    }
  }}
/>
    </div>

  </div>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

   <div className="bg-gray-800 p-6 rounded-lg h-[300px] flex flex-col">

<h2 className="text-xl font-bold mb-4">Recent Admin Activity</h2>

 <div className="flex-1 overflow-y-auto pr-2">
    <ul className="space-y-2">

{activity.length === 0 ? (

  <p>No activity yet</p>

) : (

  activity
.filter((a) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(a.createdAt) >= sevenDaysAgo;
})
.map((a) => (
   <li key={a._id} className="border-b border-gray-700 py-2 text-sm text-white flex justify-between">
  <span>{a.message}</span>
  <span className="text-white text-xs">
    {new Date(a.createdAt).toLocaleDateString()}
  </span>
</li>
  ))

)}

</ul>
</div>
</div>


     <div className="bg-gray-800 p-6 rounded-lg h-[300px] flex flex-col">

  <h2 className="text-xl font-bold text-white mb-4">
    All Users
  </h2>

  <input
  type="text"
  placeholder="Search users..."
  value={userSearch}
  onChange={(e) => setUserSearch(e.target.value)}
  className="mb-4 p-2 rounded bg-gray-700 w-full"
/>

 <div className="flex-1 overflow-y-auto">
  <table className="w-full text-left text-white">

    <thead>
      <tr className="border-b border-gray-600">
        <th className="p-2">Name</th>
        <th className="p-2">Email</th>
       <th className="p-2">Role</th>
<th className="p-2">Actions</th>
      </tr>
    </thead>

    <tbody>
  {users.length === 0 ? (
    <tr>
      <td colSpan="3" className="text-center p-4">
        No users found
      </td>
    </tr>
  ) : (
   users
      .filter((u) =>
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      )
      .map((user) => (
  <tr key={user._id} className="border-b border-gray-700">
   <td className="p-2">{user.name}</td>
    <td className="p-2">{user.email}</td>
    <td className="p-2">{user.role}</td>

   <td className="p-2">
  {user.role !== "admin" && (
    <button
      onClick={() => handleDeleteUser(user._id)}
      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
    >
      Delete
    </button>
  )}
</td>
  </tr>
))
    
  )
  }
</tbody>

  </table>
</div>
</div>
</div>

<div className="bg-gray-800 p-6 rounded-lg mt-10">

<h2 className="text-xl font-bold text-white mb-4">
All Applications
</h2>
<input
  type="text"
  placeholder="Search jobs..."
  value={jobSearch}
  onChange={(e) => setJobSearch(e.target.value)}
  className="mb-4 p-2 rounded bg-gray-700 w-full"
/>

<table className="w-full text-left text-white">

<thead>
<tr className="border-b border-gray-600">
<th className="p-2">Company</th>
<th className="p-2">Role</th>
<th className="p-2">User</th>
<th className="p-2">Status</th>
<th className="p-2">Action</th>
</tr>
</thead>

<tbody>
{
  paginatedJobs
.filter((j) =>
  j.company.toLowerCase().includes(jobSearch.toLowerCase())
)
.map((job) => (
<tr key={job._id} className="border-b border-gray-700 hover:bg-gray-700 transition">

<td className="p-2">{job.company}</td>
<td className="p-2">{job.role}</td>
<td className="p-2">{job.user?.name}</td>
<td className={`p-2 font-semibold
  ${job.status === "Applied" && "text-blue-400"}
  ${job.status === "Interview" && "text-yellow-400"}
  ${job.status === "Offer" && "text-green-400"}
  ${job.status === "Rejected" && "text-red-400"}
`}>
  {job.status}
</td>
<td className="p-2">
  <button
    onClick={() => handleDeleteJob(job._id)}
    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
  >
    Delete
  </button>
</td>

</tr>
))}
</tbody>

</table>

<div className="flex gap-4 mt-4">

<button
  onClick={() => setPage(page - 1)}
  disabled={page === 1}
  className="bg-gray-700 px-3 py-1 rounded"
>
Prev
</button>

<button
  onClick={() => setPage(page + 1)}
  disabled={page * jobsPerPage >= jobs.length}
  className="bg-gray-700 px-3 py-1 rounded"
>
Next
</button>

</div>
</div>

    </div>
    
  );
}