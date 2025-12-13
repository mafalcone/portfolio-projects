import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // Esto ayuda a detectar por qué queda blanco si falta la env en Vercel
  console.warn("VITE_API_BASE_URL is not set");
}

export const api = axios.create({
  baseURL: baseURL || "",
  headers: { "Content-Type": "application/json" },
});
