from fastapi import APIRouter, Depends

from routes.dependencies import get_current_user

router = APIRouter(prefix="/api/content", tags=["Learning Content"])


@router.get("/dashboard")
def dashboard_content(_: object = Depends(get_current_user)):
    return {
        "stats": [
            {"kicker": "Active Course", "title": "JEE Adv. Crash", "detail": "Batch - Elite 2026"},
            {"kicker": "Mock Tests Completed", "title": "24", "detail": "of 60 in plan"},
            {"kicker": "Accuracy", "title": "82%", "detail": "+4% this week"},
            {"kicker": "Study Streak", "title": "37d", "detail": "Personal best"},
        ],
        "today_plan": [
            {"time": "08:00", "title": "Rotational Dynamics - Concept", "subject": "Physics"},
            {"time": "10:30", "title": "Coordination Compounds - DPP", "subject": "Chemistry"},
            {"time": "18:30", "title": "Full Syllabus Mock #25", "subject": "Test"},
        ],
    }


@router.get("/courses")
def courses_content(_: object = Depends(get_current_user)):
    return {
        "active": [
            {
                "title": "JEE Advanced - Elite Crash Course 2026",
                "mentor": "Dr. R. Iyer",
                "progress": 62,
            },
            {
                "title": "Chemistry Mastery - Organic Edition",
                "mentor": "Prof. A. Sharma",
                "progress": 41,
            },
        ]
    }


@router.get("/study-materials")
def study_materials_content(_: object = Depends(get_current_user)):
    return {
        "materials": [
            {"title": "Concept Modules", "count": "312 items"},
            {"title": "Formula Sheets", "count": "84 items"},
            {"title": "Previous Year Papers", "count": "22 items"},
            {"title": "Video Lessons", "count": "720 items"},
        ]
    }
