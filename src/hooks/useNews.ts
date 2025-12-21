import { useState } from "react";
import { getNewsTrend, recommendNews, getCareerAdvice } from "../api/newsApi";
import type { ArticleResponse } from "../types/News";

export const useNews = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [trendReport, setTrendReport] = useState<any>(null);
    const [articles, setArticles] = useState<ArticleResponse[]>([]);
    const [careerAdvice, setCareerAdvice] = useState<string>("");
    const [error, setError] = useState<string>("");

    const fetchTrend = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getNewsTrend();
            setTrendReport(res.report);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'ERR_NETWORK') {
                setError("CORS 에러: 백엔드 서버의 CORS 설정을 확인해주세요.");
            } else if (err.response?.status === 500) {
                setError("서버 오류: " + (err.response?.data?.detail || "뉴스 분석 중 오류가 발생했습니다."));
            } else {
                setError(err.response?.data?.detail || "트렌드 분석에 실패했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async (interest: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await recommendNews(interest);
            setArticles(res);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'ERR_NETWORK') {
                setError("CORS 에러: 백엔드 서버의 CORS 설정을 확인해주세요.");
            } else if (err.response?.status === 500) {
                setError("서버 오류: " + (err.response?.data?.detail || "기사 추천 중 오류가 발생했습니다."));
            } else {
                setError(err.response?.data?.detail || "추천 기사 조회에 실패했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCareerAdvice = async (query: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await getCareerAdvice(query);
            setCareerAdvice(res.advice);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'ERR_NETWORK') {
                setError("CORS 에러: 백엔드 서버의 CORS 설정을 확인해주세요.");
            } else if (err.response?.status === 500) {
                setError("서버 오류: " + (err.response?.data?.detail || "커리어 조언 생성 중 오류가 발생했습니다."));
            } else {
                setError(err.response?.data?.detail || "커리어 조언 조회에 실패했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        trendReport,
        articles,
        careerAdvice,
        error,
        fetchTrend,
        fetchRecommendations,
        fetchCareerAdvice,
    };
};
