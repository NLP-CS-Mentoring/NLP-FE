import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

type MenuItem = {
  path: string;
  label: string;
  icon: string;
};

const MENU: MenuItem[] = [
  { path: "/interview", label: "CS 면접 연습", icon: "fa-regular fa-comments" },
  { path: "/github", label: "깃허브 분석 챗", icon: "fa-brands fa-github" },
  { path: "/cover-letter", label: "AI 자소서 생성기", icon: "fa-regular fa-file-lines" },
  { path: "/algorithm", label: "알고리즘 헬퍼", icon: "fa-solid fa-code" },
  { path: "/news", label: "IT 뉴스 & 커리어", icon: "fa-regular fa-newspaper" },
  { path: "/my", label: "마이페이지", icon: "fa-regular fa-user" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="logo">
        <i className="fa-solid fa-layer-group" />
        JobFlow
      </div>

      <div className="nav-group">
        <div className="nav-label">MAIN MENU</div>

        {MENU.map((m) => (
          <div
            key={m.path}
            className="menu-item"
            onClick={() => navigate(m.path)}
          >
            <i className={m.icon} />
            {m.label}
          </div>
        ))}
      </div>
    </aside>
  );
}