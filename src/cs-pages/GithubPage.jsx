import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

const DIFFICULTY_OPTIONS = [
  { key: "junior", label: "Junior" },
  { key: "mid", label: "Mid" },
  { key: "difficult", label: "Difficult" },
];

async function fetchGithubInterviewQuestion({ repo_url, difficulty }) {
  const res = await fetch(`${API_BASE}/github-interview/question`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url, difficulty }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`문제 생성 실패: ${res.status} ${text}`);
  }
  return res.json();
}

async function gradeGithubInterview({ session_id, answer }) {
  const res = await fetch(`${API_BASE}/github-interview/grade`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id, answer }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`채점 실패: ${res.status} ${text}`);
  }
  return res.json();
}

function nowLabel() {
  const d = new Date();
  const hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 || 12;
  return `Today ${h12}:${mm} ${ampm}`;
}

export default function GithubPage() {
  const [repoUrl, setRepoUrl] = useState(
    "https://github.com/my-account/nlp-project"
  );
  const [difficulty, setDifficulty] = useState("mid");
  const [locked, setLocked] = useState(false); // ✅ 채점 후 잠금

  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [rubric, setRubric] = useState([]); // 지금은 안 보여줘도 되지만 유지

  const [messages, setMessages] = useState([
    {
      type: "system",
      text:
        "레포 URL과 난이도를 선택한 뒤 ‘문제 생성’을 누르세요.\n" +
        "답변은 1번만 제출 가능하고, 채점 후에는 다음 문제 생성 전까지 입력이 잠깁니다.",
    },
  ]);

  const [input, setInput] = useState("");
  const [creating, setCreating] = useState(false);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState("");

  const endRef = useRef(null);
  const scrollBottom = () =>
    endRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollBottom();
  }, [messages.length, creating, grading]);

  const timeLabel = useMemo(() => nowLabel(), []);

  function pushAI(text) {
    setMessages((prev) => [...prev, { type: "ai", text }]);
  }
  function pushUser(text) {
    setMessages((prev) => [...prev, { type: "user", text }]);
  }

  async function handleCreateQuestion() {
    const url = repoUrl.trim();
    if (!url) return;

    setError("");
    setCreating(true);

    // ✅ 새 문제 생성 = 잠금 해제 + 이전 상태 초기화
    setLocked(false);
    setSessionId(null);
    setQuestion("");
    setRubric([]);
    setInput("");

    pushUser(`문제 생성 요청\n- repo: ${url}\n- difficulty: ${difficulty}`);
    pushAI("레포를 분석해서 면접 질문을 만들고 있어요...");

    try {
      const data = await fetchGithubInterviewQuestion({
        repo_url: url,
        difficulty,
      });

      setSessionId(data.session_id);
      setQuestion(data.question || "");
      setRubric(Array.isArray(data.rubric) ? data.rubric : []);

      pushAI(`문제 생성 완료 ✅\n\n${data.question || "(질문 없음)"}`);
    } catch (e) {
      setError(e?.message || "문제 생성 실패");
      pushAI(
        "문제 생성 중 오류가 발생했어요. 엔드포인트/서버 로그를 확인해줘."
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleSubmitAnswer() {
    if (!sessionId) {
      setError("먼저 ‘문제 생성’을 눌러 session_id를 받아야 채점할 수 있어요.");
      return;
    }
    if (locked) return; // ✅ 잠금 상태면 제출 불가

    const ans = input.trim();
    if (!ans) return;

    setError("");
    setInput("");
    pushUser(ans);

    try {
      setGrading(true);

      const result = await gradeGithubInterview({
        session_id: sessionId,
        answer: ans,
      });

      const verdict = result.verdict ?? "unknown";
      const score = result.score ?? 0;

      const verdictBadge =
        verdict === "correct"
          ? "✅ 정답"
          : verdict === "partial"
          ? "🟨 부분정답"
          : verdict === "wrong"
          ? "❌ 오답"
          : `ℹ️ ${verdict}`;

      pushAI(`${verdictBadge} (score: ${score})`);

      if (result.feedback) {
        pushAI(`피드백:\n${result.feedback}`);
      }

      if (
        Array.isArray(result.missing_points) &&
        result.missing_points.length > 0
      ) {
        pushAI(
          "놓친 포인트:\n" +
            result.missing_points.map((p) => `- ${p}`).join("\n")
        );
      }

      if (result.ideal_answer) {
        pushAI("모범답안:\n" + result.ideal_answer);
      }

      // ✅ 꼬리질문 기능 안 쓸 거면 여기서 출력 안 함
      // if (result.followup_question) { ... }

      // ✅ 채점 완료 → 잠금
      setLocked(true);
      pushAI("답변 제출 완료! 다음 문제를 생성하면 다시 답변할 수 있어요.");
    } catch (e) {
      setError(e?.message || "채점 실패");
      pushAI(
        "채점 중 오류가 발생했어요. session_id가 유효한지/서버 로그를 확인해줘."
      );
    } finally {
      setGrading(false);
    }
  }

  // ✅ 잠금 반영
  const canAnswer = !!sessionId && !!question && !locked;

  return (
    <section className="card chat-wrapper">
      <div
        className="chat-header"
        style={{ background: "#f8fafc", padding: 16, borderRadius: 12 }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: 10,
            alignItems: "center",
          }}
        >
          <i className="fa-brands fa-github" style={{ fontSize: 24 }} />

          <input
            type="text"
            className="input-field"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            style={{ background: "white" }}
            placeholder="https://github.com/owner/repo"
          />

          <div className="difficulty-seg" role="tablist" aria-label="difficulty">
            {DIFFICULTY_OPTIONS.map((o) => {
                const active = difficulty === o.key;
                return (
                <button
                    key={o.key}
                    type="button"
                    className={`difficulty-pill ${active ? "active" : ""}`}
                    onClick={() => setDifficulty(o.key)}
                    disabled={creating || grading}
                >
                    {o.label}
                </button>
                );
            })}
           </div>

          <button
            className="btn"
            onClick={handleCreateQuestion}
            disabled={creating || grading}
          >
            {creating ? "생성 중..." : "문제 생성"}
          </button>
        </div>
      </div>

      <div className="chat-body">
        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 13,
            margin: "10px 0",
          }}
        >
          <span>{timeLabel}</span>
        </div>

        {messages.map((m, idx) => {
          if (m.type === "user") {
            return (
              <div
                key={idx}
                className="msg msg-user"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {m.text}
              </div>
            );
          }
          return (
            <div key={idx} className="msg msg-ai">
              {m.type !== "system" && (
                <i className="fa-solid fa-robot" style={{ marginRight: 6 }} />
              )}
              <span style={{ whiteSpace: "pre-wrap" }}>{m.text}</span>
            </div>
          );
        })}

        {(creating || grading) && (
          <div className="msg msg-ai" style={{ opacity: 0.7 }}>
            {creating ? "문제 생성 중..." : "채점 중..."}
          </div>
        )}

        {error && (
          <div
            className="msg msg-ai"
            style={{ border: "1px solid #fecaca", background: "#fff1f2" }}
          >
            <b style={{ color: "#b91c1c" }}>에러:</b> {error}
          </div>
        )}

        {sessionId && (
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
            session_id: {sessionId}
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="chat-input-zone">
        <input
          type="text"
          placeholder={
            !sessionId
              ? "먼저 ‘문제 생성’을 눌러 질문을 받아오세요."
              : locked
              ? "답변 제출 완료! 다음 문제를 생성하면 다시 입력할 수 있어요."
              : "답변을 입력하세요... (Enter 제출)"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && !grading && handleSubmitAnswer()
          }
          disabled={!canAnswer || creating || grading}
        />
        <button
          className="send-btn"
          onClick={handleSubmitAnswer}
          disabled={!canAnswer || creating || grading}
        >
          <i className="fa-solid fa-paper-plane" />
        </button>
      </div>
    </section>
  );
}