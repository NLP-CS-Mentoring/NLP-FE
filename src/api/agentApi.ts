import axios from "axios";
import type { AgentExecuteResponse } from "../types/Agent";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

export const executeAgent = async (message: string, context: string): Promise<AgentExecuteResponse> => {
  const res = await api.post("/agent/execute", { message, context });
  return res.data;
};
