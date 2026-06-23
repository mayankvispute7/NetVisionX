import axios from "axios";

// This points to our Python FastAPI server
export const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});