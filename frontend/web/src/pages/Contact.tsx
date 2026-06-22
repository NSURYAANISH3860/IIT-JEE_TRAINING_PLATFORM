import FooterPolicyLinks from "../components/FooterPolicyLinks";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "../assets/logo.png";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "admissions@valluri.ai",
    href: "mailto:admissions@valluri.ai",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 80 4567 8900",
    href: "tel:+918045678900",
  },
  {
    icon: MapPin,
    label: "HQ",
    value: "Hyderabad, India",
  },
];

const programLinks = [
  "Two-Year Integrated",
  "Sprint to JEE",
  "Advanced Booster",
  "Foundation (Class 9–10)",
];

function Contact() {
  function sendMessage() {
    window.alert("Message sent successfully!");
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="section-kicker gold-kicker">Contact</p>
        <h1>Talk to us</h1>
        <p>
          Admissions, partnerships, or just a question — we read every message.
        </p>
      </section>

      <section className="contact-body">
        <div className="contact-layout">
          <div className="contact-info-list">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="contact-info-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={2.1} />
                  </span>
                  <div>
                    <p className="contact-info-label">{item.label}</p>
                    <strong>{item.value}</strong>
                  </div>
                </>
              );

              return item.href ? (
                <a
                  className="contact-info-item"
                  href={item.href}
                  key={item.label}
                >
                  {content}
                </a>
              ) : (
                <article className="contact-info-item" key={item.label}>
                  {content}
                </article>
              );
            })}
          </div>

          <form className="contact-form-card" onSubmit={(e) => e.preventDefault()}>
            <label>
              Name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              Message
              <textarea placeholder="How can we help?" rows={5} />
            </label>
            <button type="button" className="contact-submit-btn" onClick={sendMessage}>
              Send Message
            </button>
          </form>
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

export default Contact;
