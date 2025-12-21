import { useState } from "react";
import { useCoverLetter } from "../hooks/useCoverLetter";
import "./CoverLetter.css";
import AgentChatModal from "../components/AgentChatModal";
import { useAgentChat } from "../hooks/useAgentChat";

import FileInput from "../components/FileInput";
import TextArea from "../components/TextArea";

export default function CoverLetter() {
    const { loading, result, error, createBasic, createWithStyle } = useCoverLetter();
    const [userFact, setUserFact] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [openAgent, setOpenAgent] = useState(false);
    const { messages, loading: agentLoading, error: agentError, sendMessage, resetChat } = useAgentChat();

    const handleCopy = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("복사 실패:", err);
            alert("복사에 실패했습니다.");
        }
    };

    const handleGenerate = () => {
        if (!userFact) {
            alert("경험이나 스킬을 입력해주세요!");
            return;
        }
        if (file) {
            createWithStyle(file, userFact);
        } else {
            createBasic(userFact);
        }
    };

    return (
        <div className="app-container">
            <div className="input-section">
                <header className="header">
                    <h1>✨ AI 자소서 생성기</h1>
                    <p>내 경험을 입력하고, <strong style={{color: 'var(--primary)'}}>나의 문체</strong>를 입혀보세요.</p>
                </header>

                <div className="scroll-container">
                    <div className="step-card">
                        <div className="step-badge">STEP 1</div>
                        <h3>내용 작성</h3>
                        <p className="step-desc">본인의 경험, 경력, 스킬을 자유롭게 적어주세요.</p>
                        <TextArea 
                            label="" 
                            value={userFact} 
                            onChange={setUserFact}
                            placeholder="예: 마케팅 인턴 6개월 동안 SNS 팔로워 200% 증가 경험이 있습니다. 꼼꼼한 성격이고 데이터 분석 능력이 뛰어납니다."
                        />
                    </div>
                    <div className="step-card">
                        <div className="step-badge secondary">STEP 2 (선택)</div>
                        <h3>스타일 참조 파일</h3>
                        <p className="step-desc">참고하고 싶은 자소서 스타일(PDF/TXT)이 있다면 올려주세요.</p>
                        <div className="file-upload-wrapper">
                            <FileInput onChange={setFile} />
                        </div>
                    </div>
                </div>
                <div className="action-area">
                    <button 
                        className="btn-generate" 
                        disabled={loading} 
                        onClick={handleGenerate}
                    >
                        {loading ? "생성 중입니다..." : "자소서 생성하기"}
                    </button>
                    {error && <p className="error-msg">{error}</p>}
                </div>
            </div>

            <div className="output-section">
                <div className="result-card">
                    <div className="result-header">
                        <h3>📄 생성 결과</h3>
                        {result && (
                        <div className="header-actions">
                            <button 
                                className={`btn-copy ${isCopied ? 'copied' : ''}`} 
                                onClick={handleCopy}
                            >
                            {isCopied ? '✅ 복사완료!' : '📋 복사하기'}
                            </button>
                        </div>
                        )}
                    </div>

                    <div className="result-content">
                        {result ? <pre>{result}</pre> : (
                            <div className="empty-state">
                                {/* <div className="empty-icon">✨</div> */}
                                <h3>📝 AI 자소서 생성기 활용 팁</h3>
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <span className="badge-basic">기본 생성</span>
                                        <p>경험과 스킬만 입력하면<br/>표준적인 자소서를 써드려요.</p>
                                    </div>
                                    <div className="feature-item">
                                        <span className="badge-style">스타일 적용</span>
                                        <p>내 예전 글(파일)을 올리면<br/><strong>나만의 문체와 톤</strong>을 학습해 작성해요.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                className="agent-fab"
                onClick={() => setOpenAgent(prev => !prev)}
                aria-label="AI 챗봇"
            >
                💬
            </button>

            <AgentChatModal
                open={openAgent}
                onClose={() => setOpenAgent(false)}
                messages={messages}
                loading={agentLoading}
                error={agentError}
                onSend={(msg) => sendMessage(msg, result || "")}
                onReset={resetChat}
                contextInfo={result ? "현재 생성된 자소서 내용이 전송됩니다." : undefined}
            />
        </div>
    );
}
