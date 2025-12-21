import axios from "axios";
import type { NewsReportResponse, ArticleResponse, NewsRequest, CareerRequest, CareerResponse } from "../types/News";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

export const getNewsTrend = async (): Promise<NewsReportResponse> => {
    const res = await api.get("/news/analyze");
    return res.data;
};

export const recommendNews = async (interest: string): Promise<ArticleResponse[]> => {
    const res = await api.post("/news/recommend", { interest });
    return res.data;
};

export const getCareerAdvice = async (query: string): Promise<CareerResponse> => {
    const res = await api.post("/career/advice", { query });
    return res.data;
};
