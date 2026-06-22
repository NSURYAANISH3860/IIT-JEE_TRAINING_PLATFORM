import FooterPolicyLinks from "../components/FooterPolicyLinks";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const results = [
  {
    rank: "AIR 12",
    year: "JEE ADV 2025",
    quote:
      "The AI planner caught my weak topics 3 months before mocks did. Game changer.",
    name: "Aarav Mehta",
  },
  {
    rank: "AIR 47",
    year: "JEE ADV 2025",
    quote:
      "I asked it to derive Bohr's model at 2 AM. It taught me better than my notes.",
    name: "Ishita Reddy",
  },
  {
    rank: "AIR 138",
    year: "JEE ADV 2024",
    quote:
      "Daily DPPs from the agent felt personal. Mains 99.91 percentile, Advanced under 200.",
    name: "Karthik V.",
  },
];

const programLinks = [
  "Two-Year Integrated",
  "Sprint to JEE",
  "Advanced Booster",
  "Foundation (Class 9-10)",
];

function Results() {
  return (
    <main className="results-page">
      <section className="results-hero">
        <div className="results-hero-inner">
          <p className="results-hero-kicker">Our Results</p>
          <h1>Ranks that speak louder</h1>
          <p>
            A snapshot of what VALLURI students have achieved across JEE Mains
            and Advanced.
          </p>
        </div>
      </section>

      <section className="results-showcase" aria-labelledby="results-heading">
        <div className="results-showcase-inner">
          <p className="section-kicker">Results</p>
          <h2 className="results-display" id="results-heading">
            Ranks that <em>speak</em>
            <br />
            <em>for themselves.</em>
          </h2>

          <div className="results-card-grid">
            {results.map((result) => (
              <figure className="results-story-card" key={result.rank}>
                <strong>{result.rank}</strong>
                <span>{result.year}</span>
                <blockquote>&quot;{result.quote}&quot;</blockquote>
                <figcaption>&mdash; {result.name}</figcaption>
              </figure>
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
              {programLinks.map((program) => (
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
              <li>Bengaluru - Hyderabad - Online</li>
            </ul>
          </div>
        </div>

        <div className="contact-footer-bar">
          <p>&copy; 2026 VALLURI<sup>TM</sup> Learning Systems. All rights reserved.</p>
          <FooterPolicyLinks />
        </div>
      </footer>
    </main>
  );
}

export default Results;
