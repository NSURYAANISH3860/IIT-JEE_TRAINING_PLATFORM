import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import FooterPolicyLinks from "../components/FooterPolicyLinks";
import {
  BookOpen,
  ClipboardList,
  Download,
  FileText,
  NotebookPen,
  ScrollText,
  Video,
  X,
  CheckCircle,
  Loader2,
  Eye,
  Printer,
  ZoomIn,
  ZoomOut,
  Sparkles,
} from "lucide-react";
import logo from "../assets/logo.png";

const programLinks = [
  "Two-Year Integrated",
  "Sprint to JEE",
  "Advanced Booster",
  "Foundation (Class 9–10)",
];

type ResourceFile = {
  name: string;
  size: string;
  type: string;
  subject: "Physics" | "Chemistry" | "Mathematics";
  title: string;
  theory: string[];
  formulas: string[];
  solvedProblem: {
    question: string;
    solution: string;
  };
};

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

// Rich structured data mapped to the JEE Advanced 2026 Syllabus
const structuredResources: Record<string, ResourceFile[]> = {
  "Concept Modules": [
    // Physics
    {
      name: "Physics_Rotational_Dynamics_Module.pdf",
      size: "4.8 MB",
      type: "PDF Module",
      subject: "Physics",
      title: "Rotational Dynamics: Torque & Angular Acceleration",
      theory: [
        "Rotational dynamics extends translational mechanics to rotating systems using angular coordinates.",
        "Torque (τ) acts as the rotational counterpart to force, causing angular acceleration.",
        "Moment of Inertia (I) defines a body's resistance to rotational changes about a specific axis."
      ],
      formulas: [
        "Torque Vector: τ = r × F = dL/dt",
        "Rotational Second Law: τ_net = I · α",
        "Moment of Inertia (General): I = ∑ m_i · r_i² = ∫ r² dm",
        "Parallel Axis Theorem: I = I_cm + M · d²"
      ],
      solvedProblem: {
        question: "Find the torque required to accelerate a uniform cylinder of mass 10 kg and radius 0.5 m from rest to 12 rad/s in 4 seconds.",
        solution: "1. Calculate Moment of Inertia (disc/cylinder): I = 0.5 · M · R² = 0.5 · 10 · 0.25 = 1.25 kg·m².\n2. Compute Angular Acceleration: α = Δω / Δt = (12 - 0) / 4 = 3 rad/s².\n3. Apply Newton's Rotational Law: τ = I · α = 1.25 · 3 = 3.75 N·m."
      }
    },
    {
      name: "Physics_Newton_Laws_of_Motion.pdf",
      size: "3.6 MB",
      type: "PDF Module",
      subject: "Physics",
      title: "Laws of Motion & Static Friction Constraints",
      theory: [
        "Newton's First Law defines inertial reference frames where acceleration is zero if net force is zero.",
        "Newton's Second Law describes the rate of change of momentum: F = dp/dt.",
        "Static friction represents an adaptive self-adjusting constraint force bounded by μ_s · Normal."
      ],
      formulas: [
        "Newton's Second Law: F = m · a (if mass is constant)",
        "Static Friction Constraint: f_s ≤ μ_s · N",
        "Kinetic Friction: f_k = μ_k · N"
      ],
      solvedProblem: {
        question: "A block of mass 5 kg is placed on a rough horizontal surface with μ_s = 0.6. A horizontal force of 20 N is applied. Find the friction force acting on it.",
        solution: "1. Find Normal force: N = m · g = 5 · 9.8 = 49 N.\n2. Calculate Maximum Static Friction: f_s_max = μ_s · N = 0.6 · 49 = 29.4 N.\n3. Compare applied force: Since F_applied (20 N) < f_s_max (29.4 N), the block remains at rest.\n4. Conclusion: Friction force adapts to equal the applied force, f_s = 20 N."
      }
    },
    {
      name: "Physics_Vernier_ScrewGauge_Module.pdf",
      size: "3.2 MB",
      type: "PDF Module",
      subject: "Physics",
      title: "Experimental Physics: Vernier Calipers & Screw Gauge",
      theory: [
        "Vernier calipers and screw gauges are precision measuring instruments used in laboratories.",
        "Least count is the smallest measurable quantity by the instrument.",
        "Zero error correction must be applied: positive error is subtracted, negative error is added."
      ],
      formulas: [
        "Vernier Least Count: LC = 1 MSD - 1 VSD",
        "Screw Gauge Least Count: LC = Pitch / divisions",
        "Correct Reading = Observed Reading - Zero Error"
      ],
      solvedProblem: {
        question: "A caliper has 1 MSD = 1 mm. 20 Vernier divisions coincide with 16 main-scale divisions. Find least count.",
        solution: "1. 20 VSD = 16 MSD => 1 VSD = 0.8 MSD.\n2. LC = 1 MSD - 1 VSD = 1.0 mm - 0.8 mm = 0.2 mm."
      }
    },
    {
      name: "Physics_Kinematics_Projectiles.pdf",
      size: "4.1 MB",
      type: "PDF Module",
      subject: "Physics",
      title: "Kinematics, Projectile Motion & Circular Motion",
      theory: [
        "Kinematics details position, velocity, and acceleration without considering forces.",
        "Projectile motion is 2D motion under constant downward acceleration g.",
        "Circular motion contains centripetal acceleration changing velocity direction."
      ],
      formulas: [
        "v = u + at, s = ut + 0.5at²",
        "H = u² sin²θ / 2g, R = u² sin(2θ) / g",
        "Centripetal acceleration: a_c = v²/r = ω²r"
      ],
      solvedProblem: {
        question: "A stone is thrown horizontally from a 45 m high building with speed 20 m/s. Find horizontal range.",
        solution: "1. Vertical time of flight: h = 0.5gt² => 45 = 5t² => t = 3 s.\n2. Range = u_x * t = 20 * 3 = 60 m."
      }
    },
    {
      name: "Physics_Electromagnetism_Galvanometer_AC.pdf",
      size: "5.5 MB",
      type: "PDF Module",
      subject: "Physics",
      title: "Electromagnetism: Moving Coil Galvanometer, AC & LCR",
      theory: [
        "A galvanometer converts current to deflection. Shunts convert it to ammeters.",
        "AC circuits contain varying voltage and current. Inductors and capacitors create frequency-dependent reactance.",
        "Resonance occurs in LCR circuits when inductive and capacitive reactances cancel."
      ],
      formulas: [
        "Galvanometer equilibrium: N B I A = k θ",
        "Resonant frequency: ω_0 = 1 / sqrt(L C)",
        "AC Impedance: Z = sqrt(R² + (X_L - X_C)²)"
      ],
      solvedProblem: {
        question: "A galvanometer has resistance 30 ohm and full-scale current 2 mA. Convert to 1 A ammeter.",
        solution: "1. Parallel voltage: I_g * G = (I - I_g) * S.\n2. Substitute: 0.002 * 30 = (1 - 0.002) * S.\n3. Solve: S = 0.060 / 0.998 = 0.060 ohm."
      }
    },
    // Chemistry
    {
      name: "Chemistry_Chemical_Bonding_MOT.pdf",
      size: "5.2 MB",
      type: "PDF Module",
      subject: "Chemistry",
      title: "Chemical Bonding & Molecular Orbital Theory (MOT)",
      theory: [
        "Molecular Orbital Theory represents bonding by combining atomic wavefunctions into delocalized molecular orbitals.",
        "Bonding molecular orbitals stabilize the system (lower energy), while antibonding orbitals destabilize it (higher energy).",
        "Bond order indicates relative bond strength, length, and stability."
      ],
      formulas: [
        "Bond Order = 0.5 · (N_bonding - N_antibonding)",
        "Diatomic species configuration order (≤ N₂): σ1s < σ*1s < σ2s < σ*2s < (π2p_x = π2p_y) < σ2p_z < (π*2p_x = π*2p_y) < σ*2p_z"
      ],
      solvedProblem: {
        question: "Calculate the bond order and determine the magnetic behavior of O₂ (diatomic oxygen).",
        solution: "1. Total electrons in O₂ = 16.\n2. MO Configuration: σ1s² σ*1s² σ2s² σ*2s² σ2p_z² (π2p_x² = π2p_y²) (π*2p_x¹ = π*2p_y¹).\n3. Count electrons: N_bonding = 10, N_antibonding = 6.\n4. Compute Bond Order: BO = 0.5 · (10 - 6) = 2.\n5. Magnetism: Contains 2 unpaired electrons in antibonding π* orbitals, making O₂ Paramagnetic."
      }
    },
    // Mathematics
    {
      name: "Mathematics_Definite_Integration_Kings_Rule.pdf",
      size: "6.1 MB",
      type: "PDF Module",
      subject: "Mathematics",
      title: "Definite Integration & Area Under Curves",
      theory: [
        "Definite integrals calculate the signed area enclosed by a function curve and the coordinate axis.",
        "Riemann Sum limits form the theoretical basis of converting summation series into definite integrals.",
        "Symmetry properties allow rapid simplification of complex trigonometric and algebraic integrands."
      ],
      formulas: [
        "King's Rule: ∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx",
        "Odd/Even symmetry: ∫[-a to a] f(x) dx = 2·∫[0 to a] f(x) dx (if even), or 0 (if odd)",
        "Area between curves: Area = ∫[a to b] |f(x) - g(x)| dx"
      ],
      solvedProblem: {
        question: "Evaluate the integral I = ∫[0 to π/2] (sin(x) / (sin(x) + cos(x))) dx.",
        solution: "1. Apply King's Rule: I = ∫[0 to π/2] (sin(π/2 - x) / (sin(π/2 - x) + cos(π/2 - x))) dx = ∫[0 to π/2] (cos(x) / (cos(x) + sin(x))) dx.\n2. Add the two integrals: 2I = ∫[0 to π/2] ((sin(x) + cos(x)) / (sin(x) + cos(x))) dx = ∫[0 to π/2] 1 dx = [x][0 to π/2] = π/2.\n3. Solve for I: I = π/4."
      }
    }
  ],
  "Formula Sheets": [
    {
      name: "Physics_Mechanics_Formulas_Summary.pdf",
      size: "1.2 MB",
      type: "Cheat Sheet",
      subject: "Physics",
      title: "IIT-JEE Mechanics Core Formula Cheat Sheet",
      theory: [
        "Complete kinematics, circular motion, work-energy, momentum, rotational dynamics, and SHM summary."
      ],
      formulas: [
        "Kinematic equations: v = u + at, s = ut + 0.5at², v² = u² + 2as",
        "Work Energy Theorem: W_net = ΔK = K_final - K_initial",
        "Elastic Collision velocity: v₁' = [(m₁ - m₂)/(m₁ + m₂)]·v₁ + [2m₂/(m₁ + m₂)]·v₂",
        "SHM frequency: ω = √(k/m)"
      ],
      solvedProblem: {
        question: "Find the work done by a variable force F = 3x² + 2x in moving a particle from x = 0 to x = 2 meters.",
        solution: "1. Apply integral work definition: W = ∫ F dx = ∫[0 to 2] (3x² + 2x) dx.\n2. Integrate: ∫ (3x² + 2x) dx = [x³ + x²] evaluated from 0 to 2.\n3. Calculate values: (2³ + 2²) - (0³ + 0²) = 8 + 4 = 12 Joules."
      }
    },
    {
      name: "Chemistry_Organic_Reactions_Map.pdf",
      size: "2.1 MB",
      type: "Cheat Sheet",
      subject: "Chemistry",
      title: "Organic Chemistry GOC & Core Named Reactions",
      theory: [
        "Comprehensive organic reaction maps covering elimination, nucleophilic substitutions, and standard condensation reactions."
      ],
      formulas: [
        "Inductive effect strength: -I: -NO₂ > -CN > -COOH > -F > -Cl > -Br > -I",
        "Nucleophilic Substitution: S_N1 (Rate = k[R-X], carbocation intermediate) vs S_N2 (Rate = k[R-X][Nu], concerted transition state)",
        "Aldol Condensation requirement: Presence of α-hydrogen with dilute base"
      ],
      solvedProblem: {
        question: "Predict the product of Aldol Condensation of Acetaldehyde (CH₃CHO) in the presence of dilute NaOH followed by heating.",
        solution: "1. Base abstracts α-hydrogen to form enolate ion: [CH₂CHO]⁻.\n2. Enolate nucleophilically attacks another acetaldehyde carbonyl: CH₃-CH(OH)-CH₂-CHO (β-hydroxybutyraldehyde).\n3. Heating causes dehydration: elimination of H₂O yields Crotonaldehyde (CH₃-CH=CH-CHO)."
      }
    },
    {
      name: "Mathematics_Calculus_Cheat_Sheet.pdf",
      size: "1.5 MB",
      type: "Cheat Sheet",
      subject: "Mathematics",
      title: "Calculus (Limits, Derivatives & Integration) Formula Map",
      theory: [
        "Full list of derivatives, standard indefinite integrals, and differentiability limits for JEE Advanced."
      ],
      formulas: [
        "Leibniz Rule: d/dx [∫[g(x) to h(x)] f(t) dt] = f(h(x)) · h'(x) - f(g(x)) · g'(x)",
        "Indefinite integral: ∫ sec(x) dx = ln|sec(x) + tan(x)| + C",
        "L'Hopital Rule: Limit x→a (f(x)/g(x)) = Limit x→a (f'(x)/g'(x)) if indeterminate form (0/0 or ∞/∞)"
      ],
      solvedProblem: {
        question: "Find the derivative of F(x) = ∫[0 to x²] cos(t) dt with respect to x.",
        solution: "1. Apply Leibniz Rule: F'(x) = cos(x²) · d/dx(x²) - cos(0) · d/dx(0).\n2. Differentiate bounds: d/dx(x²) = 2x, d/dx(0) = 0.\n3. Substitute: F'(x) = 2x · cos(x²)."
      }
    }
  ],
  "Previous Year Papers": [
    {
      name: "JEE_Advanced_2025_Paper_Solved.pdf",
      size: "4.2 MB",
      type: "PYQ Paper",
      subject: "Physics",
      title: "JEE Advanced 2025 Solved Paper 1 & 2 Compilation",
      theory: [
        "Official questions from the 2025 JEE Advanced exam with comprehensive solutions certified by IITian mentors."
      ],
      formulas: [
        "Topic weightage: Mechanics (35%), Electromagnetism (30%), Modern Physics (15%)",
        "Paper difficulty summary: Moderate difficulty with multi-concept mechanics integrations."
      ],
      solvedProblem: {
        question: "Q1. An elastic ball bounces vertically on a steel plate. The height of successive bounces decays by a factor of e = 0.8. Find energy loss ratio.",
        solution: "1. Height after collision: h' = e² · h.\n2. Energy relationship: E = mgh.\n3. Ratio of final to initial energy: E'/E = h'/h = e² = 0.8² = 0.64.\n4. Energy loss percentage: Loss = 1 - 0.64 = 0.36 or 36% loss."
      }
    }
  ],
  "DPPs": [
    {
      name: "DPP_01_Rotational_Mechanics.pdf",
      size: "940 KB",
      type: "Worksheet",
      subject: "Physics",
      title: "Daily Practice Problem 01: Rotational Torque & Rolling",
      theory: [
        "A selection of 5 targeted JEE Advanced problems covering pure rolling, conservation of angular momentum, and angular impulses."
      ],
      formulas: [
        "Rolling constraint: v_cm = R · ω",
        "Angular Impulse: J_angular = ∫ τ dt = ΔL"
      ],
      solvedProblem: {
        question: "Problem 1: A solid sphere of mass M and radius R rolls without slipping down an incline of angle θ. Find its linear acceleration.",
        solution: "1. Torque equation: τ = f · R = I · α = (2/5 MR²) · (a/R) => f = 2/5 M a.\n2. Force equation: M g sin(θ) - f = M a.\n3. Substitute friction: M g sin(θ) - 2/5 M a = M a => M g sin(θ) = 7/5 M a.\n4. Acceleration: a = (5/7) g sin(θ)."
      }
    }
  ],
  "Revision Notes": [
    {
      name: "Physics_Topper_Notes_Mechanics.pdf",
      size: "2.4 MB",
      type: "Revision Notes",
      subject: "Physics",
      title: "AIR-14 Topper's Mechanics Revision Notebook",
      theory: [
        "Handwritten notes compiled by AIR 14, summarizing core JEE Advanced tricks for Mechanics, Collision, and Impulse equations."
      ],
      formulas: [
        "JEE Trap: Always locate the instant center of zero velocity (ICR) to calculate kinetic energy of complex rolling mechanisms.",
        "Symmetric distributions yield simplified moments of inertia. Use perpendicular axis theorem for planar lamina."
      ],
      solvedProblem: {
        question: "Find the moment of inertia of a uniform planar square plate of mass M and side length L about its diagonal axis.",
        solution: "1. Moment of inertia about central axes parallel to sides: I_x = I_y = (1/12) M L².\n2. By perpendicular axis theorem: I_z = I_x + I_y = (1/6) M L².\n3. Since diagonals are perpendicular and symmetric, I_diag1 + I_diag2 = I_z.\n4. Diagonals are equivalent: 2 · I_diag = I_z = (1/6) M L² => I_diag = (1/12) M L²."
      }
    }
  ]
};

