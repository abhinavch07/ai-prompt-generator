import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  { id: "writing", label: "✍️ Writing", desc: "Blog posts, essays, fiction, copy, creative content" },
  { id: "coding", label: "💻 Coding", desc: "Debug, review, generate, explain, or refactor code" },
  { id: "analysis", label: "🔍 Analysis", desc: "Research, summarize, compare, evaluate, fact-check" },
  { id: "brainstorm", label: "💡 Brainstorm", desc: "Ideation, creative thinking, problem-solving, strategy" },
  { id: "email", label: "📧 Email & Comms", desc: "Professional emails, messages, follow-ups, pitches" },
  { id: "learning", label: "📚 Learning", desc: "Explain concepts, tutor, quiz, simplify, teach me" },
  { id: "data", label: "📊 Data & Reports", desc: "Analyze data, create charts, generate reports, insights" },
  { id: "planning", label: "🗓️ Planning", desc: "Roadmaps, schedules, checklists, project breakdowns" },
  { id: "translation", label: "🌐 Translation", desc: "Translate, localize, adapt tone for different languages" },
  { id: "review", label: "🔎 Review & Edit", desc: "Proofread, improve clarity, grammar, style, structure" },
];

const TONES = [
  { id: "professional", label: "Professional", desc: "Polished, formal, business-ready" },
  { id: "casual", label: "Casual", desc: "Friendly, relaxed, conversational" },
  { id: "concise", label: "Concise", desc: "Brief, direct, no fluff" },
  { id: "detailed", label: "Detailed", desc: "Thorough, comprehensive, in-depth" },
  { id: "creative", label: "Creative", desc: "Imaginative, expressive, original" },
  { id: "technical", label: "Technical", desc: "Precise, expert-level, domain-specific" },
  { id: "empathetic", label: "Empathetic", desc: "Warm, understanding, human" },
  { id: "persuasive", label: "Persuasive", desc: "Compelling, convincing, action-driving" },
];

const FORMATS = [
  { id: "paragraph", label: "Paragraph", desc: "Flowing prose, narrative style" },
  { id: "bullets", label: "Bullet Points", desc: "Scannable list of key items" },
  { id: "stepbystep", label: "Step-by-step", desc: "Numbered instructions in order" },
  { id: "table", label: "Table", desc: "Structured rows and columns" },
  { id: "code", label: "Code", desc: "Formatted code with comments" },
  { id: "qa", label: "Q&A", desc: "Question and answer pairs" },
  { id: "outline", label: "Outline", desc: "Hierarchical structure with headers" },
  { id: "report", label: "Report", desc: "Executive summary with sections" },
];

const LENGTHS = [
  { id: "brief", label: "Brief", desc: "1–3 sentences or a short snippet" },
  { id: "short", label: "Short", desc: "1 paragraph or ~100 words" },
  { id: "medium", label: "Medium", desc: "3–5 paragraphs or ~300 words" },
  { id: "long", label: "Long", desc: "Full document or 500+ words" },
];

const AUDIENCES = [
  { id: "beginner", label: "Beginner", desc: "No prior knowledge assumed" },
  { id: "intermediate", label: "Intermediate", desc: "Some background knowledge" },
  { id: "expert", label: "Expert", desc: "Deep domain expertise" },
  { id: "executive", label: "Executive", desc: "C-suite, high-level overview" },
  { id: "general", label: "General Public", desc: "Broad, accessible audience" },
  { id: "student", label: "Student", desc: "Academic or learning context" },
];

function ChipGrid({ items, selected, onToggle }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
      {items.map(item => {
        const active = selected === item.id;
        return (
          <button key={item.id} onClick={() => onToggle(item.id)} style={{
            padding: "12px 14px",
            border: `1px solid ${active ? "#c9a96e" : "#252433"}`,
            borderRadius: 6,
            background: active ? "rgba(201,169,110,0.08)" : "#0e0d18",
            color: active ? "#c9a96e" : "#5a5870",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12, cursor: "pointer", textAlign: "left",
            transition: "all 0.15s", lineHeight: 1.4,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 3, color: active ? "#c9a96e" : "#9997b0" }}>{item.label}</div>
            <div style={{ fontSize: 10, opacity: 0.75 }}>{item.desc}</div>
          </button>
        );
      })}
    </div>
  );
}

function Section({ num, title, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#c9a96e",
          background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)",
          borderRadius: 4, padding: "3px 8px", letterSpacing: 1
        }}>{num}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#7a7890", letterSpacing: 2, textTransform: "uppercase" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function MicButton({ field, recording, activeField, transcribing, onStart, onStop, supported }) {
  if (!supported) return null;
  const isActive = recording && activeField === field;
  const isLoading = transcribing && activeField === field;
  return (
    <button onClick={() => isActive ? onStop() : onStart(field)}
      disabled={transcribing || (recording && activeField !== field)}
      title={isActive ? "Stop recording" : "Speak to fill this field"}
      style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        border: `1px solid ${isActive ? "#e05555" : "#252433"}`,
        background: isActive ? "rgba(224,85,85,0.15)" : "rgba(201,169,110,0.06)",
        color: isActive ? "#e05555" : "#5a5878", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
        transition: "all 0.15s", animation: isActive ? "micPulse 1s infinite" : "none",
      }}>
      {isLoading ? "⌛" : isActive ? "⏹" : "🎙"}
    </button>
  );
}

