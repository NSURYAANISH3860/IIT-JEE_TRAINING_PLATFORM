import { useEffect, useState } from "react";
import { X, Pause, Play } from "lucide-react";

interface VirtualTeacherProps {
  subject: string;
  topic: string;
  onClose: () => void;
}

interface TeacherContent {
  title: string;
  explanation: string;
  examples: string[];
  formulas?: string[];
  tips: string[];
  relatedTopics: string[];
}

const topicContent: Record<string, Record<string, TeacherContent>> = {
  Physics: {
    "Rotational Dynamics": {
      title: "Rotational Dynamics - Complete Guide",
      explanation:
        "Rotational dynamics extends translational mechanics to rotating systems using angular coordinates. Just like linear motion has force, mass, and acceleration, rotational motion has torque, moment of inertia, and angular acceleration. The fundamental equation is: τ = Iα.",
      formulas: [
        "Torque Vector: τ = r × F = Iα",
        "Moment of Inertia: I = ∑ m_i · r_i² = ∫ r² dm",
        "Rotational KE: K = 1/2 I ω²",
        "Parallel Axis Theorem: I = I_cm + M d²",
      ],
      examples: [
        "Illustration 1: A uniform disc of mass 2 kg and radius 0.5 m has a force of 4 N applied tangentially at the rim. Calculate angular acceleration. Solution: I = 0.5 * 2 * 0.25 = 0.25 kg m^2. Torque = 4 * 0.5 = 2 N m. α = 2 / 0.25 = 8 rad/s^2.",
        "Illustration 2: Find the ratio of rotational KE to total KE for a solid sphere performing pure rolling. Solution: I = (2/5)MR^2. K_rot = (1/5)Mv^2, K_total = (7/10)Mv^2. Ratio = 2/7.",
        "Real-life Example: Flywheels are used in internal combustion engines to store rotational kinetic energy and smooth out variations in power output.",
      ],
      tips: [
        "Always identify the axis of rotation first.",
        "Use the right-hand rule to find the direction of angular velocity and torque vectors.",
        "In pure rolling, the contact point is instantaneously at rest.",
      ],
      relatedTopics: ["Rolling Motion", "Circular Motion", "Angular Momentum"],
    },
    "Kinematics": {
      title: "Kinematics - Projectiles & 1D Motion",
      explanation:
        "Kinematics describes motion without considering the forces causing it. For constant acceleration, motion is governed by the standard SUVAT equations.",
      formulas: [
        "SUVAT Equations: v = u + at, s = ut + 0.5at², v² = u² + 2as",
        "Max Projectile Height: H = u² sin²θ / 2g",
        "Horizontal Range: R = u² sin(2θ) / g",
        "Time of Flight: T = 2u sinθ / g",
      ],
      examples: [
        "Illustration 1: A particle starts from rest and moves with constant acceleration 4 m/s^2. Find its displacement after 6 seconds. Solution: s = 0 + 0.5 * 4 * 36 = 72 m.",
        "Illustration 2: A ball is projected at 20 m/s at an angle of 30° above the horizontal. Find its maximum height. Solution: H = (20^2 * sin^2 30) / (2 * 10) = 400 * 0.25 / 20 = 5 m.",
        "Real-life Example: Basketball players shoot at specific release angles (typically 45-50 degrees) to optimize the probability of scoring based on projectile trajectory.",
      ],
      tips: [
        "Apply SUVAT formulas only when acceleration is constant.",
        "For variable acceleration, use calculus: v = dx/dt, a = dv/dt = v dv/dx.",
        "Horizontal velocity of a projectile remains constant throughout its flight.",
      ],
      relatedTopics: ["Relative Velocity", "Newton's Laws", "Circular Motion"],
    },
    "Newton's Laws of Motion": {
      title: "Newton's Laws of Motion & Friction",
      explanation:
        "Newton's laws of motion form the bedrock of classical mechanics, defining inertia, forces (F=ma), and action-reaction pairs.",
      formulas: [
        "Second Law: F = m a",
        "Static Friction: f_s ≤ μ_s N",
        "Kinetic Friction: f_k = μ_k N",
        "Incline Normal Force: N = mg cosθ",
      ],
      examples: [
        "Illustration 1: A 10 kg block sits on a rough floor with μ_s = 0.4. If a 30 N horizontal force is applied, find the friction force. Solution: N = 100 N. Max static friction = 40 N. Since 30 N < 40 N, the block remains stationary and static friction adapts to exactly 30 N.",
        "Illustration 2: Two masses (2 kg and 3 kg) are connected by a light string over a pulley. Find acceleration. Solution: a = (3 - 2) * 10 / (3 + 2) = 2 m/s^2.",
        "Real-life Example: Passenger seat belts utilize inertia (Newton's first law) to restrain occupants when a vehicle decelerates suddenly.",
      ],
      tips: [
        "Draw a free-body diagram (FBD) containing all external forces before writing equations.",
        "Friction opposes the relative motion or the tendency of relative motion.",
        "Internal forces always cancel out when treating the entire system as a single entity.",
      ],
      relatedTopics: ["Kinematics", "Work, Power & Energy", "Friction"],
    },
    "Modern Physics": {
      title: "Modern Physics - Photoelectric Effect & Bohr Model",
      explanation:
        "Photoelectric effect establishes light's particle nature via photons. Bohr's model explains hydrogen-like atomic transitions and spectral emissions.",
      formulas: [
        "Photon Energy: E = hf = hc/λ = 1240 / λ(nm) eV",
        "Einstein Equation: K_max = hf - Φ",
        "Stopping Potential: eV_s = K_max",
        "Bohr Orbit Energy: E_n = -13.6 Z²/n² eV",
      ],
      examples: [
        "Illustration 1: A metal with work function 2.0 eV is hit by 400 nm light. Find the stopping potential. Solution: E_photon = 1240/400 = 3.1 eV. K_max = 3.1 - 2.0 = 1.1 eV. V_s = 1.1 V.",
        "Illustration 2: Find the wavelength emitted when an electron in a hydrogen atom jumps from n=3 to n=2. Solution: E_3 = -1.51 eV, E_2 = -3.4 eV. ΔE = 1.89 eV. λ = 1240 / 1.89 = 656 nm.",
        "Real-life Example: Solar photovoltaic panels utilize the photoelectric effect to release electrons from silicon cells when struck by sunlight.",
      ],
      tips: [
        "Never use Celsius in absolute gas laws or radiation formulas; convert to Kelvin first.",
        "Use the shortcut hc = 1240 eV nm to speed up optical calculations.",
        "For Bohr's formulas, ensure the species is hydrogen-like (single-electron).",
      ],
      relatedTopics: ["Nuclear Physics", "Quantum Theory", "Electromagnetism"],
    },
    "Nuclear Physics": {
      title: "Nuclear Physics - Radioactivity & Binding Energy",
      explanation:
        "Nuclear physics deals with nuclear radius, radioactive decay (first-order kinetics), and the energy binding protons and neutrons together.",
      formulas: [
        "Nuclear Radius: R = R₀ A^{1/3} (R₀ ≈ 1.2 fm)",
        "Decay Law: N = N₀ e^{-λ t} = N₀ (1/2)^n",
        "Half-Life: T_{1/2} = 0.693 / λ",
        "Mass Defect: Δm = [Z m_p + (A-Z) m_n] - M_nucleus",
        "Binding Energy: BE = Δm · 931.5 MeV (if Δm is in u)",
      ],
      examples: [
        "Illustration 1: Compare nuclear radii of nuclei with mass numbers 27 and 64. Solution: R1/R2 = (27/64)^{1/3} = 3/4.",
        "Illustration 2: A sample's activity falls to 1/8 of its initial value in 30 minutes. Find its half-life. Solution: 1/8 = (1/2)^3, so 3 half-lives have passed in 30 mins. Half-life = 10 minutes.",
        "Real-life Example: Carbon-14 dating uses the radioactivity decay constant of organic remains to accurately estimate their historical age.",
      ],
      tips: [
        "Nuclear density is approximately constant for all nuclei because volume is proportional to mass number A.",
        "Always subtract background counts before calculation.",
        "Binding energy per nucleon (BE/A) determines nuclear stability, not total binding energy.",
      ],
      relatedTopics: ["Modern Physics", "Quantum Numbers", "X-rays"],
    }
  },
  Chemistry: {
    "Chemical Bonding": {
      title: "Chemical Bonding - Hybridization & Geometry",
      explanation:
        "Chemical bonds form to minimize system potential energy. Hybridization and VSEPR theories predict molecular geometry based on electron pairs.",
      formulas: [
        "Steric Number: (Valence electrons + Monovalent atoms - Charge) / 2",
        "Bond Order: 0.5 * (Bonding electrons - Antibonding electrons)",
      ],
      examples: [
        "Illustration 1: Find the hybridization and shape of BF3. Solution: Boron has 3 valence electrons, monovalents = 3. Steric Number = (3+3)/2 = 3. Hybridization is sp2; shape is trigonal planar.",
        "Illustration 2: Calculate the bond order of O2. Solution: 16 electrons. Bonding = 10, Antibonding = 6. Bond Order = 0.5 * (10 - 6) = 2 (paramagnetic).",
        "Real-life Example: Diamond and graphite are allotropes of carbon with completely different physical properties due to sp3 tetrahedral vs sp2 planar structures.",
      ],
      tips: [
        "Lone pairs occupy more space than bond pairs, causing bond angle compression.",
        "Diatomic configurations for elements up to N2 differ from O2/F2.",
        "High electronegativity difference leads to polar covalent bonds.",
      ],
      relatedTopics: ["Coordination Compounds", "Periodic Table", "Gaseous State"],
    },
    "Coordination Compounds": {
      title: "Coordination Compounds & CFSE",
      explanation:
        "Coordination complexes involve coordinate bonds between a central transition metal and electron-donating ligands.",
      formulas: [
        "Effective Atomic Number (EAN): Z - (Oxidation State) + 2 * (Coordination Number)",
        "CFSE splitting energy relation: Δt ≈ 4/9 Δo",
      ],
      examples: [
        "Illustration 1: Find the oxidation state and coordination number of cobalt in [Co(en)3]Cl3. Solution: en is bidentate, CN = 3 * 2 = 6. Chloride is Cl-, oxidation state = +3.",
        "Illustration 2: Identify magnetic behavior of [Fe(CN)6]3-. Solution: CN- is a strong field ligand, causing pairing in d5 iron, leaving one unpaired electron (paramagnetic).",
        "Real-life Example: Hemoglobin is a vital coordination complex with iron at the center that binds and transports oxygen throughout the human bloodstream.",
      ],
      tips: [
        "Bidentate ligands like oxalate and ethylenediamine count as 2 bonds each.",
        "Strong field ligands like CN- and CO force electron pairing (low spin).",
        "Chelating ligands create highly stable ring structures.",
      ],
      relatedTopics: ["Chemical Bonding", "Transition Elements", "d-Block Chemistry"],
    }
  },
  Mathematics: {
    "Definite Integration": {
      title: "Definite Integration - Theorems & King's Rule",
      explanation:
        "Definite integrals evaluate the net area bounded by a function and the coordinate axes over a specific domain interval.",
      formulas: [
        "Fundamental Theorem: ∫_a^b f(x) dx = F(b) - F(a)",
        "King's Rule: ∫_a^b f(x) dx = ∫_a^b f(a + b - x) dx",
        "Even/Odd rule: ∫_{-a}^a f(x) dx = 0 if odd; 2 ∫_0^a f(x) dx if even",
      ],
      examples: [
        "Illustration 1: Evaluate ∫ from 0 to π/2 of (sin x) / (sin x + cos x) dx. Solution: Apply King's Rule. 2I = ∫ from 0 to π/2 of 1 dx = π/2. Therefore, I = π/4.",
        "Illustration 2: Evaluate ∫ from -1 to 1 of (x^3 + |x|) dx. Solution: x^3 is odd (integrates to 0), |x| is even. Result = 2 * ∫_0^1 x dx = [x^2]_0^1 = 1.",
        "Real-life Example: Engineers use definite integration to calculate the exact work done by variable force systems like gas compression in engine pistons.",
      ],
      tips: [
        "Apply King's Rule first for integrals with complex fractional trigonometric terms.",
        "Check for function symmetry (odd/even) immediately when integration limits are symmetric [-a, a].",
        "Remember to change integration limits when applying substitution.",
      ],
      relatedTopics: ["Indefinite Integration", "Calculus", "Probability"],
    },
    "Probability": {
      title: "Probability & Bayes' Theorem",
      explanation:
        "Probability measures the likelihood of events occurring, moving from simple ratios to conditional situations and distributions.",
      formulas: [
        "Conditional Probability: P(A|B) = P(A ∩ B) / P(B)",
        "Bayes' Theorem: P(A_i|B) = P(B|A_i)P(A_i) / ∑ P(B|A_j)P(A_j)",
        "Independent Events: P(A ∩ B) = P(A) · P(B)",
      ],
      examples: [
        "Illustration 1: If P(A) = 0.5 and P(B) = 0.6 are independent events, find P(A ∩ B). Solution: P(A ∩ B) = 0.5 * 0.6 = 0.3.",
        "Illustration 2: Find probability of getting a sum of 7 when rolling two fair dice. Solution: Favorable outcomes = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Total = 36. P = 6/36 = 1/6.",
        "Real-life Example: Spam filters use Bayes' Theorem to dynamically calculate the probability that an incoming email is spam based on the presence of specific keywords.",
      ],
      tips: [
        "P(A ∪ B) = P(A) + P(B) - P(A ∩ B).",
        "Mutually exclusive events cannot occur simultaneously, meaning P(A ∩ B) = 0.",
        "Independent events are NOT the same as mutually exclusive events.",
      ],
      relatedTopics: ["Combinations & Permutations", "Definite Integration", "Algebra"],
    }
  },
};

