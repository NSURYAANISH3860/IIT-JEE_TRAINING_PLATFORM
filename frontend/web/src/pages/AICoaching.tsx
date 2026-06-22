import { Bell, Brain, Clock3, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";

const recommendations = [
  "2 hrs concept revision - weak chapter rotation",
  "1 hr DPP - timed mode",
  "30 min flashcards - spaced repetition",
  "1 mock section per evening",
];

const weakAreas = [
  {
    title: "Coordination Compounds",
    need: "+3 hrs needed",
    accuracy: "Accuracy 62%",
    progress: "62%",
  },
  {
    title: "Probability",
    need: "+2 hrs needed",
    accuracy: "Accuracy 66%",
    progress: "66%",
  },
  {
    title: "Electrostatics",
    need: "+1.5 hrs needed",
    accuracy: "Accuracy 71%",
    progress: "71%",
  },
];

function AICoaching() {
  return (
    <main className="dashboard-ai-page">
      <section className="dashboard-ai-hero">
        <p className="dashboard-overline">AI Coaching</p>
        <h1>
          Your personal <em>mentor.</em>
        </h1>
        <p>Daily nudges, revision reminders, and a plan that adapts to you.</p>
      </section>

      <section className="dashboard-ai-plan-section">
        <div className="dashboard-ai-section-heading">
          <p className="dashboard-overline">Mentor Plan</p>
          <h2>This week with your AI mentor</h2>
        </div>

        <div className="dashboard-ai-plan-grid">
          <article className="dashboard-ai-focus-card">
            <Sparkles size={26} aria-hidden="true" />
            <h3>Focus theme</h3>
            <p>
              Spend the first 3 days deepening Inorganic Chemistry - your weakest
              accuracy region. Friday onwards, shift to full-syllabus mocks with
              strict 3-hour timers.
            </p>
          </article>

          <article className="dashboard-ai-recommendation-card">
            <Brain size={26} aria-hidden="true" />
            <h3>Daily recommendation</h3>
            <ul>
              {recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="dashboard-ai-insights-section">
        <div className="dashboard-ai-section-heading">
          <p className="dashboard-overline">Insights</p>
          <h2>Weak area analysis</h2>
        </div>

        <div className="dashboard-ai-weak-grid">
          {weakAreas.map((area) => (
            <article className="dashboard-ai-weak-card" key={area.title}>
              <Target size={22} aria-hidden="true" />
              <h3>{area.title}</h3>
              <p>{area.need}</p>
              <div className="dashboard-ai-progress-track">
                <span style={{ width: area.progress }} />
              </div>
              <small>{area.accuracy}</small>
            </article>
          ))}
        </div>

        <article className="dashboard-ai-reminder-card">
          <div>
            <Bell size={24} aria-hidden="true" />
            <p>Revision reminder Â· Rotational Dynamics flashcards due in 2 hours.</p>
          </div>
          <Link to="/dashboard/study-materials">
            Start now
            <Clock3 size={15} aria-hidden="true" />
          </Link>
        </article>
      </section>

      <footer className="dashboard-footer">
        <span>Â© 2026 VALLURIâ„¢ IIT-JEE. All rights reserved.</span>
        <Link to="/pricing">Premium plans</Link>
      </footer>
    </main>
  );
}

export default AICoaching;
