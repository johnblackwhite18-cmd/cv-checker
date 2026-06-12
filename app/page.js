"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const NAVY = "#1A2332";
const NAVY_DEEP = "#12192a";
const GOLD = "#B8924C";
const GOLD_LIGHT = "#d4b06a";

const SCAN_MSGS = [
  "Opening your CV...",
  "Scanning it the way I would...",
  "6 seconds. That's all you get.",
];

const BUILD_MSGS = [
  "Running Gate 1: the software...",
  "Running Gate 2: the AI screen...",
  "Running Gate 3: the human scan...",
  "Checking your experience bullets...",
  "Writing your rewrite examples...",
  "Building your rejection report...",
];

const ST = {
  green: { bg: "#f2f8f2", border: "#bcd9bc", dot: "#3f8f4f", text: "#166534" },
  amber: { bg: "#fdf8ee", border: "#ead9b0", dot: "#c47f2e", text: "#92400e" },
  red: { bg: "#fdf2f2", border: "#f3c5c5", dot: "#c0392b", text: "#9f1239" },
};

const VD = {
  "needs urgent work": { color: "#c0392b", bg: "#fdf2f2", border: "#f3c5c5", emoji: "⚠️" },
  "needs significant work": { color: "#c47f2e", bg: "#fdf8ee", border: "#ead9b0", emoji: "🔧" },
  "good foundations": { color: "#B8924C", bg: "#fdf8ee", border: "#ead9b0", emoji: "📈" },
  "strong cv": { color: "#3f8f4f", bg: "#f2f8f2", border: "#bcd9bc", emoji: "✅" },
};

const GATE_STYLE = {
  "pass": { color: "#5fae6f", label: "PASS", icon: "✓" },
  "at risk": { color: "#d4a04c", label: "AT RISK", icon: "!" },
  "reject": { color: "#d3625a", label: "REJECT", icon: "✕" },
};

function sc(n) {
  if (n >= 70) return "#5fae6f";
  if (n >= 50) return GOLD_LIGHT;
  if (n >= 30) return "#d4a04c";
  return "#d3625a";
}

