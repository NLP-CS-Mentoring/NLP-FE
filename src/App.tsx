import { Routes, Route, Navigate } from "react-router-dom";

// [CSS 및 레이아웃]
import './App.css';
import MainLayout from "./layouts/MainLayout"; 

// [페이지 임포트 - 팀원들 것]
import InterviewPage from "./cs-pages/InterviewPage"; // .jsx 생략 가능 (설정에 따라 다름)
import GithubPage from "./cs-pages/GithubPage";
import MyPage from "./cs-pages/MyPage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";

// [페이지 임포트 - 작성자님 기능 추가]
import CoverLetter from './pages/CoverLetter'; 
// 만약 NewsPage도 만드셨다면 여기서 임포트하고 아래 Route에 추가해야 합니다.
// import NewsPage from './pages/NewsPage'; 

export default function App() {
  return (
    <Routes>
      {/* 로그인/회원가입 (레이아웃 없음) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 메인 레이아웃이 적용되는 페이지들 (헤더/사이드바 포함) */}
      <Route element={<MainLayout />}>
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/github" element={<GithubPage />} />
        <Route path="/my" element={<MyPage />} />
        
        {/* ★ 작성자님 기능 추가: /cover-letter 경로로 접속하면 자소서 페이지 뜸 */}
        <Route path="/cover-letter" element={<CoverLetter />} />
        
        {/* 뉴스 페이지도 만드셨다면 주석 풀고 사용하세요 */}
        {/* <Route path="/news" element={<NewsPage />} /> */}
      </Route>

      {/* 기본 경로 접속 시 /interview로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/interview" replace />} />
      <Route path="*" element={<Navigate to="/interview" replace />} />
    </Routes>
  );
}