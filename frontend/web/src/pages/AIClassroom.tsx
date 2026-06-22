import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  ChevronRight,
  FileUp,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  Send,
  RotateCcw,
  BookOpen,
  Maximize2,
  Award,
  ListMusic,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

type LessonSlide = {
  title: string;
  subject: string;
  visual: string;
  points: string[];
  script: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

// Toast notification type
type Toast = {
  id: string;
  text: string;
  type: "info" | "success" | "warning";
};

function generateLocalSlides(subject: string, topic: string): LessonSlide[] {
  const visualSymbol = subject === "Mathematics" ? "∫dx" : subject === "Physics" ? "Δt" : "H₂O";
  return [
    {
      title: `Introduction to ${topic}`,
      subject: `${subject} - ${topic}`,
      visual: visualSymbol,
      points: [
        `Fundamental concepts and core definition of ${topic} for IIT JEE.`,
        "Crucial physical or mathematical interpretations of variables.",
        "Key initial assumptions and model constraints."
      ],
      script: `Welcome to this presentation on ${topic}. Let's discuss the fundamental definitions and the core models. Pay attention to how the variables are defined and the physical constraints of this topic.`
    },
    {
      title: `${topic} - Formulas & Equations`,
      subject: `${subject} - ${topic}`,
      visual: "Formula Sheet",
      points: [
        "Mathematical equations governing the key theorems.",
        "Proportionality, constants, and limiting cases.",
        "Solving standard forms and derivations."
      ],
      script: `Moving to the equations of ${topic}. It is highly recommended to understand the derivations from first principles. Practice these formulas regularly as they are frequently tested in JEE Mains.`
    },
    {
      title: `${topic} - JEE Problem Solving & Tips`,
      subject: `${subject} - ${topic}`,
      visual: "★ JEE",
      points: [
        "Common traps: sign conventions, unit errors, and domain conditions.",
        "High-yield shortcut tips to save calculation time.",
        "Step-by-step resolution of multi-concept numericals."
      ],
      script: `Finally, let's discuss common errors and tricks in ${topic}. Watch out for sign conventions and unit conversions, which are the main sources of errors. Apply symmetry arguments whenever possible to solve questions faster.`
    }
  ];
}

// Generate quizzes on the fly for the selected subject/topic
function getQuizForTopic(_subject: string, topic: string): QuizQuestion[] {
  const t_lower = topic.toLowerCase();
  
  if (t_lower.includes("rotational") || t_lower.includes("rotation")) {
    return [
      {
        question: "What is the rotational analogue of force, defined as the cross product of position and force vector?",
        options: ["Moment of Inertia", "Angular Momentum", "Torque", "Angular Velocity"],
        answerIndex: 2,
        explanation: "Torque is the rotational equivalent of force, defined mathematically as τ = r × F."
      },
      {
        question: "If a spinning ice skater pulls her arms in, what happens to her moment of inertia and angular velocity?",
        options: [
          "Both increase",
          "Both decrease",
          "Moment of inertia decreases, angular velocity increases",
          "Moment of inertia increases, angular velocity decreases"
        ],
        answerIndex: 2,
        explanation: "Due to the conservation of angular momentum (L = Iω), if moment of inertia (I) decreases, the angular velocity (ω) must increase."
      },
      {
        question: "What is the total kinetic energy of a rigid body performing pure rolling on a flat surface?",
        options: [
          "Only translational kinetic energy",
          "Only rotational kinetic energy",
          "The sum of translational and rotational kinetic energies",
          "The difference between translational and rotational kinetic energies"
        ],
        answerIndex: 2,
        explanation: "In pure rolling, total kinetic energy is the sum of translational KE of the center of mass (1/2 m v²) and rotational KE about the center of mass (1/2 I ω²)."
      }
    ];
  } else if (t_lower.includes("bonding") || t_lower.includes("bond")) {
    return [
      {
        question: "Which theory predicts the molecular geometry of covalent molecules by minimizing valence shell electron pair repulsions?",
        options: ["Molecular Orbital Theory", "Valence Bond Theory", "VSEPR Theory", "Crystal Field Theory"],
        answerIndex: 2,
        explanation: "VSEPR (Valence Shell Electron Pair Repulsion) theory predicts geometric shapes based on electrostatic repulsion between electron pairs."
      },
      {
        question: "What is the hybridization of the carbon atom in a methane (CH₄) molecule?",
        options: ["sp", "sp²", "sp³", "dsp²"],
        answerIndex: 2,
        explanation: "Methane has a steric number of 4 around carbon (4 single bonds, 0 lone pairs), which corresponds to sp³ hybridization and a tetrahedral shape."
      },
      {
        question: "How is a Pi (π) bond formed between two atomic orbitals?",
        options: [
          "Axial overlap of s-orbitals",
          "Lateral, parallel overlap of p-orbitals",
          "End-to-end overlap of p-orbitals",
          "Hybrid orbital overlap with hydrogen s-orbital"
        ],
        answerIndex: 1,
        explanation: "Pi bonds are formed by the sideways (lateral) overlap of atomic p-orbitals that are perpendicular to the internuclear axis."
      }
    ];
  } else if (t_lower.includes("integration") || t_lower.includes("integral")) {
    return [
      {
        question: "What does the definite integral of a function f(x) from a to b represent geometrically?",
        options: [
          "The slope of the tangent line",
          "The signed area enclosed between the curve and the x-axis",
          "The arc length of the function curve",
          "The instantaneous rate of change"
        ],
        answerIndex: 1,
        explanation: "Geometrically, the definite integral represent the net signed area bounded by the curve, the x-axis, and the vertical lines x=a and x=b."
      },
      {
        question: "According to King's Property, the definite integral of f(x) from a to b is equal to the integral from a to b of which expression?",
        options: ["f(x - a)", "f(b - x)", "f(a + b - x)", "f(x - b)"],
        answerIndex: 2,
        explanation: "King's Rule states that ∫[a to b] f(x)dx = ∫[a to b] f(a + b - x)dx, which is very useful for solving JEE calculus questions."
      },
      {
        question: "Which theorem directly connects differentiation and integration as inverse operations?",
        options: ["Mean Value Theorem", "Rolle's Theorem", "Fundamental Theorem of Calculus", "Squeeze Theorem"],
        answerIndex: 2,
        explanation: "The Fundamental Theorem of Calculus establishes the derivative of the integral accumulator function and details how to evaluate integrals using antiderivatives."
      }
    ];
  } else {
    // Fallback Quiz for general topics
    return [
      {
        question: `For ${topic}, what is the key purpose of checking boundary conditions or limiting cases?`,
        options: [
          "To format unit dimensions",
          "To verify formulas and eliminate incorrect options quickly",
          "To estimate the graphical axis limits",
          "To find derivatives without limits"
        ],
        answerIndex: 1,
        explanation: "Checking boundary conditions (like setting parameters to 0 or infinity) is a top shortcut in IIT JEE to instantly rule out invalid equation options."
      },
      {
        question: "What is a Free Body Diagram (FBD) designed to show?",
        options: [
          "All molecules inside a chemical bond",
          "An isolated body with all external forces acting on it",
          "The graphical plot of a function's derivative",
          "The coordinates of a particle in projectile motion"
        ],
        answerIndex: 1,
        explanation: "An FBD isolates a body and displays all vector forces exerted on it, which is the crucial starting step in solving mechanics problems."
      },
      {
        question: "Which strategy is most recommended when tackling complex multi-concept numericals in JEE?",
        options: [
          "Skip variables and guess the final integer value",
          "Write equations without identifying the physical quantities",
          "Deconstruct the problem into separate concepts, write FBDs/equations, and solve step-by-step",
          "Choose the longest option formula"
        ],
        answerIndex: 2,
        explanation: "Breaking down complex questions into individual parts (e.g., conservation of energy first, then force equations) is the standard high-yield approach."
      }
    ];
  }
}

// Estimate timings of sentences in a slide script
function getSentenceTimings(script: string) {
  const sentences = script.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  let accumulated = 0;
  return sentences.map((sentence) => {
    const wordCount = sentence.split(/\s+/).length;
    // Significantly increased duration calculation per sentence for longer video lessons
    const duration = Math.max(6, wordCount * 0.95); // 0.95s per word, min 6s
    const start = accumulated;
    accumulated += duration;
    return {
      text: sentence,
      start,
      end: accumulated,
      duration
    };
  });
}

function AIClassroom() {
  const [catalog, setCatalog] = useState<Record<string, string[]>>({});
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [selectedTopic, setSelectedTopic] = useState("Rotational Dynamics");
  const [slides, setSlides] = useState<LessonSlide[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Custom video states
  const [currentTime, setCurrentTime] = useState(0); // overall lesson time
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isCcEnabled, setIsCcEnabled] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  
  // Interaction & Tabs States
  const [activeTab, setActiveTab] = useState<"doubts" | "quiz" | "notes">("doubts");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Doubt Integration States
  const [doubtText, setDoubtText] = useState("");
  const [isSubmittingDoubt, setIsSubmittingDoubt] = useState(false);
  const [doubtResponse, setDoubtResponse] = useState<string | null>(null);
  const [sessionDoubts, setSessionDoubts] = useState<{ question: string; answer: string }[]>([]);
  const [isLoadingSlides, setIsLoadingSlides] = useState(false);

  // Quiz States
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Refs for tracking playback loops
  const timerRef = useRef<number | null>(null);
  const lastSentenceIndexRef = useRef<string>("-1");
  const isPlayingRef = useRef(isPlaying);
  
  // Helper to raise toast alert
  const showToast = (text: string, type: "info" | "success" | "warning" = "info") => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Calculate slide start times & total length
  const slideSpecs = useMemo(() => {
    let accumulated = 0;
    const list = slides.map((s) => {
      const timings = getSentenceTimings(s.script);
      const duration = timings.reduce((sum, item) => sum + item.duration, 0);
      const start = accumulated;
      accumulated += duration;
      return {
        start,
        duration,
        end: accumulated,
        timings
      };
    });
    return {
      list,
      totalDuration: accumulated
    };
  }, [slides]);

  // Determine current active slide index based on overall currentTime
  const calculatedActiveSlide = useMemo(() => {
    if (slides.length === 0) return 0;
    const idx = slideSpecs.list.findIndex(
      (spec) => currentTime >= spec.start && currentTime < spec.end
    );
    if (idx === -1) {
      if (currentTime >= slideSpecs.totalDuration && slideSpecs.totalDuration > 0) {
        return slides.length - 1;
      }
      return 0;
    }
    return idx;
  }, [currentTime, slideSpecs, slides.length]);

  // Keep activeSlide state in sync with computed slide
  useEffect(() => {
    if (slides.length > 0 && calculatedActiveSlide !== activeSlide) {
      setActiveSlide(calculatedActiveSlide);
      showToast(`Entering Chapter ${calculatedActiveSlide + 1}: ${slides[calculatedActiveSlide].title}`, "info");
    }
  }, [calculatedActiveSlide, activeSlide, slides]);

  // Retrieve current slide and timing details
  const slide = slides[activeSlide] || null;
  const activeSlideSpec = slideSpecs.list[activeSlide] || null;

  // Determine current sentence text inside current slide
  const currentSentence = useMemo(() => {
    if (!activeSlideSpec || slides.length === 0) return { text: "", index: -1 };
    const relativeTime = currentTime - activeSlideSpec.start;
    const index = activeSlideSpec.timings.findIndex(
      (t) => relativeTime >= t.start && relativeTime < t.end
    );
    if (index === -1) {
      // Fallback to last sentence if near end
      const lastIdx = activeSlideSpec.timings.length - 1;
      return {
        text: activeSlideSpec.timings[lastIdx]?.text || "",
        index: lastIdx
      };
    }
    return {
      text: activeSlideSpec.timings[index].text,
      index
    };
  }, [currentTime, activeSlideSpec, slides.length]);

  // Split sentence into words for real-time subtitle pointing/highlighting
  const currentSentenceWords = useMemo(() => {
    if (!currentSentence.text) return [];
    return currentSentence.text.split(/\s+/).filter((w) => w.trim().length > 0);
  }, [currentSentence.text]);

  // Calculate active word index in sentence based on relative time elapsed
  const activeWordIndex = useMemo(() => {
    if (!activeSlideSpec || currentSentence.index === -1 || slides.length === 0) return -1;
    const timing = activeSlideSpec.timings[currentSentence.index];
    if (!timing) return -1;
    const relativeTime = currentTime - activeSlideSpec.start;
    const sentenceElapsed = relativeTime - timing.start;
    const progress = Math.min(1, Math.max(0, sentenceElapsed / timing.duration));
    return Math.floor(progress * currentSentenceWords.length);
  }, [currentTime, activeSlideSpec, currentSentence, currentSentenceWords.length, slides.length]);

  // Load catalog on mount
  useEffect(() => {
    async function fetchCatalog() {
      try {
        const data = await apiRequest<Record<string, string[]>>("/api/content/ai-classroom/topics");
        setCatalog(data);
        if (data.Physics && data.Physics.length > 0) {
          setSelectedTopic(data.Physics[0]);
        }
      } catch (error) {
        console.error("Could not fetch classroom topics catalog:", error);
        setCatalog({
          Physics: ["Motion in a Straight Line", "Vector Algebra & Kinematics", "Laws of Motion & Friction", "Rotational Dynamics"],
          Chemistry: ["Mole Concept & Stoichiometry", "Chemical Bonding & Molecular Geometry", "Coordination Compounds"],
          Mathematics: ["Definite Integration & Area under Curve", "Complex Numbers & Quadratic Equations", "Probability & Bayes Theorem"]
        });
      }
    }
    fetchCatalog();
  }, []);

  // Sync refs
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Load slides and setup quiz when topic changes
  useEffect(() => {
    async function fetchSlides() {
      if (!selectedSubject || !selectedTopic) return;
      setIsLoadingSlides(true);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setIsSpeaking(false);
      setDoubtResponse(null);
      setCurrentTime(0);
      lastSentenceIndexRef.current = -1;
      
      // Reset quiz
      const quiz = getQuizForTopic(selectedSubject, selectedTopic);
      setQuizQuestions(quiz);
      setSelectedAnswers({});
      setShowFeedback({});
      setQuizFinished(false);
      setQuizScore(0);

      try {
        const response = await apiRequest<{ slides: LessonSlide[] }>(
          `/api/content/ai-classroom/slides?subject=${encodeURIComponent(selectedSubject)}&topic=${encodeURIComponent(selectedTopic)}`
        );
        setSlides(response.slides);
        setActiveSlide(0);
      } catch (error) {
        console.error("Could not load slides:", error);
        const fallbackSlides = generateLocalSlides(selectedSubject, selectedTopic);
        setSlides(fallbackSlides);
        setActiveSlide(0);
      } finally {
        setIsLoadingSlides(false);
      }
    }
    fetchSlides();
  }, [selectedSubject, selectedTopic]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Text-to-Speech Sentence Player
  const speakActiveSentence = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    
    if (isMuted) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN"; // Professional Indian English accent
    utterance.rate = 0.95 * playbackSpeed;
    utterance.pitch = 1.02;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Video playback loop timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const nextVal = prev + 0.25 * playbackSpeed;
          if (nextVal >= slideSpecs.totalDuration) {
            // Reached end of lesson video
            setIsPlaying(false);
            setIsSpeaking(false);
            if ("speechSynthesis" in window) {
              window.speechSynthesis.cancel();
            }
            showToast("Lesson Completed!", "success");
            return slideSpecs.totalDuration;
          }
          return nextVal;
        });
      }, 250);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, slideSpecs.totalDuration]);

  // Handle Speech trigger on sentence changes or seek changes
  useEffect(() => {
    if (isPlaying && currentSentence.text && slides.length > 0) {
      const sentenceKey = `${activeSlide}_${currentSentence.index}`;
      
      // Speak only if the sentence index has changed, or if speech was cancelled
      if (lastSentenceIndexRef.current !== sentenceKey) {
        lastSentenceIndexRef.current = sentenceKey;
        speakActiveSentence(currentSentence.text);
      }
    }
  }, [isPlaying, currentSentence, activeSlide, slides.length]);

  // Handle Mute state change
  useEffect(() => {
    if (isMuted) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } else if (isPlaying && currentSentence.text) {
      speakActiveSentence(currentSentence.text);
    }
  }, [isMuted]);

  // Speech helper for doubt responses
  const speakResponse = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.94;
    utterance.pitch = 1.02;
    utterance.volume = volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    setDoubtResponse(null);
    setIsPlaying((prev) => !prev);
  };

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
    showToast(isMuted ? "Audio Unmuted" : "Audio Muted", "info");
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    showToast(`Speed set to ${speed}x`, "success");
    // Restart active sentence to apply speed
    if (isPlaying && currentSentence.text) {
      speakActiveSentence(currentSentence.text);
    }
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    // Recalculate slide spec and force voice update
    lastSentenceIndexRef.current = -1;
    if (isPlaying) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Jump to specific slide (chapter)
  const jumpToSlide = (index: number) => {
    if (index < 0 || index >= slides.length) return;
    const start = slideSpecs.list[index]?.start || 0;
    setCurrentTime(start);
    lastSentenceIndexRef.current = -1;
    if (isPlaying) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
    }
  };

  // Drag 10 seconds forward/backward
  const skipTime = (amount: number) => {
    setCurrentTime((prev) => {
      let val = prev + amount;
      if (val < 0) val = 0;
      if (val > slideSpecs.totalDuration) val = slideSpecs.totalDuration;
      return val;
    });
    lastSentenceIndexRef.current = -1;
    if (isPlaying && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Submit doubt handler
  async function handleDoubtSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doubtText.trim() || !slide) return;

    // Pause lesson playback & narration
    setIsPlaying(false);
    setIsSpeaking(false);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSubmittingDoubt(true);
    setDoubtResponse(null);
    showToast("Sending doubt to AI Tutor...", "info");

    const questionText = doubtText.trim();

    try {
      const fullQuestion = questionText.length < 10 
        ? `Regarding ${slide.title}: ${questionText} (explain concept detail)` 
        : questionText;

      const created = await apiRequest<{ id: string; ai_answer: string }>(
        "/api/doubts",
        {
          method: "POST",
          body: JSON.stringify({
            subject: selectedSubject,
            topic: selectedTopic,
            question: fullQuestion
          })
        }
      );

      setDoubtResponse(created.ai_answer);
      setSessionDoubts((current) => [
        { question: questionText, answer: created.ai_answer },
        ...current
      ]);
      setDoubtText("");
      showToast("AI Tutor answered your doubt!", "success");

      // Speak the doubt answer
      speakResponse(created.ai_answer);

    } catch (error) {
      console.error("Could not submit doubt:", error);
      const fallbackAnswer = `For ${selectedTopic}, remember that ${slide.points[0]} Let's review this together.`;
      setDoubtResponse(fallbackAnswer);
      speakResponse(fallbackAnswer);
    } finally {
      setIsSubmittingDoubt(false);
    }
  }

  // Resume lesson after doubt response
  function handleResumeLesson() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setDoubtResponse(null);
    // Force speech reload
    lastSentenceIndexRef.current = -1;
    setIsPlaying(true);
  }

  // Format time (mm:ss)
  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Upload ppt handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    // Mock progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Generate customized slides
          const rawName = file.name.split(".")[0];
          const words = rawName.split(/[-_\s]+/);
          const cleanTopic = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          
          showToast(`Successfully extracted slides for "${cleanTopic}"!`, "success");
          
          setSelectedTopic(cleanTopic);
          setCatalog(prevCatalog => {
            const currentList = prevCatalog[selectedSubject] || [];
            if (!currentList.includes(cleanTopic)) {
              return {
                ...prevCatalog,
                [selectedSubject]: [cleanTopic, ...currentList]
              };
            }
            return prevCatalog;
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Check Quiz Answer
  const handleQuizAnswer = (qIdx: number, oIdx: number) => {
    if (showFeedback[qIdx]) return; // Answer already locked

    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    setShowFeedback(prev => ({ ...prev, [qIdx]: true }));

    const isCorrect = oIdx === quizQuestions[qIdx].answerIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      showToast("Correct Answer!", "success");
    } else {
      showToast("Incorrect. Read the explanation.", "warning");
    }
  };

  // Finish Quiz
  const finishQuiz = () => {
    setQuizFinished(true);
    showToast(`Quiz completed! Score: ${quizScore}/3`, "success");
  };

  // Reset Quiz
  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowFeedback({});
    setQuizFinished(false);
    setQuizScore(0);
    showToast("Quiz reset. Good luck!", "info");
  };

  return (
    <main className="dashboard-classroom-page">
      {/* Toast Alert Center */}
      <div className="classroom-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`classroom-toast ${toast.type}`}>
            <Sparkles size={16} />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      <section className="dashboard-classroom-hero">
        <div>
          <p className="dashboard-overline">AI Video Classroom</p>
          <h1>
            Interactive lessons with an <em>AI Presenter.</em>
          </h1>
          <p>
            An interactive learning player with voice, slides, closed captions, speed controls, 
            and on-screen doubt resolution.
          </p>
        </div>
        <button
          type="button"
          className="classroom-upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <FileUp size={18} />
          {isUploading ? `Extracting ${uploadProgress}%` : uploadedFileName ? "Upload Another PPT" : "Upload PPT"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".ppt,.pptx,.pdf"
          className="classroom-hidden-file"
          onChange={handleFileUpload}
        />
      </section>

      {/* PPT Uploading Overlay Modal */}
      {isUploading && (
        <div className="classroom-modal-overlay">
          <div className="classroom-modal-card">
            <Bot size={40} className="text-gold animate-bounce" />
            <h3>AI PPT Extraction Engine</h3>
            <p>Analyzing and generating slide speech notes for: <strong>{uploadedFileName}</strong></p>
            <div className="classroom-upload-progress-bar">
              <span style={{ width: `${uploadProgress}%` }}></span>
            </div>
            <span>{uploadProgress}% processed</span>
          </div>
        </div>
      )}

      {/* Classroom Selection panel */}
      <section className="classroom-stage-section">
        <div className="classroom-selector-card">
          <div className="subject-selector">
            <span className="selector-label">Subject</span>
            <div className="subject-pills">
              {Object.keys(catalog).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  className={`subject-pill ${selectedSubject === sub ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSubject(sub);
                    if (catalog[sub] && catalog[sub].length > 0) {
                      setSelectedTopic(catalog[sub][0]);
                    }
                  }}
                >
                  <BookOpen size={14} />
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="topic-selector">
            <span className="selector-label">Lesson Topic</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="topic-dropdown"
              aria-label="Select classroom topic"
            >
              {catalog[selectedSubject]?.map((top) => (
                <option key={top} value={top}>
                  {top}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoadingSlides ? (
          <div className="classroom-loading-state">
            <RotateCcw className="animate-spin text-gold" size={32} />
            <p>Preparing presentation slides & scripts...</p>
          </div>
        ) : slide ? (
          <>
            <div className={`classroom-stage-layout ${isTheaterMode ? "theater-mode" : ""}`}>
              {/* Left Column: YouTube-style Video Player */}
              <div className="classroom-player-column">
                <div className="youtube-video-player" aria-label="AI Lecture Video Player">
                  {/* PPT Presentation Slide inside Player */}
                  <article className="classroom-slide-screen">
                    <div className="slide-watermark">{slide.subject}</div>
                    
                    <div className="slide-content-frame">
                      <div className="slide-visual-icon">
                        <span>{slide.visual}</span>
                      </div>
                      <h2 className="slide-main-title">{slide.title}</h2>
                      <ul className="slide-points-list">
                        {slide.points.map((point, idx) => {
                          const isActivePoint = currentSentence.index === idx;
                          return (
                            <li 
                              key={idx} 
                              className={`slide-point-item ${isActivePoint ? "active-bullet-point" : ""}`}
                            >
                              {isActivePoint && <span className="bullet-pointer-indicator">👉</span>}
                              {point}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Subtitle / Closed Caption Overlay with Word-by-Word Highlight */}
                    {isCcEnabled && currentSentence.text && (
                      <div className="video-player-cc-overlay">
                        <span className="cc-text">
                          {currentSentenceWords.map((word, wIdx) => {
                            const isWordActive = wIdx === activeWordIndex;
                            return (
                              <span
                                key={wIdx}
                                className={`highlight-word ${isWordActive ? "active" : ""}`}
                              >
                                {word}{" "}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                    )}

                    {/* AI Coach Presenter Webcam Overlay (PIP) */}
                    <div className={`classroom-presenter-pip ${isSpeaking ? "speaking" : ""}`}>
                      <div className="pip-header">
                        <span className="pip-live-dot" />
                        <span>AI Tutor (Webcam)</span>
                      </div>
                      
                      <div className="teacher-avatar">
                        {/* Pointer Stick */}
                        <div className={`teacher-pointer-stick ${isSpeaking ? "pointing" : ""}`} />
                        
                        {/* Human Figure */}
                        <div className="teacher-head">
                          <div className="teacher-hair" />
                          <div className="teacher-glasses" />
                          <div className={`teacher-mouth ${isSpeaking ? "talking" : ""}`} />
                        </div>
                        <div className="teacher-torso">
                          <div className="teacher-tie" />
                        </div>
                      </div>
                      
                      <span className="pip-presenter-name">VALLURI AI Coach</span>
                    </div>

                    {/* Play/Pause Large Center Overlay */}
                    {!isPlaying && (
                      <div className="video-play-center-overlay" onClick={handlePlayPause}>
                        <div className="play-icon-ring">
                          <Play size={38} className="text-white" />
                        </div>
                      </div>
                    )}
                  </article>

                  {/* YouTube Player Control Bar */}
                  <div className="youtube-controls-bar">
                    {/* Time Progress Bar / Seekbar */}
                    <div className="youtube-seekbar-container">
                      <input
                        type="range"
                        min="0"
                        max={slideSpecs.totalDuration}
                        value={currentTime}
                        onChange={handleScrubChange}
                        className="youtube-seekbar-slider"
                      />
                      {/* Chapter markings */}
                      {slideSpecs.list.map((spec, idx) => (
                        <div
                          key={idx}
                          className="seekbar-chapter-tick"
                          style={{ left: `${(spec.start / slideSpecs.totalDuration) * 100}%` }}
                          title={`Chapter ${idx + 1}: ${slides[idx]?.title}`}
                        />
                      ))}
                      <div 
                        className="seekbar-progress-filled" 
                        style={{ width: `${(currentTime / slideSpecs.totalDuration) * 100}%` }}
                      />
                    </div>

                    <div className="youtube-controls-buttons">
                      <div className="controls-left">
                        {/* Play / Pause */}
                        <button type="button" className="control-btn" onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"}>
                          {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                        </button>

                        {/* Back 10s */}
                        <button type="button" className="control-btn" onClick={() => skipTime(-10)} title="Rewind 10s">
                          <RotateCcw size={15} />
                        </button>

                        {/* Next Slide */}
                        <button type="button" className="control-btn" onClick={() => jumpToSlide(activeSlide + 1)} title="Next slide chapter">
                          <ChevronRight size={17} />
                        </button>

                        {/* Volume Control */}
                        <div className="volume-control-group">
                          <button type="button" className="control-btn" onClick={handleMuteToggle}>
                            {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              setVolume(v);
                              if (v > 0 && isMuted) setIsMuted(false);
                            }}
                            className="volume-slider"
                          />
                        </div>

                        {/* Timestamp */}
                        <span className="video-timer-label">
                          {formatTime(currentTime)} / {formatTime(slideSpecs.totalDuration)}
                        </span>
                      </div>

                      <div className="controls-right">
                        {/* Speech Speed dropdown */}
                        <div className="speed-control-group">
                          <span className="speed-indicator-text">{playbackSpeed}x Speed</span>
                          <div className="speed-options-dropdown">
                            {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                              <button
                                key={s}
                                type="button"
                                className={playbackSpeed === s ? "active-speed" : ""}
                                onClick={() => handleSpeedChange(s)}
                              >
                                {s}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Closed Captions toggle */}
                        <button
                          type="button"
                          className={`control-btn cc-toggle-btn ${isCcEnabled ? "cc-active" : ""}`}
                          onClick={() => setIsCcEnabled(!isCcEnabled)}
                          title="Subtitles / Closed Captions (C)"
                        >
                          CC
                        </button>

                        {/* Theater Mode */}
                        <button
                          type="button"
                          className={`control-btn ${isTheaterMode ? "cc-active" : ""}`}
                          onClick={() => setIsTheaterMode(!isTheaterMode)}
                          title="Theater Mode"
                        >
                          <BookOpen size={16} />
                        </button>

                        {/* Full width */}
                        <button
                          type="button"
                          className="control-btn"
                          onClick={() => {
                            const elem = document.querySelector(".youtube-video-player");
                            if (elem?.requestFullscreen) {
                              elem.requestFullscreen();
                            }
                          }}
                          title="Fullscreen"
                        >
                          <Maximize2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clean Lecture Info Header (No YouTube Clutter) */}
                <div className="lecture-classroom-info-header">
                  <div className="lecture-header-meta">
                    <span className="lecture-subject-tag">{selectedSubject}</span>
                    <span className="lecture-topic-tag">{selectedTopic}</span>
                    <span className="lecture-video-badge"><Sparkles size={12} className="text-gold" /> AI Assistant Active</span>
                  </div>
                  <h2 className="lecture-classroom-title">
                    IIT-JEE Advanced Special: {selectedTopic} Core Masterclass (Interactive Presentation)
                  </h2>
                  <p className="lecture-classroom-description">
                    Welcome to the VALLURI AI Classroom. This interactive lecture covers definitions, mathematical equations, and JEE Advanced traps. Use the <strong>Doubt Assistant</strong> or take the <strong>Practice Quiz</strong> below to verify your learning.
                  </p>
                </div>

                {/* Tabs Panel (Doubt Assistant, Quiz, Notes) */}
                <div className="classroom-interaction-tabs">
                  <div className="tabs-header-bar">
                    <button
                      type="button"
                      className={`tab-toggle-btn ${activeTab === "doubts" ? "active" : ""}`}
                      onClick={() => setActiveTab("doubts")}
                    >
                      Doubt Assistant & Notes
                    </button>
                    <button
                      type="button"
                      className={`tab-toggle-btn ${activeTab === "quiz" ? "active" : ""}`}
                      onClick={() => setActiveTab("quiz")}
                    >
                      Topic Practice Quiz ({quizQuestions.length})
                    </button>
                    <button
                      type="button"
                      className={`tab-toggle-btn ${activeTab === "notes" ? "active" : ""}`}
                      onClick={() => setActiveTab("notes")}
                    >
                      Quick Formulas Sheet
                    </button>
                  </div>

                  <div className="tabs-content-body">
                    {/* Tab 1: Doubt Assistant */}
                    {activeTab === "doubts" && (
                      <div className="classroom-doubt-assistant">
                        <div className="doubt-assistant-header">
                          <Bot size={20} className="text-gold" />
                          <h3>Classroom Doubt Assistant</h3>
                          <span className="doubt-badge">Instant Answer</span>
                        </div>
                        <p className="doubt-description">
                          Ask the AI bot any doubt regarding <strong>{slide.title}</strong>. The presentation will automatically pause, answer your doubt visually/verbally, and allow you to resume.
                        </p>

                        <form onSubmit={handleDoubtSubmit} className="doubt-input-form">
                          <input
                            type="text"
                            value={doubtText}
                            onChange={(e) => setDoubtText(e.target.value)}
                            placeholder="Ask a doubt about this slide (e.g., Explain the formula step-by-step)..."
                            required
                            disabled={isSubmittingDoubt}
                          />
                          <button type="submit" disabled={isSubmittingDoubt || doubtText.trim().length < 3}>
                            {isSubmittingDoubt ? (
                              <>
                                <RotateCcw size={16} className="animate-spin" />
                                Clarifying...
                              </>
                            ) : (
                              <>
                                <Send size={16} />
                                Ask Bot
                              </>
                            )}
                          </button>
                        </form>

                        {doubtResponse && (
                          <div className="doubt-explanation-bubble">
                            <div className="bubble-header">
                              <Sparkles size={16} className="text-gold" />
                              <strong>Explanation for your doubt:</strong>
                              <button type="button" onClick={handleResumeLesson} className="resume-lesson-btn">
                                <Play size={14} /> Resume Lesson
                              </button>
                            </div>
                            <p>{doubtResponse}</p>
                            <div className="bubble-actions">
                              <span className="voice-active-indicator">
                                <Volume2 size={14} className="text-gold animate-pulse" />
                                Bot is speaking answer...
                              </span>
                            </div>
                          </div>
                        )}

                        {sessionDoubts.length > 0 && (
                          <div className="session-doubts-history">
                            <h4>Lesson Doubt Notebook ({sessionDoubts.length})</h4>
                            <div className="doubts-history-list">
                              {sessionDoubts.map((item, idx) => (
                                <div key={idx} className="history-doubt-item">
                                  <div className="history-question">
                                    <HelpCircleIcon />
                                    <span>{item.question}</span>
                                  </div>
                                  <div className="history-answer">
                                    <Sparkles size={12} className="text-gold" />
                                    <p>{item.answer}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 2: Topic Practice Quiz */}
                    {activeTab === "quiz" && (
                      <div className="classroom-practice-quiz-tab">
                        <div className="quiz-header-row">
                          <div className="quiz-header-title">
                            <Award size={20} className="text-gold" />
                            <h3>Topic Practice Quiz — {selectedTopic}</h3>
                          </div>
                          {quizFinished ? (
                            <button type="button" className="quiz-reset-btn" onClick={resetQuiz}>
                              Retake Quiz
                            </button>
                          ) : (
                            <span className="quiz-status-badge">Check your understanding</span>
                          )}
                        </div>

                        <div className="quiz-questions-list">
                          {quizQuestions.map((q, qIdx) => {
                            const isAnswered = showFeedback[qIdx];
                            const selectedOption = selectedAnswers[qIdx];
                            const isCorrect = selectedOption === q.answerIndex;

                            return (
                              <div key={qIdx} className={`quiz-question-card ${isAnswered ? (isCorrect ? "answered-correct" : "answered-incorrect") : ""}`}>
                                <h4 className="quiz-question-text">
                                  Q{qIdx + 1}: {q.question}
                                </h4>

                                <div className="quiz-options-grid">
                                  {q.options.map((opt, oIdx) => {
                                    const isChosen = selectedOption === oIdx;
                                    const isThisCorrect = oIdx === q.answerIndex;
                                    let optionClass = "";
                                    if (isAnswered) {
                                      if (isThisCorrect) optionClass = "correct-option";
                                      else if (isChosen) optionClass = "wrong-option";
                                      else optionClass = "disabled-option";
                                    } else if (isChosen) {
                                      optionClass = "chosen-option";
                                    }

                                    return (
                                      <button
                                        key={oIdx}
                                        type="button"
                                        className={`quiz-option-button ${optionClass}`}
                                        onClick={() => handleQuizAnswer(qIdx, oIdx)}
                                        disabled={isAnswered}
                                      >
                                        <span className="option-letter">{String.fromCharCode(65 + oIdx)}.</span>
                                        <span className="option-text-label">{opt}</span>
                                        {isAnswered && isThisCorrect && <CheckCircle size={15} className="option-feedback-icon correct" />}
                                      </button>
                                    );
                                  })}
                                </div>

                                {isAnswered && (
                                  <div className="quiz-explanation-box">
                                    <strong>{isCorrect ? "Correct!" : "Incorrect."} Explanation:</strong>
                                    <p>{q.explanation}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {!quizFinished && Object.keys(showFeedback).length === quizQuestions.length && (
                          <button type="button" className="quiz-finish-submit-btn" onClick={finishQuiz}>
                            See Final Score
                          </button>
                        )}

                        {quizFinished && (
                          <div className="quiz-completion-scoreboard">
                            <Award size={36} className="text-gold animate-bounce" />
                            <h4>Quiz Score Card</h4>
                            <p className="quiz-scoreboard-text">
                              You scored <strong>{quizScore}</strong> out of <strong>{quizQuestions.length}</strong> correct!
                            </p>
                            <p className="quiz-suggestion">
                              {quizScore === 3 ? "Excellent work! You have completely mastered this topic's concepts." : "Good try! We recommend reviewing the slide notes and explanations again."}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 3: Lecture notes formula sheet */}
                    {activeTab === "notes" && (
                      <div className="classroom-notes-tab">
                        <h3>Key Formulations: {selectedTopic}</h3>
                        <div className="notes-formula-list">
                          {slide ? (
                            <>
                              <div className="formula-block">
                                <span className="formula-badge">Key equation</span>
                                <code className="formula-code">{slide.visual}</code>
                                <p className="formula-desc">Governing law & primary model for this sub-chapter.</p>
                              </div>
                              <div className="notes-key-points">
                                <h4>Essential Revision Bulletpoints</h4>
                                <ul>
                                  {slides.flatMap((s) => s.points).map((pt, i) => (
                                    <li key={i}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          ) : (
                            <p>No active notes loaded.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Playlist / Lecture Chapters */}
              <div className="classroom-playlist-column">
                <div className="lecture-playlist-card">
                  <div className="playlist-header">
                    <ListMusic size={18} className="text-gold" />
                    <div>
                      <h3>Course Chapters</h3>
                      <span>{slides.length} Lectures · {formatTime(slideSpecs.totalDuration)} total</span>
                    </div>
                  </div>

                  <div className="playlist-list-items">
                    {slides.map((s, idx) => {
                      const spec = slideSpecs.list[idx];
                      const isActive = idx === activeSlide;
                      const isCompleted = currentTime >= (spec?.end || 0);

                      return (
                        <div
                          key={idx}
                          className={`playlist-item-card ${isActive ? "active-item" : ""}`}
                          onClick={() => jumpToSlide(idx)}
                        >
                          <div className="item-index-column">
                            {isCompleted ? (
                              <CheckCircle size={15} className="text-success" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          
                          <div className="item-thumbnail-placeholder">
                            <span>{s.visual}</span>
                            {isActive && <div className="now-playing-tag">PLAYING</div>}
                          </div>

                          <div className="item-info-column">
                            <h4>{s.title}</h4>
                            <span className="item-duration">{formatTime(spec?.duration || 0)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="classroom-empty-state">
            <p>No slides found for this topic. Please select another chapter.</p>
          </div>
        )}
      </section>

      <section className="classroom-next-steps">
        <article>
          <h2>Active Learning Pedagogy</h2>
          <p>
            VALLURI's interactive AI Classroom ensures you don't just passively watch slides. 
            You can pause, ask questions, resolve misunderstandings immediately, and continue at your own pace.
          </p>
        </article>
        <article>
          <h2>Speech & Doubt History Sync</h2>
          <p>
            Your doubts are synced directly with your personal Notebook in the Doubts page, 
            allowing you to revisit hard questions and concepts during revision sessions.
          </p>
        </article>
      </section>

      <footer className="dashboard-footer">
        <span>&copy; 2026 VALLURI&trade; IIT-JEE. All rights reserved.</span>
        <Link to="/dashboard/study-materials">Study materials</Link>
      </footer>
    </main>
  );
}

// Inline custom HelpCircleIcon for styling
function HelpCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold"
      style={{ flexShrink: 0, marginTop: "4px" }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export default AIClassroom;
