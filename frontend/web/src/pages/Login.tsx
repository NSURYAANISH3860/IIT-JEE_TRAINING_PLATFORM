import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import FooterPolicyLinks from "../components/FooterPolicyLinks";

type LoginProps = {
  initialMode?: "login" | "signup";
};

function Login({ initialMode = "login" }: LoginProps) {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(initialMode === "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [targetExam, setTargetExam] = useState("JEE Advanced");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loginStudent(loginEmail: string, loginPassword: string) {
    localStorage.setItem("access_token", "local_access_token");

    const existingUser = localStorage.getItem("current_user");
    if (!existingUser) {
      const defaultName = loginEmail.split("@")[0] || "Student";
      localStorage.setItem(
        "current_user",
        JSON.stringify({
          name: defaultName,
          email: loginEmail,
          class_level: "",
          target_exam: "",
        }),
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isSignup) {
        localStorage.setItem(
          "current_user",
          JSON.stringify({
            name,
            email,
            class_level: classLevel,
            target_exam: targetExam,
          }),
        );
      }

      loginStudent(email, password);
      window.dispatchEvent(new Event("auth-change"));
      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Request failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-copy">
          <p className="eyebrow">{isSignup ? "Signup" : "Login"}</p>
          <h1 id="auth-title">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p>
            {isSignup
              ? "Start your JEE practice with a student account."
              : "Sign in to continue your JEE practice."}
          </p>

          <div className="auth-mini-stats" aria-hidden="true">
            <span>Mock Tests</span>
            <span>Rank Tools</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>
                Name
                <input
                  type="text"
                  placeholder="Student name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>

              <div className="auth-form-grid">
                <label>
                  Class Level
                  <input
                    type="text"
                    placeholder="11, 12, or Dropper"
                    value={classLevel}
                    onChange={(event) => setClassLevel(event.target.value)}
                    required
                  />
                </label>

                <label>
                  Target Exam
                  <input
                    type="text"
                    placeholder="JEE Mains / JEE Advanced"
                    value={targetExam}
                    onChange={(event) => setTargetExam(event.target.value)}
                    required
                  />
                </label>
              </div>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : isSignup ? "Create Account" : "Login"}
          </button>

          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => {
              setIsSignup((currentValue) => !currentValue);
              setError("");
            }}
          >
            {isSignup
              ? "Already have an account? Login"
              : "New student? Create an account"}
          </button>

          {!isSignup && (
            <Link to="/forgot-password" className="auth-forgot-link">
              Forgot password?
            </Link>
          )}
        </form>
      </section>

      <div className="auth-policy-footer">
        <FooterPolicyLinks />
      </div>
    </main>
  );
}

export default Login;
