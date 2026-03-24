import { Link } from "react-router-dom";
import { FaHome, FaBriefcase, FaChartBar } from "react-icons/fa";

export default function Sidebar() {
 
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h1 className="text-xl font-bold mb-6">Job Tracker</h1>

      <nav className="space-y-4">
        <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-400">
          <FaHome /> Dashboard
        </Link>

        <Link to="/jobs" className="flex items-center gap-2 hover:text-blue-400">
          <FaBriefcase /> Jobs
        </Link>

        <Link to="/analytics" className="flex items-center gap-2 hover:text-blue-400">
          <FaChartBar /> Analytics
        </Link>
      </nav>
    </div>
  );
}