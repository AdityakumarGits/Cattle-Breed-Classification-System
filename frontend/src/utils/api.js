 import axios from "axios";

 import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default API;
// Har request se pehle token add karega
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Check karein aapka key name 'token' hi hai na
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default API;