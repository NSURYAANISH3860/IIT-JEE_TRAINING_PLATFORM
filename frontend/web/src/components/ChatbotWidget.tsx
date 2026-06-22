import { useState, useRef, useEffect } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ── 3D Gold Robot SVG ────────────────────────────────────────────────────────
function RobotFace({ isThinking, size = 56 }: { isThinking: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 100 110" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: "block", overflow: "visible" }}>
      <defs>
        {/* Gold metallic gradients */}
        <linearGradient id="rb-head" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffe480" />
          <stop offset="35%" stopColor="#f2b91f" />
          <stop offset="70%" stopColor="#c8880a" />
          <stop offset="100%" stopColor="#8a5500" />
        </linearGradient>
        <linearGradient id="rb-body" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#f0c040" />
          <stop offset="50%" stopColor="#d4980e" />
          <stop offset="100%" stopColor="#7a4a00" />
        </linearGradient>
        <linearGradient id="rb-ear" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f2c84b" />
          <stop offset="100%" stopColor="#a06800" />
        </linearGradient>
        <radialGradient id="rb-eye" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#1a0a00" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
        <radialGradient id="rb-pupil" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="50%" stopColor="#f2b91f" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f2b91f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rb-antenna" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe480" />
          <stop offset="100%" stopColor="#c8880a" />
        </linearGradient>
        <filter id="rb-shine" x="-5%" y="-5%" width="110%" height="110%">
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>

      {/* Antenna stem */}
      <rect x="47" y="0" width="6" height="16" rx="3" fill="url(#rb-antenna)" />
      {/* Antenna ball */}
      <circle cx="50" cy="0" r="6" fill="#ffe480">
        <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="fill" values="#ffe480;#fff5b0;#ffe480" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Head */}
      <rect x="12" y="14" width="76" height="60" rx="20" fill="url(#rb-head)" />

      {/* Head top highlight (3D shine) */}
      <ellipse cx="38" cy="20" rx="20" ry="7" fill="#fff8d0" fillOpacity="0.22" />

      {/* Left ear */}
      <rect x="4" y="30" width="12" height="22" rx="6" fill="url(#rb-ear)" />
      <rect x="6" y="35" width="5" height="12" rx="2.5" fill="#050505" fillOpacity="0.45" />

      {/* Right ear */}
      <rect x="84" y="30" width="12" height="22" rx="6" fill="url(#rb-ear)" />
      <rect x="89" y="35" width="5" height="12" rx="2.5" fill="#050505" fillOpacity="0.45" />

      {/* Left eye socket */}
      <ellipse cx="34" cy="42" rx="12" ry="12" fill="#0d0800" />
      {/* Left eye glow */}
      <ellipse cx="34" cy="42" rx="9" ry="9" fill="url(#rb-pupil)">
        {isThinking && (
          <animate attributeName="rx" values="9;3;9" dur="0.55s" repeatCount="indefinite" />
        )}
      </ellipse>
      <circle cx="38" cy="38" r="2.5" fill="white" fillOpacity="0.85" />

      {/* Right eye socket */}
      <ellipse cx="66" cy="42" rx="12" ry="12" fill="#0d0800" />
      {/* Right eye glow */}
      <ellipse cx="66" cy="42" rx="9" ry="9" fill="url(#rb-pupil)">
        {isThinking && (
          <animate attributeName="rx" values="9;3;9" dur="0.55s" repeatCount="indefinite" />
        )}
      </ellipse>
      <circle cx="70" cy="38" r="2.5" fill="white" fillOpacity="0.85" />

      {/* Mouth */}
      {isThinking ? (
        <>
          <circle cx="41" cy="63" r="3.5" fill="#f2b91f" opacity="0.9">
            <animate attributeName="r" values="3.5;2;3.5" dur="0.5s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="63" r="3.5" fill="#f2b91f" opacity="0.9">
            <animate attributeName="r" values="3.5;2;3.5" dur="0.5s" begin="0.16s" repeatCount="indefinite" />
          </circle>
          <circle cx="59" cy="63" r="3.5" fill="#f2b91f" opacity="0.9">
            <animate attributeName="r" values="3.5;2;3.5" dur="0.5s" begin="0.32s" repeatCount="indefinite" />
          </circle>
        </>
      ) : (
        <path d="M36,60 Q50,72 64,60" stroke="#f2b91f" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}

      {/* Neck */}
      <rect x="42" y="73" width="16" height="9" rx="3" fill="#c8880a" />

      {/* Body */}
      <rect x="14" y="81" width="72" height="26" rx="13" fill="url(#rb-body)" />
      {/* Body shine */}
      <ellipse cx="37" cy="88" rx="17" ry="5" fill="#fff8d0" fillOpacity="0.15" />

      {/* Chest panel */}
      <rect x="32" y="87" width="36" height="14" rx="5" fill="#050505" fillOpacity="0.55" />

      {/* Panel LEDs */}
      <circle cx="42" cy="94" r="3.5" fill="#f2b91f">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="94" r="3.5" fill="#ffe480">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="58" cy="94" r="3.5" fill="#c8880a">
        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ── Thinking dots ─────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "10px 14px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#f2b91f",
          animation: `qb-bounce 1.1s ${i * 0.18}s ease-in-out infinite`,
          display: "inline-block",
        }} />
      ))}
    </div>
  );
}

