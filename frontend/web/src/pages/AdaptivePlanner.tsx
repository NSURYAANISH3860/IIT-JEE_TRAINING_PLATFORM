import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { ProgressSummary } from "../services/api";

function AdaptivePlanner() {
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const summary = await api.getProgressSummary();
        setProgress(summary);
      } catch (err) {
        console.error("Error loading progress in planner:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  // Determine weak and strong chapters from actual performance
  const weakChapters = progress?.weak_topics 
    ? Object.entries(progress.weak_topics)
        .filter(([_, score]) => score < 75)
        .slice(0, 4)
    : [];

  const strongChapters = progress?.weak_topics
    ? Object.entries(progress.weak_topics)
        .filter(([_, score]) => score >= 75)
        .slice(0, 4)
    : [];

  // Default fallbacks if no attempts are made yet
  const displayWeak = weakChapters.length > 0 
    ? weakChapters 
    : [["Coordination Compounds", 62], ["Probability", 62], ["Electrostatics", 62]];

  const displayStrong = strongChapters.length > 0
    ? strongChapters
    : [["Kinematics", 94], ["Calculus", 94], ["Stoichiometry", 94]];

  // Generate dynamic AI Insight
  const weakestTopicEntry = weakChapters[0];
  const aiInsight = weakestTopicEntry
    ? `Spend 6 more hours this week on ${weakestTopicEntry[0]}. Your accuracy in this topic is ${weakestTopicEntry[1]}%, which is below average. Review it in the AI Classroom.`
    : "Spend 6 more hours this week on Inorganic Chemistry and Probability. Your accuracy in these topics is 18% below your average.";

  // Build a dynamic weekly plan centered around weak areas
  const primaryWeakTopic = weakestTopicEntry ? weakestTopicEntry[0] : "Probability";
  const secondaryWeakTopic = weakChapters[1] ? weakChapters[1][0] : "Rotational Dynamics";

  const weekPlan = [
    {
      day: "Mon",
      sessions: [
        { time: "8 AM", title: `${primaryWeakTopic} Review`, subject: "Weak Area" },
        { time: "2 PM", title: "Practice Questions", subject: "Math" },
      ],
    },
    {
      day: "Tue",
      sessions: [
        { time: "9 AM", title: `${secondaryWeakTopic} Practice`, subject: "Weak Area" },
        { time: "5 PM", title: "Mock Test Prep", subject: "Test" },
      ],
    },
    {
      day: "Wed",
      sessions: [{ time: "8 AM", title: `${primaryWeakTopic} Doubt Solving`, subject: "Physics" }],
    },
    {
      day: "Thu",
      sessions: [{ time: "10 AM", title: "Revision Session", subject: "Chemistry" }],
    },
    {
      day: "Fri",
      sessions: [{ time: "8 AM", title: "Complete Syllabus Practice", subject: "All" }],
    },
    {
      day: "Sat",
      sessions: [{ time: "9 AM", title: "Weekly Mock Exam", subject: "Test" }],
    },
    {
      day: "Sun",
      sessions: [{ time: "11 AM", title: "Analysis & Relax", subject: "All" }],
    },
  ];

  if (loading) {
    return (
      <main className="dashboard-planner-page flex items-center justify-center h-screen">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin text-red-500 mx-auto" size={40} />
          <p className="text-gray-400">Analyzing performance and building plan...</p>
        </div>
      </main>
    );
  }

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
          <span>{aiInsight}</span>
        </article>

        <article className="dashboard-planner-list-card weak">
          <p>
            <AlertTriangle size={18} aria-hidden="true" />
            Weak Chapters
          </p>
          {displayWeak.map(([chapter, score]) => (
            <div key={chapter as string}>
              <span>{chapter as string}</span>
              <strong>{score}%</strong>
            </div>
          ))}
        </article>

        <article className="dashboard-planner-list-card strong">
          <p>
            <CheckCircle2 size={18} aria-hidden="true" />
            Strong Chapters
          </p>
          {displayStrong.map(([chapter, score]) => (
            <div key={chapter as string}>
              <span>{chapter as string}</span>
              <strong>{score}%</strong>
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
