import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./auth.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function SignupPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (password !== password2) {
      setErr("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `회원가입 실패 (${res.status})`);
      }

      nav("/login");
    } catch (e2) {
      setErr(e2?.message || "회원가입 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="회원가입" subtitle="계정을 만들고 바로 연습을 시작하세요.">
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
          autoComplete="new-password"
          required
        />

        <label className="auth-label">비밀번호 확인</label>
        <input
          className="auth-input"
          type="password"
          placeholder="••••••••"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          autoComplete="new-password"
          required
        />

        {err && <div className="auth-error">{err}</div>}

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "가입 중..." : "계정 만들기"}
          <i className="fa-solid fa-user-plus" />
        </button>

        <div className="auth-foot">
          <span>이미 계정이 있나요?</span>
          <Link className="auth-link" to="/login">
            로그인
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}