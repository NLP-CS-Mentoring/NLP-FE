import { Routes, Route, Navigate } from "react-router-dom";

// [CSS 및 레이아웃]
import './App.css';
import MainLayout from "./layouts/MainLayout"; 

// [페이지 임포트 - 팀원들 것]
import InterviewPage from "./cs-pages/InterviewPage";
import GithubPage from "./cs-pages/GithubPage";
import MyPage from "./cs-pages/MyPage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";

// [페이지 임포트 - 작성자님 기능 추가]
import HomePage from "./pages/HomePage";
import CoverLetter from './pages/CoverLetter'; 
import NewsPage from './pages/NewsPage';
import Algorithm from "./pages/Algorithm";

export default function App() {
  return (
    <Routes>
      {/* 로그인/회원가입 (레이아웃 없음) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 홈 페이지 (레이아웃 없음) */}
      <Route path="/" element={<HomePage />} />

      {/* 메인 레이아웃이 적용되는 페이지들 (헤더/사이드바 포함) */}
      <Route element={<MainLayout />}>
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/github" element={<GithubPage />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/algorithm" element={<Algorithm />} />
      </Route>

      {/* 기타 경로는 /interview로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/interview" replace />} />
    </Routes>
  );
}