export default function PromptGenerator() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [format, setFormat] = useState("");
  const [length, setLength] = useState("");
  const [audience, setAudience] = useState("");
  const [role, setRole] = useState("");
  const [context, setContext] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [recording, setRecording] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    setAudioSupported(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
  }, []);

  const startRecording = async (field) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(blob, field);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setActiveField(field);
    } catch { alert("Microphone access denied or unavailable."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (blob, field) => {
    setTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514", max_tokens: 500,
            messages: [{ role: "user", content: [
              { type: "text", text: "Transcribe this audio recording exactly as spoken. Return only the transcribed text, nothing else." },
              { type: "document", source: { type: "base64", media_type: "audio/webm", data: base64 } }
            ]}]
          })
        });
        const data = await res.json();
        const text = data.content?.map(b => b.text || "").join("") || "";
        if (text && !text.toLowerCase().includes("cannot") && !text.toLowerCase().includes("don't")) {
          applyToField(field, text);
        } else { useSpeechRecognition(field); }
        setTranscribing(false); setActiveField(null);
      };
    } catch { setTranscribing(false); setActiveField(null); useSpeechRecognition(field); }
  };

  const useSpeechRecognition = (field) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported in this browser."); return; }
    const r = new SR(); r.continuous = false; r.interimResults = false;
    r.onresult = e => applyToField(field, e.results[0][0].transcript);
    r.start();
  };

  const applyToField = (field, text) => {
    const setters = { task: setTask, role: setRole, context: setContext };
    setters[field]?.(prev => prev ? prev + " " + text : text);
  };

  const buildSystemPrompt = () => `You are an expert prompt engineer for Claude. Generate a single, highly effective, ready-to-use prompt based on the user's inputs.
The prompt must:
- Be specific, detailed, and immediately usable
- Naturally incorporate all provided parameters
- Open with the role/persona assignment if provided
- Clearly state the task and any constraints
- Specify output format and length expectations
- Be written in second person addressing Claude directly
- Output ONLY the prompt itself — no explanation, no preamble, no quotes, no markdown fences.`;

  const buildUserMessage = () => {
    const parts = [];
    if (task) parts.push(`Task: ${task}`);
    if (category) parts.push(`Category: ${CATEGORIES.find(c => c.id === category)?.label}`);
    if (tone) parts.push(`Tone: ${tone}`);
    if (format) parts.push(`Output format: ${format}`);
    if (length) parts.push(`Length: ${length}`);
    if (audience) parts.push(`Target audience: ${audience}`);
    if (role) parts.push(`Role/Persona for Claude: ${role}`);
    if (context) parts.push(`Additional context: ${context}`);
    return parts.join("\n");
  };

  const generate = async () => {
    if (!task.trim()) return;
    setLoading(true); setGenerated(""); setCopied(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: [{ role: "user", content: buildUserMessage() }],
        }),
      });
      const data = await res.json();
      setGenerated(data.content?.map(b => b.text || "").join("").trim() || "Could not generate prompt.");
    } catch { setGenerated("Error generating prompt. Please try again."); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(generated); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const reset = () => { setTask(""); setCategory(""); setTone(""); setFormat(""); setLength(""); setAudience(""); setRole(""); setContext(""); setGenerated(""); setCopied(false); };

  const micProps = { recording, activeField, transcribing, onStart: startRecording, onStop: stopRecording, supported: audioSupported };

  const inputStyle = {
    width: "100%", background: "#0a0914", border: "1px solid #252433",
    borderRadius: 6, color: "#e8e4d9", fontFamily: "'DM Mono', monospace",
    fontSize: 13, padding: "12px 14px", resize: "none", outline: "none",
    lineHeight: 1.6, transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080712", color: "#e8e4d9", fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus, input:focus { border-color: #c9a96e !important; }
        textarea::placeholder, input::placeholder { color: #302e45; }
        button:disabled { opacity: 0.35; cursor: not-allowed; }
        @keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(224,85,85,0.4)} 50%{box-shadow:0 0 0 6px rgba(224,85,85,0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .gen-btn:hover:not(:disabled) { background: #dfc088 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,169,110,0.2) !important; }
        .action-btn:hover { border-color: #c9a96e !important; color: #c9a96e !important; }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 4, color: "#c9a96e", marginBottom: 14, textTransform: "uppercase" }}>
            Claude Prompt Engineer
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px,7vw,64px)", fontWeight: 900, color: "#f0ece2", lineHeight: 1.05, letterSpacing: -1, marginBottom: 12 }}>
            Craft the <em style={{ color: "#c9a96e", fontStyle: "italic" }}>Perfect Prompt</em>
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#5a5870", letterSpacing: 0.5 }}>
            Fill in what you know — speak or type — generate what works.
          </p>
        </div>

        {/* Main card */}
        <div style={{ background: "#0e0d18", border: "1px solid #1e1c30", borderRadius: 12, padding: "32px 28px", marginBottom: 16 }}>

          <Section num="01" title="What do you want Claude to do?">
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <textarea rows={3} value={task} onChange={e => setTask(e.target.value)}
                placeholder="e.g. Write a compelling intro for my SaaS landing page targeting HR managers..."
                style={inputStyle} />
              <MicButton field="task" {...micProps} />
            </div>
          </Section>

          <div style={{ height: 1, background: "#1a1828", margin: "4px 0 20px" }} />

          <Section num="02" title="Category">
            <div style={{ marginBottom: 20 }}>
              <ChipGrid items={CATEGORIES} selected={category} onToggle={id => setCategory(category === id ? "" : id)} />
            </div>
          </Section>

          <div style={{ height: 1, background: "#1a1828", margin: "4px 0 20px" }} />

          <Section num="03" title="Tone">
            <div style={{ marginBottom: 20 }}>
              <ChipGrid items={TONES} selected={tone} onToggle={id => setTone(tone === id ? "" : id)} />
            </div>
          </Section>

          <div style={{ height: 1, background: "#1a1828", margin: "4px 0 20px" }} />

          <Section num="04" title="Output Format">
            <div style={{ marginBottom: 20 }}>
              <ChipGrid items={FORMATS} selected={format} onToggle={id => setFormat(format === id ? "" : id)} />
            </div>
          </Section>

          <div style={{ height: 1, background: "#1a1828", margin: "4px 0 20px" }} />

          <Section num="05" title="Response Length">
            <div style={{ marginBottom: 20 }}>
              <ChipGrid items={LENGTHS} selected={length} onToggle={id => setLength(length === id ? "" : id)} />
            </div>
          </Section>

          <div style={{ height: 1, background: "#1a1828", margin: "4px 0 20px" }} />

          <Section num="06" title="Target Audience">
            <div style={{ marginBottom: 20 }}>
              <ChipGrid items={AUDIENCES} selected={audience} onToggle={id => setAudience(audience === id ? "" : id)} />
            </div>
          </Section>

          <div style={{ height: 1, background: "#1a1828", margin: "4px 0 20px" }} />

          <Section num="07" title="Role / Persona for Claude (optional)">
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input value={role} onChange={e => setRole(e.target.value)}
                placeholder="e.g. Senior UX designer, Harvard debate coach, empathetic therapist..."
                style={{ ...inputStyle, resize: undefined }} />
              <MicButton field="role" {...micProps} />
            </div>
          </Section>

          <div style={{ height: 1, background: "#1a1828", margin: "4px 0 20px" }} />

          <Section num="08" title="Extra Context (optional)">
            <div style={{ display: "flex", gap: 8 }}>
              <textarea rows={2} value={context} onChange={e => setContext(e.target.value)}
                placeholder="Background info, constraints, examples, references, tone nuances..."
                style={inputStyle} />
              <MicButton field="context" {...micProps} />
            </div>
          </Section>
        </div>

        {audioSupported && (
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#3a3850", textAlign: "center", marginBottom: 16, letterSpacing: 1 }}>
            🎙 TAP MIC ICON TO SPEAK INTO ANY FIELD — TAP AGAIN TO STOP
          </div>
        )}

        <button className="gen-btn" onClick={generate} disabled={!task.trim() || loading} style={{
          width: "100%", padding: "18px", background: "#c9a96e", border: "none",
          borderRadius: 8, color: "#080712", fontFamily: "'Playfair Display', serif",
          fontSize: 17, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer", transition: "all 0.2s",
        }}>
          {loading ? "Generating..." : "Generate Prompt →"}
        </button>

        {(loading || generated) && (
          <div style={{ background: "#0e0d18", border: "1px solid #c9a96e", borderRadius: 12, padding: "28px", marginTop: 20, animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#c9a96e", textTransform: "uppercase", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
              Your Prompt <span style={{ flex: 1, height: 1, background: "#1e1c30" }} />
            </div>
            {loading ? (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#5a5870", padding: "16px 0", display: "flex", alignItems: "center", gap: 10 }}>
                <span>●</span><span>●</span><span>●</span>
                <span style={{ marginLeft: 8 }}>Crafting your prompt...</span>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.9, color: "#d8d4c8", whiteSpace: "pre-wrap" }}>{generated}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                  {[
                    { label: copied ? "✓ Copied!" : "Copy Prompt", onClick: copy, primary: true },
                    { label: "Regenerate", onClick: generate },
                    { label: "Start Over", onClick: reset },
                  ].map(({ label, onClick, primary }) => (
                    <button key={label} className="action-btn" onClick={onClick} style={{
                      padding: "9px 20px", border: `1px solid ${primary ? "#c9a96e" : "#252433"}`, borderRadius: 6,
                      background: "transparent", color: primary ? "#c9a96e" : "#7a7890",
                      fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1,
                      cursor: "pointer", transition: "all 0.15s", textTransform: "uppercase"
                    }}>{label}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
