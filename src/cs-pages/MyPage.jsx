import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./my.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

function getSessionId() {
  return localStorage.getItem("session_id") ?? "";
}

async function fetchMe() {
  const sessionId = getSessionId();

  const url = new URL(`${API_BASE}/users/me`);

  if (sessionId) {
    url.searchParams.set("session_id", sessionId);
    url.searchParams.set("session", sessionId);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include", 
    headers: {
      ...(sessionId
        ? {
            "X-Session-Id": sessionId,
            "X-Session": sessionId,
          }
        : {}),
    },
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`me 조회 실패: ${res.status} ${t}`);
  }
  return res.json();
}

async function logoutRequest() {
  const sessionId = getSessionId();
  const url = new URL(`${API_BASE}/users/logout`);

  if (sessionId) {
    url.searchParams.set("session_id", sessionId);
    url.searchParams.set("session", sessionId);
  }

  const res = await fetch(url.toString(), {
    method: "POST",
    credentials: "include", 
    headers: {
      ...(sessionId
        ? {
            "X-Session-Id": sessionId,
            "X-Session": sessionId,
          }
        : {}),
    },
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`logout 실패: ${res.status} ${t}`);
  }
}

export default function MyPage() {
  const nav = useNavigate();

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr("");
        setLoading(true);
        const data = await fetchMe();
        if (!alive) return;
        setMe(data);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "마이페이지 로드 실패");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const list = Array.isArray(me?.topic_stats) ? me.topic_stats : [];

    const totalAttempt = list.reduce((s, t) => s + (t.attempt_count ?? 0), 0);
    const totalCorrect = list.reduce((s, t) => s + (t.correct_count ?? 0), 0);
    const totalWrong = list.reduce((s, t) => s + (t.wrong_count ?? 0), 0);

    const accuracy = totalAttempt
      ? Math.round((totalCorrect / totalAttempt) * 100)
      : 0;

    const topics = list
      .map((t) => {
        const attempt = t.attempt_count ?? 0;
        const correct = t.correct_count ?? 0;
        const wrong = t.wrong_count ?? 0;
        const acc = attempt ? correct / attempt : 0;
        return { ...t, attempt, correct, wrong, acc };
      })
      .sort((a, b) => b.attempt - a.attempt);

    const weakTop3 = [...topics].sort((a, b) => a.acc - b.acc).slice(0, 3);

    return { totalAttempt, totalCorrect, totalWrong, accuracy, topics, weakTop3 };
  }, [me]);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setErr("");
      await logoutRequest();
    } catch (e) {

    } finally {
      localStorage.removeItem("session_id");
      localStorage.removeItem("jobflow_interview_session");
      setLoggingOut(false);
      nav("/login");
    }
  }

  if (loading) {
    return (
      <div className="my-wrap">
        <div className="card">불러오는 중...</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="my-wrap">
        <div
          className="card"
          style={{ border: "1px solid #fecaca", background: "#fff1f2" }}
        >
          <b style={{ color: "#b91c1c" }}>에러:</b> {err}
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => location.reload()}>
              다시 시도
            </button>
            <button className="btn" onClick={() => nav("/login")}>
              로그인으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  const createdAtLabel = me?.created_at
    ? new Date(me.created_at).toLocaleString()
    : "-";

  return (
    <div className="my-wrap">
      <div className="my-title">
        <h2>마이페이지</h2>
        <p>내 CS 면접 성과를 한 눈에 확인해요.</p>
      </div>

      <div className="my-hero">
        <div className="my-hero-left">
          <div className="my-hero-name">{me?.username ?? "User"}</div>
          <div className="my-hero-sub">가입일: {createdAtLabel}</div>
        </div>

        <div className="my-hero-right">
          <div className="my-pill">
            총 시도 <span>{stats.totalAttempt}</span>
          </div>
          <div className="my-pill">
            정답률 <span>{stats.accuracy}%</span>
          </div>
          <div className="my-pill">
            오답 <span>{stats.totalWrong}</span>
          </div>

          <button
            className="btn my-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            title="로그아웃"
          >
            <i className="fa-solid fa-right-from-bracket" />
            {loggingOut ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>
      </div>

      <div className="my-grid">
        <div className="card">
          <div className="my-section-title">취약 토픽 TOP 3</div>

          <div className="my-weak-grid">
            {stats.weakTop3.map((t) => (
              <div key={t.topic} className="my-weak-item">
                <div className="my-weak-topic">{t.topic}</div>
                <div className="my-weak-meta">
                  시도 {t.attempt} · 정답 {t.correct} · 오답 {t.wrong}
                </div>

                <div className="my-weak-acc">
                  정답률 <b>{Math.round(t.acc * 100)}%</b>
                </div>

                <div className="my-bar">
                  <div
                    className="my-bar-fill"
                    style={{ width: `${Math.round(t.acc * 100)}%` }}
                  />
                </div>

                <button className="btn my-weak-btn" onClick={() => nav("/interview")}>
                  문제 풀기
                </button>
              </div>
            ))}

            {stats.weakTop3.length === 0 && (
              <div style={{ color: "#64748b" }}>아직 데이터가 없어요.</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="my-section-title">토픽별 정답/오답</div>

          <div className="my-topic-list">
            {stats.topics.map((t) => {
              const total = t.attempt || 1;
              const correctPct = Math.round((t.correct / total) * 100);
              const wrongPct = 100 - correctPct;

              return (
                <div key={t.topic} className="my-topic-row">
                  <div className="my-topic-left">
                    <div className="my-topic-name">{t.topic}</div>
                    <div className="my-topic-sub">
                      시도 {t.attempt} · 정답 {t.correct} · 오답 {t.wrong}
                    </div>

                    <div className="my-topic-last">
                      마지막 시도:{" "}
                      {t.last_attempt_at
                        ? new Date(t.last_attempt_at).toLocaleString()
                        : "-"}
                    </div>
                  </div>

                  <div className="my-topic-right">
                    <div className="my-topic-acc">{Math.round(t.acc * 100)}%</div>

                    <div className="my-stack" title={`정답 ${correctPct}% / 오답 ${wrongPct}%`}>
                      <div
                        className="my-stack-correct"
                        style={{ width: `${correctPct}%` }}
                      />
                      <div
                        className="my-stack-wrong"
                        style={{ width: `${wrongPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {stats.topics.length === 0 && (
              <div style={{ color: "#64748b" }}>아직 토픽 통계가 없어요.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}