// ── Widget ────────────────────────────────────────────────────────────────────
export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ right: 26, bottom: 26 });
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Hey! 👋 I'm your AI study assistant. Ask me any doubt about your exam prep — concepts, formulas, strategy, anything!",
  }]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [nudge, setNudge] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: 0,
    startX: 0,
    startY: 0,
    startRight: 26,
    startBottom: 26,
  });

  useEffect(() => {
    if (isOpen) return;
    const id = setInterval(() => {
      setNudge(true);
      setTimeout(() => setNudge(false), 700);
    }, 9000);
    return () => clearInterval(id);
  }, [isOpen]);

  useEffect(() => {
    if (localStorage.getItem("open_chatbot") === "1") {
      setIsOpen(true);
      localStorage.removeItem("open_chatbot");
    }

    function openChatbot() {
      setIsOpen(true);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === "open_chatbot" && event.newValue === "1") {
        setIsOpen(true);
        localStorage.removeItem("open_chatbot");
      }
    }

    window.addEventListener("open-chatbot", openChatbot);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("open-chatbot", openChatbot);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  function clampWidgetPosition(nextRight: number, nextBottom: number) {
    if (typeof window === "undefined") {
      return { right: nextRight, bottom: nextBottom };
    }

    const maxRight = Math.max(8, window.innerWidth - 86);
    const maxBottom = Math.max(8, window.innerHeight - 86);
    return {
      right: Math.min(Math.max(8, nextRight), maxRight),
      bottom: Math.min(Math.max(8, nextBottom), maxBottom),
    };
  }

  function startDrag(event: ReactPointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select, button.qb-send")) return;

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRight: position.right,
      startBottom: position.bottom,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragRef.current.moved = true;
    }

    setPosition(clampWidgetPosition(drag.startRight - deltaX, drag.startBottom - deltaY));
  }

  function stopDrag(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    dragRef.current.active = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || isThinking) return;
    const hist: Message[] = [...messages, { role: "user", content: text }];
    setMessages(hist);
    setInput("");
    setIsThinking(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an AI study assistant for QuantumAI Mock Tests — a platform for competitive exam preparation (JEE, NEET, UPSC, CAT, etc.).
- Answer academic doubts clearly and concisely
- Help with concepts, formulas, problem-solving, and exam strategy
- Be friendly, direct, and encouraging
- Use plain language; occasional emojis are fine
- Keep answers under 150 words unless the question genuinely needs depth`,
          messages: hist.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.find((b: { type: string }) => b.type === "text")?.text
        || "Something went wrong. Please try again!";
      setMessages(p => [...p, { role: "assistant", content: reply }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Connection error. Check your internet and retry. 🔌" }]);
    } finally {
      setIsThinking(false);
    }
  }

  const G = {
    gold: "#f2b91f",
    goldLight: "#ffe480",
    goldDark: "#c8880a",
    goldDeep: "#8a5500",
    black: "#050505",
    blackSoft: "#0f0f0f",
    blackCard: "#161206",
    surface: "#1a1508",
    border: "rgba(242,185,31,0.22)",
    borderHover: "rgba(242,185,31,0.45)",
    text: "#fff8e7",
    textMuted: "#c9a96e",
  };

  return (
    <>
      <style>{`
        @keyframes qb-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-7px)} }
        @keyframes qb-pop { 0%{transform:scale(0.7) translateY(16px);opacity:0} 70%{transform:scale(1.04) translateY(-2px);opacity:1} 100%{transform:scale(1);opacity:1} }
        @keyframes qb-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes qb-nudge { 0%,100%{transform:translateY(0)} 30%{transform:translateY(-9px)} 60%{transform:translateY(-4px)} }
        @keyframes qb-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.65);opacity:0} }
        @keyframes qb-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .qb-msg-anim { animation: qb-pop 0.28s ease forwards; }
        .qb-input:focus { border-color: rgba(242,185,31,0.6) !important; outline: none; box-shadow: 0 0 0 2px rgba(242,185,31,0.12); }
        .qb-input::placeholder { color: #7a5c28; }
        .qb-send:disabled { opacity: 0.35; cursor: default; }
        .qb-send:not(:disabled):hover { background: #c8880a !important; }
        .qb-fab-btn:hover { transform: scale(1.07); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(242,185,31,0.3); border-radius: 4px; }
      `}</style>

      <div
        style={{
          position: "fixed",
          bottom: position.bottom,
          right: position.right,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
          touchAction: "none",
        }}
      >

        {/* Tooltip */}
        {!isOpen && (
          <div style={{
            background: "linear-gradient(90deg, #c8880a, #f2b91f, #ffe480, #f2b91f, #c8880a)",
            backgroundSize: "200% auto",
            animation: "qb-shimmer 3s linear infinite, qb-float 3.5s ease-in-out infinite",
            color: "#050505",
            fontSize: 12,
            fontWeight: 700,
            padding: "6px 14px",
            borderRadius: 20,
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 16px rgba(242,185,31,0.35)",
          }}>
            Ask your doubt ✦
          </div>
        )}

        {/* Chat panel */}
        {isOpen && (
          <div className="qb-msg-anim" style={{
            width: 358,
            height: 496,
            background: G.black,
            border: `1px solid ${G.border}`,
            borderRadius: 20,
            boxShadow: `0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(242,185,31,0.08), inset 0 1px 0 rgba(242,185,31,0.12)`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
          }}>

            {/* Header */}
            <div
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={stopDrag}
              onPointerCancel={stopDrag}
              style={{
              background: `linear-gradient(135deg, #0d0800 0%, #1a1000 50%, #0d0800 100%)`,
              borderBottom: `1px solid rgba(242,185,31,0.3)`,
              padding: "11px 14px",
              display: "flex",
              alignItems: "center",
              gap: 11,
              cursor: "grab",
              userSelect: "none",
              touchAction: "none",
            }}>
              <div style={{ width: 46, height: 46, flexShrink: 0 }}>
                <RobotFace isThinking={isThinking} size={46} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  color: G.gold,
                  fontWeight: 700,
                  fontSize: 14.5,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}>
                  AI Assistant
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px #4ade80" }} />
                  <span style={{ color: G.textMuted, fontSize: 11 }}>Online · QuantumAI</span>
                </div>
              </div>
              <button
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => setIsOpen(false)}
                style={{
                background: "rgba(242,185,31,0.08)",
                border: `1px solid rgba(242,185,31,0.2)`,
                borderRadius: "50%",
                width: 28, height: 28,
                cursor: "pointer",
                color: G.goldLight,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>×</button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 12px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: G.black,
            }}>
              {messages.map((msg, i) => (
                <div key={i} className="qb-msg-anim" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                }}>
                  {msg.role === "assistant" && (
                    <div style={{ marginBottom: 4, marginLeft: 2 }}>
                      <RobotFace isThinking={false} size={20} />
                    </div>
                  )}
                  <div style={{
                    maxWidth: "83%",
                    padding: "9px 13px",
                    borderRadius: msg.role === "user" ? "16px 16px 3px 16px" : "16px 16px 16px 3px",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    background: msg.role === "user"
                      ? `linear-gradient(135deg, ${G.goldDark} 0%, ${G.gold} 100%)`
                      : G.surface,
                    color: msg.role === "user" ? "#050505" : G.text,
                    fontWeight: msg.role === "user" ? 500 : 400,
                    border: msg.role === "assistant" ? `1px solid ${G.border}` : "none",
                    boxShadow: msg.role === "user"
                      ? "0 4px 16px rgba(200,136,10,0.35)"
                      : "0 2px 8px rgba(0,0,0,0.4)",
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                  <RobotFace isThinking size={20} />
                  <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "16px 16px 16px 3px" }}>
                    <ThinkingDots />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input bar */}
            <div style={{
              padding: "10px 11px",
              background: "#0a0800",
              borderTop: `1px solid rgba(242,185,31,0.18)`,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}>
              <input
                className="qb-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Type your doubt…"
                disabled={isThinking}
                style={{
                  flex: 1,
                  background: G.surface,
                  border: `1px solid ${G.border}`,
                  borderRadius: 20,
                  padding: "9px 14px",
                  color: G.text,
                  fontSize: 13,
                  transition: "border-color 0.2s",
                }}
              />
              <button
                className="qb-send"
                onClick={send}
                disabled={isThinking || !input.trim()}
                style={{
                  background: G.gold,
                  border: "none",
                  borderRadius: "50%",
                  width: 36, height: 36,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s, opacity 0.2s",
                }}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* FAB */}
        <button
          className="qb-fab-btn"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onClick={() => {
            if (dragRef.current.moved) {
              dragRef.current.moved = false;
              return;
            }
            setIsOpen(o => !o);
          }}
          style={{
            width: 64, height: 64,
            borderRadius: "50%",
            background: G.black,
            border: `2px solid ${G.gold}`,
            cursor: "pointer",
            padding: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 24px rgba(242,185,31,0.45), 0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,228,128,0.2)`,
            transition: "transform 0.2s",
            position: "relative",
            animation: nudge ? "qb-nudge 0.65s ease" : undefined,
            touchAction: "none",
          }}
        >
          {/* Pulse ring */}
          {!isOpen && (
            <span style={{
              position: "absolute", inset: -5,
              borderRadius: "50%",
              border: `1.5px solid ${G.gold}`,
              animation: "qb-ring 2.2s ease-out infinite",
              pointerEvents: "none",
            }} />
          )}
          {isOpen ? (
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={G.gold} strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <RobotFace isThinking={false} size={52} />
          )}
        </button>
      </div>
    </>
  );
}
