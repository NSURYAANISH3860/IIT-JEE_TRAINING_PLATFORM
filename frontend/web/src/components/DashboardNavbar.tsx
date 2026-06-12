import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";

const dashboardNavItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "My Courses", to: "/courses" },
  { label: "Mock Tests", to: "/mock-test" },
  { label: "AI Coaching", to: "/#agents" },
  { label: "Study Materials", to: "/study-materials" },
  { label: "Rank Predictor", to: "/rank-predictor" },
  { label: "Results", to: "/results" },
  { label: "Profile", to: "#profile" },
];

function DashboardNavbar() {
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        toolsOpen &&
        toolsRef.current &&
        !toolsRef.current.contains(event.target as Node)
      ) {
        setToolsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [toolsOpen]);

  function logout() {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  }

  function openChatbot() {
    localStorage.setItem("open_chatbot", "1");
    setToolsOpen(false);
    navigate("/");
  }

  function goTo(path: string) {
    setToolsOpen(false);
    navigate(path);
  }

  return (
    <header className="dashboard-navbar">
      <nav className="dashboard-nav-inner" aria-label="Student dashboard navigation">
        <Link to="/dashboard" className="brand" aria-label="VALLURI dashboard">
          <img src={logo} alt="VALLURI logo" className="brand-logo-img" />
          <span className="brand-text">
            <span className="brand-name">
              VALLURI<sup>TM</sup>
            </span>
            <span className="brand-subtitle">IIT-JEE</span>
          </span>
        </Link>

        <div className="dashboard-nav-links">
          <div
            ref={toolsRef}
            className="smart-tools-dropdown"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              type="button"
              className={`smart-tools-button ${toolsOpen ? "open" : ""}`}
              onClick={() => setToolsOpen((current) => !current)}
            >
              Smart Tools <span aria-hidden="true">▾</span>
            </button>

            <div className={`smart-tools-menu ${toolsOpen ? "open" : ""}`}>
              <button type="button" className="smart-tools-item" onClick={openChatbot}>
                <div className="smart-tools-item-title">
                  <span> Doubt Solver </span>
                  <span className="smart-tools-item-action">Open Chatbot</span>
                </div>
                <p className="smart-tools-item-text">
                  Snap any PCM problem and get step-by-step solutions with concept callouts in seconds.
                </p>
              </button>

              <button type="button" className="smart-tools-item" onClick={() => goTo("/get-started")}
              >
                <div className="smart-tools-item-title">
                  <span>Adaptive Planner</span>
                  <span className="smart-tools-item-action">Get Started</span>
                </div>
                <p className="smart-tools-item-text">
                  An autonomous agent builds your daily study schedule around syllabus, mocks, and energy.
                </p>
              </button>

              <button type="button" className="smart-tools-item" onClick={() => goTo("/mock-test")}
              >
                <div className="smart-tools-item-title">
                  <span>Mock Test Engine</span>
                  <span className="smart-tools-item-action">Launch Tests</span>
                </div>
                <p className="smart-tools-item-text">
                  JEE-pattern tests auto-generated, auto-graded, with topic-wise weakness diagnostics.
                </p>
              </button>

              <button type="button" className="smart-tools-item" onClick={() => goTo("/study-materials")}
              >
                <div className="smart-tools-item-title">
                  <span>Concept Library</span>
                  <span className="smart-tools-item-action">Explore</span>
                </div>
                <p className="smart-tools-item-text">
                  Connects chapters, formulas, and mistakes so every revision session has a purpose.
                </p>
              </button>

              <button type="button" className="smart-tools-item" onClick={() => goTo("/rank-predictor")}
              >
                <div className="smart-tools-item-title">
                  <span>Rank Predictor</span>
                  <span className="smart-tools-item-action">Predict</span>
                </div>
                <p className="smart-tools-item-text">
                  Forecasts your AIR band from score, accuracy, consistency, and current test trends.
                </p>
              </button>

              <button type="button" className="smart-tools-item" onClick={() => goTo("/get-started")}
              >
                <div className="smart-tools-item-title">
                  <span>Revision Coach</span>
                  <span className="smart-tools-item-action">Get Started</span>
                </div>
                <p className="smart-tools-item-text">
                  Daily summaries, weak-topic drills, and parent reports that keep momentum visible.
                </p>
              </button>
            </div>
          </div>

          {dashboardNavItems.map((item) =>
            item.to.startsWith("#") || item.to.includes("#") ? (
              <a href={item.to} key={item.label}>
                {item.label}
              </a>
            ) : (
              <NavLink to={item.to} key={item.label}>
                {item.label}
              </NavLink>
            ),
          )}
        </div>

        <button type="button" className="get-started-btn" onClick={logout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default DashboardNavbar;
