import axios from "axios";
import { Platform } from "react-native";
import { storage } from "./storage";

const HOST = Platform.OS === "web" ? "localhost" : "SEU_IP_AQUI";

const api = axios.create({
  baseURL: `http://${HOST}:5239/api`,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await storage.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const mensagemErro = (erro, padrao = "Erro ao conectar com o servidor.") => {
  const data = erro?.response?.data;
  if (typeof data === "string" && data) return data;
  if (data?.title) return data.title;
  return padrao;
};

export default api;