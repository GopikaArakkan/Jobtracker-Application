import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async () => {
    const { data } = await api.get("/api/jobs");
    return data;
  }
);

// Add job
export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (jobData) => {
    const { data } = await api.post("/api/jobs", jobData);
    return data;
  }
);

// Update job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, status }) => {
    const { data } = await api.put(`/api/jobs/${id}`, { status });
    return data;
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id) => {
    await api.delete(`/api/jobs/${id}`);
    return id;
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id
        );
        if (index !== -1) state.jobs[index] = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(
          (job) => job._id !== action.payload
        );
      });
  },
});

export default jobsSlice.reducer;