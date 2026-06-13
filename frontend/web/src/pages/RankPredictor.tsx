import FooterPolicyLinks from "../components/FooterPolicyLinks";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Target, TrendingUp } from "lucide-react";
import logo from "../assets/logo.png";

function getRankPrediction(score: number) {
  if (score >= 260) {
    return "Estimated AIR 1 - 500";
  }

  if (score >= 230) {
    return "Estimated AIR 500 - 2,000";
  }

  if (score >= 200) {
    return "Estimated AIR 2,000 - 8,000";
  }

  if (score >= 170) {
    return "Estimated AIR 8,000 - 20,000";
  }

  if (score >= 140) {
    return "Estimated AIR 20,000 - 50,000";
  }

  return "Needs more practice, focus on weak topics";
}

const programLinks = [
  "Two-Year Integrated",
  "Sprint to JEE",
  "Advanced Booster",
  "Foundation (Class 9–10)",
];

function RankPredictor({ dashboardMode = false }: { dashboardMode?: boolean }) {
  const [score, setScore] = useState(dashboardMode ? "248" : "");
  const [prediction, setPrediction] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericScore = Number(score);

    if (!score || Number.isNaN(numericScore)) {
      setPrediction("Enter a valid score out of 300");
      return;
    }

    if (dashboardMode) {
      setPrediction("2,200 - 3,200");
      return;
    }

    const clampedScore = Math.max(0, Math.min(300, numericScore));
    setPrediction(getRankPrediction(clampedScore));
  }

  if (dashboardMode) {
    return (
      <main className="rank-predictor-page dashboard-rank-page">
        <section className="dashboard-rank-hero">
          <p className="dashboard-overline">Rank Predictor</p>
          <h1>
            Know where <em>you stand.</em>
          </h1>
          <p>ML-backed predictions based on past 7 years of cutoffs.</p>
        </section>

        <section className="dashboard-rank-workspace">
          <form className="dashboard-rank-form-card" onSubmit={handleSubmit}>
            <h2>Enter your details</h2>

            <label htmlFor="dashboard-rank-score">Expected marks (out of 360)</label>
            <input
              id="dashboard-rank-score"
              inputMode="numeric"
              max="360"
              min="0"
              onChange={(event) => setScore(event.target.value)}
              type="number"
              value={score}
            />

            <label htmlFor="dashboard-rank-exam">Exam</label>
            <select id="dashboard-rank-exam" defaultValue="JEE Advanced">
              <option>JEE Advanced</option>
              <option>JEE Main</option>
            </select>

            <label htmlFor="dashboard-rank-category">Category</label>
            <select id="dashboard-rank-category" defaultValue="General">
              <option>General</option>
              <option>OBC-NCL</option>
              <option>SC</option>
              <option>ST</option>
              <option>EWS</option>
            </select>

            <label htmlFor="dashboard-rank-difficulty">Paper difficulty</label>
            <select id="dashboard-rank-difficulty" defaultValue="Moderate">
              <option>Easy</option>
              <option>Moderate</option>
              <option>Hard</option>
            </select>

            <button type="submit">Predict My Rank</button>
          </form>

          <article className={`dashboard-rank-result-card ${prediction ? "has-result" : ""}`}>
            <p className="dashboard-overline">
              <TrendingUp size={15} aria-hidden="true" />
              Prediction
            </p>

            {prediction ? (
              <>
                <h2>Predicted AIR</h2>
                <strong>{prediction}</strong>
                <span>Based on General category · JEE Advanced · Moderate paper</span>

                <div className="dashboard-rank-colleges">
                  <h3>
                    <GraduationCap size={18} aria-hidden="true" />
                    Likely Colleges
                  </h3>
                  <div>
                    <span>IIT Bombay — Computer Science</span>
                    <em>Low</em>
                  </div>
                  <div>
                    <span>IIT Delhi — Electrical Eng.</span>
                    <em>Moderate</em>
                  </div>
                  <div>
                    <span>IIT Kanpur — Mechanical Eng.</span>
                    <em>High</em>
                  </div>
                  <div>
                    <span>IIT Roorkee — Chemical Eng.</span>
                    <em>Very High</em>
                  </div>
                </div>
              </>
            ) : (
              <div className="dashboard-rank-empty-state">
                <TrendingUp size={44} aria-hidden="true" />
                <span>Fill the form to see your predicted rank.</span>
              </div>
            )}
          </article>
        </section>

        <footer className="dashboard-footer">
          <span>© 2026 VALLURI™ IIT-JEE. All rights reserved.</span>
          <Link to="/pricing">Premium plans</Link>
        </footer>
      </main>
    );
  }

  return (
    <main className="rank-predictor-page">
      <section className="courses-hero">
        <p className="section-kicker gold-kicker">Rank Predictor</p>
        <h1>Where do you stand today?</h1>
        <p>
          Enter your expected JEE Mains score and our model will estimate your
          All-India Rank band.
        </p>
      </section>

      <section className="page-body">
        <div className="page-inner page-inner-narrow">
          <form className="predictor-form-card" onSubmit={handleSubmit}>
            <label htmlFor="jee-score">Expected JEE Mains score (out of 300)</label>
            <input
              id="jee-score"
              inputMode="numeric"
              max="300"
              min="0"
              onChange={(event) => setScore(event.target.value)}
              placeholder="e.g. 220"
              type="number"
              value={score}
            />
            <button type="submit" className="contact-submit-btn">
              Predict My Rank
            </button>

            {prediction && (
              <div className="predictor-result" role="status">
                <Target size={24} />
                <div>
                  <span>Your rank band</span>
                  <strong>{prediction}</strong>
                </div>
              </div>
            )}
          </form>
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

export default RankPredictor;