// Detailed database of topics from the JEE Advanced 2026 Syllabus
const syllabusTopics = {
  Physics: [
    {
      topic: "Rotational Dynamics",
      subtopics: [
        "Torque and Angular Acceleration",
        "Moment of Inertia of Rigid Bodies",
        "Conservation of Angular Momentum",
        "Pure Rolling and Slipping Constraints",
        "Angular Impulse and Collisions"
      ],
      formulas: [
        "Torque: τ = I · α",
        "Angular Momentum: L = I · ω",
        "Kinetic Energy: K = 1/2 I ω² + 1/2 M v²",
        "Rolling Condition: v = R · ω"
      ],
      question: "A cylinder of mass M and radius R rolls without slipping down an incline of angle θ. Find the friction force.",
      solution: "1. Force equation: M g sin(θ) - f = M a.\n2. Torque equation: f · R = I · α = (1/2 M R²) · (a / R) => f = 1/2 M a.\n3. Solve: a = (2/3) g sin(θ), f = (1/3) M g sin(θ)."
    },
    {
      topic: "Electrostatics",
      subtopics: [
        "Gauss's Law and Flux",
        "Electric Potential and Field Relations",
        "Conducting Spheres and Shells",
        "Dipole in a Uniform Field",
        "Capacitance and Dielectric Mediums"
      ],
      formulas: [
        "Electric Flux: Φ = ∮ E · dA = Q_in / ε₀",
        "Potential Energy: U = q · V",
        "Electric Field: E = -∇V",
        "Capacitance: C = K · ε₀ · A / d"
      ],
      question: "Find the work done in bringing a charge q from infinity to a distance r from a point charge Q.",
      solution: "1. Electric potential at r is V = Q / (4πε₀r).\n2. Work done equals change in potential energy.\n3. W = q · V = q Q / (4πε₀r)."
    },
    {
      topic: "Laws of Motion",
      subtopics: [
        "Constraint Relations & Pulley Systems",
        "Static and Kinetic Friction Limits",
        "Centripetal Force & Banking of Roads",
        "Newton's Second Law Applications",
        "Pseudo Forces in Accelerated Frames"
      ],
      formulas: [
        "Net Force: F_net = m · a",
        "Friction Constraint: f_s ≤ μ_s · N",
        "Centripetal Acceleration: a_c = v² / R",
        "Pseudo Force: F_pseudo = -m · a_frame"
      ],
      question: "A block is on an inclined plane of angle θ. Find the minimum coefficient of static friction to prevent slipping.",
      solution: "1. Forces along incline: M g sin(θ) - f = 0.\n2. Normal force: N = M g cos(θ).\n3. Slipping limit: f = f_s_max = μ_s · N.\n4. Solve: M g sin(θ) = μ_s · M g cos(θ) => μ_s = tan(θ)."
    },
    {
      topic: "Thermodynamics",
      subtopics: [
        "First Law of Thermodynamics",
        "Isothermal and Adiabatic Processes",
        "Carnot Engine Efficiency",
        "Specific Heat of Gases (Cp, Cv)",
        "Entropy and Second Law"
      ],
      formulas: [
        "First Law: Q = W + ΔU",
        "Work in Adiabatic: W = (P₁V₁ - P₂V₂)/(γ - 1)",
        "Carnot Efficiency: η = 1 - T_cold/T_hot",
        "Relation: Cp - Cv = R"
      ],
      question: "An ideal gas expands isothermally from volume V to 3V. Find the work done.",
      solution: "1. Work done in isothermal process: W = n R T ln(V_final / V_initial).\n2. Substitute values: W = n R T ln(3V / V) = n R T ln(3)."
    },
    {
      topic: "Wave Optics",
      subtopics: [
        "Young's Double Slit Experiment",
        "Path Difference and Phase Difference",
        "Thin Film Interference",
        "Diffraction at a Single Slit",
        "Polarization and Brewster's Law"
      ],
      formulas: [
        "Fringe Width: β = λ · D / d",
        "Max Intensity: I_max = (√I₁ + √I₂)²",
        "Brewster's Law: μ = tan(i_p)",
        "Path Difference: Δx = d · sin(θ)"
      ],
      question: "In YDSE, the slit separation is 0.2 mm and screen distance is 1 m. For light of wavelength 600 nm, find the fringe width.",
      solution: "1. Formula: β = λ D / d.\n2. Substitute: β = (600 · 10⁻⁹ m · 1 m) / (0.2 · 10⁻³ m).\n3. Compute: β = 3 · 10⁻³ m = 3 mm."
    }
  ],
  Chemistry: [
    {
      topic: "Chemical Bonding",
      subtopics: [
        "Molecular Orbital Theory",
        "VSEPR Theory and Shapes",
        "Hybridization of Atomic Orbitals",
        "Dipole Moment and Polar Bonds",
        "Hydrogen Bonding Interactions"
      ],
      formulas: [
        "Bond Order: BO = 0.5 · (N_b - N_a)",
        "Formal Charge: FC = V - N - B/2",
        "Dipole Moment: μ = q · d"
      ],
      question: "Determine the hybridization and shape of SF4.",
      solution: "1. Valence electrons: S(6) + 4 · F(7) = 34 electrons (5 pairs: 4 bonding, 1 lone pair).\n2. Shape: Seesaw geometry due to the lone pair on the equatorial position."
    },
    {
      topic: "Chemical Kinetics",
      subtopics: [
        "Rate Law and Order of Reaction",
        "First Order Integrated Rate Equations",
        "Arrhenius Equation and Activation Energy",
        "Half-Life of Radioactive Decays",
        "Collision Theory of Reactions"
      ],
      formulas: [
        "First Order Rate: k = (2.303/t) · log(A₀/A)",
        "Half-life: t_1/2 = 0.693 / k",
        "Arrhenius Equation: k = A · e^(-E_a / RT)"
      ],
      question: "A first-order reaction is 50% complete in 20 minutes. Find the rate constant.",
      solution: "1. Formula: k = 0.693 / t_1/2.\n2. Substitute: k = 0.693 / 20 = 0.03465 min⁻¹."
    },
    {
      topic: "Coordination Compounds",
      subtopics: [
        "Crystal Field Splitting Theory",
        "Isomerism in Coordination Complexes",
        "Werner's Coordination Theory",
        "Magnetic Properties & Spin States",
        "IUPAC Nomenclature of Complexes"
      ],
      formulas: [
        "CFSE (Octahedral): CFSE = -0.4 · n_t2g + 0.6 · n_eg + n·P",
        "Spin-Only Magnetic Moment: μ = √[n(n + 2)] BM"
      ],
      question: "Calculate the spin-only magnetic moment of [Fe(H2O)6]2+.",
      solution: "1. Fe2+ has 3d6 configuration.\n2. H2O is a weak field ligand, so high spin complex.\n3. Number of unpaired electrons (n) = 4.\n4. Magnetic Moment: μ = √[4(4+2)] = √24 ≈ 4.9 BM."
    },
    {
      topic: "Ionic Equilibrium",
      subtopics: [
        "pH Calculations of Weak Acids/Bases",
        "Buffer Action and Henderson Equation",
        "Solubility Product Constant (Ksp)",
        "Salt Hydrolysis and Acid Strength",
        "Common Ion Effect in Solutions"
      ],
      formulas: [
        "Henderson-Hasselbalch: pH = pKa + log([Salt]/[Acid])",
        "Water Constant: pKw = pH + pOH = 14",
        "Solubility Product: Ksp = [A]^x [B]^y"
      ],
      question: "Find the pH of a solution containing 0.1 M CH3COOH and 0.1 M CH3COONa (pKa of CH3COOH = 4.74).",
      solution: "1. Apply Henderson Equation: pH = pKa + log([Salt] / [Acid]).\n2. Substitute: pH = 4.74 + log(0.1 / 0.1) = 4.74 + log(1) = 4.74."
    }
  ],
  Mathematics: [
    {
      topic: "Definite Integration",
      subtopics: [
        "Properties of Definite Integrals",
        "King's Rule and Symmetry Shortcuts",
        "Integration by Parts Definite Form",
        "Leibniz Rule for Differentiation",
        "Limit of a Sum Formulation"
      ],
      formulas: [
        "King's Rule: ∫[a to b] f(x)dx = ∫[a to b] f(a+b-x)dx",
        "Leibniz Formula: d/dx ∫[u(x) to v(x)] f(t)dt = f(v(x))v'(x) - f(u(x))u'(x)"
      ],
      question: "Evaluate I = ∫[0 to 1] x · (1 - x)^99 dx.",
      solution: "1. Apply King's Rule: I = ∫[0 to 1] (1-x) · (1 - (1-x))^99 dx = ∫[0 to 1] (1-x) · x^99 dx.\n2. Expand: I = ∫[0 to 1] (x^99 - x^100) dx.\n3. Integrate: I = [x^100 / 100 - x^101 / 101] evaluated from 0 to 1 = 1/100 - 1/101 = 1/10100."
    },
    {
      topic: "Complex Numbers",
      subtopics: [
        "Euler's Form & Polar Coordinates",
        "De Moivre's Theorem & Deconstruction",
        "Cube Roots of Unity (1, ω, ω²)",
        "Geometry of Complex Curves",
        "Roots of Complex Equations"
      ],
      formulas: [
        "Euler Representation: z = r · e^(iθ)",
        "Cube Roots: 1 + ω + ω² = 0, ω³ = 1",
        "Modulus Relation: |z₁ + z₂|² + |z₁ - z₂|² = 2(|z₁|² + |z₂|²)"
      ],
      question: "Find the value of (1 + ω - ω²)^7.",
      solution: "1. We know 1 + ω = -ω².\n2. Substitute: (-ω² - ω²)^7 = (-2ω²)^7 = (-2)^7 · ω^14.\n3. Simplify ω^14 = ω².\n4. Final answer: -128 ω²."
    },
    {
      topic: "Matrices & Determinants",
      subtopics: [
        "Adjoint and Inverse of Matrices",
        "Cramer's Rule for Linear Systems",
        "Properties of Determinant Columns",
        "Cayley-Hamilton Theorem Application",
        "Symmetric and Skew-Symmetric Matrices"
      ],
      formulas: [
        "Inverse Formula: A⁻¹ = adj(A) / |A|",
        "Adjoint Property: adj(AB) = adj(B) · adj(A)",
        "Determinant Property: |kA| = k^n |A|"
      ],
      question: "If A is a 3x3 matrix and |A| = 4, find the value of |adj(A)|.",
      solution: "1. Adjoint determinant formula: |adj(A)| = |A|^(n-1).\n2. Substitute n = 3 and |A| = 4: |adj(A)| = 4^(3-1) = 16."
    },
    {
      topic: "Vectors & 3D Geometry",
      subtopics: [
        "Scalar Triple Product & Coplanarity",
        "Vector Triple Product Expansion",
        "Shortest Distance Between Skew Lines",
        "Equation of a Plane in 3D Space",
        "Angle Between Line and Plane"
      ],
      formulas: [
        "Scalar Triple Product: [a b c] = a · (b × c)",
        "Vector Triple Product: a × (b × c) = (a · c)b - (a · b)c",
        "Skew lines distance: d = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|"
      ],
      question: "Find the value of λ such that the vectors a = i - j + k, b = 2i + j - k, and c = λi - j + λk are coplanar.",
      solution: "1. Coplanarity condition: Scalar triple product [a b c] = 0.\n2. Determinant check: |[1, -1, 1; 2, 1, -1; λ, -1, λ]| = 0.\n3. Expand: 1(λ - 1) + 1(2λ + λ) + 1(-2 - λ) = 0 => 3λ - 3 = 0 => λ = 1."
    }
  ]
};

