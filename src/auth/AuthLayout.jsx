import React from "react";
import "./auth.css";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-bg" aria-hidden="true" />

      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <i className="fa-solid fa-layer-group" />
          </div>
          <div>
            <div className="auth-brand-name">JobFlow</div>
            <div className="auth-brand-sub">취업 준비 플랫폼</div>
          </div>
        </div>

        <div className="auth-head">
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}