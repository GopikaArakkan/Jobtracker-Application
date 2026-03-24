import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSelector } from "react-redux";

import AddJobForm from "../components/AddJobForm";
import JobList from "../components/JobList";
import { FaBell, FaBriefcase, FaChartBar, FaMoon, FaUserShield } from "react-icons/fa";

export default function Applications() {

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const jobs = useSelector((state) => state.jobs.jobs);
  const role = localStorage.getItem("role");
  const [userName, setUserName] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name);
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();
  }, []);

  const stats = jobs.reduce(
    (acc, job) => {
      acc.total++;
      if (job.status === "Applied") acc.applied++;
      if (job.status === "Interview") acc.interview++;
      if (job.status === "Offer") acc.offer++;
      if (job.status === "Rejected") acc.rejected++;
      return acc;
    },
    { total: 0, applied: 0, interview: 0, offer: 0, rejected: 0 }
  );

  return (

<div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#0F172A] via-gray-800 to-gray-500 text-white">

  {/* Sidebar */}
  <div className="w-full md:w-64 bg-gradient-to-l from-[#0F172A] via-gray-900 to-gray-700 p-6 text-white">

    <h2 className="text-2xl font-bold mb-8">Job Tracker</h2>

    <ul className="space-y-6">

      <li onClick={() => navigate("/dashboard")} className="flex items-center gap-3 cursor-pointer">
        <FaChartBar />
        Dashboard
      </li>

      <li className="flex items-center gap-3 cursor-pointer text-yellow-300">
        <FaBriefcase />
        Applications
      </li>

      {role === "admin" && (
        <li onClick={() => navigate("/admin")} className="flex items-center gap-3 cursor-pointer text-purple-300">
          <FaUserShield />
          Admin Dashboard
        </li>
      )}

      <li onClick={() => navigate("/notifications")} className="flex items-center gap-3 cursor-pointer">
        <FaBell />
        Notifications
      </li>

      <li onClick={handleLogout} className="flex items-center gap-3 cursor-pointer text-red-300">
        Logout
      </li>

    </ul>
  </div>

  {/* Main Content */}
  <div className="flex-1 p-4 md:p-8 text-white">

    {/* Top Bar */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

      <div>
        <h1 className="text-xl md:text-3xl font-bold text-white">
          Hello, {userName || "User"} 👋
        </h1>

        <p className="text-gray-400 text-sm">
          Welcome back to your Application
        </p>
      </div>

      <div className="flex items-center gap-6">

        <div className="relative text-yellow-300">
          <FaBell
            size={22}
            className="cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          />

          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {notifications.length}
            </span>
          )}

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b font-semibold">Notifications</div>

              {notifications.length === 0 ? (
                <div className="p-3 text-gray-500">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="p-3 border-b text-sm hover:bg-gray-600">
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <FaMoon className="text-white cursor-pointer" />
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

      <div className="bg-white p-6 rounded-lg shadow text-black">
        <h3 className="text-gray-500">Total Jobs</h3>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>

      <div className="bg-blue-100 p-6 rounded-lg shadow">
        <h3 className="text-blue-600">Applied</h3>
        <p className="text-2xl font-bold text-blue-700">{stats.applied}</p>
      </div>

      <div className="bg-yellow-100 p-6 rounded-lg shadow">
        <h3 className="text-yellow-600">Interview</h3>
        <p className="text-2xl font-bold text-yellow-700">{stats.interview}</p>
      </div>

      <div className="bg-green-100 p-6 rounded-lg shadow">
        <h3 className="text-green-600">Offers</h3>
        <p className="text-2xl font-bold text-green-700">{stats.offer}</p>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
        <h2 className="font-bold mb-2 text-yellow-700">⚠ Job Reminders</h2>

        <div className="max-h-12 overflow-y-auto">
          {notifications.length === 0 ? (
            <p>No reminders</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="text-yellow-700">
                {n.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    {/* Forms + List */}
    <div className="flex flex-col lg:flex-row gap-6">

      <div className="w-full lg:w-1/2 bg-gray-700 p-6 rounded-lg shadow-lg shadow-gray-950">
        <h2 className="text-2xl text-gray-200 font-bold mb-4">
          Add New Application
        </h2>
        <AddJobForm />
      </div>

      <div className="w-full lg:w-1/2 bg-gray-700 p-6 rounded-lg shadow-lg shadow-gray-950">
        <h2 className="text-2xl text-gray-200 font-bold mb-4">
          Job Applications
        </h2>
        <JobList />
      </div>

    </div>

  </div>
</div>

);
}