function VirtualTeacher({ subject, topic, onClose }: VirtualTeacherProps) {
  const [content, setContent] = useState<TeacherContent | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expandedExample, setExpandedExample] = useState<number | null>(null);

  useEffect(() => {
    const teacherContent = topicContent[subject]?.[topic];
    if (teacherContent) {
      setContent(teacherContent);
      // Optionally start speaking
      speakExplanation(teacherContent.explanation);
    }
  }, [subject, topic]);

  const speakExplanation = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    } else if (content) {
      speakExplanation(content.explanation);
    }
  };

  if (!content) {
    return (
      <div className="virtual-teacher-modal">
        <div className="virtual-teacher-content">
          <button className="virtual-teacher-close" onClick={onClose}>
            <X size={24} />
          </button>
          <p>No content available for {topic}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="virtual-teacher-modal">
      <div className="virtual-teacher-content">
        <button className="virtual-teacher-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="virtual-teacher-header">
          <h2>{content.title}</h2>
          <button
            className={`speech-button ${isSpeaking ? "speaking" : ""}`}
            onClick={toggleSpeech}
          >
            {isSpeaking ? <Pause size={20} /> : <Play size={20} />}
            {isSpeaking ? "Pause" : "Listen"}
          </button>
        </div>

        <div className="virtual-teacher-sections">
          <section className="teacher-section explanation-section">
            <h3>📚 Explanation</h3>
            <p>{content.explanation}</p>
          </section>

          {content.formulas && content.formulas.length > 0 && (
            <section className="teacher-section formulas-section">
              <h3>🧮 Key Formulas</h3>
              <div className="formulas-grid">
                {content.formulas.map((formula, idx) => (
                  <div key={idx} className="formula-card">
                    {formula}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="teacher-section examples-section">
            <h3>💡 Real-World Examples</h3>
            <div className="examples-list">
              {content.examples.map((example, idx) => (
                <div key={idx} className="example-card">
                  <button
                    className="example-header"
                    onClick={() =>
                      setExpandedExample(expandedExample === idx ? null : idx)
                    }
                  >
                    <span className="example-number">Example {idx + 1}</span>
                    <span className="example-toggle">
                      {expandedExample === idx ? "−" : "+"}
                    </span>
                  </button>
                  {expandedExample === idx && (
                    <p className="example-content">{example}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="teacher-section tips-section">
            <h3>⭐ Pro Tips</h3>
            <ul className="tips-list">
              {content.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="teacher-section related-section">
            <h3>🔗 Related Topics</h3>
            <div className="related-topics">
              {content.relatedTopics.map((relatedTopic, idx) => (
                <button key={idx} className="related-topic-tag">
                  {relatedTopic}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="virtual-teacher-actions">
          <button className="btn-primary" onClick={onClose}>
            Close & Practice
          </button>
        </div>
      </div>

      <style>{`
        .virtual-teacher-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .virtual-teacher-content {
          background: white;
          border-radius: 12px;
          max-width: 900px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .virtual-teacher-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          z-index: 10;
        }

        .virtual-teacher-header {
          padding: 30px 30px 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .virtual-teacher-header h2 {
          margin: 0;
          font-size: 24px;
          color: #1a1a1a;
        }

        .speech-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .speech-button:hover {
          background: #4338ca;
        }

        .speech-button.speaking {
          background: #ef4444;
        }

        .virtual-teacher-sections {
          padding: 30px;
        }

        .teacher-section {
          margin-bottom: 30px;
        }

        .teacher-section h3 {
          font-size: 18px;
          margin: 0 0 15px 0;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .explanation-section p {
          line-height: 1.8;
          color: #333;
          font-size: 15px;
          margin: 0;
        }

        .formulas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
        }

        .formula-card {
          background: #f3f4f6;
          padding: 12px 16px;
          border-radius: 8px;
          border-left: 3px solid #4f46e5;
          font-family: "Courier New", monospace;
          font-size: 13px;
          color: #1a1a1a;
        }

        .examples-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .example-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .example-header {
          width: 100%;
          padding: 12px 16px;
          background: #f9fafb;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          transition: all 0.2s;
        }

        .example-header:hover {
          background: #f3f4f6;
        }

        .example-number {
          font-weight: 500;
          color: #1a1a1a;
        }

        .example-toggle {
          color: #4f46e5;
          font-weight: bold;
        }

        .example-content {
          padding: 12px 16px;
          color: #333;
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          background: #fafafa;
        }

        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tips-list li {
          padding: 10px 16px;
          background: #fef3c7;
          border-left: 3px solid #f59e0b;
          border-radius: 4px;
          color: #333;
          font-size: 14px;
        }

        .related-topics {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .related-topic-tag {
          padding: 6px 12px;
          background: #e0e7ff;
          color: #4f46e5;
          border: 1px solid #c7d2fe;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .related-topic-tag:hover {
          background: #c7d2fe;
        }

        .virtual-teacher-actions {
          padding: 20px 30px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-primary {
          padding: 10px 24px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #4338ca;
        }

        @media (max-width: 640px) {
          .virtual-teacher-content {
            max-height: 90vh;
          }

          .virtual-teacher-header {
            flex-direction: column;
            gap: 15px;
          }

          .formulas-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default VirtualTeacher;
