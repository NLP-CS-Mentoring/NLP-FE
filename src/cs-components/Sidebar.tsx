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