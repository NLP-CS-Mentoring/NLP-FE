import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./auth.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        credentials: "include", // ✅ 쿠키(session_id) 받으려면 필수
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "아이디 또는 비밀번호가 올바르지 않습니다.");
      }

      nav("/interview");
    } catch (e2) {
      setErr(e2?.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="로그인" subtitle="CS 면접 연습을 시작해볼까요?">
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-label">아이디</label>
        <input
          className="auth-input"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <label className="auth-label">비밀번호</label>
        <input
          className="auth-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {err && <div className="auth-error">{err}</div>}

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"} <i className="fa-solid fa-arrow-right" />
        </button>

        <div className="auth-foot">
          <span>계정이 없나요?</span>
          <Link className="auth-link" to="/signup">
            회원가입
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}