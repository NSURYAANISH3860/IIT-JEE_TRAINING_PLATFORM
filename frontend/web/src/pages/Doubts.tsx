import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, HelpCircle, RefreshCw, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";
import type { Doubt } from "../api";

const filters = ["all", "open", "answered", "resolved"] as const;

function Doubts() {
  const [subject, setSubject] = useState("Physics");
  const [topic, setTopic] = useState("Rotational Dynamics");
  const [question, setQuestion] = useState("");
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("all");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleDoubts = useMemo(() => {
    if (activeFilter === "all") return doubts;
    return doubts.filter((doubt) => doubt.status === activeFilter);
  }, [activeFilter, doubts]);

  async function loadDoubts() {
    setIsLoading(true);
    setMessage("");
    try {
      const data = await apiRequest<Doubt[]>("/api/doubts");
      setDoubts(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load doubts.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDoubts();
  }, []);

  async function submitDoubt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const created = await apiRequest<Doubt>("/api/doubts", {
        method: "POST",
        body: JSON.stringify({ subject, topic, question }),
      });
      setDoubts((current) => [created, ...current]);
      setQuestion("");
      setActiveFilter("all");
      setMessage("Doubt submitted. Your AI explanation is ready.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit doubt.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resolveDoubt(doubtId: string) {
    setMessage("");
    try {
      const updated = await apiRequest<Doubt>(`/api/doubts/${doubtId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "resolved" }),
      });
      setDoubts((current) => current.map((doubt) => (doubt.id === doubtId ? updated : doubt)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update doubt.");
    }
  }

  return (
    <main className="dashboard-doubts-page">
      <section className="dashboard-doubts-hero">
        <p className="dashboard-overline">Doubts</p>
        <h1>
          Ask, revise, <em>resolve.</em>
        </h1>
        <p>Send a doubt from any chapter and keep your solved questions in one place.</p>
      </section>

      <section className="doubts-workspace">
        <form className="doubts-form-card" onSubmit={submitDoubt}>
          <div>
            <p className="dashboard-overline">Ask</p>
            <h2>Submit a doubt</h2>
          </div>

          <div className="doubts-form-grid">
            <label>
              Subject
              <input value={subject} onChange={(event) => setSubject(event.target.value)} required />
            </label>
            <label>
              Topic
              <input value={topic} onChange={(event) => setTopic(event.target.value)} required />
            </label>
          </div>

          <label>
            Question
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Type the exact question or concept that is confusing you."
              required
              minLength={10}
            />
          </label>

          {message && <p className="doubts-message">{message}</p>}

          <button type="submit" disabled={isSubmitting}>
            <Send size={17} />
            {isSubmitting ? "Submitting..." : "Submit Doubt"}
          </button>
        </form>

        <section className="doubts-list-panel">
          <div className="doubts-list-heading">
            <div>
              <p className="dashboard-overline">Notebook</p>
              <h2>My doubts</h2>
            </div>
            <button type="button" onClick={loadDoubts} disabled={isLoading}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          <div className="doubts-filter-row" aria-label="Doubt filters">
            {filters.map((filter) => (
              <button
                type="button"
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
                key={filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="doubts-list">
            {visibleDoubts.length === 0 ? (
              <div className="doubts-empty-state">
                <HelpCircle size={34} />
                <p>{isLoading ? "Loading doubts..." : "No doubts in this filter yet."}</p>
              </div>
            ) : (
              visibleDoubts.map((doubt) => (
                <article className="doubt-card" key={doubt.id}>
                  <div className="doubt-card-top">
                    <span>{doubt.status}</span>
                    <strong>{doubt.subject} - {doubt.topic}</strong>
                  </div>
                  <h3>{doubt.question}</h3>
                  {doubt.ai_answer && (
                    <p>
                      <Sparkles size={15} />
                      {doubt.ai_answer}
                    </p>
                  )}
                  <div className="doubt-card-actions">
                    <button
                      type="button"
                      onClick={() => resolveDoubt(doubt.id)}
                      disabled={doubt.status === "resolved"}
                    >
                      <CheckCircle2 size={16} />
                      {doubt.status === "resolved" ? "Resolved" : "Mark resolved"}
                    </button>
                    <Link to="/dashboard/ai-classroom">Open classroom</Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>

      <footer className="dashboard-footer">
        <span>&copy; 2026 VALLURI&trade; IIT-JEE. All rights reserved.</span>
        <Link to="/dashboard/ai-coaching">AI coaching</Link>
      </footer>
    </main>
  );
}

export default Doubts;
