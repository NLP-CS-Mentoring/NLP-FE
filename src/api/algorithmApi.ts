import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface SimilarProblem {
  id: string;
  title: string;
  source: string;
  url?: string;
  tags: string[];
  solution_outline: string;
  similarity: number;
}

export interface AnalyzeResponse {
  similar: SimilarProblem[];
  hint: string;
}

export const analyzeProblem = async (
  statement: string,
  topK: number = 3
): Promise<AnalyzeResponse> => {
  const { data } = await axios.post(`${API_BASE}/algorithm/hint`, {
    statement,
    top_k: topK,
  });
  return data;
};
