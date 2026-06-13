# Quantum AI IIT JEE Mock Tests (VALLURI™)

VALLURI™ is a next-generation, agentic AI-powered mock testing and personalized coaching platform designed specifically for IIT-JEE (Mains & Advanced) aspirants. The system combines robust pedagogy with a multi-agent system that autonomously plans study sessions, resolves student doubts, grades exams, tracks real-time progress, and forecasts Rank/All India Rank (AIR) bands.

This repository hosts a multi-tier codebase containing a fully functional **FastAPI backend**, an elegant **React 19 + TypeScript web application**, and the blueprint architecture for specialized AI agents, mobile/desktop applications, SDKs, and cloud deployment pipelines.

---

## 🏗️ Project Architecture

```mermaid
graph TD
    subgraph Client Tier [Web Frontend]
        Vite[Vite Dev Server]
        React[React 19 SPA]
        Router[React Router v7]
        Tailwind[Tailwind CSS v4]
        Vite --> React
        React --> Router
        React --> Tailwind
    end

    subgraph Service Tier [FastAPI Backend]
        API[FastAPI Router]
        Auth[JWT Security / Bcrypt]
        Exam[Exam & Grading Engine]
        Progress[Progress & Metrics Evaluator]
        DB_Adapter[SQLModel DB Adapter]
        
        API --> Auth
        API --> Exam
        API --> Progress
        Exam --> DB_Adapter
        Progress --> DB_Adapter
    end

    subgraph Storage Tier [Database]
        SQLite[(quantum_ai_jee.db)]
        DB_Adapter --> SQLite
    end

    subgraph Agentic AI Tier [Conceptual Roadmap]
        Planner[Adaptive Planner Agent]
        Solver[Doubt Solver Agent]
        Predictor[Rank Predictor Agent]
        Coach[Revision Coach]
    end

    Client Tier -- REST APIs --> API
    API -. Future Integration .-> Agentic AI Tier
```

---

## 📂 Repository Structure

The project is structured logically to separate functional implementations from conceptual blueprints:

```bash
├── agentic_ai/           # Blueprints for autonomous agents (Doubt Solver, Adaptive Planner, Revision Coach)
├── ai_models/            # Machine learning & prediction model architectures (adaptive learning, recommendations)
├── analytics/            # Telemetry dashboards, reports, and visualization definitions
├── backend/              # Core RESTful API implementation
│   ├── authentication/   # JWT creation, validation, and password security utilities
│   ├── models/           # DB entities (User, Question, ExamAttempt) and schemas via SQLModel
│   ├── routes/           # Endpoint routers (Auth, Exams, Progress, Student, Admin)
│   ├── db.py             # SQLite engine setup & table creation logic
│   ├── main.py           # FastAPI entrypoint, middleware, and startup handlers
│   ├── storage.py        # Database operations (CRUD) for users, exams, and questions
│   └── requirements.txt  # Python package dependencies
├── cloud/                # Cloud deployments, dockerization scripts, and GPU infrastructure setup
├── desktop_apps/         # Electron applications wrappers, builders, and EXE installers
├── documentation/        # Technical, architecture, and API documentation
├── frontend/             # Single Page Application
│   └── web/              # React 19 + TypeScript + Vite + Tailwind CSS v4 source code
├── mobile_app/           # Cross-platform mobile project skeletons (Flutter) and build outputs
├── question_bank/        # Structured database of questions organized by subject and topic
├── sdk/                  # Client SDK libraries (Java, Python, Node.js)
├── security/             # Custom JWT configurations, firewalls, and encryption standards
└── tests/                # Unit tests, integration tests, and AI model evaluation suites
```

---

## 🚀 Key Features

*   **Mock Test Engine**: Seamless JEE Mains & Advanced pattern-based test environment with a ticking countdown timer, interactive quiz layouts, and instant results calculation.
*   **Student Progress Analytics**: Real-time evaluation of average scores, estimated rank ranges, active streaks, and subject-wise accuracy tracking.
*   **JWT Authentication**: Secure user signup, login, password hashing (Bcrypt), and endpoint authorization checks.
*   **Responsive Dashboard**: Immersive student interface with subject-specific library links, target study goals, and recommended practice drills.
*   **Sample Question Seeding**: Auto-initializes the database with physics, chemistry, and mathematics questions upon backend startup.

---

## 🛠️ Technology Stack

### Backend
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
*   **Database ORM**: [SQLModel](https://sqlmodel.tiangolo.com/) (SQLAlchemy + Pydantic wrapper)
*   **Database**: SQLite (`quantum_ai_jee.db` generated locally)
*   **Security**: JWT tokens (`python-jose`) & password hashing (`passlib` + `bcrypt`)

### Frontend
*   **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vite.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Routing**: [React Router v7](https://reactrouter.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚡ Getting Started

### Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment**:
    *   **Windows**:
        ```powershell
        .\venv\Scripts\activate
        ```
    *   **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```

4.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Set up environment variables**:
    Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```

6.  **Run the development server**:
    ```bash
    uvicorn main:app --reload
    ```
    The API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend/web
    ```

2.  **Install node packages**:
    ```bash
    npm install
    ```

3.  **Launch the Vite dev server**:
    ```bash
    npm run dev
    ```
    The web application will launch at [http://localhost:5173](http://localhost:5173).

---

## 🗺️ Roadmap & Conceptual Blueprints

The root directories that contain empty templates represent the conceptual scope and future features of **VALLURI™**:

1.  **Agentic AI (`agentic_ai/`)**: Intended for specialized agents communicating asynchronously via messages to orchestrate study schedules, answer student queries, and design individual custom mock papers.
2.  **Mobile Client (`mobile_app/`)**: Built to serve Flutter application targets compiling into native iOS (`.ipa`) and Android (`.apk`) apps.
3.  **Desktop Client (`desktop_apps/`)**: For delivering packaged offline-ready desktop examination clients built using Electron.
4.  **SDKs (`sdk/`)**: Language-specific API wrappers to integrate question banks and grading algorithms into other institutional applications.

---

## 📝 License

This project is proprietary. All rights reserved.
