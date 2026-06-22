import FooterPolicyLinks from "../components/FooterPolicyLinks";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const stats = [
  {
    value: "12,000+",
    label: "Students mentored since 2019",
  },
  {
    value: "47",
    label: "IITians on faculty + research",
  },
  {
    value: "4.9 / 5",
    label: "Average student rating",
  },
];

const programLinks = [
  "Two-Year Integrated",
  "Sprint to JEE",
  "Advanced Booster",
  "Foundation (Class 9-10)",
];

function About() {
  return (
    <main className="about-page">
      <section className="about-page-hero">
        <p className="section-kicker gold-kicker">About VALLURI<sup>TM</sup></p>
        <h1>Built by IITians. Powered by agents.</h1>
        <p>
          We&apos;re rebuilding JEE coaching from the ground up - combining IIT
          faculty pedagogy with autonomous AI tutors.
        </p>
      </section>

      <section className="about-page-body">
        <div className="about-page-inner">
          <div className="about-stat-grid" aria-label="VALLURI highlights">
            {stats.map((stat) => (
              <article className="about-stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>

          <div className="about-mission">
            <h2>Our mission</h2>
            <p>
              Every JEE aspirant deserves a tutor that adapts to them - not the
              other way around. VALLURI<sup>TM</sup> combines decades of IIT
              teaching experience with frontier multi-agent AI to deliver
              coaching that&apos;s personal, rigorous, and always available.
            </p>
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

export default About;
