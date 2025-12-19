import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./auth.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function SignupPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (pw !== pw2) {
      setErr("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      // 🔧 너 백엔드 스펙에 맞게 endpoint만 바꿔 끼우면 됨
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pw }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `회원가입 실패 (${res.status})`);
      }

      // 회원가입 성공 → 로그인으로
      nav("/login");
    } catch (e2) {
      setErr(e2.message || "회원가입 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="회원가입" subtitle="3분 만에 시작하고 바로 연습해보세요.">
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-label">이름</label>
        <input
          className="auth-input"
          type="text"
          placeholder="정윤"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />

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
          placeholder="8자 이상 권장"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="new-password"
          required
        />

        <label className="auth-label">비밀번호 확인</label>
        <input
          className="auth-input"
          type="password"
          placeholder="비밀번호 다시 입력"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
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