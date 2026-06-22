import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const weekPlan = [
  {
    day: "Mon",
    sessions: [
      { time: "8 AM", title: "Rotational Dyna...", subject: "Physics" },
      { time: "2 PM", title: "Definite Integrat...", subject: "Math" },
    ],
  },
  {
    day: "Tue",
    sessions: [
      { time: "9 AM", title: "Coordination Co...", subject: "Chemistry" },
      { time: "5 PM", title: "Mock #25 Review", subject: "Test" },
    ],
  },
  {
    day: "Wed",
    sessions: [{ time: "8 AM", title: "Electromagnetic...", subject: "Physics" }],
  },
  {
    day: "Thu",
    sessions: [{ time: "10 AM", title: "Probability DPP", subject: "Math" }],
  },
  {
    day: "Fri",
    sessions: [{ time: "8 AM", title: "Organic Reactions", subject: "Chemistry" }],
  },
  {
    day: "Sat",
    sessions: [{ time: "9 AM", title: "Mock Test #26", subject: "Test" }],
  },
  {
    day: "Sun",
    sessions: [{ time: "11 AM", title: "Weekly Revision", subject: "All" }],
  },
];

const weakChapters = [
  ["Coordination Compounds", "62%"],
  ["Probability", "62%"],
  ["Electrostatics", "62%"],
];

const strongChapters = [
  ["Kinematics", "94%"],
  ["Calculus", "94%"],
  ["Stoichiometry", "94%"],
];

function AdaptivePlanner() {
  return (
    <main className="dashboard-planner-page">
      <section className="dashboard-planner-hero">
        <p className="dashboard-overline">Adaptive Planner</p>
        <h1>
          Your weekly <em>discipline.</em>
        </h1>
        <p>AI-curated study plan that reshapes based on your accuracy and pace.</p>
      </section>

      <section className="dashboard-planner-schedule">
        <div className="dashboard-planner-heading">
          <p className="dashboard-overline">This Week</p>
          <h2>Weekly Schedule</h2>
        </div>

        <div className="dashboard-planner-week">
          {weekPlan.map((day) => (
            <article className="dashboard-planner-day" key={day.day}>
              <header>
                <h3>{day.day}</h3>
                <span aria-hidden="true" />
              </header>
              <div className="dashboard-planner-session-list">
                {day.sessions.map((session) => (
                  <div className="dashboard-planner-session" key={`${day.day}-${session.time}`}>
                    <time>{session.time}</time>
                    <strong>{session.title}</strong>
                    <small>{session.subject}</small>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-planner-insights">
        <article className="dashboard-planner-insight-card">
          <p>
            <Sparkles size={18} aria-hidden="true" />
            AI Insight
          </p>
          <h3>Your focus zone</h3>
          <span>
            Spend 6 more hours this week on Inorganic Chemistry and Probability.
            Your accuracy in these topics is 18% below your average.
          </span>
        </article>

        <article className="dashboard-planner-list-card weak">
          <p>
            <AlertTriangle size={18} aria-hidden="true" />
            Weak Chapters
          </p>
          {weakChapters.map(([chapter, score]) => (
            <div key={chapter}>
              <span>{chapter}</span>
              <strong>{score}</strong>
            </div>
          ))}
        </article>

        <article className="dashboard-planner-list-card strong">
          <p>
            <CheckCircle2 size={18} aria-hidden="true" />
            Strong Chapters
          </p>
          {strongChapters.map(([chapter, score]) => (
            <div key={chapter}>
              <span>{chapter}</span>
              <strong>{score}</strong>
            </div>
          ))}
        </article>
      </section>

      <footer className="dashboard-footer">
        <span>© 2026 VALLURI™ IIT-JEE. All rights reserved.</span>
        <Link to="/pricing">Premium plans</Link>
      </footer>
    </main>
  );
}

export default AdaptivePlanner;
