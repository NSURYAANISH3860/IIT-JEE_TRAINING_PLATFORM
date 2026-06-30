import FooterPolicyLinks from "../components/FooterPolicyLinks";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Target, TrendingUp, HelpCircle } from "lucide-react";
import logo from "../assets/logo.png";

interface CollegeSuggestion {
  name: string;
  branch: string;
  chance: "Very High" | "High" | "Moderate" | "Low";
}

interface PredictionResult {
  crlRank: string;
  categoryRank?: string;
  colleges: CollegeSuggestion[];
}

function calculateJEEPrediction(
  score: number,
  exam: string,
  category: string,
  difficulty: string
): PredictionResult {
  // Normalize difficulty multiplier
  let difficultyMultiplier = 1.0;
  if (difficulty === "Easy") {
    difficultyMultiplier = 0.88; // Score is worth less rank
  } else if (difficulty === "Hard") {
    difficultyMultiplier = 1.15; // Score is worth more rank
  }

  const adjustedScore = score * difficultyMultiplier;

  let crlMin = 250000;
  let crlMax = 500000;
  let colleges: CollegeSuggestion[] = [];

  if (exam.includes("Main")) {
    // JEE Main out of 300 marks
    if (adjustedScore >= 280) {
      crlMin = 1;
      crlMax = 100;
    } else if (adjustedScore >= 250) {
      crlMin = 101;
      crlMax = 500;
    } else if (adjustedScore >= 220) {
      crlMin = 501;
      crlMax = 2000;
    } else if (adjustedScore >= 190) {
      crlMin = 2001;
      crlMax = 5000;
    } else if (adjustedScore >= 160) {
      crlMin = 5001;
      crlMax = 12000;
    } else if (adjustedScore >= 130) {
      crlMin = 12001;
      crlMax = 25000;
    } else if (adjustedScore >= 100) {
      crlMin = 25001;
      crlMax = 55000;
    } else if (adjustedScore >= 70) {
      crlMin = 55001;
      crlMax = 110000;
    } else {
      crlMin = 110001;
      crlMax = 250000;
    }

    // Set NIT / IIIT colleges based on CRL Rank
    if (crlMax <= 2000) {
      colleges = [
        { name: "NIT Trichy", branch: "Computer Science & Engineering", chance: "High" },
        { name: "NIT Surathkal", branch: "Computer Science & Engineering", chance: "High" },
        { name: "IIIT Allahabad", branch: "Information Technology", chance: "Very High" },
        { name: "DTU Delhi", branch: "Software Engineering", chance: "Very High" },
      ];
    } else if (crlMax <= 8000) {
      colleges = [
        { name: "NIT Trichy", branch: "Electronics & Communication Eng.", chance: "Moderate" },
        { name: "MNNIT Allahabad", branch: "Computer Science & Engineering", chance: "High" },
        { name: "VNIT Nagpur", branch: "Computer Science & Engineering", chance: "Very High" },
        { name: "IIIT Gwalior", branch: "Integrated B.Tech + M.Tech", chance: "Very High" },
      ];
    } else if (crlMax <= 20000) {
      colleges = [
        { name: "NIT Rourkela", branch: "Mechanical Engineering", chance: "High" },
        { name: "NIT Calicut", branch: "Electrical Engineering", chance: "High" },
        { name: "IIIT Pune", branch: "Computer Science & Engineering", chance: "Moderate" },
        { name: "MNIT Jaipur", branch: "Chemical Engineering", chance: "Very High" },
      ];
    } else if (crlMax <= 55000) {
      colleges = [
        { name: "NIT Jalandhar", branch: "Civil Engineering", chance: "High" },
        { name: "NIT Hamirpur", branch: "Electrical & Electronics Eng.", chance: "High" },
        { name: "IIIT Sri City", branch: "Computer Science & Engineering", chance: "Moderate" },
        { name: "NIT Agartala", branch: "Production Engineering", chance: "Very High" },
      ];
    } else {
      colleges = [
        { name: "NIT Mizoram", branch: "Electronics & Communication Eng.", chance: "High" },
        { name: "IIIT Manipur", branch: "Computer Science & Engineering", chance: "Moderate" },
        { name: "PEC Chandigarh", branch: "Metallurgical Engineering", chance: "Low" },
        { name: "SLIET Longowal", branch: "Mechanical Engineering", chance: "Very High" },
      ];
    }
  } else {
    // JEE Advanced out of 360 marks
    if (adjustedScore >= 300) {
      crlMin = 1;
      crlMax = 100;
    } else if (adjustedScore >= 260) {
      crlMin = 101;
      crlMax = 500;
    } else if (adjustedScore >= 220) {
      crlMin = 501;
      crlMax = 1500;
    } else if (adjustedScore >= 180) {
      crlMin = 1501;
      crlMax = 3500;
    } else if (adjustedScore >= 150) {
      crlMin = 3501;
      crlMax = 7000;
    } else if (adjustedScore >= 120) {
      crlMin = 7001;
      crlMax = 12000;
    } else if (adjustedScore >= 90) {
      crlMin = 12001;
      crlMax = 20000;
    } else if (adjustedScore >= 75) {
      crlMin = 20001;
      crlMax = 30000;
    } else {
      crlMin = 0;
      crlMax = 0; // Not qualified
    }

    // Set IIT colleges based on CRL Rank
    if (crlMax === 0) {
      colleges = [];
    } else if (crlMax <= 500) {
      colleges = [
        { name: "IIT Bombay", branch: "Computer Science & Engineering", chance: "Moderate" },
        { name: "IIT Delhi", branch: "Computer Science & Engineering", chance: "High" },
        { name: "IIT Madras", branch: "Electrical Engineering", chance: "Very High" },
        { name: "IIT Kanpur", branch: "Aerospace Engineering", chance: "Very High" },
      ];
    } else if (crlMax <= 2000) {
      colleges = [
        { name: "IIT Roorkee", branch: "Computer Science & Engineering", chance: "Moderate" },
        { name: "IIT Kharagpur", branch: "Electronics & Electrical Comm. Eng.", chance: "High" },
        { name: "IIT Hyderabad", branch: "Engineering Physics", chance: "High" },
        { name: "IIT BHU (Varanasi)", branch: "Chemical Engineering", chance: "Very High" },
      ];
    } else if (crlMax <= 7000) {
      colleges = [
        { name: "IIT Indore", branch: "Mechanical Engineering", chance: "High" },
        { name: "IIT Ropar", branch: "Electrical Engineering", chance: "High" },
        { name: "IIT Mandi", branch: "Data Science & Artificial Intelligence", chance: "Moderate" },
        { name: "IIT Dhanbad (ISM)", branch: "Petroleum Engineering", chance: "Very High" },
      ];
    } else if (crlMax <= 20000) {
      colleges = [
        { name: "IIT Jammu", branch: "Materials Engineering", chance: "High" },
        { name: "IIT Palakkad", branch: "Civil Engineering", chance: "High" },
        { name: "IIT Dharwad", branch: "Computer Science & Engineering", chance: "Low" },
        { name: "IIT Bhilai", branch: "Mechanical Engineering", chance: "Moderate" },
      ];
    } else {
      colleges = [
        { name: "IIT Palakkad", branch: "Environmental Engineering", chance: "High" },
        { name: "IIT Dharwad", branch: "Civil Engineering", chance: "High" },
        { name: "IIT Jammu", branch: "Chemical Engineering", chance: "Moderate" },
        { name: "IIT Bhilai", branch: "Metallurgical Engineering", chance: "Very High" },
      ];
    }
  }

  // Format CRL Range
  let crlRankStr = "";
  if (crlMax === 0) {
    crlRankStr = "Did not meet estimated cutoff (Qualified rank typically < 30,000)";
  } else {
    crlRankStr = `${crlMin.toLocaleString()} - ${crlMax.toLocaleString()}`;
  }

  // Calculate Category Rank Range if not General
  let categoryRankStr: string | undefined = undefined;
  if (crlMax > 0 && category !== "General") {
    let catMultiplier = 0.27; // OBC-NCL
    if (category === "EWS") catMultiplier = 0.10;
    else if (category === "SC") catMultiplier = 0.15;
    else if (category === "ST") catMultiplier = 0.07;

    const catMin = Math.max(1, Math.round(crlMin * catMultiplier));
    const catMax = Math.max(2, Math.round(crlMax * catMultiplier));
    categoryRankStr = `${catMin.toLocaleString()} - ${catMax.toLocaleString()}`;
  }

  return {
    crlRank: crlRankStr,
    categoryRank: categoryRankStr,
    colleges: colleges,
  };
}

