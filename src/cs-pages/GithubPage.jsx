import React, { useState } from "react";

export default function GithubPage() {
  const [url, setUrl] = useState("https://github.com/my-account/nlp-project");

  return (
    <section className="card chat-wrapper">
      <div className="chat-header github-head">
        <div className="github-head-row">
          <i className="fa-brands fa-github" style={{ fontSize: 24 }} />
          <input
            type="text"
            className="input-field"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ background: "white" }}
          />
          <button className="btn">분석</button>
        </div>
      </div>

      <div className="chat-body">
        <div className="chat-date">Today 10:23 AM</div>
        <div className="msg msg-ai">
          분석이 완료되었습니다. 🚀
          <br />
          <code>README.md</code>와 <code>app.py</code> 코드를 확인했습니다.
          <br />
          이 프로젝트에서 <strong>FastAPI를 선택한 이유</strong>와 비동기 처리는
          어떻게 구현했는지 질문할게요.
        </div>
      </div>

      <div className="chat-input-zone">
        <input type="text" placeholder="프로젝트 관련 질문에 답변해보세요..." />
        <button className="send-btn">
          <i className="fa-solid fa-paper-plane" />
        </button>
      </div>
    </section>
  );
}