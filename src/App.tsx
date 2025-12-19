import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./cs-components/Sidebar";
import Header from "./cs-components/Header";
import InterviewPage from "./cs-pages/InterviewPage.jsx";
import GithubPage from "./cs-pages/GithubPage.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <Header
          title="CS 실전 면접"
          userLabel="SW전공 3학년님"
          avatarText="JM"
        />

        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/interview" replace />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/github" element={<GithubPage />} />
            <Route path="/dfd" element={<div>dfd 테스트</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;