function useAnimatedNumber(target, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function Ring({ score }) {
  const animatedScore = useAnimatedNumber(score);
  const r = 48, c = 2 * Math.PI * r, d = (animatedScore / 100) * c, col = sc(score);
  return (
    <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
      <svg width={130} height={130} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={65} cy={65} r={r} fill="none" stroke="#2a3547" strokeWidth={10} />
        <circle cx={65} cy={65} r={r} fill="none" stroke={col} strokeWidth={10}
          strokeDasharray={`${d} ${c}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: col, lineHeight: 1, fontFamily: "'Lato',sans-serif" }}>{animatedScore}</span>
        <span style={{ fontSize: 10, color: "#8b94a3", fontWeight: 700, letterSpacing: "0.06em", marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function GatePanel({ gates }) {
  if (!Array.isArray(gates) || gates.length === 0) return null;
  return (
    <div style={{
      background: "rgba(255,255,255,.03)", border: "1px solid rgba(184,146,76,.25)",
      borderRadius: 18, padding: "22px 22px", marginBottom: 14,
    }}>
      <p style={{ color: GOLD, fontSize: 11, fontWeight: 700, margin: "0 0 4px", letterSpacing: "0.14em", fontFamily: "'Lato',sans-serif" }}>
        THE THREE GATES
      </p>
      <p style={{ color: "#8b94a3", fontSize: 12.5, margin: "0 0 16px", lineHeight: 1.6 }}>
        Every direct application has to survive the software, the AI screen, and a human who may not know your specialism.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {gates.map((g, i) => {
          const gs = GATE_STYLE[String(g.verdict || "").toLowerCase()] || GATE_STYLE["at risk"];
          return (
            <div key={i} style={{
              background: "rgba(255,255,255,.03)", border: `1px solid rgba(255,255,255,.07)`,
              borderLeft: `3px solid ${gs.color}`, borderRadius: "0 12px 12px 0",
              padding: "13px 16px", animation: `fadeUp .4s ease both`, animationDelay: `${i * .12}s`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: "#f0ede6", fontFamily: "'Lato',sans-serif" }}>
                  <span style={{ color: "#8b94a3", fontWeight: 700, fontSize: 11, marginRight: 8 }}>GATE {i + 1}</span>
                  {g.gate}
                </span>
                <span style={{
                  fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em", color: gs.color,
                  border: `1px solid ${gs.color}`, borderRadius: 14, padding: "3px 10px", whiteSpace: "nowrap",
                }}>{gs.icon} {gs.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#aab2bf", lineHeight: 1.6 }}>{g.reason}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Card({ section, i }) {
  const s = ST[section.status] || ST.amber;
  const ba = section.before_after;
  return (
    <div style={{
      background: "#fdfcfa", borderRadius: 14, border: `1.5px solid ${s.border}`,
      padding: "15px 17px", display: "flex", flexDirection: "column", gap: 9,
      animation: `fadeUp .4s ease both`, animationDelay: `${i * .07}s`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot }} />
          <span style={{ fontWeight: 800, fontSize: 14, color: NAVY, fontFamily: "'Lato',sans-serif" }}>{section.name}</span>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 800, color: s.text, background: s.bg,
          border: `1px solid ${s.border}`, borderRadius: 20, padding: "2px 10px"
        }}>{section.score}/100</span>
      </div>
      {section.issue && <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.55 }}><span style={{ color: s.dot, fontWeight: 700 }}>Issue: </span>{section.issue}</p>}
      {section.fix && (
        <div style={{ background: s.bg, borderLeft: `3px solid ${GOLD}`, borderRadius: "0 8px 8px 0", padding: "9px 12px", fontSize: 13, color: NAVY, lineHeight: 1.55 }}>
          <span style={{ fontWeight: 700 }}>Fix tonight: </span>{section.fix}
        </div>
      )}
      {ba && ba.before && ba.after && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          <div style={{ background: "#fdf2f2", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#9f1239", lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>❌ Your bullet: </span>
            <span style={{ fontStyle: "italic" }}>{ba.before}</span>
          </div>
          <div style={{ background: "#f2f8f2", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#166534", lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>✅ Rewritten: </span>
            <span>{ba.after}</span>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>Anything in [brackets] is a placeholder — fill in your real numbers.</p>
        </div>
      )}
      {!section.issue && <p style={{ margin: 0, fontSize: 13, color: s.dot, fontWeight: 700 }}>✓ This section looks solid</p>}
    </div>
  );
}

function ScanCountdown({ seconds }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16 }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        border: `3px solid rgba(184,146,76,.3)`, display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "rgba(184,146,76,.06)",
      }}>
        <span style={{ fontSize: 28, fontWeight: 900, color: GOLD_LIGHT, fontFamily: "'Lato',sans-serif" }}>{seconds}</span>
      </div>
    </div>
  );
}

async function extractTextFromFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "txt") return await file.text();

  if (ext === "docx") {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
    await new Promise((res, rej) => { script.onload = res; script.onerror = rej; document.head.appendChild(script); });
    const ab = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer: ab });
    return result.value;
  }

  if (ext === "doc") throw new Error("Old .doc format not supported. Save as .docx or paste your CV text.");

  if (ext === "pdf") {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    await new Promise((res, rej) => { script.onload = res; script.onerror = rej; document.head.appendChild(script); });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const ab = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: ab }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }
    return text;
  }

  throw new Error(`Unsupported file type (.${ext}). Upload PDF, DOCX, or TXT.`);
}

export default function CVChecker() {
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cv, setCv] = useState("");
  const [fileName, setFileName] = useState("");
  const [scanCount, setScanCount] = useState(6);
  const [scanMsg, setScanMsg] = useState(SCAN_MSGS[0]);
  const [buildMsg, setBuildMsg] = useState(BUILD_MSGS[0]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const topRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if ((step === "result" || step === "scanning") && topRef.current) {
      setTimeout(() => topRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [step]);

  const wordCount = cv.trim().split(/\s+/).filter(Boolean).length;

  const validate = () => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address — your full report is delivered there.";
    if (wordCount < 80) return "Please paste your full CV. It needs at least 80 words for a meaningful analysis.";
    return null;
  };

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileLoading(true);
    setError(null);
    try {
      const text = await extractTextFromFile(file);
      if (text.trim().length < 50) {
        setError("Could not extract enough text. Try pasting your CV text directly.");
      } else {
        setCv(text.trim());
        setFileName(file.name);
      }
    } catch (err) {
      setError(`Could not read that file (${err.message}). Try pasting your CV text directly.`);
    } finally {
      setFileLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, []);

  const run = async () => {
    const e = validate();
    if (e) { setError(e); return; }
    setError(null); setResult(null);

    const startTime = Date.now();

    setStep("scanning");
    setScanCount(6);
    setScanMsg(SCAN_MSGS[0]);

    let scanInterval = setInterval(() => {
      setScanCount(prev => {
        if (prev <= 1) { clearInterval(scanInterval); return 0; }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => setScanMsg(SCAN_MSGS[1]), 2000);
    setTimeout(() => setScanMsg(SCAN_MSGS[2]), 4000);

    let buildMsgInterval = null;
    setTimeout(() => {
      setStep(prev => prev === "scanning" ? "building" : prev);
      clearInterval(scanInterval);
      let idx = 0;
      setBuildMsg(BUILD_MSGS[0]);
      buildMsgInterval = setInterval(() => {
        idx = (idx + 1) % BUILD_MSGS.length;
        setBuildMsg(BUILD_MSGS[idx]);
      }, 2500);
    }, 6000);

    try {
      const res = await fetch("/api/check-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, cv }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");

      const elapsed = Date.now() - startTime;
      if (elapsed < 8000) {
        await new Promise(resolve => setTimeout(resolve, 8000 - elapsed));
      }

      if (buildMsgInterval) clearInterval(buildMsgInterval);
      clearInterval(scanInterval);
      setResult(data);
      setStep("result");
    } catch (err) {
      if (buildMsgInterval) clearInterval(buildMsgInterval);
      clearInterval(scanInterval);
      setError(err.message || "Something went wrong. Please try again.");
      setStep("form");
    }
  };

  const reset = () => {
    setStep("form"); setResult(null); setError(null);
    setName(""); setEmail(""); setCv(""); setFileName("");
  };

  const copyReport = () => {
    if (!result) return;
    const gatesTxt = Array.isArray(result.gates)
      ? result.gates.map((g, i) => `GATE ${i + 1} — ${g.gate}: ${String(g.verdict).toUpperCase()}\n  ${g.reason}`).join("\n")
      : "";
    const txt = [
      `Your Rejection Report — ${result.overall_score}/100`,
      ``,
      `FIRST IMPRESSION (6 seconds):`, result.first_impression, ``,
      `Verdict: ${result.overall_verdict.toUpperCase()}`, ``,
      `THE THREE GATES:`, gatesTxt, ``,
      result.summary_line, ``,
      `SECTION SCORES:`,
      ...result.sections.map(s => [
        `• ${s.name}: ${s.score}/100 (${s.status.toUpperCase()})`,
        s.issue ? `  Issue: ${s.issue}` : null,
        s.fix ? `  Fix tonight: ${s.fix}` : null,
        s.before_after?.before ? `  Your bullet: "${s.before_after.before}"` : null,
        s.before_after?.after ? `  Rewritten: "${s.before_after.after}"` : null,
      ].filter(Boolean).join("\n")),
      ``, `YOUR 3 PRIORITY FIXES:`,
      ...result.priority_fixes.map((f, i) => `${i + 1}. ${f}`),
      ``, `MY HONEST TAKE:`, result.recruiter_take, ``,
      ...(result.summary_rewrite ? [`REWRITTEN PROFESSIONAL SUMMARY:`, result.summary_rewrite, ``] : []),
      `John Bhairoo — Black & White Recruitment`,
    ].join("\n");
    navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const inp = {
    width: "100%", padding: "13px 16px", borderRadius: 10, fontSize: 16,
    border: "1.5px solid #d6d2c8", background: "#fdfcfa", color: NAVY,
    fontFamily: "'Lato',sans-serif", outline: "none", boxSizing: "border-box",
    WebkitAppearance: "none",
  };
  const lbl = { fontSize: 13, fontWeight: 700, color: "#c5ccd6", marginBottom: 5, display: "block", fontFamily: "'Lato',sans-serif" };
  const vrd = result ? (VD[result.overall_verdict] || VD["needs significant work"]) : null;

  const getPercentile = (score) => {
    if (score >= 80) return 95; if (score >= 70) return 85; if (score >= 60) return 70;
    if (score >= 50) return 50; if (score >= 40) return 30; if (score >= 30) return 15; return 5;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg,${NAVY_DEEP} 0%,${NAVY} 50%,${NAVY_DEEP} 100%)`,
      fontFamily: "'Lato','Segoe UI',sans-serif",
      padding: "28px 16px 56px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes glow { 0%,100%{box-shadow:0 0 24px rgba(184,146,76,.2)} 50%{box-shadow:0 0 48px rgba(184,146,76,.4)} }
        @keyframes countPulse { 0%{transform:scale(1)} 50%{transform:scale(1.15)} 100%{transform:scale(1)} }
        @keyframes stampIn { 0%{transform:scale(3);opacity:0} 60%{transform:scale(.9);opacity:1} 100%{transform:scale(1);opacity:1} }
        input:focus,textarea:focus { border-color:${GOLD} !important; box-shadow:0 0 0 3px rgba(184,146,76,.15) !important; }
        .gbtn:hover { transform:translateY(-2px) !important; box-shadow:0 8px 32px rgba(184,146,76,.5) !important; }
        .gbtn:active { transform:translateY(0) !important; }
        .wbtn:hover { background:#f3f4f6 !important; }
        .dbtn:hover { background:rgba(255,255,255,.08) !important; }
        .upload-zone { cursor:pointer; transition: all .2s; }
        .upload-zone:hover { border-color: ${GOLD} !important; background: rgba(184,146,76,.05) !important; }
        @media (max-width: 520px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .score-header { flex-direction: column !important; text-align: center !important; }
          .score-header > div:last-child { min-width: unset !important; }
          .action-btns { flex-direction: column !important; }
          .action-btns button { width: 100% !important; }
          .trust-badges { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>

      <div style={{ maxWidth: 660, margin: "0 auto" }} ref={topRef}>
        <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeUp .5s ease" }}>
          <p style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", margin: "0 0 14px", fontFamily: "'Lato',sans-serif" }}>
            BLACK &amp; WHITE RECRUITMENT
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18,
            background: "rgba(184,146,76,.08)", border: "1px solid rgba(184,146,76,.3)",
            borderRadius: 20, padding: "5px 14px",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD_LIGHT, animation: "pulse 2s infinite" }} />
            <span style={{ color: GOLD_LIGHT, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>THE REJECTION REPORT · FREE</span>
          </div>
          <h1 style={{
            color: "#f0ede6", fontSize: "clamp(24px,5vw,38px)", fontWeight: 900,
            fontFamily: "'Lato',sans-serif", margin: "0 0 12px", lineHeight: 1.15, letterSpacing: "-0.02em",
          }}>
            Find out why you're getting rejected<br /><span style={{ color: GOLD_LIGHT }}>before you apply.</span>
          </h1>
          <p style={{ color: "#aab2bf", fontSize: 15, margin: 0, lineHeight: 1.7, maxWidth: 500, marginInline: "auto" }}>
            I'm an agency recruiter. I watch good people get rejected every day — by software
            that can't read their CV, AI that ranks them down, and recruiters who don't
            understand what they do. This shows you exactly where yours fails, and how to fix it.
          </p>
          <div className="trust-badges" style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
            {["15 years agency-side", "Thousands of CVs screened", "The three gates, explained"].map(t => (
              <span key={t} style={{ color: "#8b94a3", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: GOLD_LIGHT }}>✓</span>{t}
              </span>
            ))}
          </div>
        </div>

        {step === "form" && (
          <div style={{
            background: "rgba(255,255,255,.03)", border: "1px solid rgba(184,146,76,.2)",
            borderRadius: 20, padding: "28px 24px", animation: "fadeUp .5s ease .1s both",
          }}>
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={lbl}>Your name</label>
                <input style={inp} placeholder="e.g. Sarah Jones" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Email <span style={{ color: GOLD_LIGHT }}>*</span> <span style={{ color: "#8b94a3", fontWeight: 500 }}>(report sent here)</span></label>
                <input style={inp} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Upload your CV <span style={{ color: "#8b94a3", fontWeight: 500 }}>(PDF, Word, or TXT)</span></label>
              <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{
                border: "2px dashed #3a4558", borderRadius: 12, padding: "20px", textAlign: "center",
                background: fileName ? "rgba(184,146,76,.06)" : "rgba(255,255,255,.02)",
                borderColor: fileName ? GOLD : "#3a4558",
              }}>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} style={{ display: "none" }} />
                {fileLoading ? (
                  <p style={{ margin: 0, color: GOLD_LIGHT, fontSize: 14, fontWeight: 600 }}>Extracting text...</p>
                ) : fileName ? (
                  <div>
                    <p style={{ margin: "0 0 4px", color: GOLD_LIGHT, fontSize: 14, fontWeight: 700 }}>✓ {fileName}</p>
                    <p style={{ margin: 0, color: "#8b94a3", fontSize: 12 }}>{wordCount} words extracted. Tap to replace.</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: "0 0 4px", color: "#c5ccd6", fontSize: 14, fontWeight: 600 }}>📄 Tap to upload PDF, Word, or TXT</p>
                    <p style={{ margin: 0, color: "#8b94a3", fontSize: 12 }}>Or paste your CV text below</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 6 }}>
              <label style={lbl}>Or paste your CV</label>
              <textarea style={{ ...inp, minHeight: 220, resize: "vertical", lineHeight: 1.65 }}
                placeholder={"Paste your full CV here...\n\nIn Word: Ctrl+A, Ctrl+C then paste.\nIn a PDF: select all text, copy and paste."}
                value={cv} onChange={e => { setCv(e.target.value); setFileName(""); }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 12, color: "#8b94a3" }}>Include your full work history for the best analysis</span>
                <span style={{ fontSize: 12, color: wordCount < 80 ? "#d3625a" : "#5fae6f", fontWeight: 600 }}>
                  {wordCount} words {wordCount >= 80 ? "✓" : "— need more"}
                </span>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fdf2f2", border: "1px solid #f3c5c5", borderRadius: 10, padding: "10px 14px", color: "#9f1239", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                {error}
              </div>
            )}

            <button className="gbtn" onClick={run} style={{
              width: "100%", padding: "15px 24px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg,${GOLD_LIGHT},${GOLD})`,
              color: NAVY_DEEP, fontSize: 15, fontWeight: 900, cursor: "pointer",
              fontFamily: "'Lato',sans-serif", transition: "all .2s", animation: "glow 3s infinite",
              letterSpacing: "0.02em",
            }}>
              Run My Rejection Report — Free →
            </button>
            <p style={{ margin: "12px 0 0", textAlign: "center", color: "#8b94a3", fontSize: 12 }}>
              🔒 Your CV is analysed and never stored. Full report delivered by email.
            </p>
          </div>
        )}

        {step === "scanning" && (
          <div style={{
            background: "rgba(255,255,255,.03)", border: "1px solid rgba(184,146,76,.2)",
            borderRadius: 20, padding: "64px 24px", textAlign: "center", animation: "fadeUp .3s ease",
          }}>
            <ScanCountdown seconds={scanCount} />
            <p style={{ color: GOLD_LIGHT, fontSize: 18, fontWeight: 800, margin: "0 0 8px", fontFamily: "'Lato',sans-serif", animation: "countPulse 1s infinite" }}>
              {scanMsg}
            </p>
            <p style={{ color: "#8b94a3", fontSize: 13, margin: 0 }}>
              Recruiters decide in 6 seconds. Let's see what yours says.
            </p>
          </div>
        )}

        {step === "building" && (
          <div style={{
            background: "rgba(255,255,255,.03)", border: "1px solid rgba(184,146,76,.2)",
            borderRadius: 20, padding: "64px 24px", textAlign: "center", animation: "fadeUp .3s ease",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "4px solid rgba(184,146,76,.15)", borderTopColor: GOLD_LIGHT,
              animation: "spin .85s linear infinite", margin: "0 auto 24px",
            }} />
            <p style={{ color: "#f0ede6", fontSize: 14, fontWeight: 700, margin: "0 0 6px", fontFamily: "'Lato',sans-serif" }}>
              Scan complete. Running the three gates...
            </p>
            <p style={{ color: GOLD_LIGHT, fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>{buildMsg}</p>
            <p style={{ color: "#8b94a3", fontSize: 12, margin: 0 }}>Almost there</p>
          </div>
        )}

        {step === "result" && result && (() => {
          const reds = result.sections.filter(s => s.status === "red");
          const ambers = result.sections.filter(s => s.status === "amber");
          const greens = result.sections.filter(s => s.status === "green");
          const pct = getPercentile(result.overall_score);
          return (
            <div style={{ animation: "fadeUp .5s ease" }}>

              {result.first_impression && (
                <div style={{
                  background: "rgba(255,255,255,.03)", border: "1px solid rgba(184,146,76,.2)",
                  borderRadius: 20, padding: "24px 24px", marginBottom: 14, textAlign: "center",
                }}>
                  <p style={{ color: "#8b94a3", fontSize: 11, fontWeight: 700, margin: "0 0 10px", letterSpacing: "0.12em" }}>
                    ⏱ MY 6-SECOND FIRST IMPRESSION
                  </p>
                  <p style={{
                    color: "#f0ede6", fontSize: 17, fontWeight: 700, margin: 0, lineHeight: 1.5,
                    fontFamily: "'Lato',sans-serif", fontStyle: "italic",
                    animation: "stampIn .6s ease",
                  }}>
                    "{result.first_impression}"
                  </p>
                </div>
              )}

              <GatePanel gates={result.gates} />

              <div style={{
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(184,146,76,.2)",
                borderRadius: 20, padding: "28px 24px", marginBottom: 14,
              }}>
                <div className="score-header" style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
                  <Ring score={result.overall_score} />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10,
                      background: vrd.bg, border: `1px solid ${vrd.border}`, borderRadius: 20, padding: "4px 14px",
                    }}>
                      <span>{vrd.emoji}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: vrd.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{result.overall_verdict}</span>
                    </div>
                    <h2 style={{ color: "#f0ede6", fontFamily: "'Lato',sans-serif", fontSize: 19, fontWeight: 800, margin: "0 0 7px" }}>
                      {name}'s Rejection Report
                    </h2>
                    <p style={{ color: "#aab2bf", fontSize: 14, margin: "0 0 8px", lineHeight: 1.6 }}>{result.summary_line}</p>
                    <p style={{ color: "#8b94a3", fontSize: 12, margin: "0 0 4px", fontWeight: 600 }}>
                      📊 Ahead of roughly {pct}% of CVs we see. Most score 30-55.
                    </p>
                    <p style={{ color: "#6b7585", fontSize: 11, margin: "0 0 12px" }}>
                      This is a human recruiter score, not an ATS keyword match.
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {[
                        { label: `${reds.length} Urgent`, color: "#9f1239", bg: "#fdf2f2" },
                        { label: `${ambers.length} Work`, color: "#92400e", bg: "#fdf8ee" },
                        { label: `${greens.length} Strong`, color: "#166534", bg: "#f2f8f2" },
                      ].map(b => (
                        <span key={b.label} style={{ fontSize: 12, fontWeight: 700, color: b.color, background: b.bg, borderRadius: 20, padding: "3px 10px" }}>{b.label}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: "rgba(184,146,76,.06)", border: "1px solid rgba(184,146,76,.2)",
                  borderRadius: 14, padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg,${GOLD_LIGHT},${GOLD})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 900, color: NAVY_DEEP, fontFamily: "'Lato',sans-serif",
                  }}>J</div>
                  <div>
                    <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: GOLD_LIGHT }}>John's Honest Take</p>
                    <p style={{ margin: 0, fontSize: 14, color: "#c5ccd6", lineHeight: 1.7 }}>{result.recruiter_take}</p>
                  </div>
                </div>
              </div>

              {result.emailed ? (
                <>
                  <div style={{
                    background: "linear-gradient(135deg,rgba(184,146,76,.12),rgba(184,146,76,.04))",
                    border: "1px solid rgba(184,146,76,.35)", borderRadius: 18,
                    padding: "28px 24px", textAlign: "center", marginBottom: 14,
                  }}>
                    <p style={{ fontSize: 36, margin: "0 0 10px" }}>📬</p>
                    <h3 style={{ color: "#f0ede6", fontFamily: "'Lato',sans-serif", fontSize: 20, fontWeight: 900, margin: "0 0 10px" }}>
                      Your full report is in your inbox
                    </h3>
                    <p style={{ color: "#aab2bf", fontSize: 14, margin: "0 0 14px", lineHeight: 1.65, maxWidth: 440, marginInline: "auto" }}>
                      Sent to <strong style={{ color: GOLD_LIGHT }}>{email}</strong> — the full three-gates
                      diagnosis, your section-by-section breakdown, the 3 fixes to make tonight, and my
                      rewrite of your weakest bullet.
                    </p>
                    <p style={{ color: "#8b94a3", fontSize: 12, margin: 0 }}>
                      Can't see it? Check spam or promotions — and move it to your inbox so the rest of the series lands.
                    </p>
                  </div>

                  <div style={{
                    background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
                    borderRadius: 16, padding: "20px 22px", marginBottom: 14, textAlign: "center",
                  }}>
                    <p style={{ color: GOLD_LIGHT, fontSize: 11, fontWeight: 700, margin: "0 0 8px", letterSpacing: "0.12em" }}>WHAT HAPPENS NEXT</p>
                    <p style={{ color: "#aab2bf", fontSize: 14, margin: 0, lineHeight: 1.7, maxWidth: 460, marginInline: "auto" }}>
                      Over the next two weeks I'll send you the playbook recruiters never share: how the
                      6-second scan works, what the AI screen actually rewards, and how to get seen when
                      the person reading your CV doesn't understand what you do. All free.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {result.summary_rewrite && (
                    <div style={{
                      background: "rgba(255,255,255,.03)", border: "1px solid rgba(184,146,76,.2)",
                      borderRadius: 16, padding: "20px 22px", marginBottom: 14,
                    }}>
                      <h3 style={{ color: "#f0ede6", fontFamily: "'Lato',sans-serif", fontSize: 15, fontWeight: 800, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ background: GOLD, borderRadius: 6, padding: "2px 8px", fontSize: 12, color: NAVY_DEEP }}>✍️ Summary Rewrite</span>
                      </h3>
                      <p style={{ color: "#8b94a3", fontSize: 12, margin: "0 0 10px", fontWeight: 600 }}>
                        Written so a recruiter who's never done your job sees your value instantly (fill in anything in [brackets] with your real figures):
                      </p>
                      <div style={{
                        background: "#fdf8ee", borderRadius: 10, padding: "14px 16px",
                        border: "1px solid #ead9b0", borderLeft: `3px solid ${GOLD}`,
                        fontSize: 14, color: NAVY, lineHeight: 1.7, fontStyle: "italic",
                      }}>
                        {result.summary_rewrite}
                      </div>
                    </div>
                  )}

                  <div style={{
                    background: "rgba(255,255,255,.03)", border: "1px solid rgba(184,146,76,.2)",
                    borderRadius: 16, padding: "20px 22px", marginBottom: 14,
                  }}>
                    <h3 style={{ color: "#f0ede6", fontFamily: "'Lato',sans-serif", fontSize: 15, fontWeight: 800, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: "#c0392b", borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#fff" }}>🎯 Fix These Tonight</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {result.priority_fixes.map((fix, i) => (
                        <div key={i} style={{
                          display: "flex", gap: 12, alignItems: "flex-start",
                          background: "rgba(255,255,255,.03)", borderRadius: 10, padding: "11px 14px",
                          border: "1px solid rgba(255,255,255,.06)",
                        }}>
                          <span style={{
                            width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                            background: `linear-gradient(135deg,${GOLD_LIGHT},${GOLD})`,
                            color: NAVY_DEEP, fontSize: 12, fontWeight: 900,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Lato',sans-serif",
                          }}>{i + 1}</span>
                          <span style={{ fontSize: 14, color: "#c5ccd6", lineHeight: 1.6 }}>{fix}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    background: "rgba(255,255,255,.03)", border: "1px solid rgba(184,146,76,.2)",
                    borderRadius: 16, padding: "20px 22px", marginBottom: 14,
                  }}>
                    <h3 style={{ color: "#f0ede6", fontFamily: "'Lato',sans-serif", fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>
                      Section-by-Section Breakdown
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {result.sections.map((s, i) => <Card key={s.name} section={s} i={i} />)}
                    </div>
                  </div>
                </>
              )}

              <div className="action-btns" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
                {!result.emailed && (
                  <button className="wbtn" onClick={copyReport} style={{
                    padding: "11px 20px", borderRadius: 10, border: "1.5px solid #d6d2c8",
                    background: "#fdfcfa", color: NAVY, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Lato',sans-serif", transition: "all .2s",
                    display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
                  }}>
                    {copied ? "✓ Copied!" : "📋 Copy report"}
                  </button>
                )}
                <button className="dbtn" onClick={reset} style={{
                  padding: "11px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,.15)",
                  background: "transparent", color: "#aab2bf", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Lato',sans-serif", transition: "all .2s",
                }}>
                  ← Check another CV
                </button>
              </div>
            </div>
          );
        })()}

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <p style={{ color: "#3a4558", fontSize: 12, margin: 0 }}>
            <span style={{ color: GOLD, fontWeight: 700 }}>John Bhairoo</span> · Black &amp; White Recruitment · The recruiter you remember
          </p>
        </div>
      </div>
    </div>
  );
}
