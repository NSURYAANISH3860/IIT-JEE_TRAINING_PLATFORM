import FooterPolicyLinks from "../components/FooterPolicyLinks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, ChevronRight, Clock3, Trophy } from "lucide-react";
import logo from "../assets/logo.png";
import { api } from "../services/api";

const mockTestsCatalog = [
  {
    tag: "Mains",
    title: "JEE Mains Full Syllabus",
    detail: "40+ papers",
    startPractice: true,
  },
  {
    tag: "Advanced",
    title: "JEE Advanced Full Syllabus",
    detail: "25+ papers",
    startPractice: true,
  },
  {
    tag: "Mains",
    title: "Chapter-wise Mains Tests",
    detail: "120+ papers",
    startPractice: true,
  },
  {
    tag: "Advanced",
    title: "All-India Test Series",
    detail: "Weekly",
    startPractice: true,
  },
  {
    tag: "Live Ranked",
    title: "AI Adaptive Tests",
    detail: "Unlimited",
    startPractice: true,
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
];

const subjectTopics: Record<string, string[]> = {
  All: ["All"],
  Physics: ["All", "Kinematics", "Modern Physics", "Rotational Dynamics"],
  Chemistry: ["All", "Chemical Bonding", "Coordination Compounds"],
  Mathematics: ["All", "Algebra", "Definite Integration", "Probability"],
};

interface Question {
  id: string;
  exam_type: string;
  subject: string;
  topic: string;
  question_text: string;
  options: string[];
}

interface ExamResultDetail {
  question_id: string;
  subject: string;
  topic: string;
  selected_option: string;
  correct_option: string;
  is_correct: boolean;
  explanation: string;
  marks_obtained: number;
  max_marks: number;
}

interface ExamResultResponse {
  total_questions: number;
  correct_answers: number;
  score: number;
  percentage: number;
  obtained_marks: number;
  total_marks: number;
  details: ExamResultDetail[];
}

function MockTest({ dashboardMode = false }: { dashboardMode?: boolean }) {
  // Config state
  const [showConfig, setShowConfig] = useState(false);
  const [examType, setExamType] = useState("jee_mains");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [questionsLimit, setQuestionsLimit] = useState(5);
  const [isFullMock, setIsFullMock] = useState(false);
  const [activeSection, setActiveSection] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");

  // Quiz active state
  const [showQuiz, setShowQuiz] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> answer string
  
  // Results state
  const [showResult, setShowResult] = useState(false);
  const [submittingExam, setSubmittingExam] = useState(false);
  const [examResult, setExamResult] = useState<ExamResultResponse | null>(null);

  const [activeDashboardFilter, setActiveDashboardFilter] = useState("All");
  const [analysisTitle, setAnalysisTitle] = useState("");

  // Handle topic listing change when subject changes
  const handleSubjectChange = (subj: string) => {
    setSelectedSubject(subj);
    setSelectedTopic("All");
    if (subj !== "All") {
      setIsFullMock(false);
    }
  };

  useEffect(() => {
    if (!showQuiz || timeLeft === 0 || showResult) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [timeLeft, showResult, showQuiz]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Fetch questions from backend
  const startExam = async () => {
    setLoadingQuestions(true);
    try {
      const fetched = await api.getQuestions(
        selectedSubject === "All" ? undefined : selectedSubject,
        selectedTopic === "All" ? undefined : selectedTopic,
        examType,
        questionsLimit
      );
      
      if (fetched && fetched.length > 0) {
        setQuestions(fetched);
        setUserAnswers({});
        setTimeLeft(questionsLimit === 75 ? 10800 : questionsLimit * 120); // 3 hours if 75 questions, otherwise 2 minutes per question
        setShowQuiz(true);
        setShowConfig(false);
        setShowResult(false);
        setActiveSection("Physics"); // reset active section
      } else {
        alert("No questions found matching your filter selection. Try selecting a different topic or exam type.");
      }
    } catch (error) {
      console.error("Failed to load questions:", error);
      alert("Error loading questions from database. Please verify backend is running.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectOption = (qId: string, optionText: string, isMulti: boolean) => {
    if (isMulti) {
      // Toggle choice
      const current = userAnswers[qId] || "";
      const choices = current.split(",").map(c => c.trim()).filter(Boolean);
      if (choices.includes(optionText)) {
        const updated = choices.filter(c => c !== optionText).join(",");
        setUserAnswers({ ...userAnswers, [qId]: updated });
      } else {
        choices.push(optionText);
        setUserAnswers({ ...userAnswers, [qId]: choices.join(",") });
      }
    } else {
      // Single choice
      setUserAnswers({ ...userAnswers, [qId]: optionText });
    }
  };

  const submitExam = async () => {
    setSubmittingExam(true);
    try {
      const answersPayload = questions.map((q) => ({
        question_id: q.id,
        selected_option: userAnswers[q.id] || "",
      }));

      const res = await api.submitExam(
        selectedSubject,
        selectedTopic,
        answersPayload,
        questionsLimit * 120 - timeLeft
      );

      // Log student activity
      await api.logActivity({
        type: "exam",
        title: `Mock: ${examType === "jee_mains" ? "JEE Mains" : "JEE Advanced"} - ${selectedSubject}`,
        subject: selectedSubject,
        timestamp: new Date().toISOString(),
        score: res.score,
      }).catch(console.error);

      setExamResult(res);
      setShowResult(true);
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Could not submit exam. Please try again.");
    } finally {
      setSubmittingExam(false);
    }
  };

  const quitExam = () => {
    setShowQuiz(false);
    setShowResult(false);
    setQuestions([]);
    setUserAnswers({});
  };

  const openConfig = () => {
    setShowConfig(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If exam quiz is active
  if (showQuiz) {
    return (
      <main className="mock-tests-page quiz-session-active">
        <section className="mock-quiz-section">
          <div className="mock-quiz-inner">
            <div className="quiz-header-bar">
              <h2>
                {examType === "jee_mains" ? "JEE Main Simulation" : "JEE Advanced Simulation"} — {selectedSubject}
              </h2>
              <div className="quiz-header-right">
                <div className="quiz-timer-box">
                  <Clock3 size={18} />
                  <span>Time Remaining: <strong>{minutes}:{seconds}</strong></span>
                </div>
                <button type="button" className="quit-btn" onClick={quitExam}>
                  Quit
                </button>
              </div>
            </div>

            {!showResult ? (
              <section className="quiz-panel">
                {questions.length === 75 && (
                  <div className="flex border-b border-gray-700 mb-6 bg-gray-900/50 rounded-t-lg p-2 gap-2">
                    {(["Physics", "Chemistry", "Mathematics"] as const).map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                          activeSection === sec
                            ? "bg-red-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        }`}
                        onClick={() => setActiveSection(sec)}
                      >
                        {sec} ({questions.filter(q => q.subject === sec).length} Qs)
                      </button>
                    ))}
                  </div>
                )}
                <div className="question-list">
                  {questions
                    .map((q, idx) => ({ ...q, overallIndex: idx }))
                    .filter((q) => questions.length !== 75 || q.subject === activeSection)
                    .map((question) => {
                      const isNumerical = !question.options || question.options.length === 0;
                      const isMulti = question.question_text.includes("[MULTIPLE CORRECT]");
                      const currentSelection = userAnswers[question.id] || "";

                      return (
                        <article className="question-card" key={question.id}>
                          <div className="question-card-header">
                            <span className="question-number">Question {question.overallIndex + 1}</span>
                            <span className="question-type-badge">
                              {isNumerical ? "Numerical (Integer)" : isMulti ? "One or More Correct" : "Single Choice"}
                            </span>
                            <span className="question-subject-badge">{question.subject} · {question.topic}</span>
                          </div>

                          <h3 className="question-text-rendered">{question.question_text}</h3>

                          {isNumerical ? (
                            <div className="numerical-answer-input">
                              <label>
                                Your Answer:
                                <input
                                  type="text"
                                  value={currentSelection}
                                  onChange={(e) => setUserAnswers({ ...userAnswers, [question.id]: e.target.value })}
                                  placeholder="Type your integer or decimal answer here..."
                                />
                              </label>
                            </div>
                          ) : (
                            <div className="answer-grid">
                              {question.options.map((option) => {
                                const isSelected = isMulti 
                                  ? currentSelection.split(",").map(c => c.trim()).includes(option)
                                  : currentSelection === option;

                                return (
                                  <button
                                    type="button"
                                    className={isSelected ? "answer-option selected-answer" : "answer-option"}
                                    onClick={() => handleSelectOption(question.id, option, isMulti)}
                                    key={option}
                                  >
                                    <span className="option-indicator">{isMulti ? (isSelected ? "☑" : "☐") : (isSelected ? "●" : "○")}</span>
                                    <span className="option-text">{option}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </article>
                      );
                    })}
                </div>

                <div className="quiz-actions-row">
                  <button
                    type="button"
                    className="submit-quiz-btn"
                    onClick={submitExam}
                    disabled={submittingExam}
                  >
                    {submittingExam ? "Submitting Answers..." : "Submit and Finish Exam"}
                  </button>
                </div>
              </section>
            ) : (
              <section className="quiz-results-panel">
                <div className="results-hero-card">
                  <div className="results-circular-stat">
                    <Trophy size={48} className="trophy-gold" />
                    <div>
                      <h3>Obtained Marks</h3>
                      <h2>{examResult?.obtained_marks} / {examResult?.total_marks}</h2>
                      <p>Accuracy Percentage: {examResult?.score}%</p>
                    </div>
                  </div>
                  <div className="results-kpi-summary">
                    <div>
                      <span>Total Questions</span>
                      <strong>{examResult?.total_questions}</strong>
                    </div>
                    <div>
                      <span>Correct Answers</span>
                      <strong>{examResult?.correct_answers}</strong>
                    </div>
                    <div>
                      <span>Percentage</span>
                      <strong>{examResult?.percentage}%</strong>
                    </div>
                  </div>
                </div>

                <div className="results-explanations-list">
                  <h2>Detailed Review & Solutions</h2>
                  {examResult?.details.map((detail, idx) => {
                    const question = questions.find(q => q.id === detail.question_id);
                    return (
                      <article key={detail.question_id} className={`result-review-card ${detail.is_correct ? "correct-card" : "incorrect-card"}`}>
                        <div className="review-card-header">
                          <span className="review-question-number">Question {idx + 1}</span>
                          <span className={detail.is_correct ? "status-badge correct" : "status-badge incorrect"}>
                            {detail.is_correct ? "Correct" : "Incorrect"}
                          </span>
                          <span className="marks-badge">Marks: {detail.marks_obtained} / {detail.max_marks}</span>
                        </div>

                        <h3 className="review-question-text">{question?.question_text}</h3>
                        
                        <div className="review-answers-comparison">
                          <div>
                            <span>Your Selection:</span>
                            <strong className={detail.is_correct ? "text-correct" : "text-incorrect"}>
                              {detail.selected_option || "(Unattempted)"}
                            </strong>
                          </div>
                          <div>
                            <span>Correct Answer:</span>
                            <strong className="text-correct">{detail.correct_option}</strong>
                          </div>
                        </div>

                        {detail.explanation && (
                          <div className="review-explanation-box">
                            <h4>Solution & Explanation:</h4>
                            <p>{detail.explanation}</p>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

                <div className="results-footer-actions">
                  <button type="button" className="dashboard-primary-action" onClick={quitExam}>
                    Return to Exam Hall
                  </button>
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
    );
  }

  // If config panel is open
  if (showConfig) {
    return (
      <main className="mock-tests-page configure-session-page">
        <section className="courses-hero">
          <p className="section-kicker gold-kicker">Configuration</p>
          <h1>Set up your practice simulation</h1>
          <p>Customize syllabus, test type, and question count for tailored AI guidance.</p>
        </section>

        <section className="config-workspace">
          <div className="config-form-card">
            <h2>Select Exam Parameters</h2>

            <div className="config-form-group">
              <label>Exam Mode</label>
              <div className="config-radio-cards">
                <button
                  type="button"
                  className={examType === "jee_mains" ? "radio-card active" : "radio-card"}
                  onClick={() => setExamType("jee_mains")}
                >
                  <h3>JEE Main</h3>
                  <p>Single correct MCQs and integer values (+4/-1 marking scheme)</p>
                </button>
                <button
                  type="button"
                  className={examType === "jee_advanced" ? "radio-card active" : "radio-card"}
                  onClick={() => setExamType("jee_advanced")}
                >
                  <h3>JEE Advanced</h3>
                  <p>Includes multi-correct checkboxes and integers (+3, +4/-2 scheme)</p>
                </button>
              </div>
            </div>

            <div className="config-select-grid">
              <label>
                Subject
                <select value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
                  {Object.keys(subjectTopics).map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </label>

              <label>
                Topic / Chapter
                <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                  {(subjectTopics[selectedSubject] || ["All"]).map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </label>
            </div>

            {selectedSubject === "All" && (
              <div className="flex items-center space-x-2 my-4 p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                <input
                  type="checkbox"
                  id="full-syllabus-checkbox"
                  checked={isFullMock}
                  onChange={(e) => {
                    setIsFullMock(e.target.checked);
                    if (e.target.checked) {
                      setQuestionsLimit(75);
                    } else {
                      setQuestionsLimit(5);
                    }
                  }}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="full-syllabus-checkbox" className="text-sm font-medium text-gray-200 cursor-pointer select-none">
                  Take Full Syllabus Mock Test (75 Questions, 3 Hours)
                </label>
              </div>
            )}

            {!isFullMock ? (
              <label className="range-label">
                Questions Limit: <strong>{questionsLimit} Questions</strong>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="1"
                  value={questionsLimit}
                  onChange={(e) => setQuestionsLimit(Number(e.target.value))}
                />
              </label>
            ) : (
              <div className="range-label mb-4 text-sm text-gray-300 bg-red-950/20 border border-red-900/30 rounded-lg p-3">
                🤖 <strong>Full Syllabus Mode Enabled:</strong> Exactly 25 Physics, 25 Chemistry, and 25 Math questions will be generated. Mark scheme will reflect full JEE guidelines (+4/-1). Time limit is locked at 180 minutes.
              </div>
            )}

            <div className="config-buttons-row">
              <button type="button" className="secondary-btn" onClick={() => setShowConfig(false)}>
                Cancel
              </button>
              <button type="button" className="dashboard-primary-action" onClick={startExam} disabled={loadingQuestions}>
                {loadingQuestions ? "Generating Exam..." : "Start Practice Session"}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Dashboard list layout
  if (dashboardMode) {
    const filteredMockTests = dashboardMockTests.filter((test) => {
      if (activeDashboardFilter === "All") return true;
      return test.status === activeDashboardFilter || test.type === activeDashboardFilter;
    });

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
            {["All", "Upcoming", "Attempted", "Full Syllabus", "Chapter-wise"].map((filter) => (
              <button
                className={activeDashboardFilter === filter ? "active" : ""}
                key={filter}
                type="button"
                onClick={() => setActiveDashboardFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {analysisTitle && (
            <div className="dashboard-mock-analysis-banner">
              Analysis opened for {analysisTitle}. Custom review metrics loaded correctly in standard visual layout.
            </div>
          )}

          <div className="dashboard-mock-list">
            <article className="dashboard-mock-row highlighted">
              <div className="dashboard-mock-row-content">
                <div className="dashboard-mock-row-tags">
                  <span className="upcoming">Live Practice</span>
                  <strong>Custom Mock Test</strong>
                </div>
                <h2>Create Your Own Practice Test</h2>
                <p>Generate a dynamic JEE Main or Advanced mock exam mapped to your profile.</p>
              </div>
              <button type="button" className="dashboard-mock-primary" onClick={openConfig}>
                Configure & Start
              </button>
            </article>

            {filteredMockTests.map((test) => {
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
                    <button type="button" className="dashboard-mock-primary" onClick={openConfig}>
                      Enter Test
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="dashboard-mock-analysis"
                      onClick={() => setAnalysisTitle(test.title)}
                    >
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

  // Public catalog layout
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
            <article className="mock-test-card featured-mock-create-card" style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,215,0,0.2)" }}>
              <p className="mock-test-tag" style={{ background: "gold", color: "#111" }}>Premium Active</p>
              <h3>Interactive Exam Simulator</h3>
              <p className="mock-test-detail">Choose JEE Main or Advanced, select subjects/chapters, and start instant practice with automated grading.</p>
              <button
                type="button"
                className="mock-test-link"
                onClick={openConfig}
                style={{ cursor: "pointer", background: "none", border: "none", color: "gold", fontWeight: "bold" }}
              >
                Configure & Start Test →
              </button>
            </article>

            {mockTestsCatalog.map((test) => (
              <article className="mock-test-card" key={test.title}>
                <p className="mock-test-tag">{test.tag}</p>
                <h3>{test.title}</h3>
                <p className="mock-test-detail">{test.detail}</p>
                {test.startPractice ? (
                  <button
                    type="button"
                    className="mock-test-link"
                    onClick={openConfig}
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

      <footer className="contact-footer">
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
              {["Two-Year Integrated", "Sprint to JEE", "Advanced Booster", "Foundation (Class 9–10)"].map((program) => (
                <li key={program}>
                  <Link to="/courses">{program}</Link>
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
      </footer>
    </main>
  );
}

export default MockTest;
