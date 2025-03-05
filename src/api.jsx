import axios from "axios";

export const API_BASE_URL = "https://your-api-base-url.com"; // Change this to your actual API

export const apiClient = axios.create({
  baseURL: "http://localhost:5001",
});
