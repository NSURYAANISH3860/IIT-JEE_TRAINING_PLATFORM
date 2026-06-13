import FooterPolicyLinks from "../components/FooterPolicyLinks";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ClipboardList,
  Download,
  FileText,
  NotebookPen,
  ScrollText,
  Video,
} from "lucide-react";
import logo from "../assets/logo.png";

const libraryCategories = [
  {
    icon: BookOpen,
    title: "Concept Modules",
    description: "Every JEE chapter, written by IIT alumni and curated by AI.",
  },
  {
    icon: ClipboardList,
    title: "Formula Sheets",
    description: "Printable revision sheets for Physics, Chemistry, and Math.",
  },
  {
    icon: FileText,
    title: "Solved PYQs",
    description: "20 years of Mains & Advanced papers with detailed solutions.",
  },
  {
    icon: Video,
    title: "Concept Videos",
    description: "Short, focused video explanations for every tricky topic.",
  },
];

const programLinks = [
  "Two-Year Integrated",
  "Sprint to JEE",
  "Advanced Booster",
  "Foundation (Class 9–10)",
];

const dashboardMaterialCards = [
  {
    icon: BookOpen,
    count: "312 items",
    title: "Concept Modules",
    description: "Topic-wise PDFs crafted by IITian mentors.",
  },
  {
    icon: ClipboardList,
    count: "84 items",
    title: "Formula Sheets",
    description: "Last-minute revision sheets for every chapter.",
  },
  {
    icon: FileText,
    count: "22 items",
    title: "Previous Year Papers",
    description: "JEE Main + Advanced - 2002 to 2025.",
  },
  {
    icon: Video,
    count: "720 items",
    title: "Video Lessons",
    description: "HD recorded sessions, indexed by chapter.",
  },
  {
    icon: NotebookPen,
    count: "540 items",
    title: "DPPs",
    description: "Daily Practice Problems - graded difficulty.",
  },
  {
    icon: ScrollText,
    count: "168 items",
    title: "Revision Notes",
    description: "Crisp, condensed notes by toppers.",
  },
];

function StudyMaterials({ dashboardMode = false }: { dashboardMode?: boolean }) {
  if (dashboardMode) {
    return (
      <main className="study-materials-page dashboard-materials-page">
        <section className="dashboard-materials-hero">
          <p className="dashboard-overline">Study Materials</p>
          <h1>
            Curated by <em>IITians.</em>
          </h1>
          <p>Premium resources accessible only to enrolled aspirants.</p>
        </section>

        <section className="dashboard-materials-browser">
          <div className="dashboard-materials-heading">
            <p className="dashboard-overline">Library</p>
            <h2>Browse materials</h2>
          </div>

          <div className="dashboard-materials-grid">
            {dashboardMaterialCards.map((material) => {
              const Icon = material.icon;
              return (
                <article className="dashboard-material-card" key={material.title}>
                  <div className="dashboard-material-card-top">
                    <span aria-hidden="true">
                      <Icon size={25} />
                    </span>
                    <small>{material.count}</small>
                  </div>
                  <h3>{material.title}</h3>
                  <p>{material.description}</p>
                  <button type="button">
                    Open
                    <Download size={16} aria-hidden="true" />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>Â© 2026 VALLURIâ„¢ IIT-JEE. All rights reserved.</span>
          <Link to="/pricing">Premium plans</Link>
        </footer>
      </main>
    );
  }

  return (
    <main className="study-materials-page">
      <section className="courses-hero">
        <p className="section-kicker gold-kicker">Library</p>
        <h1>Everything you&apos;ll ever need to revise</h1>
        <p>
          A single source of truth — modules, sheets, papers, and videos, all
          indexed by your AI tutor.
        </p>
      </section>

      <section className="library-body">
        <div className="library-inner">
          <div className="library-grid">
            {libraryCategories.map((category) => {
              const Icon = category.icon;
              return (
                <article className="library-card" key={category.title}>
                  <span className="library-card-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={2.1} />
                  </span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </article>
              );
            })}
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

export default StudyMaterials;
