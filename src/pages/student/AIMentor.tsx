import { useState, useRef, useEffect } from "react";
import { C, FONT } from "@/tokens";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "Hello Priya! I'm your AI Learning Assistant. I can help you understand concepts from your learning materials, explain your gap analysis, or answer questions about any topic. What would you like to learn today?",
    time: "9:00 AM",
  },
  {
    id: 2,
    role: "user",
    text: "Can you explain what Digital Governance means in the Indian context?",
    time: "9:02 AM",
  },
  {
    id: 3,
    role: "ai",
    text: "Digital Governance in India refers to the use of digital technologies to deliver government services efficiently, transparently, and inclusively to citizens. It sits at the heart of the Digital India initiative launched in 2015.\n\nKey pillars include:\n\n• DigiLocker — a cloud-based document wallet for citizens to access official documents like Aadhaar, PAN, and educational certificates without physical copies.\n\n• UMANG (Unified Mobile Application for New-age Governance) — a single mobile app providing access to 1,200+ central and state government services.\n\n• GeM (Government e-Marketplace) — a procurement platform that brings transparency and efficiency to public purchases, with ₹2+ lakh crore in transactions.\n\n• CoWIN — the COVID-19 vaccination management platform, which became a global benchmark for digital public health infrastructure.\n\nFor civil servants, Digital Governance competency means understanding these platforms, policy frameworks like the National Data Governance Policy, and the ability to leverage data-driven decision-making in your ministry or department.",
    time: "9:02 AM",
  },
  {
    id: 4,
    role: "user",
    text: "What should I focus on for my Digital Competency gap?",
    time: "9:05 AM",
  },
  {
    id: 5,
    role: "ai",
    text: "Based on your gap analysis, your Digital Competency score is 32 against a target of 80 — that's a 48-point gap, which is your largest and most critical gap.\n\nHere's a focused action plan:\n\n1. Start immediately with 'Digital Governance Fundamentals' — it's already in your learning path (Phase 2) and you're 65% through. Completing this is your top priority this week.\n\n2. After that, take 'Digital Architectures & Platforms' (6h) — it covers modern platform designs in depth.\n\n3. Build practical skills: explore open-source data systems and APIs to understand modern application stacks firsthand.\n\n4. For your assessment prep, focus on foundational data architecture, system design, and security governance.\n\nAt your current pace, you can reduce this gap from 48 to under 20 points within 3–4 weeks of consistent study. Would you like me to create a daily study schedule for this?",
    time: "9:05 AM",
  },
];

const suggestedQuestions = [
  "Explain the PM GatiShakti framework",
  "What is the Data Protection Bill 2023?",
  "How do I prepare for the Policy Analysis module?",
  "Summarise my current learning progress",
  "What are the key ethics frameworks for IAS officers?",
];

const recentTopics = [
  { title: "Digital Governance", time: "Today" },
  { title: "Ethics in Civil Services", time: "Yesterday" },
  { title: "Policy Analysis Methods", time: "Jun 3" },
  { title: "Leadership Frameworks", time: "Jun 1" },
];

const mockAIReplies: Record<string, string> = {
  "Explain the PM GatiShakti framework":
    "PM GatiShakti is a Rs. 100 lakh crore National Master Plan for multi-modal connectivity launched in 2021. It integrates 16 ministries via a GIS-based digital platform to enable holistic planning of infrastructure projects — roads, railways, ports, airports, waterways, and logistics. It aims to eliminate siloed planning by making all project data visible to every ministry in real time.",
  "What is the Data Protection Bill 2023?":
    "The Digital Personal Data Protection Act 2023 (DPDPA) is India's first comprehensive data privacy law. It establishes rights for Data Principals (citizens), obligations for Data Fiduciaries (entities processing data), and creates the Data Protection Board of India. Key provisions include consent-based processing, purpose limitation, storage limitation, and significant penalties (up to ₹250 crore) for breaches.",
};

function getAIReply(text: string): string {
  const key = Object.keys(mockAIReplies).find((k) => text.toLowerCase().includes(k.toLowerCase().slice(0, 10)));
  if (key) return mockAIReplies[key];
  return "That's a great question! Based on your learning materials and the Karmayogi competency framework, let me break this down for you. This topic is covered in your Phase 2 modules. I'd recommend revisiting the relevant section in your learning path and coming back if you have specific doubts. Is there a particular aspect you'd like me to explain further?";
}

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now(), role: "user", text, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: getAIReply(text),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div
      style={{
        fontFamily: FONT.body,
        color: C.dark,
        padding: "28px 32px",
        height: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, margin: 0, color: C.dark }}>
          AI Mentor
        </h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 14 }}>
          Your personal AI learning assistant powered by the Karmayogi framework
        </p>
      </div>

      {/* Body */}
      <div style={{ display: "flex", gap: 20, flex: 1, overflow: "hidden" }}>
        {/* Left sidebar */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflowY: "auto",
          }}
        >
          {/* Current topic */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              Current Topic
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#E0F4F2",
                border: `1px solid ${C.s3}`,
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: C.s3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                }}
              >
                💻
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: C.dark }}>Digital Governance</div>
                <div style={{ fontSize: 11, color: C.muted }}>Phase 2 · 65% complete</div>
              </div>
            </div>
          </div>

          {/* Suggested questions */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Suggested Questions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    textAlign: "left",
                    padding: "9px 12px",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.dark,
                    fontFamily: FONT.body,
                    fontSize: 12,
                    cursor: "pointer",
                    lineHeight: 1.4,
                    transition: "border-color 0.15s",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Recent topics */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Recent Topics
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentTopics.map((t) => (
                <div
                  key={t.title}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 4px",
                    borderBottom: `1px solid ${C.border}`,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: C.dark }}>{t.title}</span>
                  <span style={{ color: C.faint, fontSize: 11 }}>{t.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat window */}
        <div
          style={{
            flex: 1,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: msg.role === "ai" ? C.dark : C.s1,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {msg.role === "ai" ? "AI" : "PS"}
                </div>
                {/* Bubble */}
                <div style={{ maxWidth: "70%" }}>
                  <div
                    style={{
                      background: msg.role === "user" ? C.accent : C.dark,
                      color: "#fff",
                      padding: "12px 16px",
                      borderRadius: msg.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                      fontSize: 14,
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.faint,
                      marginTop: 4,
                      textAlign: msg.role === "user" ? "right" : "left",
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: C.dark,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  AI
                </div>
                <div
                  style={{
                    background: C.dark,
                    color: "#fff",
                    padding: "12px 18px",
                    borderRadius: "4px 14px 14px 14px",
                    fontSize: 22,
                    letterSpacing: 3,
                  }}
                >
                  •••
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              padding: "16px 20px",
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              background: C.bg,
            }}
          >
            <button
              title="Attach file"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.surface,
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              📎
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your learning materials…"
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px 14px",
                fontFamily: FONT.body,
                fontSize: 14,
                color: C.dark,
                background: C.surface,
                outline: "none",
                lineHeight: 1.5,
                minHeight: 42,
                maxHeight: 120,
                overflowY: "auto",
              }}
            />
            <button
              title="Voice input"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.surface,
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              🎤
            </button>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border: "none",
                background: input.trim() ? C.accent : C.border,
                color: "#fff",
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
