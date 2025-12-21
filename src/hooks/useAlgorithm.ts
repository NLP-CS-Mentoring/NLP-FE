import { useState } from "react";
import { analyzeProblem, type AnalyzeResponse } from "../api/algorithmApi";

export const useAlgorithm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState("");

  const analyze = async (statement: string, topK: number = 3) => {
    if (!statement.trim()) {
      setError("문제 설명을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await analyzeProblem(statement, topK);
      setResult(res);
    } catch (err: any) {
      console.error("[useAlgorithm] error:", err);
      setError("분석 중 오류가 발생했습니다. 서버 상태를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
  };

  return { loading, result, error, analyze, reset };
};
