import os
import httpx
import math
import random
from collections import defaultdict
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from datetime import datetime, timezone

from models.db_models import Doubt, ExamAttempt, Question, User, UserActivity
from models.schemas import DoubtCreate, DoubtUpdate, QuestionCreate, QuestionUpdate


def create_user(session: Session, user_data: dict) -> User:
    user = User(**user_data)
    session.add(user)

    try:
        session.commit()
        session.refresh(user)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists",
        )

    return user


def get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email.strip().lower())
    return session.exec(statement).one_or_none()


def get_user_by_id(session: Session, user_id: str) -> User | None:
    statement = select(User).where(User.id == user_id)
    return session.exec(statement).one_or_none()


def update_student_selection(session: Session, email: str, subject: str, topic: str) -> User:
    user = get_user_by_email(session, email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.selected_subject = subject
    user.selected_topic = topic
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def create_question(session: Session, payload: QuestionCreate) -> Question:
    question = Question(**payload.dict())
    session.add(question)
    session.commit()
    session.refresh(question)
    return question


def list_questions(session: Session) -> list[Question]:
    statement = select(Question).order_by(Question.created_at.desc())
    return session.exec(statement).all()


def get_question_by_id(session: Session, question_id: str) -> Question | None:
    statement = select(Question).where(Question.id == question_id)
    return session.exec(statement).one_or_none()


def update_question(session: Session, question_id: str, payload: QuestionUpdate) -> Question:
    question = get_question_by_id(session, question_id)

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(question, field, value)

    session.add(question)
    session.commit()
    session.refresh(question)
    return question


def delete_question(session: Session, question_id: str) -> None:
    question = get_question_by_id(session, question_id)
    if question:
        session.delete(question)
        session.commit()


def generate_procedural_questions(subject: str, topic: str | None = None, exam_type: str = "jee_mains", count: int = 10) -> list[Question]:
    physics_templates = [
        {
            "topic": "Kinematics",
            "get": lambda: {
                "question": f"A Vernier caliper has 1 MSD = {msd := random.choice([0.5, 1.0, 2.0])} mm. If {n := random.choice([10, 20, 50])} divisions of Vernier scale coincide with {m := random.choice([8, 9, 16, 49])} divisions of main scale, find the least count in mm.",
                "options": [f"{round(msd * (1 - m/n), 3)} mm", f"{round(msd * (1 - m/(n+2)), 3)} mm", f"{round(msd * (1 - (m+1)/n), 3)} mm", f"{round(msd * 0.1, 3)} mm"],
                "correct": f"{round(msd * (1 - m/n), 3)} mm",
                "explanation": f"LC = 1 MSD - 1 VSD. Given {n} VSD = {m} MSD, so 1 VSD = ({m}/{n}) MSD. LC = 1 MSD * (1 - {m}/{n}) = {msd} * (1 - {m}/{n}) = {round(msd * (1 - m/n), 3)} mm."
            }
        },
        {
            "topic": "Kinematics",
            "get": lambda: {
                "question": f"A projectile is launched with velocity {u := random.choice([10, 20, 30, 40])} m/s at an angle {angle := random.choice([30, 45, 60])}° above the horizontal. Find its maximum height in meters. (Take g = 10 m/s^2)",
                "options": [f"{round((u**2 * (math.sin(math.radians(angle))**2)) / 20.0, 2)} m", f"{round((u**2 * 0.5) / 20.0, 2)} m", f"{round((u**2) / 20.0, 2)} m", f"{round((u**2 * 0.25) / 20.0, 2)} m"],
                "correct": f"{round((u**2 * (math.sin(math.radians(angle))**2)) / 20.0, 2)} m",
                "explanation": f"Maximum height H = (u^2 * sin^2(theta)) / (2g). Substituting u = {u} and theta = {angle} gives H = ({u}^2 * sin^2({angle})) / 20 = {round((u**2 * (math.sin(math.radians(angle))**2)) / 20.0, 2)} m."
            }
        },
        {
            "topic": "Kinematics",
            "get": lambda: {
                "question": f"A block of mass {m := random.choice([2, 5, 10])} kg lies on a smooth horizontal surface. A force of {F := random.choice([10, 20, 50])} N is applied. Find its acceleration in m/s^2.",
                "options": [f"{round(F/m, 2)} m/s^2", f"{round(F/(m+2), 2)} m/s^2", f"{round(F*1.5/m, 2)} m/s^2", f"{round(F/(m-1) if m > 1 else 9.8, 2)} m/s^2"],
                "correct": f"{round(F/m, 2)} m/s^2",
                "explanation": f"Using F = ma, acceleration a = F / m = {F} / {m} = {round(F/m, 2)} m/s^2."
            }
        },
        {
            "topic": "Rotational Dynamics",
            "get": lambda: {
                "question": f"A uniform solid disc of mass {M := random.choice([2, 4, 10])} kg and radius {R := random.choice([0.5, 1.0, 2.0])} m rotates. Find its moment of inertia about the central axis perpendicular to its plane in kg m^2.",
                "options": [f"{round(0.5 * M * R**2, 4)} kg m^2", f"{round(M * R**2, 4)} kg m^2", f"{round(0.4 * M * R**2, 4)} kg m^2", f"{round(0.25 * M * R**2, 4)} kg m^2"],
                "correct": f"{round(0.5 * M * R**2, 4)} kg m^2",
                "explanation": f"For a solid disc, Moment of Inertia I = 0.5 * M * R^2 = 0.5 * {M} * {R}^2 = {round(0.5 * M * R**2, 4)} kg m^2."
            }
        },
        {
            "topic": "Rotational Dynamics",
            "get": lambda: {
                "question": f"In a simple pendulum experiment, the error in measuring length L is {errL := random.choice([1, 2])}% and the error in measuring time period T is {errT := random.choice([1, 2, 3])}%. What is the estimated percentage error in acceleration due to gravity g?",
                "options": [f"{errL + 2*errT}%", f"{errL + errT}%", f"{2*errL + errT}%", f"{errL + 3*errT}%"],
                "correct": f"{errL + 2*errT}%",
                "explanation": f"g = 4*pi^2*L / T^2. Relative error: dg/g = dL/L + 2 * dT/T. Percentage error = {errL}% + 2 * {errT}% = {errL + 2*errT}%."
            }
        },
        {
            "topic": "Chemical Bonding",
            "get": lambda: {
                "question": f"In a calorimeter, {m1 := random.choice([50, 100])} g of water at {t1 := random.choice([80, 90])}°C is mixed with {m2 := random.choice([50, 100])} g of water at {t2 := random.choice([10, 20])}°C. Neglecting calorimeter heat capacity, find the final temperature of the mixture in °C.",
                "options": [f"{round((m1*t1 + m2*t2)/(m1+m2), 1)}°C", f"{round((t1+t2)/2.0 - 5.0, 1)}°C", f"{round((t1+t2)/2.0 + 5.0, 1)}°C", f"{round(t2 + 15.0, 1)}°C"],
                "correct": f"{round((m1*t1 + m2*t2)/(m1+m2), 1)}°C",
                "explanation": f"Heat lost = Heat gained. m1 * s * (t1 - tf) = m2 * s * (tf - t2). Since specific heat s cancels, tf = (m1*t1 + m2*t2) / (m1 + m2) = ({m1}*{t1} + {m2}*{t2}) / ({m1} + {m2}) = {round((m1*t1 + m2*t2)/(m1+m2), 1)}°C."
            }
        }
    ]

    chemistry_templates = [
        {
            "topic": "Chemical Bonding",
            "get": lambda: {
                "question": f"Calculate the number of moles present in {w := random.choice([10, 20, 40, 80])} grams of Sodium hydroxide (NaOH). (Molar mass of NaOH = 40 g/mol)",
                "options": [f"{round(w/40, 2)} mol", f"{round(w/20, 2)} mol", f"{round(w/80, 2)} mol", f"{round(w/10, 2)} mol"],
                "correct": f"{round(w/40, 2)} mol",
                "explanation": f"Moles = given mass / molar mass = {w} / 40 = {round(w/40, 2)} mol."
            }
        },
        {
            "topic": "Coordination Compounds",
            "get": lambda: {
                "question": f"What is the coordination number of cobalt in the complex [Co(en)_{n := random.choice([2, 3])}]Cl3? (en is ethylenediamine)",
                "options": [f"{n*2}", f"{n}", f"{n+3}", f"3"],
                "correct": f"{n*2}",
                "explanation": f"en is a bidentate ligand. {n} bidentate ligands form {n} x 2 = {n*2} coordinate bonds. Hence coordination number is {n*2}."
            }
        },
        {
            "topic": "Chemical Bonding",
            "get": lambda: {
                "question": f"A gas at constant volume has pressure {p1 := random.choice([1, 2, 3])} atm at {t1 := random.choice([273, 300])} K. If it is heated to {t2 := random.choice([400, 450, 600])} K, find the final pressure in atm.",
                "options": [f"{round(p1 * t2 / t1, 2)} atm", f"{round(p1 * t1 / t2, 2)} atm", f"{round(p1 + 1.5, 2)} atm", f"{round(p1 * 2.0, 2)} atm"],
                "correct": f"{round(p1 * t2 / t1, 2)} atm",
                "explanation": f"At constant volume, P1/T1 = P2/T2. So P2 = P1 * T2 / T1 = {p1} * {t2} / {t1} = {round(p1 * t2 / t1, 2)} atm."
            }
        }
    ]

    math_templates = [
        {
            "topic": "Algebra",
            "get": lambda: {
                "question": f"Find the value of x if the algebraic equation satisfies: {coeff := random.choice([2, 3, 5])}x + {const := random.choice([4, 6, 10])} = {val := random.choice([20, 25, 40])}.",
                "options": [f"{round((val - const)/coeff, 2)}", f"{round((val + const)/coeff, 2)}", f"{round((val - coeff)/const, 2)}", f"{round(val/coeff, 2)}"],
                "correct": f"{round((val - const)/coeff, 2)}",
                "explanation": f"{coeff}x = {val} - {const} = {val-const}. Hence x = {val-const} / {coeff} = {round((val-const)/coeff, 2)}."
            }
        },
        {
            "topic": "Definite Integration",
            "get": lambda: {
                "question": f"Evaluate the definite integral: ∫ from 0 to {b := random.choice([2, 4, 6])} of {coeff := random.choice([2, 4, 8])}x dx.",
                "options": [f"{round(0.5 * coeff * b**2, 2)}", f"{round(coeff * b, 2)}", f"{round(coeff * b**2, 2)}", f"{round(0.33 * coeff * b**3, 2)}"],
                "correct": f"{round(0.5 * coeff * b**2, 2)}",
                "explanation": f"∫ {coeff}x dx = {coeff} * [x^2/2] evaluated from 0 to {b} = 0.5 * {coeff} * {b}^2 = {round(0.5 * coeff * b**2, 2)}."
            }
        },
        {
            "topic": "Probability",
            "get": lambda: {
                "question": f"Two independent events A and B have probabilities P(A) = {p1 := random.choice([0.4, 0.5, 0.6])} and P(B) = {p2 := random.choice([0.3, 0.5, 0.8])}. Find P(A ∩ B).",
                "options": [f"{round(p1 * p2, 4)}", f"{round(p1 + p2, 4)}", f"{round(p1 - p2 if p1 > p2 else p2 - p1, 4)}", f"{round(p1 / p2 if p2 > 0 else 0, 4)}"],
                "correct": f"{round(p1 * p2, 4)}",
                "explanation": f"Since A and B are independent, P(A ∩ B) = P(A) * P(B) = {p1} * {p2} = {round(p1 * p2, 4)}."
            }
        }
    ]

    templates = []
    sub = subject.lower()
    if "phys" in sub:
        templates = physics_templates
    elif "chem" in sub:
        templates = chemistry_templates
    elif "math" in sub:
        templates = math_templates
    else:
        templates = physics_templates + chemistry_templates + math_templates

    if topic and topic.strip().lower() != "all":
        filtered = [t for t in templates if t["topic"].lower() == topic.strip().lower()]
        if filtered:
            templates = filtered

    results = []
    for _ in range(count):
        tpl = random.choice(templates)
        data = tpl["get"]()
        opts = data["options"]
        correct_answer = data["correct"]

        # Make 30% of Advanced questions numerical
        if exam_type == "jee_advanced" and random.random() < 0.3:
            opts = []
            val_part = correct_answer.split(" ")[0]
            correct_answer = "".join(c for c in val_part if c.isdigit() or c == "." or c == "-")

        q = Question(
            exam_type=exam_type,
            subject=subject,
            topic=tpl["topic"],
            question_text=data["question"],
            options=opts,
            correct_option=correct_answer,
            explanation=data["explanation"]
        )
        results.append(q)
    return results


def get_questions_for_exam(
    session: Session,
    subject: str | None = None,
    topic: str | None = None,
    exam_type: str | None = None,
    limit: int = 10,
) -> list[Question]:
    # Check for JEE Mains 75-question full test
    is_mains_full_test = (limit == 75 and (not subject or subject.strip().lower() == "all"))
    
    if is_mains_full_test:
        physics_qs = get_questions_for_exam(session, "Physics", "All", "jee_mains", 25)
        chemistry_qs = get_questions_for_exam(session, "Chemistry", "All", "jee_mains", 25)
        math_qs = get_questions_for_exam(session, "Mathematics", "All", "jee_mains", 25)
        return physics_qs + chemistry_qs + math_qs

    statement = select(Question)
    if subject and subject.strip().lower() != "all":
        statement = statement.where(func.lower(Question.subject) == subject.strip().lower())
    if topic and topic.strip().lower() != "all":
        statement = statement.where(func.lower(Question.topic) == topic.strip().lower())
    if exam_type and exam_type.strip().lower() != "all":
        statement = statement.where(func.lower(Question.exam_type) == exam_type.strip().lower())
    statement = statement.order_by(func.random()).limit(limit)
    questions = session.exec(statement).all()

    # Generate procedurally if not enough in DB
    if len(questions) < limit:
        needed = limit - len(questions)
        subj = subject if (subject and subject.strip().lower() != "all") else random.choice(["Physics", "Chemistry", "Mathematics"])
        etype = exam_type if (exam_type and exam_type.strip().lower() != "all") else "jee_mains"
        tpic = topic if (topic and topic.strip().lower() != "all") else None
        
        proc_qs = generate_procedural_questions(subj, tpic, etype, needed)
        questions.extend(proc_qs)
        
    return questions


def create_exam_attempt(
    session: Session,
    user_id: str,
    subject: str,
    topic: str,
    total_questions: int,
    correct_answers: int,
    score: float,
    duration_seconds: int,
    details: list[dict[str, Any]],
) -> ExamAttempt:
    attempt = ExamAttempt(
        user_id=user_id,
        subject=subject,
        topic=topic,
        total_questions=total_questions,
        correct_answers=correct_answers,
        score=score,
        duration_seconds=duration_seconds,
        details=details,
    )
    session.add(attempt)
    session.commit()
    session.refresh(attempt)
    return attempt


def get_user_attempts(session: Session, user_id: str) -> list[ExamAttempt]:
    statement = select(ExamAttempt).where(ExamAttempt.user_id == user_id).order_by(ExamAttempt.created_at.desc())
    return session.exec(statement).all()


def get_leaderboard(
    session: Session,
    subject: str | None = None,
    topic: str | None = None,
    limit: int = 10,
) -> list[ExamAttempt]:
    statement = select(ExamAttempt)
    if subject:
        statement = statement.where(func.lower(ExamAttempt.subject) == subject.strip().lower())
    if topic:
        statement = statement.where(func.lower(ExamAttempt.topic) == topic.strip().lower())
    statement = statement.order_by(ExamAttempt.score.desc(), ExamAttempt.created_at.desc()).limit(limit)
    return session.exec(statement).all()


def get_progress_summary(session: Session, user_id: str) -> dict[str, Any]:
    attempts = get_user_attempts(session, user_id)
    total_attempts = len(attempts)

    if total_attempts == 0:
        return {
            "total_attempts": 0,
            "average_score": 0.0,
            "best_score": 0.0,
            "recent_attempts": [],
            "subject_accuracy": {},
            "weak_topics": {},
        }

    total_score = 0.0
    subject_counts: dict[str, int] = defaultdict(int)
    subject_correct: dict[str, int] = defaultdict(int)
    topic_counts: dict[str, int] = defaultdict(int)
    topic_correct: dict[str, int] = defaultdict(int)

    for attempt in attempts:
        total_score += attempt.score
        for item in attempt.details:
            subject = item.get("subject", "unknown")
            topic = item.get("topic", "unknown")
            is_correct = bool(item.get("is_correct"))
            subject_counts[subject] += 1
            topic_counts[topic] += 1
            if is_correct:
                subject_correct[subject] += 1
                topic_correct[topic] += 1

    subject_accuracy = {
        subject: round((subject_correct[subject] / subject_counts[subject]) * 100, 2)
        for subject in subject_counts
    }

    weak_topics = {
        topic: round((topic_correct[topic] / topic_counts[topic]) * 100, 2)
        for topic in topic_counts
    }

    weak_topics = dict(sorted(weak_topics.items(), key=lambda item: item[1]))

    return {
        "total_attempts": total_attempts,
        "average_score": round(total_score / total_attempts, 2),
        "best_score": max(attempt.score for attempt in attempts),
        "recent_attempts": [attempt for attempt in attempts[:5]],
        "subject_accuracy": subject_accuracy,
        "weak_topics": weak_topics,
    }


def call_gemini_api(prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return ""
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }
    try:
        response = httpx.post(url, json=payload, headers=headers, timeout=20.0)
        if response.status_code == 200:
            data = response.json()
            if "contents" in data and len(data["contents"]) > 0:
                parts = data["contents"][0].get("parts", [])
                if len(parts) > 0:
                    text = parts[0].get("text", "")
                    if text:
                        return text.strip()
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
    return ""


def generate_doubt_answer(subject: str, topic: str, question: str) -> str:
    prompt = f"""You are an expert IIT-JEE coach and tutor. Solve the following student's doubt on the subject '{subject}' and topic '{topic}'.
Provide a highly detailed, clear, and step-by-step explanation.

Student's Doubt:
{question}

Please format your response in clear Markdown with:
1. **Core Concept**: Explain the underlying theory or principle.
2. **Key Formulas**: List any relevant formulas or equations.
3. **Step-by-Step Explanation/Solution**: Provide a clear, structured walkthrough to solve or understand the problem.
4. **Pro Tip/Common Trap**: Highlight what students should look out for in the exam (JEE Mains/Advanced) regarding this concept.
"""
    reply = call_gemini_api(prompt)
    if reply:
        return reply

    # Fallback response
    return f"""### AI Explanation for: {question}

#### 1. Core Concept
In **{subject}** under **{topic}**, this question relates to the core principles of the topic. Let's break down the fundamentals.

#### 2. Key Formulas
- Standard relation: $E = h\\nu$ or $F = ma$ or $I = \\sum m_i r_i^2$ (adapt depending on the subject/topic).
- Ensure consistent unit conventions (SI units).

#### 3. Step-by-Step Explanation
- **Step 1: Identify the given data**: Start by listing all variables mentioned in the question.
- **Step 2: Apply the governing law**: Set up the equations relating these variables.
- **Step 3: Solve the mathematical steps**: Carefully compute the value, keeping track of signs.
- **Step 4: Verify boundary conditions**: Check if the answer behaves as expected at extreme limits.

#### 4. Pro Tip for JEE
*Watch out for mixed units (e.g. g vs kg, cm vs m) and coordinate sign conventions. JEE questions often trap students on these simple details!*"""


def create_doubt(session: Session, user_id: str, payload: DoubtCreate) -> Doubt:
    doubt = Doubt(
        user_id=user_id,
        subject=payload.subject,
        topic=payload.topic,
        question=payload.question,
        ai_answer=generate_doubt_answer(payload.subject, payload.topic, payload.question),
        status="answered",
    )
    session.add(doubt)
    session.commit()
    session.refresh(doubt)
    return doubt


def list_user_doubts(session: Session, user_id: str, status_filter: str | None = None) -> list[Doubt]:
    statement = select(Doubt).where(Doubt.user_id == user_id)
    if status_filter:
        statement = statement.where(func.lower(Doubt.status) == status_filter.strip().lower())
    statement = statement.order_by(Doubt.created_at.desc())
    return session.exec(statement).all()


def get_doubt_by_id(session: Session, doubt_id: str, user_id: str) -> Doubt | None:
    statement = select(Doubt).where(Doubt.id == doubt_id, Doubt.user_id == user_id)
    return session.exec(statement).one_or_none()


def update_doubt(session: Session, doubt_id: str, user_id: str, payload: DoubtUpdate) -> Doubt:
    doubt = get_doubt_by_id(session, doubt_id, user_id)
    if not doubt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doubt not found",
        )

    updates = payload.dict(exclude_unset=True)
    allowed_statuses = {"open", "answered", "resolved"}
    if "status" in updates and updates["status"] not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be open, answered, or resolved",
        )

    for field, value in updates.items():
        setattr(doubt, field, value)

    doubt.updated_at = datetime.now(timezone.utc)
    session.add(doubt)
    session.commit()
    session.refresh(doubt)
    return doubt
