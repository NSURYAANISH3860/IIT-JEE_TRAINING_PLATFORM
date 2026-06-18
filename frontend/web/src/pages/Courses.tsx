import { useState } from "react";
import { ArrowRight, CalendarDays, Check, Play, ShieldCheck, UserRound } from "lucide-react";
import FooterPolicyLinks from "../components/FooterPolicyLinks";
import { Link } from "react-router-dom";
import VirtualTeacher from "../components/VirtualTeacher";
import { api } from "../services/api";
import logo from "../assets/logo.png";

const courses = [
  {
    label: "Class 11 + 12",
    title: "Two-Year Integrated",
    text: "The complete agentic journey from foundations to JEE Advanced mastery.",
    price: "₹1,80,000",
    period: "program",
    featured: true,
    badge: "Most Chosen",
    features: [
      "540+ live classes",
      "AI study planner",
      "Weekly Advanced mocks",
      "1:1 faculty mentor",
      "Parent dashboard",
    ],
  },
  {
    label: "Class 12 / Droppers",
    title: "Sprint to JEE",
    text: "Intensive 11-month track engineered to maximize rank in a single attempt.",
    price: "₹95,000",
    period: "program",
    features: [
      "320+ live classes",
      "Daily DPPs auto-graded",
      "All-India test series",
      "Rank predictor access",
    ],
  },
  {
    label: "Crash + Revision",
    title: "Advanced Booster",
    text: "90-day high-intensity revision with AI-curated weak-topic drilling.",
    price: "₹35,000",
    period: "program",
    features: [
      "Topic-wise diagnostics",
      "Unlimited AI doubt-solving",
      "12 full-syllabus mocks",
      "Last-mile strategy",
    ],
  },
];

const programLinks = [
  "Two-Year Integrated",
  "Sprint to JEE",
  "Advanced Booster",
  "Foundation (Class 9–10)",
];

const activeCourses = [
  {
    label: "Elite · Live + Recorded",
    title: "JEE Advanced - Elite Crash Course 2026",
    mentor: "Dr. R. Iyer (IIT-B)",
    nextClass: "Today · 6:30 PM · Modern Physics",
    activeTill: "Active till May 2026",
    progress: 62,
    featured: true,
    subject: "Physics",
    topic: "Modern Physics",
  },
  {
    label: "Self-Paced",
    title: "Chemistry Mastery - Organic Edition",
    mentor: "Prof. A. Sharma (IIT-K)",
    nextClass: "Tomorrow · 9:00 AM · Coordination",
    activeTill: "Active till Dec 2026",
    progress: 41,
    subject: "Chemistry",
    topic: "Coordination Compounds",
  },
];

const completedCourses = [
  {
    title: "Class XI Foundation - Math",
    mentor: "Dr. P. Verma",
    finished: "Apr 2026",
    grade: "A+",
  },
];

const recommendedCourses = [
  { label: "Add-on", title: "1-on-1 Mentor Program", price: "Rs. 29,999" },
  { label: "Add-on", title: "Test Series - Pinnacle", price: "Rs. 7,999" },
  { label: "Add-on", title: "Revision Bootcamp", price: "Rs. 12,999" },
];

