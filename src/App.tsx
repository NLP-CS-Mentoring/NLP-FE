
import CoverLetter from './pages/CoverLetter';
import './App.css'

function App() {
    return <CoverLetter/>;
}

import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout"; 
import InterviewPage from "./cs-pages/InterviewPage.jsx";
import GithubPage from "./cs-pages/GithubPage.jsx";
import MyPage from "./cs-pages/MyPage.jsx";

import LoginPage from "./auth/LoginPage.jsx";
import SignupPage from "./auth/SignupPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<MainLayout />}>
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/github" element={<GithubPage />} />
        <Route path="/my" element={<MyPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/interview" replace />} />
      <Route path="*" element={<Navigate to="/interview" replace />} />
    </Routes>
  );
}