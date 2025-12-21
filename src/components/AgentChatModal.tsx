import { useState, useEffect, useRef } from "react";
import "./AgentChatModal.css";
import type { AgentMessage } from "../types/Agent";

type Props = {
  open: boolean;
  onClose: () => void;
  messages: AgentMessage[];
  loading: boolean;
  error: string;
  onSend: (msg: string) => void;
  onReset: () => void;
  contextInfo?: string;
};

export default function AgentChatModal({ open, onClose, messages, loading, error, onSend, onReset, contextInfo }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  if (!open) return null;

  return (
    <div className="agent-dock">
      <header className="agent-header">
        <div>
          <h3>AI 챗봇</h3>
          <p>자소서 저장/이메일 전송 등을 대화로 요청해보세요.</p>
        </div>
        <div className="agent-header-actions">
          <button className="agent-btn ghost" onClick={onReset}>초기화</button>
          <button className="agent-btn" onClick={onClose}>닫기</button>
        </div>
      </header>

      {contextInfo && <div className="agent-context">현재 자소서 내용이 전송됩니다.</div>}

      <div className="agent-chat-body">
        {messages.map((m, idx) => (
          <div key={idx} className={`agent-msg ${m.role}`}>
            <div className="agent-msg-bubble">
              {m.content}
              {m.type === "file" && m.url && (
                <a className="agent-download" href={m.url} target="_blank" rel="noopener noreferrer">
                  📎 {m.filename || "다운로드"}
                </a>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="agent-msg assistant"><div className="agent-msg-bubble">생각 중입니다...</div></div>}
        {error && <div className="agent-error">{error}</div>}
        <div ref={bottomRef} />
      </div>

      <div className="agent-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="예) PDF로 저장해줘 / 이메일로 보내줘 / 내용 수정해줘"
        />
        <button className="agent-btn" onClick={handleSend} disabled={loading}>전송</button>
      </div>
    </div>
  );
}