function Courses({ dashboardMode = false }: { dashboardMode?: boolean }) {
  const [selectedTeacherTopic, setSelectedTeacherTopic] = useState<{
    subject: string;
    topic: string;
  } | null>(null);

  const coursesPath = dashboardMode ? "/dashboard/courses" : "/courses";
  const mockTestsPath = dashboardMode ? "/dashboard/mock-tests" : "/mock-test";

  const handleWatchClass = async (course: any) => {
    try {
      await api.saveStudentSelection(course.subject, course.topic);
    } catch (error) {
      console.error("Failed to save course selection:", error);
    }

    try {
      await api.logActivity({
        type: "course",
        title: course.title,
        subject: course.subject,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }

    if (course.subject && course.topic) {
      setSelectedTeacherTopic({ subject: course.subject, topic: course.topic });
    }
  };

  if (dashboardMode) {
    return (
      <main className="courses-page dashboard-courses-page">
        {selectedTeacherTopic && (
          <VirtualTeacher
            subject={selectedTeacherTopic.subject}
            topic={selectedTeacherTopic.topic}
            onClose={() => setSelectedTeacherTopic(null)}
          />
        )}

        <section className="courses-hero dashboard-courses-hero">
          <p className="dashboard-overline">My Courses</p>
          <h1>
            Your learning <em>library.</em>
          </h1>
          <p>Every batch you&apos;ve enrolled in - live, recorded, and personalised.</p>
        </section>

        <section className="dashboard-courses-section dashboard-courses-section-light">
          <div className="dashboard-courses-section-heading">
            <div>
              <p className="dashboard-overline">Active</p>
              <h2>Active Courses</h2>
            </div>
            <Link to="/dashboard/study-materials">
              Browse all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="dashboard-course-grid">
            {activeCourses.map((course) => (
              <article
                className={`dashboard-course-card${course.featured ? " featured" : ""}`}
                key={course.title}
              >
                <div className="dashboard-course-card-top">
                  <p>{course.label}</p>
                  <span>Enrolled</span>
                </div>

                <h3>{course.title}</h3>

                <dl className="dashboard-course-meta">
                  <div>
                    <dt>
                      <UserRound size={16} />
                      Mentor
                    </dt>
                    <dd>{course.mentor}</dd>
                  </div>
                  <div>
                    <dt>
                      <CalendarDays size={16} />
                      Next
                    </dt>
                    <dd>{course.nextClass}</dd>
                  </div>
                  <div>
                    <dt>
                      <ShieldCheck size={16} />
                      Status
                    </dt>
                    <dd>{course.activeTill}</dd>
                  </div>
                </dl>

                <div className="dashboard-course-progress-row">
                  <span>Course Progress</span>
                  <strong>{course.progress}%</strong>
                </div>
                <div className="dashboard-course-progress-track">
                  <span style={{ width: `${course.progress}%` }}></span>
                </div>

                <button 
                  className="dashboard-course-continue" 
                  onClick={() => handleWatchClass(course)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%"
                  }}
                >
                  <Play size={17} /> Watch Class
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-courses-section dashboard-courses-section-dark">
          <div className="dashboard-courses-section-heading">
            <div>
              <p className="dashboard-overline">Completed</p>
              <h2>Completed Courses</h2>
            </div>
          </div>

          <div className="dashboard-completed-grid">
            {completedCourses.map((course) => (
              <article className="dashboard-completed-card" key={course.title}>
                <h3>{course.title}</h3>
                <p>Mentor · {course.mentor}</p>
                <p>Finished · {course.finished}</p>
                <strong>Grade · {course.grade}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-courses-section dashboard-courses-section-light">
          <div className="dashboard-courses-section-heading">
            <div>
              <p className="dashboard-overline">Upgrade</p>
              <h2>Recommended for you</h2>
            </div>
          </div>

          <div className="dashboard-recommendation-grid">
            {recommendedCourses.map((course) => (
              <article className="dashboard-recommendation-card" key={course.title}>
                <p>{course.label}</p>
                <h3>{course.title}</h3>
                <strong>{course.price}</strong>
                <Link to="/pricing">Upgrade</Link>
              </article>
            ))}
          </div>
        </section>

        <footer className="dashboard-footer">© 2026 VALLURI™ IIT-JEE. All rights reserved.</footer>
      </main>
    );
  }

  return (
    <main className="courses-page">
      <section className="courses-hero">
        <p className="section-kicker gold-kicker">Programs</p>
        <h1>Courses for every aspirant.</h1>
        <p>
          From Class 11 foundations to last-mile Advanced sprints — pick a track
          and let our agents adapt the curriculum to you.
        </p>
      </section>

      <section className="courses-body">
        <div className="courses-inner">
          <div className="courses-split-heading">
            <div>
              <p className="section-kicker">Programs</p>
              <h2 className="display-heading">
                Built for <em>every</em> aspirant.
              </h2>
            </div>
            <p>
              Choose a track. Our agents will adapt the curriculum, pace, and
              pedagogy to your goal.
            </p>
          </div>

          <div className="course-cards-grid">
            {courses.map((course) => (
              <article
                className={`course-card${course.featured ? " featured" : ""}`}
                key={course.title}
              >
                {course.badge && (
                  <span className="course-card-badge">{course.badge}</span>
                )}
                <p className="course-card-label">{course.label}</p>
                <h3>{course.title}</h3>
                <p className="course-card-text">{course.text}</p>
                <p className="course-card-price">
                  {course.price}
                  <span>/ {course.period}</span>
                </p>
                <ul>
                  {course.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} strokeWidth={2.5} /> {feature}
                    </li>
                  ))}
                </ul>
                <div className="course-card-actions">
                  <button
                    type="button"
                    className={
                      course.featured ? "course-enroll-btn" : "course-enroll-btn-dark"
                    }
                    onClick={() => handleWatchClass(course)}
                  >
                    Start Class
                  </button>
                  <Link
                    to={mockTestsPath}
                    className="course-secondary-btn"
                  >
                    Enroll & Practice
                  </Link>
                </div>
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
                  <Link to={coursesPath}>{program}</Link>
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

export default Courses;
