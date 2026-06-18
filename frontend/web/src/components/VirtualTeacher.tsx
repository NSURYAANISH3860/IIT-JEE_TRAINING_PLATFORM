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
      title: "Rotational Dynamics - Virtual Explanation",
      explanation:
        "Rotational dynamics deals with the motion of objects rotating about a fixed axis. Just like linear motion has force, mass, and acceleration, rotational motion has torque, moment of inertia, and angular acceleration. The fundamental equation is: τ = Iα, where τ is torque, I is moment of inertia, and α is angular acceleration.",
      examples: [
        "A spinning wheel: When you apply a force to the rim, it rotates about the center. The farther from the center you apply the force, the greater the torque.",
        "A spinning top: Remains upright due to angular momentum conservation.",
        "Earth's rotation: Rotates about its axis completing one rotation every 24 hours.",
      ],
      formulas: [
        "Torque: τ = r × F (cross product)",
        "Moment of Inertia: I = Σ(m·r²)",
        "Angular equation: τ = Iα",
        "Angular momentum: L = Iω",
      ],
      tips: [
        "Always identify the axis of rotation first",
        "Remember that torque depends on both force magnitude and perpendicular distance",
        "Use right-hand rule to determine direction of angular quantities",
      ],
      relatedTopics: ["Circular Motion", "Conservation of Angular Momentum", "Torque"],
    },
    "Modern Physics": {
      title: "Modern Physics - Photoelectric Effect",
      explanation:
        "The photoelectric effect is the emission of electrons from a material when light shines on it. This effect proves that light behaves as particles (photons). When a photon with sufficient energy hits an electron, it transfers its energy, allowing the electron to escape the material.",
      examples: [
        "Solar cells: Convert light energy directly into electrical energy",
        "Image sensors in cameras: Detect light by counting ejected electrons",
        "Night vision goggles: Amplify weak light signals",
      ],
      formulas: [
        "Photon energy: E = hf = hc/λ",
        "Photoelectric equation: hf = Φ + KEmax",
        "Stopping potential: eVs = KEmax",
      ],
      tips: [
        "The threshold frequency determines the minimum energy needed",
        "Increasing light intensity increases current, not kinetic energy",
        "Work function is material-specific",
      ],
      relatedTopics: ["Quantum Theory", "Wave-Particle Duality", "Planck's Constant"],
    },
  },
  Chemistry: {
    "Coordination Compounds": {
      title: "Coordination Compounds - Advanced Concepts",
      explanation:
        "Coordination compounds consist of a central metal atom bonded to ligands (molecules or ions). The ligands donate electron pairs to form coordinate covalent bonds. The coordination number indicates how many ligands surround the central atom, typically 4 or 6.",
      examples: [
        "Hemoglobin: Iron at the center with oxygen-carrying capability",
        "Chlorophyll: Magnesium center in plant photosynthesis",
        "Cisplatin: Cancer treatment drug containing platinum",
      ],
      formulas: [
        "Coordination sphere: [M(L)n]ˣ⁺",
        "Crystal field splitting energy: Δ = E(eg) - E(t2g)",
        "Spectrochemical series: I⁻ < Br⁻ < Cl⁻ < F⁻ < H₂O < NH₃ < CN⁻",
      ],
      tips: [
        "Ligand strength determines splitting magnitude",
        "CFSE (Crystal Field Stabilization Energy) affects stability",
        "Chelate effect explains why multidentate ligands bind strongly",
      ],
      relatedTopics: ["Crystal Field Theory", "Ligand Field Theory", "Oxidation States"],
    },
  },
  Mathematics: {
    "Definite Integration": {
      title: "Definite Integration - Complete Guide",
      explanation:
        "Definite integration calculates the net area between a curve and the x-axis over a specified interval. The fundamental theorem of calculus links differentiation and integration: ∫ₐᵇ f(x)dx = F(b) - F(a), where F is the antiderivative.",
      examples: [
        "Area under a parabola from x=0 to x=3",
        "Volume of revolution around an axis",
        "Work done by a variable force",
      ],
      formulas: [
        "Definite integral: ∫ₐᵇ f(x)dx = F(b) - F(a)",
        "Integration by parts: ∫ u dv = uv - ∫ v du",
        "Substitution: ∫ f(g(x))g'(x)dx = ∫ f(u)du",
        "Power rule: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
      ],
      tips: [
        "Always identify the integration technique needed first",
        "Check limits carefully after substitution",
        "Use LIATE rule for integration by parts",
      ],
      relatedTopics: ["Indefinite Integration", "Differentiation", "Area & Volumes"],
    },
    "Probability": {
      title: "Probability - Advanced Topics",
      explanation:
        "Probability measures the likelihood of an event occurring. Conditional probability, Bayes' theorem, and distributions are crucial concepts. P(A) = (favorable outcomes)/(total outcomes).",
      examples: [
        "Drawing cards from a deck",
        "Rolling dice multiple times",
        "Quality control in manufacturing",
      ],
      formulas: [
        "Probability: P(A) = n(A)/n(S)",
        "Conditional probability: P(A|B) = P(A∩B)/P(B)",
        "Bayes' theorem: P(A|B) = P(B|A)P(A)/P(B)",
        "Binomial probability: P(X=k) = C(n,k)pᵏ(1-p)ⁿ⁻ᵏ",
      ],
      tips: [
        "Identify whether events are independent or dependent",
        "Use tree diagrams for complex scenarios",
        "Remember: P(A) + P(A') = 1",
      ],
      relatedTopics: ["Combinations", "Permutations", "Statistics"],
    },
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