// Target counts mapping to dashboard card badges
const categoriesTargets: Record<string, number> = {
  "Concept Modules": 312,
  "Formula Sheets": 84,
  "Previous Year Papers": 22,
  "DPPs": 540,
  "Revision Notes": 168
};

// Build the fully populated resources database
const allGeneratedResources: Record<string, ResourceFile[]> = {};

Object.entries(categoriesTargets).forEach(([category, target]) => {
  const baseList = structuredResources[category] || [];
  const list = [...baseList];
  const subjects = ["Physics", "Chemistry", "Mathematics"] as const;
  
  for (let i = baseList.length; i < target; i++) {
    const subject = subjects[i % 3];
    const subjectTopics = syllabusTopics[subject];
    const topicData = subjectTopics[i % subjectTopics.length];
    const subtopic = topicData.subtopics[i % topicData.subtopics.length];
    const sanitizedTopic = topicData.topic.replace(/\s+/g, "_");
    const sanitizedSubtopic = subtopic.replace(/['’\s()]+/g, "_");
    
    let name = "";
    let type = "";
    if (category === "Concept Modules") {
      name = `${subject}_${sanitizedTopic}_${sanitizedSubtopic}_Module.pdf`;
      type = "PDF Module";
    } else if (category === "Formula Sheets") {
      name = `${subject}_${sanitizedTopic}_Formulas_Sheet_${i - baseList.length + 1}.pdf`;
      type = "Cheat Sheet";
    } else if (category === "Previous Year Papers") {
      const year = 2025 - (i % 24);
      name = `JEE_Advanced_${year}_${subject}_Paper_${(i % 2) + 1}_Solved.pdf`;
      type = "PYQ Paper";
    } else if (category === "DPPs") {
      const dppNum = String(i - baseList.length + 2).padStart(2, "0");
      name = `DPP_${dppNum}_${subject}_${sanitizedTopic}.pdf`;
      type = "Worksheet";
    } else if (category === "Revision Notes") {
      name = `${subject}_Revision_Notes_${sanitizedTopic}_Topper_${(i % 15) + 1}.pdf`;
      type = "Revision Notes";
    }
    
    const size = `${((i * 13) % 75 / 10 + 1.1).toFixed(1)} MB`;
    const title = `${subtopic} (${topicData.topic})`;
    
    const theory = [
      `Detailed conceptual study framework for ${subtopic} under the JEE Advanced ${topicData.topic} section.`,
      `Covers core derivations, boundary state constraints, and qualitative analysis of multi-stage problem setups.`,
      `Crucial for solving high-weightage JEE questions. Pay attention to standard sign conventions.`
    ];
    
    const formulas = [
      ...topicData.formulas,
      `IIT-JEE Shortcut: Check limiting conditions when variables approach zero or infinity.`
    ];
    
    const solvedProblem = {
      question: `[Practice Set ${i}] ${topicData.question}`,
      solution: topicData.solution
    };
    
    list.push({
      name,
      size,
      type,
      subject,
      title,
      theory,
      formulas,
      solvedProblem
    });
  }
  
  allGeneratedResources[category] = list;
});

function StudyMaterials({ dashboardMode = false }: { dashboardMode?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<"All" | "Physics" | "Chemistry" | "Mathematics">("All");
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadedFiles, setDownloadedFiles] = useState<Record<string, boolean>>({});
  
  // PDF Viewer Modal States
  const [previewingFile, setPreviewingFile] = useState<ResourceFile | null>(null);
  const [pdfZoom, setPdfZoom] = useState(100);

  // Filter resources based on selected category and subject filter tab
  const activeResourcesList = useMemo(() => {
    if (!selectedCategory) return [];
    
    const baseList = allGeneratedResources[selectedCategory] || [];
    if (subjectFilter === "All") return baseList;
    return baseList.filter(f => f.subject === subjectFilter);
  }, [selectedCategory, subjectFilter]);

  // Simulate download PDF flow
  function handleDownload(file: ResourceFile) {
    if (downloadedFiles[file.name]) return;
    
    setDownloadingFile(file.name);
    
    setTimeout(() => {
      setDownloadingFile(null);
      setDownloadedFiles((prev) => ({ ...prev, [file.name]: true }));
      
      // Generate a downloadable text/markdown representation with a PDF extension
      const headerText = `========================================================\n` +
                          `             VALLURI™ IIT-JEE STUDY PORTAL              \n` +
                          `========================================================\n` +
                          `Document: ${file.title}\n` +
                          `Resource Category: ${selectedCategory}\n` +
                          `File Name: ${file.name}\n` +
                          `Generated: ${new Date().toLocaleDateString()}\n` +
                          `--------------------------------------------------------\n\n` +
                          `1. THEORETICAL PRINCIPLES:\n` +
                          file.theory.map((t, idx) => `   [${idx + 1}] ${t}`).join("\n") + `\n\n` +
                          `2. KEY EQUATIONS & FORMULAS:\n` +
                          file.formulas.map((f) => `   • ${f}`).join("\n") + `\n\n` +
                          `3. SOLVED SAMPLE JEE ADVANCED NUMERICAL:\n` +
                          `   Question: ${file.solvedProblem.question}\n\n` +
                          `   Step-by-step Solution:\n` +
                          file.solvedProblem.solution + `\n\n` +
                          `========================================================\n` +
                          `              © 2026 VALLURI STUDY SYSTEMS               \n` +
                          `========================================================\n`;

      const blob = new Blob([headerText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1200);
  }

  if (dashboardMode) {
    return (
      <main className="study-materials-page dashboard-materials-page">
        <section className="dashboard-materials-hero">
          <p className="dashboard-overline">Study Materials</p>
          <h1>
            Curated by <em>IITians.</em>
          </h1>
          <p>Premium study notes, formulary maps, and worksheets structured for JEE Advanced 2026.</p>
        </section>

        <section className="dashboard-materials-browser">
          <div className="dashboard-materials-heading">
            <p className="dashboard-overline">Library</p>
            <h2>Browse materials</h2>
          </div>

          <div className="dashboard-materials-grid">
            {dashboardMaterialCards.map((material) => {
              const Icon = material.icon;
              const isVideoLesson = material.title === "Video Lessons";

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
                  
                  {isVideoLesson ? (
                    <Link to="/dashboard/ai-classroom" className="dashboard-material-open-link">
                      Open
                      <Download size={16} aria-hidden="true" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(material.title);
                        setSubjectFilter("All");
                      }}
                      className="dashboard-material-open-link-btn"
                    >
                      Open
                      <Download size={16} aria-hidden="true" />
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Dynamic Resource Modal */}
        {selectedCategory && (
          <div className="materials-modal-backdrop">
            <div className="materials-modal-card animate-fadeIn">
              <button
                type="button"
                className="materials-modal-close"
                onClick={() => setSelectedCategory(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              <div className="modal-header">
                <span className="dashboard-overline">Study Materials</span>
                <h2>{selectedCategory}</h2>
                <p>Download official notes, formulas, and worksheets compiled by IIT mentors.</p>
              </div>

              {/* Subject Tabs Filter */}
              <div className="modal-subject-tabs">
                {(["All", "Physics", "Chemistry", "Mathematics"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`subject-tab-btn ${subjectFilter === tab ? "active" : ""}`}
                    onClick={() => setSubjectFilter(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="modal-resources-list">
                {activeResourcesList.length === 0 ? (
                  <div className="modal-empty-state">
                    No resources found under this filter. Select another subject.
                  </div>
                ) : (
                  activeResourcesList.map((file) => (
                    <div className="resource-item" key={file.name}>
                      <div className="resource-info">
                        <strong>{file.name}</strong>
                        <span>{file.type} · {file.size} · {file.subject}</span>
                      </div>

                      <div className="resource-item-actions">
                        <button
                          type="button"
                          className="resource-view-pdf-btn"
                          onClick={() => setPreviewingFile(file)}
                        >
                          <Eye size={14} />
                          <span>View PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownload(file)}
                          className={`resource-download-btn ${downloadedFiles[file.name] ? "downloaded" : ""}`}
                          disabled={downloadingFile === file.name}
                        >
                          {downloadingFile === file.name ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Downloading...</span>
                            </>
                          ) : downloadedFiles[file.name] ? (
                            <>
                              <CheckCircle size={14} />
                              <span>Downloaded</span>
                            </>
                          ) : (
                            <>
                              <Download size={14} />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic PDF Document Viewer Modal */}
        {previewingFile && (
          <div className="pdf-viewer-backdrop">
            <div className="pdf-viewer-container">
              {/* PDF Toolbar */}
              <div className="pdf-viewer-toolbar">
                <div className="toolbar-left">
                  <BookOpen size={18} className="text-gold" />
                  <span className="pdf-document-title">{previewingFile.name} (Preview Mode)</span>
                </div>
                
                <div className="toolbar-middle">
                  <button 
                    type="button" 
                    className="toolbar-icon-btn" 
                    onClick={() => setPdfZoom(z => Math.max(50, z - 10))}
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="zoom-text-label">{pdfZoom}%</span>
                  <button 
                    type="button" 
                    className="toolbar-icon-btn" 
                    onClick={() => setPdfZoom(z => Math.min(200, z + 10))}
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                <div className="toolbar-right">
                  <button 
                    type="button" 
                    className="toolbar-action-btn"
                    onClick={() => window.print()}
                  >
                    <Printer size={15} />
                    <span>Print</span>
                  </button>

                  <button 
                    type="button" 
                    className="toolbar-action-btn download-accent"
                    onClick={() => handleDownload(previewingFile)}
                    disabled={downloadingFile === previewingFile.name}
                  >
                    <Download size={15} />
                    <span>{downloadedFiles[previewingFile.name] ? "Downloaded" : "Download"}</span>
                  </button>

                  <button 
                    type="button" 
                    className="toolbar-close-btn"
                    onClick={() => {
                      setPreviewingFile(null);
                      setPdfZoom(100);
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* PDF Document Canvas Sheet */}
              <div className="pdf-viewer-canvas-scroll">
                <div 
                  className="pdf-paper-document-sheet"
                  style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: "top center" }}
                >
                  {/* PDF Letterhead / Header */}
                  <div className="pdf-sheet-header">
                    <img src={logo} alt="VALLURI logo" className="pdf-sheet-logo" />
                    <div className="pdf-sheet-brand-meta">
                      <h3>VALLURI™ IIT-JEE STUDY SYSTEMS</h3>
                      <span>JEE Advanced 2026 Expert Prep Library</span>
                    </div>
                  </div>

                  <div className="pdf-sheet-divider" />

                  {/* PDF Document Content */}
                  <div className="pdf-sheet-body">
                    <span className="pdf-subject-badge">{previewingFile.subject}</span>
                    <h1 className="pdf-document-heading">{previewingFile.title}</h1>
                    
                    {/* Section 1: Core Theories */}
                    <div className="pdf-doc-section">
                      <h2>1. Core Principles & Concept Grounding</h2>
                      <ul>
                        {previewingFile.theory.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Section 2: Key Equations */}
                    <div className="pdf-doc-section">
                      <h2>2. Governing Laws & Key Formulations</h2>
                      <div className="pdf-equations-grid">
                        {previewingFile.formulas.map((f, idx) => (
                          <div key={idx} className="pdf-formula-row">
                            <span className="formula-bullet">■</span>
                            <code>{f}</code>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 3: Solved numerical */}
                    <div className="pdf-doc-section">
                      <h2>3. Solved Sample Problem (JEE Advanced Standard)</h2>
                      <div className="pdf-problem-block">
                        <div className="problem-question">
                          <strong>Question:</strong>
                          <p>{previewingFile.solvedProblem.question}</p>
                        </div>
                        <div className="problem-solution">
                          <strong>Step-by-step Solution:</strong>
                          <pre>{previewingFile.solvedProblem.solution}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: AI Coaching Tips */}
                    <div className="pdf-doc-section pdf-ai-coaching-box">
                      <div className="ai-coach-box-header">
                        <Sparkles size={16} className="text-gold" />
                        <h3>VALLURI™ AI Coaching Tip</h3>
                      </div>
                      <p>
                        Always examine the dimensional units and limiting boundaries of the formulas before computing final integer steps. 
                        In integration, look for symmetric periodic bounds. In dynamics, verify constraints around rolling contacts.
                      </p>
                    </div>
                  </div>

                  {/* PDF Sheet Footer */}
                  <div className="pdf-sheet-footer">
                    <span>Page 1 of 1 · Verified IITian Notes Portfolio</span>
                    <span>© 2026 VALLURI Systems. All rights reserved.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="dashboard-footer">
          <span>&copy; 2026 VALLURI&trade; IIT-JEE. All rights reserved.</span>
          <Link to="/pricing">Premium plans</Link>
        </footer>
      </main>
    );
  }

  // Public standard mode fallback (unauth Mode)
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
            {dashboardMaterialCards.map((category) => {
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

      {!dashboardMode && (
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
        </footer>
      )}
    </main>
  );
}

export default StudyMaterials;
