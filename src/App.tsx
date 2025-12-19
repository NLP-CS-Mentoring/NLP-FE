import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./auth/LoginPage.jsx";
import SignupPage from "./auth/SignupPage.jsx";

import InterviewPage from "./cs-pages/InterviewPage.jsx";
import GithubPage from "./cs-pages/GithubPage.jsx";

import MainLayout from "./layouts/MainLayout.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />


      <Route element={<MainLayout />}>
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/github" element={<GithubPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}