def create_default_questions(session: Session) -> None:
    statement = select(Question)
    existing = session.exec(statement).first()
    if existing:
        return

    sample_questions = [
        # JEE Mains Questions
        Question(
            exam_type="jee_mains",
            subject="Physics",
            topic="Kinematics",
            question_text="A body starts from rest and moves with constant acceleration 2 m/s^2. What is its speed after 5 seconds?",
            options=["10 m/s", "7.5 m/s", "5 m/s", "12 m/s"],
            correct_option="10 m/s",
            explanation="The speed is a*t = 2 * 5 = 10 m/s.",
        ),
        Question(
            exam_type="jee_mains",
            subject="Physics",
            topic="Modern Physics",
            question_text="In a photoelectric effect experiment, if the intensity of the light source is doubled, which of the following is correct?",
            options=["The saturation photoelectric current is doubled", "The stopping potential is doubled", "The maximum kinetic energy of photoelectrons is doubled", "The threshold frequency is halved"],
            correct_option="The saturation photoelectric current is doubled",
            explanation="Photoelectric current is directly proportional to intensity (number of photons per second), while stopping potential and max KE depend only on the frequency of light.",
        ),
        Question(
            exam_type="jee_mains",
            subject="Physics",
            topic="Rotational Dynamics",
            question_text="A solid sphere of mass M and radius R rolls without slipping on a horizontal surface. What is the ratio of its rotational kinetic energy to its total kinetic energy?",
            options=["2/7", "2/5", "5/7", "3/5"],
            correct_option="2/7",
            explanation="Rotational KE = 1/2 I w^2 = 1/2 (2/5 MR^2) (v/R)^2 = 1/5 Mv^2. Total KE = Translational KE + Rotational KE = 1/2 Mv^2 + 1/5 Mv^2 = 7/10 Mv^2. Ratio = (1/5) / (7/10) = 2/7.",
        ),
        Question(
            exam_type="jee_mains",
            subject="Chemistry",
            topic="Chemical Bonding",
            question_text="Which of the following molecules has a trigonal planar geometry?",
            options=["CH4", "BF3", "NH3", "H2O"],
            correct_option="BF3",
            explanation="BF3 has three bonding pairs and no lone pairs, making it trigonal planar.",
        ),
        Question(
            exam_type="jee_mains",
            subject="Chemistry",
            topic="Coordination Compounds",
            question_text="What is the coordination number and oxidation state of cobalt in the complex [Co(en)3]Cl3?",
            options=["Coordination number: 6, Oxidation state: +3", "Coordination number: 3, Oxidation state: +3", "Coordination number: 6, Oxidation state: +2", "Coordination number: 3, Oxidation state: +2"],
            correct_option="Coordination number: 6, Oxidation state: +3",
            explanation="Ethylene diamine (en) is a bidentate ligand, so 3 bidentate ligands give a coordination number of 6. Chlorine is anionic (Cl-), so Co oxidation state is +3.",
        ),
        Question(
            exam_type="jee_mains",
            subject="Mathematics",
            topic="Algebra",
            question_text="What is the value of x if 2x + 5 = 13?",
            options=["4", "6", "3", "8"],
            correct_option="4",
            explanation="2x = 8, so x = 4.",
        ),
        Question(
            exam_type="jee_mains",
            subject="Mathematics",
            topic="Definite Integration",
            question_text="Evaluate the definite integral: ∫ from 0 to π/2 of (sin x) / (sin x + cos x) dx.",
            options=["π/4", "π/2", "π", "0"],
            correct_option="π/4",
            explanation="Using King's Rule, I = ∫ (sin x)/(sin x + cos x) dx = ∫ (cos x)/(cos x + sin x) dx. Adding both gives 2I = ∫ 1 dx = [x] from 0 to π/2 = π/2. Therefore, I = π/4.",
        ),
        # JEE Advanced Questions
        Question(
            exam_type="jee_advanced",
            subject="Physics",
            topic="Rotational Dynamics",
            question_text="[MULTIPLE CORRECT] A rigid cylinder is performing pure rolling on a rough horizontal plane. Which of the following statements are correct?",
            options=["The work done by static friction is zero.", "The velocity of the point of contact with the surface is zero.", "Friction can be either forward, backward, or zero depending on the force applied.", "Kinetic friction is acting at the contact surface."],
            correct_option="The work done by static friction is zero.,The velocity of the point of contact with the surface is zero.,Friction can be either forward, backward, or zero depending on the force applied.",
            explanation="In pure rolling, the point of contact is instantaneously at rest, so its velocity is zero. Because there is no relative slipping, static friction acts (not kinetic) and does no work. The direction and magnitude of static friction depend on the external force applied.",
        ),
        Question(
            exam_type="jee_advanced",
            subject="Physics",
            topic="Modern Physics",
            question_text="[NUMERICAL] The work function of a metal is 2.0 eV. Light of wavelength 310 nm is incident on it. Find the maximum kinetic energy of the emitted photoelectrons in eV. (Take hc = 1240 eV-nm)",
            options=[],
            correct_option="2",
            explanation="Energy of photon E = hc / λ = 1240 eV-nm / 310 nm = 4.0 eV. Maximum KE = E - Φ = 4.0 eV - 2.0 eV = 2.0 eV.",
        ),
        Question(
            exam_type="jee_advanced",
            subject="Chemistry",
            topic="Coordination Compounds",
            question_text="[MULTIPLE CORRECT] Identify the correct statements regarding crystal field splitting in coordination complexes:",
            options=["Strong field ligands cause larger d-orbital splitting (Δ).", "Tetrahedral splitting energy (Δt) is less than octahedral splitting energy (Δo).", "[Fe(CN)6]3- is a low-spin complex.", "[Fe(H2O)6]3+ is a low-spin complex."],
            correct_option="Strong field ligands cause larger d-orbital splitting (Δ).,Tetrahedral splitting energy (Δt) is less than octahedral splitting energy (Δo).,[Fe(CN)6]3- is a low-spin complex.",
            explanation="CN- is a strong field ligand, so [Fe(CN)6]3- is low-spin. H2O is a weak field ligand, so [Fe(H2O)6]3+ is high-spin. Also, Δt is roughly 4/9 of Δo.",
        ),
        Question(
            exam_type="jee_advanced",
            subject="Mathematics",
            topic="Definite Integration",
            question_text="[NUMERICAL] Find the value of the definite integral: ∫ from -1 to 1 of (|x| + x^3) dx.",
            options=[],
            correct_option="1",
            explanation="The integral can be split: ∫_{-1}^1 |x| dx + ∫_{-1}^1 x^3 dx. Since x^3 is an odd function, its integral from -1 to 1 is 0. |x| is an even function, so ∫_{-1}^1 |x| dx = 2 * ∫_0^1 x dx = 2 * [x^2/2]_0^1 = 1.",
        ),
        Question(
            exam_type="jee_advanced",
            subject="Mathematics",
            topic="Probability",
            question_text="[MULTIPLE CORRECT] Let A and B be two independent events such that P(A) > 0 and P(B) > 0. Which of the following statements must be true?",
            options=["P(A|B) = P(A)", "P(B|A) = P(B)", "P(A∩B) = P(A) * P(B)", "A and B are mutually exclusive."],
            correct_option="P(A|B) = P(A),P(B|A) = P(B),P(A∩B) = P(A) * P(B)",
            explanation="By definition of independent events, P(A∩B) = P(A) * P(B), which implies P(A|B) = P(A) and P(B|A) = P(B). Independent events with non-zero probabilities cannot be mutually exclusive (P(A∩B) = 0).",
        ),
    ]
    session.add_all(sample_questions)
    session.commit()
def create_user_activity(
    session: Session,
    user_id: str,
    activity_type: str,
    title: str,
    subject: str,
    duration_seconds: int | None = None,
    score: float | None = None,
    extra_info: dict[str, Any] | None = None,
) -> UserActivity:
    activity = UserActivity(
        user_id=user_id,
        activity_type=activity_type,
        title=title,
        subject=subject,
        duration_seconds=duration_seconds,
        score=score,
        extra_info=extra_info or {},
    )
    session.add(activity)
    session.commit()
    session.refresh(activity)
    return activity


def get_user_activities(
    session: Session,
    user_id: str,
    limit: int = 50,
) -> list[UserActivity]:
    statement = (
        select(UserActivity)
        .where(UserActivity.user_id == user_id)
        .order_by(UserActivity.created_at.desc())
        .limit(limit)
    )
    return session.exec(statement).all()
