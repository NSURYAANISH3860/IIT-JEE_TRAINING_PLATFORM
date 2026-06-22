import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import FooterPolicyLinks from "../components/FooterPolicyLinks";
import logo from "../assets/logo.png";

const plans = [
  {
    name: "Starter",
    description: "Try the agent. Solve unlimited doubts.",
    price: "9,999",
    period: "quarter",
    features: [
      "AI tutor (PCM)",
      "10 mock tests",
      "Formula sheets",
      "Community access",
    ],
    button: "Get Starter",
  },
  {
    name: "Pro",
    description: "The full agentic experience for serious aspirants.",
    price: "35,000",
    period: "year",
    featured: true,
    features: [
      "Everything in Starter",
      "Adaptive study plan",
      "All-India test series",
      "Weekly mentor call",
      "Rank predictor",
    ],
    button: "Get Pro",
  },
  {
    name: "Elite",
    description: "1:1 IIT faculty mentorship + priority agents.",
    price: "95,000",
    period: "year",
    features: [
      "Everything in Pro",
      "1:1 faculty mentor",
      "Priority AI compute",
      "Parent dashboard",
      "Guaranteed 12 mocks reviewed",
    ],
    button: "Get Elite",
  },
];

const programLinks = [
  "Two-Year Integrated",
  "Sprint to JEE",
  "Advanced Booster",
  "Foundation (Class 9-10)",
];

function Pricing() {
  return (
    <main className="pricing-page">
      <section className="pricing-page-hero">
        <p className="section-kicker gold-kicker">Pricing</p>
        <h1>One platform. Three commitments.</h1>
        <p>Choose the tier that matches your goal. Upgrade or downgrade any time.</p>
      </section>

      <section className="pricing-page-body" aria-label="Pricing plans">
        <div className="pricing-page-inner">
          <div className="pricing-page-grid">
            {plans.map((plan) => (
              <article
                className={`pricing-page-card${plan.featured ? " featured" : ""}`}
                key={plan.name}
              >
                <h2>{plan.name}</h2>
                <p className="pricing-page-description">{plan.description}</p>
                <p className="pricing-page-price">
                  <span>&#8377;</span>
                  {plan.price}
                  <small>/ {plan.period}</small>
                </p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={17} strokeWidth={2.3} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/get-started" className="pricing-page-button">
                  {plan.button}
                </Link>
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

export default Pricing;