function RankPredictor({ dashboardMode = false }: { dashboardMode?: boolean }) {
  const [score, setScore] = useState(dashboardMode ? "248" : "");
  const [exam, setExam] = useState("JEE Advanced");
  const [category, setCategory] = useState("General");
  const [difficulty, setDifficulty] = useState("Moderate");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericScore = Number(score);
    const maxScore = exam === "JEE Main" ? 300 : 360;

    if (!score || Number.isNaN(numericScore) || numericScore < 0) {
      alert("Please enter a valid positive score.");
      return;
    }

    const clampedScore = Math.min(maxScore, numericScore);
    const result = calculateJEEPrediction(clampedScore, exam, category, difficulty);
    setPrediction(result);
    setHasSubmitted(true);
  }

  if (dashboardMode) {
    return (
      <main className="rank-predictor-page dashboard-rank-page">
        <section className="dashboard-rank-hero">
          <p className="dashboard-overline">Rank Predictor</p>
          <h1>
            Know where <em>you stand.</em>
          </h1>
          <p>ML-backed predictions based on past 7 years of cutoffs and Counselling trends.</p>
        </section>

        <section className="dashboard-rank-workspace">
          <form className="dashboard-rank-form-card" onSubmit={handleSubmit}>
            <h2>Enter your details</h2>

            <label htmlFor="dashboard-rank-exam">Exam Mode</label>
            <select id="dashboard-rank-exam" value={exam} onChange={(e) => setExam(e.target.value)}>
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="JEE Main">JEE Main</option>
            </select>

            <label htmlFor="dashboard-rank-score">
              Expected marks (out of {exam === "JEE Main" ? 300 : 360})
            </label>
            <input
              id="dashboard-rank-score"
              inputMode="numeric"
              max={exam === "JEE Main" ? "300" : "360"}
              min="0"
              onChange={(event) => setScore(event.target.value)}
              type="number"
              value={score}
              placeholder="e.g. 180"
              required
            />

            <label htmlFor="dashboard-rank-category">Category</label>
            <select id="dashboard-rank-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="General">General (Open)</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>

            <label htmlFor="dashboard-rank-difficulty">Paper difficulty</label>
            <select id="dashboard-rank-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>

            <button type="submit">Predict My Rank</button>
          </form>

          <article className={`dashboard-rank-result-card ${hasSubmitted ? "has-result" : ""}`}>
            <p className="dashboard-overline">
              <TrendingUp size={15} aria-hidden="true" />
              Prediction Results
            </p>

            {hasSubmitted && prediction ? (
              <>
                <h2>Predicted CRL Rank</h2>
                <strong style={{ display: "block", fontSize: "2rem", color: "gold", margin: "10px 0" }}>
                  {prediction.crlRank}
                </strong>
                
                {prediction.categoryRank && (
                  <div style={{ margin: "15px 0", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "15px" }}>
                    <p className="dashboard-overline" style={{ color: "lightblue" }}>Predicted Category Rank ({category})</p>
                    <strong style={{ fontSize: "1.6rem", color: "lightblue" }}>{prediction.categoryRank}</strong>
                  </div>
                )}

                <span style={{ fontSize: "0.85rem", opacity: 0.7, display: "block", margin: "5px 0" }}>
                  Based on {category} category · {exam} · {difficulty} difficulty paper.
                </span>

                {prediction.colleges.length > 0 ? (
                  <div className="dashboard-rank-colleges">
                    <h3>
                      <GraduationCap size={18} aria-hidden="true" />
                      Estimated Likely Colleges & Branches
                    </h3>
                    {prediction.colleges.map((college, idx) => (
                      <div key={idx} className="college-list-item" style={{ display: "flex", justifyContent: "space-between", margin: "12px 0", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div>
                          <span style={{ fontWeight: "bold", color: "#fff", display: "block" }}>{college.name}</span>
                          <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>{college.branch}</span>
                        </div>
                        <em style={{ 
                          alignSelf: "center",
                          fontStyle: "normal", 
                          fontSize: "0.8rem", 
                          padding: "3px 8px", 
                          borderRadius: "4px",
                          background: college.chance === "Very High" ? "rgba(46,204,113,0.15)" : college.chance === "High" ? "rgba(52,152,219,0.15)" : college.chance === "Moderate" ? "rgba(241,196,15,0.15)" : "rgba(231,76,60,0.15)",
                          color: college.chance === "Very High" ? "#2ecc71" : college.chance === "High" ? "#3498db" : college.chance === "Moderate" ? "#f1c40f" : "#e74c3c"
                        }}>{college.chance} Chance</em>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(231,76,60,0.05)", padding: "12px", borderRadius: "6px" }}>
                    <HelpCircle size={20} color="#e74c3c" />
                    <span style={{ fontSize: "0.9rem", color: "#e74c3c" }}>We suggest focusing on chapter test revisions to improve cutoff scores.</span>
                  </div>
                )}
              </>
            ) : (
              <div className="dashboard-rank-empty-state">
                <TrendingUp size={44} aria-hidden="true" />
                <span>Fill the form to see your predicted rank and likely JOSAA college matches.</span>
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

  // Public Catalog view
  return (
    <main className="rank-predictor-page">
      <section className="courses-hero">
        <p className="section-kicker gold-kicker">Rank Predictor</p>
        <h1>Where do you stand today?</h1>
        <p>
          Enter your expected score and our model will estimate your Common Rank List (CRL) and Category Rank bands.
        </p>
      </section>

      <section className="page-body">
        <div className="page-inner page-inner-narrow">
          <form className="predictor-form-card" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <label htmlFor="jee-exam">Exam Mode</label>
                <select id="jee-exam" value={exam} onChange={(e) => setExam(e.target.value)} style={{ padding: "10px", borderRadius: "5px", background: "#111", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="JEE Main">JEE Main</option>
                </select>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <label htmlFor="jee-category">Category</label>
                <select id="jee-category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "5px", background: "#111", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}>
                  <option value="General">General</option>
                  <option value="OBC-NCL">OBC-NCL</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <label htmlFor="jee-difficulty">Paper Difficulty</label>
                <select id="jee-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ padding: "10px", borderRadius: "5px", background: "#111", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <label htmlFor="jee-score">Expected Score (out of {exam === "JEE Main" ? 300 : 360})</label>
                <input
                  id="jee-score"
                  inputMode="numeric"
                  max={exam === "JEE Main" ? "300" : "360"}
                  min="0"
                  onChange={(event) => setScore(event.target.value)}
                  placeholder="e.g. 195"
                  type="number"
                  value={score}
                  required
                  style={{ padding: "10px", borderRadius: "5px", background: "#111", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
                />
              </div>
            </div>

            <button type="submit" className="contact-submit-btn" style={{ marginTop: "10px" }}>
              Predict My Rank
            </button>

            {hasSubmitted && prediction && (
              <div className="predictor-result" role="status" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,215,0,0.15)", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  <Target size={24} color="gold" />
                  <strong style={{ fontSize: "1.2rem", color: "#fff" }}>Estimated Rank Bands</strong>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <span style={{ fontSize: "0.85rem", opacity: 0.7, display: "block" }}>Predicted CRL Rank:</span>
                    <strong style={{ fontSize: "1.6rem", color: "gold" }}>{prediction.crlRank}</strong>
                  </div>
                  {prediction.categoryRank && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px" }}>
                      <span style={{ fontSize: "0.85rem", opacity: 0.7, display: "block" }}>Predicted Category ({category}) Rank:</span>
                      <strong style={{ fontSize: "1.4rem", color: "lightblue" }}>{prediction.categoryRank}</strong>
                    </div>
                  )}
                </div>

                {prediction.colleges.length > 0 && (
                  <div style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "15px" }}>
                    <span style={{ fontSize: "0.85rem", opacity: 0.7, display: "block", marginBottom: "10px" }}>Potential College Placements:</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {prediction.colleges.slice(0, 3).map((col, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.01)", padding: "8px 12px", borderRadius: "4px" }}>
                          <span style={{ fontSize: "0.9rem", color: "#fff" }}>{col.name} — {col.branch.split(" ")[0]}</span>
                          <span style={{ fontSize: "0.8rem", color: "gold" }}>{col.chance} Chance</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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

export default RankPredictor;
