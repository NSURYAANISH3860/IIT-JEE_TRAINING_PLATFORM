import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Flame,
  MessageCircleQuestion,
  Play,
  Target,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    icon: BookOpen,
    kicker: "Active Course",
    title: "JEE Adv. Crash",
    detail: "Batch · Elite 2026",
  },
  {
    icon: Trophy,
    kicker: "Mock Tests Completed",
    title: "24",
    detail: "of 60 in plan",
  },
  {
    icon: Target,
    kicker: "Accuracy",
    title: "82%",
    detail: "+4% this week",
  },
  {
    icon: Flame,
    kicker: "Study Streak",
    title: "37d",
    detail: "Personal best",
  },
  {
    icon: MessageCircleQuestion,
    kicker: "AI Doubts Solved",
    title: "318",
    detail: "avg 4s response",
  },
];

const planItems = [
  {
    time: "08:00",
    title: "Rotational Dynamics - Concept",
    subject: "Physics",
    done: true,
  },
  {
    time: "10:30",
    title: "Coordination Compounds - DPP",
    subject: "Chemistry",
    done: true,
  },
  {
    time: "14:00",
    title: "Definite Integration - Practice",
    subject: "Math",
    done: false,
  },
  {
    time: "18:30",
    title: "Mock Test #25 (Full Syllabus)",
    subject: "Test",
    done: false,
  },
];

const bars = [
  { day: "M", value: 58 },
  { day: "T", value: 72 },
  { day: "W", value: 64 },
  { day: "T", value: 84 },
  { day: "F", value: 76 },
  { day: "S", value: 92 },
  { day: "S", value: 89 },
];

function Dashboard() {
  return (
    <main className="student-dashboard dashboard-home">
      <section className="dashboard-hero-panel">
        <div className="dashboard-hero-content">
          <p className="dashboard-overline">Student Dashboard</p>
          <h1>
            Welcome back, <em>aspirant.</em>
          </h1>
          <p>Your discipline today decides your rank in May. Here&apos;s your snapshot.</p>

          <div className="dashboard-hero-actions">
            <Link to="/dashboard/courses" className="dashboard-primary-action">
              Continue Learning
            </Link>
            <Link to="/dashboard/adaptive-planner" className="dashboard-secondary-action">
              View Today&apos;s Plan
            </Link>
          </div>
        </div>
      </section>

      <section className="dashboard-stat-grid" aria-label="Preparation summary">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="dashboard-stat-card" key={stat.kicker}>
              <div>
                <p>{stat.kicker}</p>
                <h2>{stat.title}</h2>
                <span>{stat.detail}</span>
              </div>
              <Icon size={20} />
            </article>
          );
        })}
      </section>

      <section className="dashboard-workspace">
        <div className="dashboard-main-column">
          <article className="dashboard-plan-panel">
            <div className="dashboard-panel-heading">
              <div>
                <p className="dashboard-overline">Today</p>
                <h2>Your daily plan</h2>
              </div>
              <span>
                <CalendarDays size={17} /> Mon, 12 Jun
              </span>
            </div>

            <div className="dashboard-plan-list">
              {planItems.map((item) => (
                <Link
                  className="dashboard-plan-row"
                  key={`${item.time}-${item.title}`}
                  to={item.subject === "Test" ? "/dashboard/mock-tests" : "/dashboard/courses"}
                >
                  <time>{item.time}</time>
                  <span className={item.done ? "dashboard-plan-dot done" : "dashboard-plan-dot"}>
                    {item.done ? "✓" : ""}
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.subject}</small>
                  </span>
                  <ChevronRight size={20} />
                </Link>
              ))}
            </div>
          </article>

          <article className="dashboard-performance-card">
            <p className="dashboard-overline">Performance</p>
            <h2>Snapshot · last 7 days</h2>

            <div className="dashboard-bar-chart" aria-label="Last 7 days performance chart">
              {bars.map((bar) => (
                <div className="dashboard-bar-item" key={`${bar.day}-${bar.value}`}>
                  <span style={{ height: `${bar.value}%` }}></span>
                  <small>{bar.day}</small>
                </div>
              ))}
            </div>

            <div className="dashboard-performance-stats">
              <span>
                Avg Accuracy
                <strong>78.4%</strong>
                <small>↗ +3.2%</small>
              </span>
              <span>
                Avg Speed
                <strong>48s/Q</strong>
                <small>↗ -6s</small>
              </span>
              <span>
                Rank Percentile
                <strong>94.6</strong>
                <small>↗ +1.1</small>
              </span>
            </div>
          </article>
        </div>

        <aside className="dashboard-side-column">
          <article className="dashboard-mock-card">
            <p className="dashboard-overline">Upcoming Mock</p>
            <h2>Full Syllabus #25</h2>
            <p>Tonight · 6:30 PM · 3 hours · 90 questions</p>
            <ul>
              <li>
                Physics 30Q <strong>+4 marks</strong>
              </li>
              <li>
                Chemistry 30Q <strong>+4 marks</strong>
              </li>
              <li>
                Math 30Q <strong>+4 marks</strong>
              </li>
            </ul>
            <Link to="/dashboard/mock-tests">Enter Test Hall</Link>
          </article>

          <article className="dashboard-continue-card">
            <p className="dashboard-overline">Continue Learning</p>
            <h2>Modern Physics - Photoelectric Effect</h2>
            <span>Lecture 14 of 18 · 32 min remaining</span>
            <div className="dashboard-course-progress">
              <span></span>
            </div>
            <small>78% complete</small>
            <Link to="/dashboard/courses">
              <Play size={17} /> Resume
            </Link>
          </article>
        </aside>
      </section>

      <footer className="dashboard-footer">© 2026 VALLURI™ IIT-JEE. All rights reserved.</footer>
    </main>
  );
}

export default Dashboard;
