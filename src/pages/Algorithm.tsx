import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAlgorithm } from "../hooks/useAlgorithm";
import "./Algorithm.css";

export default function Algorithm() {
  const [statement, setStatement] = useState("");
  const [topK, setTopK] = useState(3);
  const { loading, result, error, analyze, reset } = useAlgorithm();

  const handleAnalyze = () => {
    analyze(statement, topK);
  };

  const handleReset = () => {
    setStatement("");
    setTopK(3);
    reset();
  };

  return (
    <div className="algorithm-container">
      <header className="algo-header">
        <h1>🧩 알고리즘 헬퍼</h1>
        <p>문제를 입력하면 유사 문제와 힌트를 제공합니다.</p>
      </header>

      <div className="algo-input-section">
        <div className="algo-field">
          <label>문제 설명</label>
          <textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="예: 배열에서 합이 K인 두 원소를 찾는 문제입니다. 시간복잡도 O(n)으로 풀어야 합니다."
            rows={6}
          />
        </div>

        <div className="algo-options">
          <div className="algo-field-inline">
            <label>유사 문제 개수</label>
            <input
              type="number"
              min={1}
              max={10}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="algo-actions">
          <button className="btn-analyze" onClick={handleAnalyze} disabled={loading}>
            {loading ? "분석 중..." : "분석하기"}
          </button>
          <button className="btn-reset" onClick={handleReset} disabled={loading}>
            초기화
          </button>
        </div>

        {error && <p className="algo-error">{error}</p>}
      </div>

      {result && (
        <div className="algo-result-section">
          <div className="algo-hint-card">
            <h3>💡 힌트</h3>
            <div className="algo-hint-markdown">
              <ReactMarkdown>{result.hint}</ReactMarkdown>
            </div>
          </div>

          <div className="algo-similar-card">
            <h3>📚 유사 문제 ({result.similar.length})</h3>
            {result.similar.map((p, idx) => (
              <div key={idx} className="similar-item">
                <div className="similar-header">
                  <h4>{p.title}</h4>
                  <span className="similarity-badge">{(p.similarity * 100).toFixed(1)}%</span>
                </div>
                <p className="similar-source">{p.source}</p>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="similar-link">
                    문제 링크 →
                  </a>
                )}
                <div className="similar-tags">
                  {p.tags.map((tag, i) => (
                    <span key={i} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="similar-outline">{p.solution_outline}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
