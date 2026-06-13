import FooterPolicyLinks from "../components/FooterPolicyLinks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, ChevronRight, Clock3, Trophy } from "lucide-react";
import logo from "../assets/logo.png";

const mockTests = [
  {
    tag: "Mains",
    title: "JEE Mains Full Syllabus",
    detail: "40+ papers",
    startPractice: false,
  },
  {
    tag: "Advanced",
    title: "JEE Advanced Full Syllabus",
    detail: "25+ papers",
    startPractice: false,
  },
  {
    tag: "Mains",
    title: "Chapter-wise Mains Tests",
    detail: "120+ papers",
    startPractice: false,
  },
  {
    tag: "Advanced",
    title: "All-India Test Series",
    detail: "Weekly",
    startPractice: false,
  },
  {
    tag: "Live Ranked",
    title: "AI Adaptive Tests",
    detail: "Unlimited",
    startPractice: true,
  },
  {
    tag: "Personalized",
    title: "JEE Mains Previous Year",
    detail: "2005 – 2025",
    startPractice: false,
  },
];

const programLinks = [
  "Two-Year Integrated",
  "Sprint to JEE",
  "Advanced Booster",
  "Foundation (Class 9–10)",
];

const questions = [
  {
    question: "If f(x) = x^2 + 3x, find f(2).",
    options: ["8", "10", "12", "14"],
    answer: "10",
  },
  {
    question: "Which subject studies force, motion, and energy?",
    options: ["Physics", "Chemistry", "Mathematics", "Biology"],
    answer: "Physics",
  },
  {
    question: "What is the derivative of x^2?",
    options: ["x", "2x", "x^3", "2"],
    answer: "2x",
  },
];

const dashboardMockTests = [
  {
    status: "Upcoming",
    type: "Full Syllabus",
    title: "Full Syllabus Mock #25",
    time: "Tonight 6:30 PM",
    action: "Enter Test",
  },
  {
    status: "Upcoming",
    type: "Chapter-wise",
    title: "Rotational Dynamics - Chapter Test",
    time: "Wed 4:00 PM",
    action: "Enter Test",
  },
  {
    status: "Attempted",
    type: "Full Syllabus",
    title: "Full Syllabus Mock #24",
    meta: ["Score 248", "Rank #124", "Accuracy 82%", "2h 47m"],
    highlighted: false,
  },
  {
    status: "Attempted",
    type: "Chapter-wise",
    title: "Coordination Compounds Test",
    meta: ["Score 78", "Rank #56", "Accuracy 88%", "44m"],
    highlighted: false,
  },
  {
    status: "Attempted",
    type: "Full Syllabus",
    title: "Full Syllabus Mock #23",
    meta: ["Score 231", "Rank #187", "Accuracy 78%", "2h 51m"],
    highlighted: true,
  },
];

const dashboardFilters = ["All", "Upcoming", "Attempted", "Full Syllabus", "Chapter-wise"];