TOPICS_CATALOG = {
    "Physics": [
        "Motion in a Straight Line",
        "Vector Algebra & Kinematics",
        "Laws of Motion & Friction",
        "Work, Power and Energy",
        "Centre of Mass & Collisions",
        "Rotational Dynamics",
        "Gravitation & Kepler's Laws",
        "Elasticity & Fluid Mechanics",
        "Thermal Expansion & Calorimetry",
        "Thermodynamics & Heat Engines",
        "Electrostatics & Gauss Law",
        "Capacitors & Dielectrics",
        "Current Electricity & Circuits",
        "Magnetic Effects of Current",
        "Electromagnetic Induction (EMI)",
        "Alternating Current (AC)",
        "Ray Optics & Optical Instruments",
        "Wave Optics & Interference",
        "Dual Nature of Matter & Radiation",
        "Atomic & Nuclear Physics",
        "Semiconductor Devices",
    ],
    "Chemistry": [
        "Mole Concept & Stoichiometry",
        "Atomic Structure & Bohr's Model",
        "Periodic Table & Periodic Properties",
        "Chemical Bonding & Molecular Geometry",
        "Gaseous State & Ideal Gas Laws",
        "Chemical Thermodynamics & Hess Law",
        "Chemical Equilibrium",
        "Ionic Equilibrium & pH",
        "Solid State & Crystal Structures",
        "Solutions & Colligative Properties",
        "Electrochemistry & Nernst Equation",
        "Chemical Kinetics & Rate Laws",
        "Surface Chemistry",
        "Coordination Compounds",
        "General Organic Chemistry (GOC)",
        "Hydrocarbons & Alkanes/Alkenes",
        "Haloalkanes & Haloarenes",
        "Alcohols, Phenols & Ethers",
        "Aldehydes, Ketones & Carboxylic Acids",
        "Biomolecules & Polymers",
    ],
    "Mathematics": [
        "Sets, Relations and Functions",
        "Complex Numbers & Quadratic Equations",
        "Matrices & Determinants",
        "Permutations and Combinations",
        "Mathematical Induction",
        "Binomial Theorem",
        "Sequences and Series (AP, GP, HP)",
        "Trigonometric Ratios & Identities",
        "Trigonometric Equations",
        "Inverse Trigonometric Functions",
        "Straight Lines & Pair of Lines",
        "Circles & Family of Circles",
        "Conic Sections (Parabola, Ellipse, Hyperbola)",
        "Limits, Continuity & Differentiability",
        "Differentiation Methods",
        "Tangents, Normals & Monotonicity",
        "Maxima and Minima (AOD)",
        "Indefinite Integration",
        "Definite Integration & Area under Curve",
        "Differential Equations",
        "Vector Algebra",
        "Three Dimensional Geometry (3D)",
        "Probability & Bayes Theorem",
    ],
}
def generate_slides_for_topic(subject: str, topic: str):
    t_lower = topic.lower()
    
    # Physics -> Rotational Dynamics
    if "rotation" in t_lower or "rotational" in t_lower:
        return [
            {
                "title": "Torque and Angular Acceleration",
                "subject": "Physics - Rotational Dynamics",
                "visual": "τ = Iα",
                "points": [
                    "Torque is the rotational analogue of force, defined as the cross product of position and force vector (r x F).",
                    "Moment of Inertia (I) measures a body's resistance to rotational acceleration.",
                    "The fundamental equation of rotational dynamics is τ = Iα, where α is the angular acceleration vector."
                ],
                "script": "Welcome students, let's begin our comprehensive discussion on Rotational Dynamics. Just as force causes linear acceleration in translational mechanics, torque is the vector quantity that causes rotational acceleration in angular mechanics. Mathematically, torque is defined as the cross product of the position vector r and the force vector F, which can be written as r cross F. The magnitude is given by r times F times sine of theta. Now, let's define the moment of inertia, denoted by capital I. This measures a body's inherent resistance to angular acceleration. Unlike mass, which is a constant scalar, the moment of inertia depends heavily on the axis of rotation and the square of the distance of the masses from that axis. Finally, the fundamental equation of rotational dynamics is torque equals moment of inertia times angular acceleration alpha. Remember to apply vector directions and sign conventions carefully when solving IIT JEE numericals, as this is a very common source of errors."
            },
            {
                "title": "Angular Momentum Conservation",
                "subject": "Physics - Rotational Dynamics",
                "visual": "L = Iω",
                "points": [
                    "Angular momentum (L) is defined as L = r x p = Iω for a rigid body rotating about a fixed axis.",
                    "In the absence of a net external torque (τ_ext = 0), the total angular momentum of the system remains constant.",
                    "This principle explains why a spinning ice skater rotates faster when they pull their arms in (decreasing I, increasing ω)."
                ],
                "script": "Next, let's examine angular momentum conservation, which is one of the most elegant principles in physics. Angular momentum, represented by capital L, is defined as the cross product of position vector r and linear momentum vector p, which simplifies to the moment of inertia I times the angular velocity vector omega for a rigid body rotating about a fixed axis. The core theorem states that in the absence of a net external torque acting on a system, the total angular momentum remains strictly constant over time. This principle beautifully explains why a spinning ice skater rotates much faster when they pull their arms inward: by pulling their mass closer to the rotational axis, they decrease their moment of inertia. Since the product of I and omega must remain constant, their angular velocity must increase dramatically. Keep this skater model in mind when analyzing complex collision problems in JEE Advanced."
            },
            {
                "title": "Rolling Motion & Kinetic Energy",
                "subject": "Physics - Rotational Dynamics",
                "visual": "v = Rω",
                "points": [
                    "Pure rolling motion is a combination of translation of the center of mass and rotation about it.",
                    "For pure rolling on a stationary surface, the point of contact is instantaneously at rest: v_cm = Rω.",
                    "Total Kinetic Energy is the sum of translational and rotational kinetic energies: K_total = 0.5*m*v^2 + 0.5*I*ω^2."
                ],
                "script": "Finally, let's analyze pure rolling motion. Pure rolling is a composite motion combining translation of the center of mass and rotation about that center. For pure, non-slipping rolling on a stationary surface, the point of contact between the rolling body and the surface must be instantaneously at rest relative to the ground. This gives us the kinematic constraint that velocity of the center of mass equals the radius R times the angular velocity omega. Consequently, the total kinetic energy of a rolling body is the sum of its translational kinetic energy, calculated as half m v squared, and its rotational kinetic energy, calculated as half I omega squared. When applying conservation of energy to rolling bodies on inclined planes, always remember to sum both kinetic energy terms. Failing to include the rotational energy term is one of the classic calculation traps set in IIT JEE exams."
            }
        ]
    
    # Chemistry -> Chemical Bonding
    elif "bonding" in t_lower or "bond" in t_lower:
        return [
            {
                "title": "Valence Shell Electron Pair Repulsion",
                "subject": "Chemistry - Chemical Bonding",
                "visual": "VSEPR",
                "points": [
                    "Electron pairs around a central atom arrange themselves to minimize electrostatic repulsion.",
                    "Lone pair-lone pair repulsion is stronger than lone pair-bond pair, which is stronger than bond pair-bond pair.",
                    "VSEPR theory predicts molecular geometries (linear, trigonal planar, tetrahedral, etc.) based on steric numbers."
                ],
                "script": "Welcome class, let's explore Chemical Bonding, starting with the Valence Shell Electron Pair Repulsion theory, commonly known as VSEPR. This theory is built on the fundamental principle that valence electron pairs surrounding a central atom, whether they are bonding pairs or non-bonding lone pairs, repel each other electrostatically. Consequently, they naturally arrange themselves in three-dimensional space as far apart as possible to minimize this repulsion and achieve a state of minimum potential energy. Crucially, remember that lone pair-lone pair repulsion is stronger than lone pair-bond pair repulsion, which in turn is stronger than bond pair-bond pair repulsion. This difference causes significant deviations from ideal bond angles, compressing the angles between bonding atoms. VSEPR theory is extremely powerful for predicting molecular geometries such as linear, trigonal planar, tetrahedral, trigonal bipyramidal, and octahedral based on the steric number of the central atom."
            },
            {
                "title": "Hybridization and Valence Bond Theory",
                "subject": "Chemistry - Chemical Bonding",
                "visual": "sp³, sp², sp",
                "points": [
                    "Hybridization is the mixing of atomic orbitals (s, p, d) of similar energy to form new hybrid orbitals.",
                    "Steric number dictates hybridization: SN = 4 corresponds to sp³ (tetrahedral), SN = 3 to sp² (trigonal planar).",
                    "Sigma bonds are formed by axial overlap of orbitals; Pi bonds are formed by lateral, parallel overlap."
                ],
                "script": "Next, let's discuss hybridization and Valence Bond Theory. Hybridization is a mathematical concept involving the mixing of atomic orbitals of similar energies, such as s, p, and sometimes d orbitals, on a central atom to form a set of equivalent hybrid orbitals. The steric number directly dictates the hybridization type: a steric number of four corresponds to sp3 hybridization with tetrahedral geometry, three corresponds to sp2 with trigonal planar geometry, and two corresponds to sp hybridization with linear geometry. When bonds are formed, we distinguish between sigma and pi bonds. Sigma bonds are formed by the head-on, axial overlap of orbitals along the internuclear axis, creating a region of high electron density directly between the nuclei. Pi bonds, on the other hand, are formed by the sideways, lateral overlap of parallel unhybridized p-orbitals, creating electron density clouds above and below the bonding plane. Always count sigma and pi bonds carefully in organic molecules to determine the correct hybridization of carbon atoms."
            },
            {
                "title": "Molecular Orbital Theory (MOT)",
                "subject": "Chemistry - Chemical Bonding",
                "visual": "Bond Order",
                "points": [
                    "Atomic orbitals combine to form molecular orbitals: bonding (lower energy) and antibonding (higher energy).",
                    "Bond Order = 0.5 * (N_bonding - N_antibonding). A bond order of zero means the molecule is unstable and cannot exist.",
                    "MOT explains magnetic properties, such as the paramagnetism of diatomic oxygen (O₂)."
                ],
                "script": "Finally, we cover Molecular Orbital Theory, or MOT. Unlike Valence Bond Theory, which views electrons as localized between specific atoms, MOT treats electrons as delocalized over the entire molecule. When atomic orbitals combine, they form molecular orbitals: bonding molecular orbitals, which have lower energy and stabilize the molecule, and antibonding molecular orbitals, which have higher energy and destabilize it. We calculate the bond order as half the difference between the number of electrons in bonding orbitals and the number in antibonding orbitals. A bond order of zero indicates that the molecule is unstable and cannot exist under normal conditions, such as diatomic helium. Crucially, Molecular Orbital Theory is highly celebrated because it successfully explains properties that Valence Bond Theory fails to account for, such as the paramagnetism of diatomic oxygen due to the presence of two unpaired electrons in its degenerate antibonding pi molecular orbitals. This is a very high-yield concept in JEE."
            }
        ]

    # Mathematics -> Integration
    elif "integration" in t_lower or "integral" in t_lower:
        return [
            {
                "title": "Definite Integrals as Limits of Sums",
                "subject": "Mathematics - Integration",
                "visual": "∫ f(x)dx",
                "points": [
                    "The definite integral of f(x) from a to b represents the signed area under the curve.",
                    "Riemann Sums approximate this area using the sum of thin rectangular strips.",
                    "As the width of these strips approaches zero, the Riemann Sum converges to the exact definite integral."
                ],
                "script": "Welcome students to this advanced calculus lesson on definite integration. We can think of the definite integral of a function f of x from limit a to limit b as representing the net signed area enclosed between the function curve, the x-axis, and the vertical lines x equals a and x equals b. To calculate this area, we divide the interval into infinitely many thin rectangular strips. Each rectangle has a height equal to the function value and a width delta x. By summing the areas of these rectangles, we obtain a Riemann Sum that approximates the total area. As we increase the number of strips to infinity, the width delta x approaches zero. The limit of this Riemann Sum converges to the exact definite integral. Understanding this limit process is crucial for solving series summation questions in JEE Advanced, where you convert a limit of a sum directly into a definite integral."
            },
            {
                "title": "The Fundamental Theorem of Calculus",
                "subject": "Mathematics - Integration",
                "visual": "F(b) - F(a)",
                "points": [
                    "FTC Part 1: The derivative of the area function A(x) = ∫[a to x] f(t)dt is the original function f(x).",
                    "FTC Part 2: If F(x) is an antiderivative of f(x), then ∫[a to b] f(x)dx = F(b) - F(a).",
                    "This establishes a direct link between differentiation and integration as inverse processes."
                ],
                "script": "Next, let's explore the Fundamental Theorem of Calculus, which is the cornerstone of integral calculus. This theorem establishes a direct mathematical link between differentiation and integration, proving that they are inverse processes. The first part of the theorem states that the derivative of the area accumulator function A of x, which integrates f of t from a to x, is simply the original function f of x. This is the basis of Leibniz rule for differentiating under the integral sign. The second part of the theorem gives us a practical, powerful method to evaluate definite integrals without calculating infinite sums: simply find the antiderivative F of x, and compute its value at the upper limit b minus its value at the lower limit a. Always check if the function is continuous on the interval before applying this theorem, as discontinuities can lead to mathematically invalid results."
            },
            {
                "title": "Properties of Definite Integrals & King's Rule",
                "subject": "Mathematics - Integration",
                "visual": "King's Rule",
                "points": [
                    "King's Property: The integral of f(x) from a to b is equal to the integral of f(a + b - x) from a to b.",
                    "Odd-Even Property: The integral of f(x) from -a to a is 0 if f is odd, and 2 * ∫[0 to a] f(x)dx if f is even.",
                    "Using these symmetry properties is the primary shortcut for solving complex JEE integration problems."
                ],
                "script": "Finally, let's cover the symmetry properties of definite integrals. The most important property for IIT JEE is the King's Rule, which states that the integral of f of x from limit a to limit b is equal to the integral of f of a plus b minus x over the same limits. This property is incredibly useful for simplifying integrands containing trigonometric or logarithmic expressions, as adding the original integral to the transformed integral often eliminates difficult terms. Another key property is the Odd-Even rule: the integral from minus a to plus a of an odd function is zero, while for an even function it equals twice the integral from zero to a. Always inspect the symmetry of the integrand and the limits first, as applying these properties can instantly reduce a complex integration problem to a simple one-line calculation."
            }
        ]

    # Physics -> Laws of Motion / Newton's First Law
    elif "motion" in t_lower or "kinematics" in t_lower or "newton" in t_lower:
        return [
            {
                "title": "Newton's First Law (Inertia)",
                "subject": "Physics - Laws of Motion",
                "visual": "ΣF = 0",
                "points": [
                    "Every body continues in its state of rest or uniform motion unless compelled by an external unbalanced force.",
                    "Inertia is the inherent property of a body to resist changes in its state of motion.",
                    "Mass is the quantitative measure of inertia."
                ],
                "script": "Welcome students to this classical mechanics lesson on Newton's Laws of Motion. We start with Newton's First Law, often called the Law of Inertia. It states that every physical body will continue in its current state of rest or uniform motion in a straight line unless it is compelled to change that state by an external, unbalanced net force. Inertia is the inherent property of matter that resists any change in its velocity. The quantitative measure of this inertia is mass: a body with more mass has more inertia, meaning it requires a larger force to change its state. In JEE mechanics, this law forms the foundation for static equilibrium. When the vector sum of all external forces acting on a body is zero, the body remains at rest or moves with constant velocity. Always identify all forces acting on a system to determine if a net external force exists."
            },
            {
                "title": "Newton's Second & Third Laws",
                "subject": "Physics - Laws of Motion",
                "visual": "F = ma",
                "points": [
                    "The rate of change of momentum is directly proportional to the applied force: F = dp/dt = m*a (for constant mass).",
                    "To every action, there is always an equal and opposite reaction: Fab = -Fba.",
                    "Forces always occur in action-reaction pairs acting on different bodies."
                ],
                "script": "Next, let's discuss Newton's Second and Third Laws. The Second Law provides a quantitative definition of force, stating that the net force acting on a body is equal to the rate of change of its linear momentum with respect to time. For a system with constant mass, this simplifies to the famous equation force equals mass times acceleration. The Third Law states that to every action, there is always an equal and opposite reaction. This means that forces always occur in pairs: if body A exerts a force on body B, body B simultaneously exerts an equal and opposite force on body A. Crucially, remember that these action-reaction forces always act on different bodies, which is why they do not cancel each other out. This concept is fundamental when setting up equations of motion for connected bodies in JEE dynamics."
            },
            {
                "title": "Friction & Free Body Diagrams",
                "subject": "Physics - Laws of Motion",
                "visual": "f = μN",
                "points": [
                    "Friction opposes relative slipping between two contact surfaces: f_s <= μ_s * N and f_k = μ_k * N.",
                    "A Free Body Diagram (FBD) isolates a body and shows all external forces acting on it.",
                    "Set up Cartesian coordinate axes along the direction of acceleration for easy resolving."
                ],
                "script": "To solve complex mechanics problems, drawing a Free Body Diagram, or FBD, is absolutely essential. An FBD isolates a specific body from its surroundings and represents all the external forces acting on it, such as gravity, normal reaction, tension, and friction. Friction is a contact force that opposes the relative slipping or tendency of slipping between two surfaces. Static friction adapts its magnitude to prevent slipping up to a maximum limiting value, while kinetic friction opposes active slipping with a constant value. When resolving forces in your FBD, always choose your Cartesian coordinate axes along the direction of acceleration and perpendicular to it. This alignment simplifies your equations of motion and minimizes calculation errors, which is a major key to scoring high in JEE Physics."
            }
        ]

    # General fallback
    else:
        visual_symbol = "x"
        if subject == "Physics":
            visual_symbol = "Δx/Δt"
        elif subject == "Chemistry":
            visual_symbol = "Rxn"
        elif subject == "Mathematics":
            visual_symbol = "f(x)"
            
        return [
            {
                "title": f"Introduction to {topic}",
                "subject": f"{subject} - {topic}",
                "visual": visual_symbol,
                "points": [
                    f"Fundamental definition and basic concepts of {topic} in IIT JEE.",
                    "Key physical or mathematical models used to explain underlying principles.",
                    "Understanding initial constraints, units, and assumptions."
                ],
                "script": f"Welcome class to our detailed lesson on {topic}. Today we will explore the core concepts and fundamental definitions of this chapter. Understanding the basic definitions is critical because IIT JEE often tests your grasp of fundamental concepts in analytical questions. We will examine the physical or mathematical models that govern this topic, and discuss the units, constraints, and initial assumptions. Make sure you note down the boundary conditions, as these are the primary parameters you will use to verify your solutions during exams."
            },
            {
                "title": f"{topic} - Formulas & Theory",
                "subject": f"{subject} - {topic}",
                "visual": "Formula Sheet",
                "points": [
                    "Derivation and explanation of major mathematical expressions.",
                    "Analysis of key variables, constants, and proportionality relationships.",
                    "Solving standard cases and boundary conditions."
                ],
                "script": f"Let's move on to the formulas, equations, and theoretical derivations of {topic}. It is highly recommended not to just memorize these equations, but to understand their derivations from first principles. We will analyze the key variables, constants, and proportionality relationships. We will also solve standard cases and apply boundary conditions. Pay close attention to how these formulas behave under limiting cases, as this provides a rapid method for eliminating incorrect options in multiple-choice questions."
            },
            {
                "title": f"{topic} - JEE Traps & Advanced Applications",
                "subject": f"{subject} - {topic}",
                "visual": "JEE Advanced",
                "points": [
                    "Analyzing typical question types asked in JEE Mains & Advanced exams.",
                    "Common mistakes: sign conventions, assumptions, and calculation traps.",
                    "Applying shortcuts and symmetry to solve numericals efficiently."
                ],
                "script": f"Finally, let's discuss advanced problem-solving strategies and typical traps in {topic}. IIT JEE exams frequently include questions designed to trap students using incorrect sign conventions, unit conversions, or hidden assumptions. We will analyze these common pitfalls and discuss high-yield shortcut methods, such as applying symmetry arguments, to solve numericals efficiently. Practicing these techniques will help you save precious time and boost your accuracy in the actual exam."
            }
        ]


@router.get("/ai-classroom")
def ai_classroom_content(_: object = Depends(get_current_user)):
    # Standard fallback return
    return {
        "slides": generate_slides_for_topic("Physics", "Newton's First Law")
    }


@router.get("/ai-classroom/topics")
def ai_classroom_topics(_: object = Depends(get_current_user)):
    return TOPICS_CATALOG


@router.get("/ai-classroom/slides")
def ai_classroom_slides(
    subject: str,
    topic: str,
    _: object = Depends(get_current_user)
):
    return {
        "slides": generate_slides_for_topic(subject, topic)
    }

