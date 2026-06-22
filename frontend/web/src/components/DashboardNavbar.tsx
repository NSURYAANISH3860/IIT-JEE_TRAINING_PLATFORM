import { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  FileQuestion,
  Gauge,
  LogOut,
  MessageCircleQuestion,
  TrendingUp,
  UserRound,
  Video,
  Menu,
  Trash2,
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
  { icon: Video, label: "Video Lessons", to: "/dashboard/ai-classroom" },
  { icon: MessageCircleQuestion, label: "Doubts", to: "/dashboard/doubts" },
  { icon: BarChart3, label: "Study Materials", to: "/dashboard/study-materials" },
  { icon: UserRound, label: "Profile", to: "/dashboard/profile" },
];

interface DashboardNavbarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function DashboardNavbar({ sidebarCollapsed, setSidebarCollapsed }: DashboardNavbarProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: "1", text: "Welcome to VALLURI AI Classroom! Try uploading your own PPT.", read: false, time: "Just now" },
    { id: "2", text: "New Mock Test Available: JEE Advanced Practice Set #25", read: false, time: "1 hour ago" },
    { id: "3", text: "AI Tutor: Rotational Dynamics notes have been added to your notebook.", read: true, time: "Yesterday" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<{
    name: string;
    email: string;
    class_level: string;
    target_exam: string;
  } | null>(null);

  useEffect(() => {
    function loadUser() {
      const storedUser = localStorage.getItem("current_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Error parsing user from localStorage", err);
        }
      } else {
        setUser(null);
      }
    }
    loadUser();
    window.addEventListener("auth-change", loadUser);
    return () => {
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  const name = user?.name || "Aspirant";
  const firstName = name.split(" ")[0];
  const classLevel = user?.class_level || "XII";
  const targetExam = user?.target_exam || "JEE 2026";
  const avatarLetter = name.trim().charAt(0).toUpperCase() || "A";

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function logout() {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const toggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

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
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            type="button"
            className="dashboard-sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
          >
            <Menu size={20} />
          </button>
          
          <div className="dashboard-live-pill">
            <span aria-hidden="true"></span>
            Live session in 2h · JEE Advanced Crash Batch
          </div>
        </div>

        <div className="dashboard-topbar-actions">
          <div className="dashboard-bell-container" ref={dropdownRef}>
            <button 
              type="button" 
              className={`dashboard-icon-button ${showNotifications ? "active" : ""}`} 
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="dashboard-notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="dashboard-notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button type="button" className="mark-read-btn" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="dropdown-list">
                  {notifications.length === 0 ? (
                    <div className="dropdown-empty">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`dropdown-item ${n.read ? "read" : "unread"}`}
                        onClick={() => toggleRead(n.id)}
                      >
                        <div className="item-dot" />
                        <div className="item-body">
                          <p className="item-text">{n.text}</p>
                          <span className="item-time">{n.time}</span>
                        </div>
                        <button 
                          type="button" 
                          className="item-delete-btn" 
                          onClick={(e) => deleteNotification(n.id, e)}
                          title="Delete notification"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="dashboard-profile-chip">
            <span className="dashboard-avatar">{avatarLetter}</span>
            <span>
              <strong>{firstName}</strong>
              <small>{targetExam} · Class {classLevel}</small>
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
