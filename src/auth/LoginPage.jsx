import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./auth.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      setLoading(true);

      // 🔧 너 백엔드 스펙에 맞게 endpoint만 바꿔 끼우면 됨
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `로그인 실패 (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));

      // 예: access_token 저장 (스펙 다르면 바꿔)
      if (data.access_token) localStorage.setItem("access_token", data.access_token);

      // 로그인 성공 후 이동
      nav("/interview");
    } catch (e2) {
      setErr(e2.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="로그인"
      subtitle="JobFlow AI로 면접 연습과 프로젝트 분석을 시작하세요."
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-label">이메일</label>
        <input
          className="auth-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label className="auth-label">비밀번호</label>
        <input
          className="auth-input"
          type="password"
          placeholder="••••••••"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="current-password"
          required
        />

        {err && <div className="auth-error">{err}</div>}

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
          <i className="fa-solid fa-arrow-right" />
        </button>

        <div className="auth-foot">
          <span>아직 계정이 없나요?</span>
          <Link className="auth-link" to="/signup">
            회원가입
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}