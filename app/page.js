"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const SCAN_MSGS = [
  "Opening your CV...",
  "Scanning it the way I would...",
  "6 seconds. That's all you get.",
];

const BUILD_MSGS = [
  "Scoring each section...",
  "Checking your experience bullets...",
  "Looking for metrics and proof points...",
  "Checking ATS compatibility...",
  "Writing your rewrite examples...",
  "Building your full report...",
];

const ST = {
  green: { bg: "#f0fdf4", border: "#86efac", dot: "#16a34a", text: "#166534" },
  amber: { bg: "#fffbeb", border: "#fde68a", dot: "#d97706", text: "#92400e" },
  red: { bg: "#fff1f2", border: "#fecdd3", dot: "#e11d48", text: "#9f1239" },
};

const VD = {
  "needs urgent work": { color: "#e11d48", bg: "#fff1f2", border: "#fecdd3", emoji: "⚠️" },
  "needs significant work": { color: "#d97706", bg: "#fffbeb", border: "#fde68a", emoji: "🔧" },
  "good foundations": { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", emoji: "📈" },
  "strong cv": { color: "#16a34a", bg: "#f0fdf4", border: "#86efac", emoji: "✅" },
};

function sc(n) {
  if (n >= 70) return "#16a34a";
  if (n >= 50) return "#2563eb";
  if (n >= 30) return "#d97706";
  return "#e11d48";
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
        <circle cx={65} cy={65} r={r} fill="none" stroke="#1e293b" strokeWidth={10} />
        <circle cx={65} cy={65} r={r} fill="none" stroke={col} strokeWidth={10}
          strokeDasharray={`${d} ${c}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: col, lineHeight: 1, fontFamily: "'Sora',sans-serif" }}>{animatedScore}</span>
        <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600, letterSpacing: "0.06em", marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function Card({ section, i }) {
  const s = ST[section.status] || ST.amber;
  const ba = section.before_after;
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: `1.5px solid ${s.border}`,
      padding: "15px 17px", display: "flex", flexDirection: "column", gap: 9,
      animation: `fadeUp .4s ease both`, animationDelay: `${i * .07}s`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot }} />
          <span style={{ fontWeight: 800, fontSize: 14, color: "#111827", fontFamily: "'Sora',sans-serif" }}>{section.name}</span>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 800, color: s.text, background: s.bg,
          border: `1px solid ${s.border}`, borderRadius: 20, padding: "2px 10px"
        }}>{section.score}/100</span>
      </div>
      {section.issue && <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.55 }}><span style={{ color: s.dot, fontWeight: 700 }}>Issue: </span>{section.issue}</p>}
      {section.fix && (
        <div style={{ background: s.bg, borderLeft: `3px solid ${s.dot}`, borderRadius: "0 8px 8px 0", padding: "9px 12px", fontSize: 13, color: "#111827", lineHeight: 1.55 }}>
          <span style={{ fontWeight: 700 }}>Fix tonight: </span>{section.fix}
        </div>
      )}
      {ba && ba.before && ba.after && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          <div style={{ background: "#fff1f2", borderRadius: 8, padding: "9px 12px", fontSize: 12, color:
