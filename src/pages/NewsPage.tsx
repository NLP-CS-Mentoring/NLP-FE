import { useState } from "react";
import { useNews } from "../hooks/useNews";
import ReactMarkdown from "react-markdown";
import "./NewsPage.css";

export default function NewsPage() {
    const { loading, trendReport, articles, careerAdvice, error, fetchTrend, fetchRecommendations, fetchCareerAdvice } = useNews();
    const [activeTab, setActiveTab] = useState<"trend" | "recommend" | "career">("trend");
    const [interest, setInterest] = useState<string>("");
    const [careerQuery, setCareerQuery] = useState<string>("");

    const handleTrendAnalysis = () => {
        fetchTrend();
    };

    const handleRecommend = () => {
        if (!interest.trim()) {
            alert("관심 분야를 입력해주세요!");
            return;
        }
        fetchRecommendations(interest);
    };

    const handleCareerAdvice = () => {
        if (!careerQuery.trim()) {
            alert("질문을 입력해주세요!");
            return;
        }
        fetchCareerAdvice(careerQuery);
    };

    // 키워드를 배열로 파싱하는 함수
    const parseKeywords = (keywords: any): string[] => {
        if (!keywords) return [];
        
        // 이미 배열인 경우
        if (Array.isArray(keywords)) {
            return keywords;
        }
        
        // 문자열인 경우
        if (typeof keywords === 'string') {
            try {
                // JSON 배열 형태로 파싱 시도
                const parsed = JSON.parse(keywords);
                return Array.isArray(parsed) ? parsed : [keywords];
            } catch {
                // 쉼표로 구분된 문자열
                return keywords.split(',').map(k => k.trim());
            }
        }
        
        return [];
    };

    return (
        <div className="news-container">
            <header className="news-header">
                <h1>📰 IT 뉴스 & 커리어 분석</h1>
                <p>최신 IT 트렌드를 분석하고 맞춤 커리어 조언을 받아보세요</p>
            </header>

            <div className="tab-menu">
                <button 
                    className={`tab-btn ${activeTab === "trend" ? "active" : ""}`}
                    onClick={() => setActiveTab("trend")}
                >
                    📊 트렌드 분석
                </button>
                <button 
                    className={`tab-btn ${activeTab === "recommend" ? "active" : ""}`}
                    onClick={() => setActiveTab("recommend")}
                >
                    🔍 맞춤 기사 추천
                </button>
                <button 
                    className={`tab-btn ${activeTab === "career" ? "active" : ""}`}
                    onClick={() => setActiveTab("career")}
                >
                    💼 커리어 조언
                </button>
            </div>

            <div className="content-area">
                {activeTab === "trend" && (
                    <div className="tab-content">
                        <h2>IT 업계 트렌드 분석</h2>
                        <button className="action-btn" onClick={handleTrendAnalysis} disabled={loading}>
                            {loading ? "분석 중..." : "최신 트렌드 분석하기"}
                        </button>
                        {error && <p className="error-text">{error}</p>}
                        {trendReport && (
                            <div className="result-box">
                                <div className="trend-section">
                                    <h3>📊 요약</h3>
                                    <p>{trendReport.summary}</p>
                                </div>
                                <div className="trend-section">
                                    <h3>🔑 핵심 키워드</h3>
                                    <div className="keyword-list">
                                        {parseKeywords(trendReport.keywords).map((keyword, idx) => (
                                            <span key={idx} className="keyword-tag">{keyword}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="trend-section">
                                    <h3>💼 업계 분위기</h3>
                                    <div className="atmosphere-status">
                                        <span className={`status-badge ${trendReport.atmosphere_status.toLowerCase()}`}>
                                            {trendReport.atmosphere_status}
                                        </span>
                                        <span className="status-percent">{trendReport.atmosphere_percent}</span>
                                    </div>
                                    <p>{trendReport.atmosphere_reason}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "recommend" && (
                    <div className="tab-content">
                        <h2>관심 분야 맞춤 기사 추천</h2>
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="예: AI, 블록체인, 클라우드" 
                                value={interest}
                                onChange={(e) => setInterest(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleRecommend()}
                            />
                            <button className="action-btn" onClick={handleRecommend} disabled={loading}>
                                {loading ? "검색 중..." : "기사 추천받기"}
                            </button>
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        {articles.length > 0 && (
                            <div className="article-list">
                                {articles.map((article, idx) => (
                                    <div key={idx} className="article-card">
                                        <h3><a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a></h3>
                                        <p className="article-preview">{article.preview}</p>
                                        <p className="article-date">{article.pubDate}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "career" && (
                    <div className="tab-content">
                        <h2>채용공고 기반 커리어 컨설팅</h2>
                        <div className="input-group">
                            <textarea 
                                placeholder="예: 신입 백엔드 개발자로 취업하려면 어떤 기술을 공부해야 하나요?" 
                                value={careerQuery}
                                onChange={(e) => setCareerQuery(e.target.value)}
                                rows={4}
                            />
                            <button className="action-btn" onClick={handleCareerAdvice} disabled={loading}>
                                {loading ? "분석 중..." : "조언 받기"}
                            </button>
                        </div>
                        {error && <p className="error-text">{error}</p>}
                        {careerAdvice && (
                            <div className="result-box markdown-content">
                                <ReactMarkdown>{careerAdvice}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
