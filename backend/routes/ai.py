from typing import Optional
from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from routes.dependencies import get_current_user
from mongodb import get_mongodb

router = APIRouter(prefix="/api/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str
    subject: Optional[str] = None
    topic: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    subject: Optional[str] = None
    topic: Optional[str] = None


topic_content = {
    "Physics": {
        "Rotational Dynamics": {
            "title": "Rotational Dynamics",
            "explanation": (
                "Rotational dynamics explains how torque and angular acceleration drive spinning objects. "
                "Use τ = Iα to relate torque, moment of inertia, and angular acceleration. "
                "This is the core tool for solving rotating wheel, disc, and pulley problems."
            ),
            "tips": [
                "Always identify the rotation axis first.",
                "Draw forces and convert them into torques using perpendicular distance.",
                "Use the right-hand rule for angular directions.",
            ],
        },
        "Modern Physics": {
            "title": "Modern Physics",
            "explanation": (
                "Modern physics covers quantum and nuclear ideas. For the photoelectric effect, remember that light behaves as photons "
                "and energy hf is needed to eject electrons. The key equation is hf = Φ + KEmax."
            ),
            "tips": [
                "Match units carefully for energy, frequency, and wavelength.",
                "Note that increasing intensity raises current, not electron energy.",
                "Identify threshold frequency for the material.",
            ],
        },
    },
    "Chemistry": {
        "Coordination Compounds": {
            "title": "Coordination Compounds",
            "explanation": (
                "Coordination compounds are built from a central metal and ligands. The ligand field splits d orbitals, "
                "and the coordination number tells you how many ligands surround the metal."
            ),
            "tips": [
                "Use the spectrochemical series to compare ligand strength.",
                "Remember chelate ligands bind more strongly than monodentate ligands.",
                "Crystal field stabilization energy explains stability differences.",
            ],
        },
    },
    "Mathematics": {
        "Definite Integration": {
            "title": "Definite Integration",
            "explanation": (
                "Definite integration finds the exact area under a curve between two limits. Use the fundamental theorem of calculus: "
                "∫_a^b f(x) dx = F(b) - F(a), where F is an antiderivative of f."
            ),
            "tips": [
                "Always choose the correct substitution before evaluating limits.",
                "Simplify the integrand, then apply the power rule or integration by parts.",
                "Check for symmetry to simplify definite integrals when possible.",
            ],
        },
        "Probability": {
            "title": "Probability",
            "explanation": (
                "Probability measures how likely an event is. For conditional probability, use P(A|B) = P(A∩B)/P(B). "
                "Bayes' theorem helps update probability when new information arrives."
            ),
            "tips": [
                "Distinguish independent events from dependent events.",
                "Use tree diagrams to map complicated conditional scenarios.",
                "Convert word problems into counts or fractions before calculating.",
            ],
        },
    },
}


def build_agent_reply(message: str, subject: Optional[str], topic: Optional[str]) -> str:
    if subject and topic:
        subject_map = topic_content.get(subject)
        if subject_map:
            item = subject_map.get(topic)
            if item:
                tips = "\n".join(f"- {tip}" for tip in item["tips"])
                return (
                    f"{item['title']}\n\n{item['explanation']}\n\nQuick tips:\n{tips}"
                )

    lower = message.lower()
    if "rotational" in lower or "dynamics" in lower:
        return build_agent_reply(message, "Physics", "Rotational Dynamics")
    if "modern" in lower or "photoelectric" in lower or "quantum" in lower:
        return build_agent_reply(message, "Physics", "Modern Physics")
    if "coordination" in lower or "ligand" in lower or "complex" in lower:
        return build_agent_reply(message, "Chemistry", "Coordination Compounds")
    if "integration" in lower or "integral" in lower or "area under" in lower:
        return build_agent_reply(message, "Mathematics", "Definite Integration")
    if "probability" in lower or "bayes" in lower or "conditional" in lower:
        return build_agent_reply(message, "Mathematics", "Probability")

    return (
        "I’m your QuantumAI tutoring assistant. Ask me about a topic like \"Rotational Dynamics\", "
        "\"Coordination Compounds\", \"Definite Integration\", or \"Probability\" so I can explain it clearly."
    )


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user=Depends(get_current_user),
    mongo_db=Depends(get_mongodb)
):
    reply = build_agent_reply(request.message, request.subject, request.topic)
    
    # Store chat turn log in MongoDB
    if mongo_db is not None:
        try:
            chat_log = {
                "user_id": current_user.id,
                "message": request.message,
                "reply": reply,
                "subject": request.subject,
                "topic": request.topic,
                "timestamp": datetime.utcnow()
            }
            await mongo_db.chat_histories.insert_one(chat_log)
        except Exception as e:
            print(f"Error saving chat log to MongoDB: {e}")

    return ChatResponse(reply=reply, subject=request.subject, topic=request.topic)
