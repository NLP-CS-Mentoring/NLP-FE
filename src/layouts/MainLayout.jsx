import Sidebar from "../cs-components/Sidebar.js";
import Header from "../cs-components/Header.js";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Header />
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}