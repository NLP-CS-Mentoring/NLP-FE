import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-bg"></div>
      <div className="home-content">
        <div className="home-brand">
          <div className="home-logo">
            <i className="fa-solid fa-layer-group" />
          </div>
          <div>
            <div className="home-brand-name">JobFlow</div>
            <div className="home-brand-sub">취업 준비 플랫폼</div>
          </div>
        </div>
        
        <div className="intro-section">
          <p className="intro-title">면접 준비부터 자소서 작성까지</p>
          <p className="intro-description">
            AI 챗봇과 함께 CS 면접을 준비하고,<br />
            자동 생성 도구로 자기소개서를 완성하세요.
          </p>
          <p className="intro-features">
            ✨ AI 면접 대비 챗봇<br />
            ✨ 자소서 자동 생성 및 피드백<br />
            ✨ 깃허브 프로젝트 관리<br />
            ✨ 학습 진도 추적
          </p>
        </div>

        <div className="auth-buttons">
          <button 
            className="auth-btn login-btn"
            onClick={() => navigate('/login')}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
