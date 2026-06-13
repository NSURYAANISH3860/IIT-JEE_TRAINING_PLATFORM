import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  FileQuestion,
  Gauge,
  LogOut,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

type DashboardNavItem = {
  icon: typeof Gauge;
  label: string;
  to: string;
};

const dashboardNavItems: DashboardNavItem[] = [
  { icon: Gauge, label: "Dashboard", to: "/dashboard" },
  { icon: BookOpen, label: "My Courses", to: "/dashboard/courses" },
  { icon: FileQuestion, label: "Mock Tests", to: "/dashboard/mock-tests" },
  { icon: CalendarDays, label: "Adaptive Planner", to: "/dashboard/adaptive-planner" },
  { icon: TrendingUp, label: "Rank Predictor", to: "/dashboard/rank-predictor" },
  { icon: Sparkles, label: "AI Coaching", to: "/dashboard/ai-coaching" },
  { icon: BarChart3, label: "Study Materials", to: "/dashboard/study-materials" },
  { icon: UserRound, label: "Profile", to: "/dashboard/profile" },
];

function DashboardNavbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  }

  return (
    <>
      <aside className="dashboard-sidebar" aria-label="Student dashboard sidebar">
        <Link to="/dashboard" className="dashboard-sidebar-brand" aria-label="VALLURI dashboard">
          <img src={logo} alt="VALLURI logo" className="dashboard-sidebar-logo" />
          <span className="dashboard-sidebar-brand-text">
            <span className="dashboard-sidebar-name">
              VALLURI<sup>TM</sup>
            </span>
            <span className="dashboard-sidebar-subtitle">IIT-JEE</span>
          </span>
        </Link>

        <nav className="dashboard-sidebar-links" aria-label="Student dashboard navigation">
          {dashboardNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink className="dashboard-sidebar-link" key={item.label} to={item.to}>
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

      </aside>

      <header className="dashboard-topbar" aria-label="Student dashboard status bar">
        <div className="dashboard-live-pill">
          <span aria-hidden="true"></span>
          Live session in 2h · JEE Advanced Crash Batch
        </div>

        <div className="dashboard-topbar-actions">
          <button type="button" className="dashboard-icon-button" aria-label="Notifications">
            <Bell size={19} />
          </button>
          <div className="dashboard-profile-chip">
            <span className="dashboard-avatar">A</span>
            <span>
              <strong>Aspirant</strong>
              <small>JEE 2026 · Class XII</small>
            </span>
          </div>
          <button type="button" className="dashboard-icon-button" onClick={logout} aria-label="Logout">
            <LogOut size={19} />
          </button>
        </div>
      </header>
    </>
  );
}

export default DashboardNavbar;