function MockTest({ dashboardMode = false }: { dashboardMode?: boolean }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!showQuiz || timeLeft === 0 || showResult) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [timeLeft, showResult, showQuiz]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const score = questions.filter((question, index) => {
    return selectedAnswers[index] === question.answer;
  }).length;

  function chooseAnswer(questionIndex: number, option: string) {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = option;
    setSelectedAnswers(newAnswers);
  }

  function restartTest() {
    setSelectedAnswers([]);
    setShowResult(false);
    setTimeLeft(120);
  }

  function startPractice() {
    restartTest();
    setShowQuiz(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function backToCatalog() {
    setShowQuiz(false);
    restartTest();
  }

  if (showQuiz) {
    return (
      <main className="mock-tests-page">
        <section className="mock-quiz-section">
          <div className="mock-quiz-inner">
            <button type="button" className="mock-back-btn" onClick={backToCatalog}>
              ← Back to Mock Tests
            </button>

            <section className="quiz-panel">
              <div className="quiz-top-row">
                <div>
                  <p className="dashboard-label">Quiz Timer</p>
                  <h2>
                    {minutes}:{seconds}
                  </h2>
                </div>
                <button type="button" className="secondary-btn" onClick={restartTest}>
                  Restart Test
                </button>
              </div>

              <div className="question-list">
                {questions.map((question, questionIndex) => (
                  <article className="question-card" key={question.question}>
                    <p className="question-number">Question {questionIndex + 1}</p>
                    <h3>{question.question}</h3>

                    <div className="answer-grid">
                      {question.options.map((option) => (
                        <button
                          type="button"
                          className={
                            selectedAnswers[questionIndex] === option
                              ? "answer-option selected-answer"
                              : "answer-option"
                          }
                          onClick={() => chooseAnswer(questionIndex, option)}
                          key={option}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="quiz-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowResult(true)}
                >
                  Submit Test
                </button>

                {showResult && (
                  <div className="score-result">
                    Score: {score} / {questions.length}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    );
  }

  if (dashboardMode) {
    return (
      <main className="mock-tests-page dashboard-mock-tests-page">
        <section className="dashboard-mock-hero">
          <p className="dashboard-overline">Mock Tests</p>
          <h1>
            Practice like <em>exam day.</em>
          </h1>
          <p>Real-clock simulations, deep analytics, and AIR-style ranking.</p>
        </section>

        <section className="dashboard-mock-catalog">
          <div className="dashboard-mock-filters" aria-label="Mock test filters">
            {dashboardFilters.map((filter, index) => (
              <button className={index === 0 ? "active" : ""} key={filter} type="button">
                {filter}
              </button>
            ))}
          </div>

          <div className="dashboard-mock-list">
            {dashboardMockTests.map((test) => {
              const isUpcoming = test.status === "Upcoming";

              return (
                <article
                  className={`dashboard-mock-row${test.highlighted ? " highlighted" : ""}`}
                  key={test.title}
                >
                  <div className="dashboard-mock-row-content">
                    <div className="dashboard-mock-row-tags">
                      <span className={isUpcoming ? "upcoming" : "attempted"}>
                        {test.status}
                      </span>
                      <strong>{test.type}</strong>
                    </div>

                    <h2>{test.title}</h2>

                    {isUpcoming ? (
                      <p>
                        <Clock3 size={16} /> {test.time}
                      </p>
                    ) : (
                      <div className="dashboard-mock-meta">
                        <Trophy size={16} />
                        {test.meta?.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUpcoming ? (
                    <button type="button" className="dashboard-mock-primary" onClick={startPractice}>
                      {test.action}
                    </button>
                  ) : (
                    <button type="button" className="dashboard-mock-analysis">
                      <BarChart3 size={17} /> View Analysis <ChevronRight size={18} />
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <footer className="dashboard-footer">© 2026 VALLURI™ IIT-JEE. All rights reserved.</footer>
      </main>
    );
  }

  return (
    <main className="mock-tests-page">
      <section className="courses-hero">
        <p className="section-kicker gold-kicker">Mock Tests</p>
        <h1>Train under real exam pressure</h1>
        <p>
          Ranked, timed, and analyzed by AI — every test surfaces the exact
          concepts you need to revisit.
        </p>
      </section>

      <section className="mock-tests-body">
        <div className="mock-tests-inner">
          <div className="mock-cards-grid">
            {mockTests.map((test) => (
              <article className="mock-test-card" key={test.title}>
                <p className="mock-test-tag">{test.tag}</p>
                <h3>{test.title}</h3>
                <p className="mock-test-detail">{test.detail}</p>
                {test.startPractice ? (
                  <button
                    type="button"
                    className="mock-test-link"
                    onClick={startPractice}
                  >
                    Start Practice →
                  </button>
                ) : (
                  <span className="mock-test-link muted">Coming soon</span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {!dashboardMode && <footer className="contact-footer">
        <div className="contact-footer-inner">
          <div className="contact-footer-brand">
            <Link to="/" className="footer-brand">
              <img src={logo} alt="VALLURI logo" className="brand-logo-img" />
              <span className="brand-text">
                <span className="footer-brand-name">
                  VALLURI<sup>TM</sup>
                </span>
                <span className="brand-subtitle">IIT-JEE</span>
              </span>
            </Link>
            <p>
              India&apos;s first agentic AI coaching system for IIT JEE Mains
              &amp; Advanced aspirants.
            </p>
          </div>

          <div className="contact-footer-col">
            <h3>Programs</h3>
            <ul>
              {programLinks.map((program) => (
                <li key={program}>
                  <Link to={dashboardMode ? "/dashboard/courses" : "/courses"}>{program}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-footer-col">
            <h3>Contact</h3>
            <ul>
              <li>
                <a href="mailto:hello@valluri.ai">hello@valluri.ai</a>
              </li>
              <li>
                <a href="tel:+918040000000">+91 80 4000 0000</a>
              </li>
              <li>Bengaluru · Hyderabad · Online</li>
            </ul>
          </div>
        </div>

        <div className="contact-footer-bar">
          <p>© 2026 VALLURI™ Learning Systems. All rights reserved.</p>
          <FooterPolicyLinks />
        </div>
      </footer>}
    </main>
  );
}

export default MockTest;
