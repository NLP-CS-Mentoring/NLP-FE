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
  const composingRef = useRef(false);
  const sendingRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    // 로딩이 끝나면 다음 전송 허용
    if (!loading) sendingRef.current = false;
  }, [loading]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg) {
      console.log("[AgentChatModal] send blocked: empty input");
      return;
    }
    if (loading) {
      console.log("[AgentChatModal] send blocked: loading");
      return;
    }
    if (sendingRef.current) {
      console.log("[AgentChatModal] send blocked: re-entry");
      return;
    }
    sendingRef.current = true;
    console.log("[AgentChatModal] send:", msg);
    setInput("");
    onSend(msg);
    // 혹시 로딩 플래그가 늦게 반영될 경우를 대비한 짧은 쿨다운
    setTimeout(() => { sendingRef.current = false; }, 300);
  };

  const formatUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `http://localhost:8000${url}`;
  };

  const getMessageText = (m: AgentMessage) => {
    return m.content;
  };

  // update인 경우에만 data를 출력
  const getUpdateBody = (m: AgentMessage) => {
    const a = m as any;
    if (a?.type !== "update") return undefined;
    return typeof a?.data === "string" ? a.data : undefined;
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
        {messages.map((m, idx) => {
          const updateBody = getUpdateBody(m);
          const text = updateBody ?? getMessageText(m);
          return (
            <div key={idx} className={`agent-msg ${m.role}`}>
              <div className="agent-msg-bubble">
                {updateBody ? (
                  <pre className="agent-msg-body">{text}</pre>
                ) : (
                  <span>{text}</span>
                )}
                {m.type === "file" && m.url && (
                  <a className="agent-download" href={formatUrl(m.url)} target="_blank" rel="noopener noreferrer">
                    📎 {m.filename || "다운로드"}
                  </a>
                )}
              </div>
            </div>
          );
        })}
        {loading && <div className="agent-msg assistant"><div className="agent-msg-bubble">생각 중입니다...</div></div>}
        {error && <div className="agent-error">{error}</div>}
        <div ref={bottomRef} />
      </div>

      <div className="agent-input-row">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            console.log("[AgentChatModal] input change:", e.target.value);
          }}
          onCompositionStart={() => {
            composingRef.current = true;
            console.log("[AgentChatModal] composition start");
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
            console.log("[AgentChatModal] composition end");
          }}
          onKeyDown={(e) => {
            const isComposing = composingRef.current || (e.nativeEvent as any)?.isComposing || (e as any)?.keyCode === 229;
            console.log("[AgentChatModal] keydown:", { key: e.key, isComposing, loading, value: input });
            if (e.key === "Enter") {
              e.preventDefault();
              if (isComposing) {
                console.log("[AgentChatModal] enter ignored: composing");
                return;
              }
              handleSend();
            }
          }}
          placeholder="예) PDF로 저장해줘 / 이메일로 보내줘 / 내용 수정해줘"
        />
        <button className="agent-btn" onClick={handleSend} disabled={loading}>전송</button>
      </div>
    </div>
  );
}
