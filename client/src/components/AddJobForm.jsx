import { useState } from "react";
import api from "../api/axios";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchJobs } from "../redux/jobsSlice";

export default function AddJobForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/api/jobs", formData);

    dispatch(fetchJobs()); // ⭐ refresh jobs list

    alert("Job added successfully");

    setFormData({
      company: "",
      role: "",
      location: "",
      notes: "",
    });

  } catch (error) {
    console.error("Add job error:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to add job");
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="w-137 p-3 bg-gray-900 mt-10 border rounded-xl"
    >
     <div className="mb-3">
       <h2 className="text-lg text-white font-semibold flex items-center gap-2">
         <FaCheckCircle className="text-green-400"/>
         Add New Job
       </h2>
        <div className="h-[3px] mt-2 bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400 rounded"></div>
     </div>

      <input
        name="company"
        value={formData.company}
        placeholder="Company"
        onChange={handleChange}
        className="w-130 p-5 mb-2 rounded-lg bg-gray-800 text-white"
        required
      /><br/>

      <input
        name="role"
       value={formData.role}
        placeholder="Role"
        onChange={handleChange}
        className="w-130 p-5 mb-2 rounded bg-gray-800 text-white"
        required
      /><br/>

      <input
        name="location"
        value={formData.location}
        placeholder="Location"
        onChange={handleChange}
        className="w-130 p-5 rounded mb-2 bg-gray-800 text-white"
      /><br/>

      <textarea
        name="notes"
        value={formData.notes}
        placeholder="Notes"
        onChange={handleChange}
        className="w-130 p-5 rounded-lg h-45 bg-gray-800 text-white"
      /><br/>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Add Job
      </button>
    </form>
  );
}