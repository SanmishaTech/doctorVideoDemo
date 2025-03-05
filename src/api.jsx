import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Change this to your actual API
console.log(API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
