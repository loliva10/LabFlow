import api from "./api";
import { storage } from "./storage";

export async function login(email, senha) {
  const { data } = await api.post("/Usuario/login", { email, senha });
  await storage.set("token", data.token);
  await storage.set("usuario", JSON.stringify(data));
  return data;
}

export async function logout() {
  await storage.remove("token");
  await storage.remove("usuario");
}

export const registrar = (dados) =>
  api.post("/Usuario/registro", dados).then((r) => r.data);

export const meuPerfil = () => api.get("/Usuario/me").then((r) => r.data);
export const listarUsuarios = () => api.get("/Usuario").then((r) => r.data);

export const alterarPerfil = (id, perfilAcesso) =>
  api.put(`/Usuario/${id}/perfil`, { perfilAcesso });

export const reativarUsuario = (id) => api.put(`/Usuario/${id}/reativar`);
export const excluirUsuario = (id) => api.delete(`/Usuario/${id}`);