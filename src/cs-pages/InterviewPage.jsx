import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

async function fetchRandomQuestion() {
  const res = await fetch(`${API_BASE}/random-question`, {
    credentials: "include", // ✅ 로그인 쿠키(session_id) 포함
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`random-question 실패: ${res.status} ${text}`);
  }
  return res.json();
}

async function checkAnswer({ id, user_answer }) {
  const res = await fetch(`${API_BASE}/check-answer`, {
    method: "POST",
    credentials: "include", // ✅ 로그인 쿠키(session_id) 포함
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, user_answer }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`check-answer 실패: ${res.status} ${text}`);
  }
  return res.json();
}

export default function InterviewPage() {
  const [q, setQ] = useState(null); // {id, question, topic, file}
  const [messages, setMessages] = useState([]); // {type:'ai'|'user'|'eval', ...}
  const [input, setInput] = useState("");

  const [loadingQ, setLoadingQ] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const [hasStarted, setHasStarted] = useState(false);

  const endRef = useRef(null);
  const scrollBottom = () =>
    endRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (!hasStarted) return;
    scrollBottom();
  }, [messages.length, loadingQ, checking, hasStarted]);

  async function loadQuestion(reset = false) {
    try {
      setError("");
      setLoadingQ(true);
      const data = await fetchRandomQuestion();
      setQ(data);

      if (reset) {
        setMessages([{ type: "ai", id: data.id, text: data.question }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "ai", id: data.id, text: data.question },
        ]);
      }
    } catch (e) {
      setError(e?.message || "질문 로드 실패");
    } finally {
      setLoadingQ(false);
    }
  }

  async function handleSend() {
    if (!hasStarted) return;
    if (!q?.id) return;

    const answer = input.trim();
    if (!answer) return;

    setInput("");
    setError("");

    setMessages((prev) => [...prev, { type: "user", text: answer }]);

    try {
      setChecking(true);

      const result = await checkAnswer({
        id: q.id,
        user_answer: answer,
      });

      setMessages((prev) => [
        ...prev,
        {
          type: "eval",
          grade: result.grade,
          final_correct: result.final_correct,
          sequence_similarity: result.sequence_similarity,
          semantic_similarity: result.semantic_similarity,
          correct_answer_core: result.correct_answer_core,
          correct_answer_full: result.correct_answer_full,
        },
      ]);
    } catch (e) {
      setError(e?.message || "채점 실패");
    } finally {
      setChecking(false);
    }
  }

  async function handleStartOrNext() {
    setError("");
    setInput("");
    setMessages([]);
    setQ(null);

    await loadQuestion(true);
    setHasStarted(true);
  }

  const topicLabel = q?.topic ?? "CS";

  const gradeLabel = (g) => {
    if (g === "correct") return "정답";
    if (g === "wrong") return "오답";
    if (g === "partial") return "부분정답";
    return g ?? "";
  };

  const gradeBadgeStyle = (g) => {
    if (g === "correct")
      return {
        background: "#ecfdf5",
        color: "#047857",
        border: "1px solid #a7f3d0",
      };
    if (g === "partial")
      return {
        background: "#fffbeb",
        color: "#b45309",
        border: "1px solid #fde68a",
      };
    return {
      background: "#fef2f2",
      color: "#b91c1c",
      border: "1px solid #fecaca",
    };
  };

  return (
    <section className="card chat-wrapper main-card">
      <div className="chat-header">
        <div>
          <span className="trend-tag" style={{ margin: 0 }}>
            {hasStarted ? topicLabel : "CS 면접"}
          </span>
        </div>

        <button
          className="btn"
          style={{
            padding: "8px 16px",
            fontSize: 12,
            background: "var(--secondary)",
          }}
          onClick={handleStartOrNext}
          disabled={loadingQ || checking}
        >
          {hasStarted ? "다음 문제" : "문제 시작"}
        </button>
      </div>

      {!hasStarted && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "min(560px, 100%)",
              border: "1px solid var(--border)",
              background: "#f8fafc",
              borderRadius: 16,
              padding: 20,
              lineHeight: 1.6,
              color: "#334155",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
              실전 CS 면접 연습
            </div>
            <div style={{ fontSize: 14, color: "#475569" }}>
              버튼을 누르면 랜덤 질문이 출제됩니다. <br />
              답변을 입력하고 <b>Enter</b>로 제출하면 채점 결과와 모범답안을 확인할 수 있어요.
            </div>

            {error && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #fecaca",
                  background: "#fff1f2",
                }}
              >
                <b style={{ color: "#b91c1c" }}>에러:</b> {error}
              </div>
            )}
          </div>
        </div>
      )}

      {hasStarted && (
        <>
          <div className="chat-body">
            {messages.map((m, idx) => {
              if (m.type === "ai") {
                return (
                  <div key={`ai-${idx}`} className="msg msg-ai">
                    <i className="fa-solid fa-robot" style={{ marginRight: 6 }} />
                    {m.text}
                  </div>
                );
              }
              if (m.type === "user") {
                return (
                  <div key={`u-${idx}`} className="msg msg-user">
                    {m.text}
                  </div>
                );
              }
              return (
                <div key={`ev-${idx}`} className="msg msg-ai">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontWeight: 800 }}>채점 결과</span>
                    <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 12, ...gradeBadgeStyle(m.grade) }}>
                      {gradeLabel(m.grade)} {m.final_correct ? "(최종 정답)" : ""}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: "#475569", marginBottom: 10 }}>
                    <div>
                      Sequence similarity: <b>{Number(m.sequence_similarity ?? 0).toFixed(3)}</b>
                    </div>
                    <div>
                      Semantic similarity: <b>{Number(m.semantic_similarity ?? 0).toFixed(3)}</b>
                    </div>
                  </div>

                  {m.correct_answer_core && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>핵심 정답</div>
                      <div style={{ whiteSpace: "pre-wrap" }}>{m.correct_answer_core}</div>
                    </div>
                  )}

                  {m.correct_answer_full && (
                    <details>
                      <summary style={{ cursor: "pointer", fontWeight: 700 }}>전체 해설/모범답안 보기</summary>
                      <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{m.correct_answer_full}</div>
                    </details>
                  )}
                </div>
              );
            })}

            {loadingQ && <div className="msg msg-ai" style={{ opacity: 0.7 }}>질문 불러오는 중...</div>}
            {checking && <div className="msg msg-ai" style={{ opacity: 0.7 }}>답변 채점 중...</div>}

            {error && (
              <div className="msg msg-ai" style={{ border: "1px solid #fecaca", background: "#fff1f2" }}>
                <b style={{ color: "#b91c1c" }}>에러:</b> {error}
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="chat-input-zone">
            <input
              type="text"
              placeholder="답변을 입력하세요... (Enter 전송)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !checking && handleSend()}
              disabled={loadingQ || checking}
            />
            <button className="send-btn" onClick={handleSend} disabled={loadingQ || checking}>
              <i className="fa-solid fa-paper-plane" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}