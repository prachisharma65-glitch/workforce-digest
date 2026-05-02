import { useState, useMemo } from "react";
import { ChevronRight, X, ArrowRight, Check, BookOpen, ArrowLeft } from "lucide-react";

export default function WorkforceDigest() {
  const [view, setView] = useState("digest");
  const [week, setWeek] = useState("current");
  const [openInsight, setOpenInsight] = useState(null);
  const [resolved, setResolved] = useState({});

  const insights = useMemo(() => week === "current" ? CURRENT_WEEK : PREVIOUS_WEEK, [week]);
  const weekLabel = week === "current" ? "Apr 21 – Apr 27, 2026" : "Apr 14 – Apr 20, 2026";
  const activeCount = insights.filter(i => !resolved[i.id]).length;

  return (
    <div style={{ fontFamily: "'Fraunces', Georgia, serif", background: "#FAF8F4", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .sans { font-family: 'Inter', sans-serif; }
        .serif { font-family: 'Fraunces', Georgia, serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        button { cursor: pointer; font-family: inherit; }
        .insight-row { transition: background 0.2s ease; }
        .insight-row:hover { background: rgba(0,0,0,0.02); }
        .insight-row:hover .arrow { transform: translateX(2px); opacity: 1; }
        .arrow { transition: transform 0.2s ease, opacity 0.2s ease; opacity: 0.4; }
        .modal-backdrop { animation: fadeIn 0.25s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-content { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .resolved { opacity: 0.4; }
        .resolved .insight-title { text-decoration: line-through; }
        .link-btn { background: none; border: none; padding: 0; color: inherit; }
        .link-btn:hover { color: #1a1a1a; }
        details > summary { list-style: none; cursor: pointer; }
        details > summary::-webkit-details-marker { display: none; }
        details[open] .chev { transform: rotate(90deg); }
        .chev { transition: transform 0.2s ease; display: inline-block; }
        .conf-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; margin: 0 6px 1px 0; vertical-align: middle; }
      `}</style>

      {view === "digest" ? (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 32px 120px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 80 }}>
            <div className="sans" style={{ fontSize: 12, color: "#888", letterSpacing: "0.02em" }}>
              Northwind Labs · Monday brief
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              <button onClick={() => setWeek("previous")} className="sans" style={{ padding: "4px 10px", fontSize: 12, border: "none", background: "transparent", color: week === "previous" ? "#1a1a1a" : "#aaa", fontWeight: week === "previous" ? 600 : 400 }}>Last week</button>
              <span style={{ color: "#ccc", padding: "4px 2px", fontSize: 12 }}>·</span>
              <button onClick={() => setWeek("current")} className="sans" style={{ padding: "4px 10px", fontSize: 12, border: "none", background: "transparent", color: week === "current" ? "#1a1a1a" : "#aaa", fontWeight: week === "current" ? 600 : 400 }}>This week</button>
            </div>
          </div>

          <div style={{ marginBottom: 72 }}>
            <div className="sans" style={{ fontSize: 12, color: "#9A4D2A", marginBottom: 24, letterSpacing: "0.02em" }}>
              {weekLabel}
            </div>
            <h1 className="serif" style={{ fontSize: 44, lineHeight: 1.15, fontWeight: 400, letterSpacing: "-0.02em", margin: "0 0 24px", color: "#1a1a1a" }}>
              {activeCount === 0 ? (
                <>Nothing urgent <span style={{ fontStyle: "italic" }}>this week.</span></>
              ) : (
                <>{activeCount === 1 ? "One thing" : `${activeCount} things`} <span style={{ fontStyle: "italic" }}>need your attention.</span></>
              )}
            </h1>
            <p className="sans" style={{ fontSize: 15, color: "#666", lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
              Quiet patterns across leave, onboarding, and engagement — surfaced from the past seven days.
            </p>
          </div>

          <div>
            {insights.map((insight, i) => (
              <InsightRow
                key={insight.id}
                insight={insight}
                rank={i + 1}
                isLast={i === insights.length - 1}
                resolved={!!resolved[insight.id]}
                onOpen={() => setOpenInsight(insight)}
                onResolve={(e) => { e.stopPropagation(); setResolved({ ...resolved, [insight.id]: !resolved[insight.id] }); }}
              />
            ))}
          </div>

          <div style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 18 }}>
              <button onClick={() => setView("signalbook")} className="sans link-btn" style={{ fontSize: 11, color: "#777", display: "flex", alignItems: "center", gap: 6 }}>
                <BookOpen size={12} />
                How signals work
              </button>
              <button onClick={() => setView("evals")} className="sans link-btn" style={{ fontSize: 11, color: "#777" }}>
                Eval suite
              </button>
            </div>
            <button onClick={() => setView("validation")} className="sans link-btn" style={{ fontSize: 11, color: "#777" }}>
              How we know we're right →
            </button>
            <button onClick={() => setView("integration")} className="sans link-btn" style={{ fontSize: 11, color: "#777" }}>
                Integration architecture
              </button>
          </div>
        </div>
      ) : view === "signalbook" ? (
        <SignalBook onBack={() => setView("digest")} />
      ) : view === "evals" ? (
        <EvalsPage onBack={() => setView("digest")} />
      ) : view === "integration" ? (
        <IntegrationPage onBack={() => setView("digest")} />
      ) : (
        <ValidationPage onBack={() => setView("digest")} />
      )}

      {openInsight && <DetailModal insight={openInsight} onClose={() => setOpenInsight(null)} onOpenSignalBook={() => { setOpenInsight(null); setView("signalbook"); }} onOpenValidation={() => { setOpenInsight(null); setView("validation"); }} />}
    </div>
  );
}

function ConfidenceLine({ confidence }) {
  const labels = { high: "High confidence", medium: "Moderate confidence", low: "Low confidence — corroborate before acting" };
  const colors = { high: "#7B9466", medium: "#B8860B", low: "#9A4D2A" };
  return (
    <div className="sans" style={{ fontSize: 12, color: "#888", fontStyle: "italic", marginBottom: 14, lineHeight: 1.5 }}>
      <span className="conf-dot" style={{ background: colors[confidence.level] }} />
      {labels[confidence.level]} · {confidence.summary}
    </div>
  );
}

function InsightRow({ insight, rank, isLast, resolved, onOpen, onResolve }) {
  return (
    <div
      onClick={onOpen}
      className={`insight-row ${resolved ? "resolved" : ""}`}
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr auto",
        gap: 24,
        padding: "28px 12px 28px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.06)",
        cursor: "pointer",
        alignItems: "flex-start",
      }}
    >
      <div className="serif" style={{ fontSize: 14, color: "#bbb", paddingTop: 4, fontWeight: 400, fontStyle: "italic" }}>
        {String(rank).padStart(2, "0")}
      </div>

      <div style={{ minWidth: 0 }}>
        <div className="sans" style={{ fontSize: 11, color: "#9A4D2A", letterSpacing: "0.04em", marginBottom: 8, fontWeight: 500 }}>
          {insight.category}
        </div>
        <div className="insight-title serif" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.3, color: "#1a1a1a", letterSpacing: "-0.01em", marginBottom: 10 }}>
          {insight.title}
        </div>
        <ConfidenceLine confidence={insight.confidence} />
        <div className="sans" style={{ fontSize: 14, color: "#777", lineHeight: 1.6, marginBottom: 16 }}>
          {insight.summary}
        </div>
        <div className="sans" style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.5, display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
          <span style={{ color: "#9A4D2A", fontSize: 11, letterSpacing: "0.04em", fontWeight: 500, flexShrink: 0 }}>SUGGESTED</span>
          <span>{insight.action}</span>
        </div>
        <div className="sans mono" style={{ fontSize: 10, color: "#aaa", letterSpacing: "0.02em" }}>
          {insight.sources.join(" · ")}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 4 }}>
        <button
          onClick={onResolve}
          style={{ border: "1px solid", borderColor: resolved ? "#7BA05B" : "rgba(0,0,0,0.12)", background: resolved ? "#7BA05B" : "transparent", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
          title={resolved ? "Mark unresolved" : "Mark done"}
        >
          {resolved && <Check size={12} color="#fff" strokeWidth={3} />}
        </button>
        <ChevronRight size={16} className="arrow" color="#999" />
      </div>
    </div>
  );
}

function DetailModal({ insight, onClose, onOpenSignalBook, onOpenValidation }) {
  const [actionTaken, setActionTaken] = useState(null);
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(20,18,12,0.4)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#FAF8F4", maxWidth: 600, width: "100%", maxHeight: "88vh", overflow: "auto", borderRadius: 4, boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
      >
        <div style={{ padding: "40px 48px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div className="sans" style={{ fontSize: 11, color: "#9A4D2A", letterSpacing: "0.04em", fontWeight: 500 }}>
              {insight.category}
            </div>
            <button onClick={onClose} style={{ border: "none", background: "transparent", padding: 4, color: "#999", cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>

          <h2 className="serif" style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 16px", color: "#1a1a1a" }}>
            {insight.title}
          </h2>
          <ConfidenceLine confidence={insight.confidence} />
          <p className="sans" style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: "8px 0 0" }}>
            {insight.detail}
          </p>
        </div>

        <div style={{ padding: "0 48px 28px" }}>
          <div className="sans" style={{ fontSize: 11, color: "#999", letterSpacing: "0.04em", marginBottom: 6, fontWeight: 500 }}>
            How confident are we
          </div>
          <div className="sans" style={{ fontSize: 12, color: "#aaa", marginBottom: 20, lineHeight: 1.5, fontStyle: "italic" }}>
            Independent signals — not used to generate the alert — checked for corroboration.
          </div>

          <div>
            {insight.corroboration.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 14, padding: "12px 0", borderTop: i > 0 ? "1px solid rgba(0,0,0,0.05)" : "none", alignItems: "baseline" }}>
                <div style={{ paddingTop: 4 }}>
                  {c.agrees === true && <span style={{ color: "#7B9466", fontSize: 14 }}>✓</span>}
                  {c.agrees === false && <span style={{ color: "#9A4D2A", fontSize: 14 }}>✗</span>}
                  {c.agrees === null && <span style={{ color: "#bbb", fontSize: 14 }}>—</span>}
                </div>
                <div>
                  <div className="sans" style={{ fontSize: 13, color: "#1a1a1a", marginBottom: 3, fontWeight: 500 }}>{c.signal}</div>
                  <div className="sans" style={{ fontSize: 12, color: "#777", lineHeight: 1.55 }}>{c.finding}</div>
                </div>
                <div className="sans mono" style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.04em", whiteSpace: "nowrap", paddingTop: 4 }}>
                  {c.agrees === true ? "AGREES" : c.agrees === false ? "DISAGREES" : "INCONCLUSIVE"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, padding: "14px 16px", background: "rgba(0,0,0,0.03)", borderRadius: 4 }}>
            <div className="sans" style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.6 }}>
              <span style={{ fontWeight: 600 }}>Verdict:</span> {insight.confidence.summary}. {insight.confidence.note}
            </div>
          </div>
        </div>

        <div style={{ padding: "0 48px 28px" }}>
          <div className="sans" style={{ fontSize: 11, color: "#999", letterSpacing: "0.04em", marginBottom: 16, fontWeight: 500 }}>
            The signal
          </div>
          <div>
            {insight.data.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "14px 0", borderTop: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none", alignItems: "baseline" }}>
                <div className="sans" style={{ fontSize: 13, color: "#666" }}>{row.label}</div>
                <div className="serif" style={{ fontSize: 16, fontWeight: 400, color: row.alert ? "#9A4D2A" : "#1a1a1a" }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 48px 28px" }}>
          <details>
            <summary className="sans" style={{ fontSize: 12, color: "#777", padding: "12px 14px", background: "rgba(0,0,0,0.025)", borderRadius: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <span className="chev" style={{ fontSize: 10, color: "#aaa" }}>›</span>
              Sources, rule, and noise control
            </summary>
            <div style={{ padding: "20px 14px 8px" }}>
              <div className="sans" style={{ fontSize: 11, color: "#999", letterSpacing: "0.04em", marginBottom: 8, fontWeight: 500 }}>SOURCES</div>
              <div className="sans mono" style={{ fontSize: 11, color: "#444", marginBottom: 20, lineHeight: 1.7 }}>
                {insight.provenance.sources.map((s, i) => <div key={i}>· {s}</div>)}
              </div>
              <div className="sans" style={{ fontSize: 11, color: "#999", letterSpacing: "0.04em", marginBottom: 8, fontWeight: 500 }}>RULE</div>
              <div className="sans" style={{ fontSize: 13, color: "#1a1a1a", marginBottom: 8, lineHeight: 1.5 }}>
                {insight.provenance.rule}
              </div>
              <div className="sans mono" style={{ fontSize: 11, color: "#9A4D2A", marginBottom: 20, padding: "8px 12px", background: "rgba(154,77,42,0.06)", borderRadius: 3 }}>
                {insight.provenance.ruleExpression}
              </div>
              <button onClick={onOpenValidation} className="link-btn sans" style={{ fontSize: 12, color: "#9A4D2A", textDecoration: "underline", textUnderlineOffset: 3 }}>
                How this rule's accuracy is measured →
              </button>
            </div>
          </details>
        </div>

        <div style={{ padding: "0 48px 48px" }}>
          <div className="sans" style={{ fontSize: 11, color: "#999", letterSpacing: "0.04em", marginBottom: 16, fontWeight: 500 }}>
            Recommended next step
          </div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 400, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 12, letterSpacing: "-0.01em" }}>
            {insight.action}
          </div>
          <p className="sans" style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: "0 0 28px" }}>
            {insight.actionRationale}
          </p>
         {actionTaken ? (
            <div style={{ padding: "16px 18px", background: "rgba(123, 160, 91, 0.08)", border: "1px solid rgba(123, 160, 91, 0.3)", borderRadius: 4, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Check size={16} color="#7BA05B" strokeWidth={2.5} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div className="sans" style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
                  {actionTaken === "action" ? "Action logged" : "Snoozed for 7 days"}
                </div>
                <div className="sans" style={{ fontSize: 12, color: "#666", lineHeight: 1.55 }}>
                  {actionTaken === "action"
                    ? "In production, this would carry out the suggested action — scheduling, messaging, and notifications — automatically."
                    : "In production, this would suppress this alert until next Monday's brief."}
                </div>
                <div className="sans mono" style={{ fontSize: 10, color: "#999", letterSpacing: "0.04em", marginTop: 8 }}>
                  DEMO · NOT CONNECTED TO REAL SYSTEMS
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setActionTaken("action")} className="sans" style={{ flex: 1, padding: "12px 20px", background: "#1a1a1a", color: "#FAF8F4", border: "none", borderRadius: 2, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Take action <ArrowRight size={14} />
              </button>
              <button onClick={() => setActionTaken("snooze")} className="sans" style={{ padding: "12px 20px", background: "transparent", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 2, fontSize: 13, fontWeight: 500, color: "#666" }}>
                Snooze
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function ValidationPage({ onBack }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px 120px" }}>
      <button onClick={onBack} className="link-btn sans" style={{ fontSize: 12, color: "#777", display: "flex", alignItems: "center", gap: 6, marginBottom: 48 }}>
        <ArrowLeft size={12} /> Back to brief
      </button>

      <div style={{ marginBottom: 64 }}>
        <div className="sans" style={{ fontSize: 12, color: "#9A4D2A", marginBottom: 16, letterSpacing: "0.02em" }}>
          Validation
        </div>
        <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 20px" }}>
          How we know <span style={{ fontStyle: "italic" }}>we're right.</span>
        </h1>
        <p className="sans" style={{ fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
          The hard problem in workforce analytics isn't generating insights — it's knowing whether the insights are correct. We can't ask you to grade every alert; that defeats the point. So validation has to come from somewhere else, and it has to come from data the system didn't already use to generate the alert.
        </p>
      </div>

      <div style={{ marginBottom: 64, paddingBottom: 56, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", marginBottom: 12 }}>01</div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 14px" }}>Three rings of validation</h2>
        <p className="sans" style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 600 }}>
          Each ring uses a different mechanism, on different data, with different latency. Stacked, they give us a continuous read on whether the system is working — without asking the HR manager to grade homework.
        </p>

        {VALIDATION_RINGS.map((ring, i) => (
          <div key={i} style={{ padding: "28px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, gap: 16 }}>
              <div className="serif" style={{ fontSize: 19, fontWeight: 500, color: "#1a1a1a", letterSpacing: "-0.01em" }}>{ring.name}</div>
              <div className="sans mono" style={{ fontSize: 10, color: "#9A4D2A", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{ring.latency}</div>
            </div>
            <div className="sans" style={{ fontSize: 14, color: "#555", lineHeight: 1.65, marginBottom: 16 }}>{ring.what}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div className="sans" style={{ fontSize: 10, color: "#888", letterSpacing: "0.06em", marginBottom: 6, fontWeight: 500 }}>WHAT IT CATCHES</div>
                <div className="sans" style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{ring.catches}</div>
              </div>
              <div>
                <div className="sans" style={{ fontSize: 10, color: "#888", letterSpacing: "0.06em", marginBottom: 6, fontWeight: 500 }}>WHAT IT MISSES</div>
                <div className="sans" style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{ring.misses}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 64, paddingBottom: 56, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", marginBottom: 12 }}>02</div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 14px" }}>The scorecard</h2>
        <p className="sans" style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 600 }}>
          Every alert eventually lands in one of four states. We track the distribution per signal type, per customer, and over time.
        </p>

        <div style={{ marginBottom: 28 }}>
          {SCORECARD.map((row, i) => (
            <div key={i} style={{ padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, gap: 16 }}>
                <div className="serif" style={{ fontSize: 17, fontWeight: 500, color: "#1a1a1a", letterSpacing: "-0.005em" }}>{row.signal}</div>
                <div className="sans mono" style={{ fontSize: 11, color: "#666" }}>{row.total} alerts · last 90d</div>
              </div>
              <div style={{ display: "flex", height: 8, borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ background: "#7B9466", width: `${row.tp}%` }} />
                <div style={{ background: "#9A4D2A", width: `${row.fp}%` }} />
                <div style={{ background: "#D4D0C5", width: `${row.pending}%` }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <ScoreCell color="#7B9466" pct={row.tp} label="Confirmed correct" />
                <ScoreCell color="#9A4D2A" pct={row.fp} label="Disconfirmed" />
                <ScoreCell color="#999" pct={row.pending} label="Outcome pending" />
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 18px", background: "rgba(0,0,0,0.03)", borderRadius: 4 }}>
          <div className="sans" style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.7 }}>
            <span style={{ fontWeight: 600 }}>Read this carefully:</span> "Confirmed correct" doesn't mean the alert prevented harm — only that the predicted outcome occurred. The actual question of <em>causal</em> impact is harder, and we address it next.
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 64, paddingBottom: 56, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", marginBottom: 12 }}>03</div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 14px" }}>
          The problem we <span style={{ fontStyle: "italic" }}>can't</span> fully solve
        </h2>
        <p className="sans" style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 600 }}>
          When the system flags an attrition risk, the manager intervenes, and the person stays — was the alert correct and the intervention saved them? Or was the alert wrong and they would have stayed anyway? You cannot know. Acting on the alert destroys the evidence that would have validated it.
        </p>
        <p className="sans" style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 600 }}>
          This is the <em>prevention paradox</em>, and every predictive workforce tool has it. Most pretend it doesn't exist. We won't.
        </p>

        <div style={{ padding: "20px 22px", background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 4, marginBottom: 24 }}>
          <div className="sans" style={{ fontSize: 11, color: "#9A4D2A", letterSpacing: "0.04em", marginBottom: 8, fontWeight: 500 }}>OUR APPROACH (V2, OPT-IN)</div>
          <div className="serif" style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.4, marginBottom: 10, letterSpacing: "-0.005em" }}>Randomized holdout testing</div>
          <div className="sans" style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>
            For customers who opt in, we silently suppress alerts on a small random subset of qualifying teams (e.g., 10%) and compare downstream outcomes against the alerted-and-acted-upon group. Over 6+ months, the difference tells us whether the alerts caused the prevention, or whether the patterns were going to resolve themselves anyway.
          </div>
        </div>

        <div className="sans" style={{ fontSize: 12, color: "#999", lineHeight: 1.7, fontStyle: "italic" }}>
          Until we run holdouts at scale, claims about prevention should be treated as plausible, not proven.
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", marginBottom: 12 }}>04</div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 14px" }}>What we still don't know</h2>
        {OPEN_QUESTIONS.map((q, i) => (
          <div key={i} style={{ padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="serif" style={{ fontSize: 16, fontWeight: 500, color: "#1a1a1a", marginBottom: 6, letterSpacing: "-0.005em" }}>{q.q}</div>
            <div className="sans" style={{ fontSize: 13, color: "#666", lineHeight: 1.65 }}>{q.a}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <button onClick={onBack} className="link-btn sans" style={{ fontSize: 12, color: "#777" }}>
          ← Back to this week's brief
        </button>
      </div>
    </div>
  );
}

function ScoreCell({ color, pct, label }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
        <div className="serif" style={{ fontSize: 18, fontWeight: 500, color: "#1a1a1a" }}>{pct}%</div>
      </div>
      <div className="sans" style={{ fontSize: 11, color: "#777", lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

function EvalsPage({ onBack }) {
  const passed = EVAL_RESULTS.filter(r => r.passed).length;
  const total = EVAL_RESULTS.length;
  const pctPassed = Math.round((passed / total) * 100);

  const byDetector = EVAL_RESULTS.reduce((acc, r) => {
    if (!acc[r.detector]) acc[r.detector] = [];
    acc[r.detector].push(r);
    return acc;
  }, {});

  const detectorLabels = {
    leave_anomaly: "Leave anomaly",
    onboarding_stall: "Onboarding stall",
    engagement_drop: "Engagement drop",
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px 120px" }}>
      <button onClick={onBack} className="link-btn sans" style={{ fontSize: 12, color: "#777", display: "flex", alignItems: "center", gap: 6, marginBottom: 48 }}>
        <ArrowLeft size={12} /> Back to brief
      </button>

      <div style={{ marginBottom: 56 }}>
        <div className="sans" style={{ fontSize: 12, color: "#9A4D2A", marginBottom: 16, letterSpacing: "0.02em" }}>
          Eval suite
        </div>
        <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 20px" }}>
          Golden tests, run on <span style={{ fontStyle: "italic" }}>every change.</span>
        </h1>
        <p className="sans" style={{ fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
          Hand-crafted scenarios with known correct answers. Runs offline before deployment. If a code change accidentally breaks behavior we already validated, the eval suite catches it in seconds — before any HR manager sees a wrong alert.
        </p>
      </div>

      <div style={{ padding: "32px 36px", background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 4, marginBottom: 48 }}>
        <div className="sans" style={{ fontSize: 11, color: "#9A4D2A", letterSpacing: "0.04em", marginBottom: 12, fontWeight: 500 }}>
          LATEST RUN
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
          <div className="serif" style={{ fontSize: 56, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1, color: pctPassed === 100 ? "#7B9466" : "#9A4D2A" }}>
            {passed} <span style={{ color: "#bbb" }}>/ {total}</span>
          </div>
          <div className="sans" style={{ fontSize: 14, color: "#666" }}>
            tests passed ({pctPassed}%)
          </div>
        </div>
        <div style={{ display: "flex", height: 6, borderRadius: 2, overflow: "hidden", background: "rgba(0,0,0,0.05)" }}>
          <div style={{ background: "#7B9466", width: `${pctPassed}%` }} />
        </div>
        <div className="sans mono" style={{ fontSize: 10, color: "#aaa", marginTop: 14, letterSpacing: "0.04em" }}>
          RUN: 2026-04-28 14:32 · COMMIT a3f8c12 · ENV: staging
        </div>
      </div>

      <div style={{ marginBottom: 56, paddingBottom: 48, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", marginBottom: 12 }}>01</div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 14px" }}>
          What an eval is — and isn't
        </h2>
        <p className="sans" style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 600 }}>
          Evals are unit tests for the alert engine. Each test is a concrete scenario where we already know the correct answer.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div className="sans" style={{ fontSize: 10, color: "#888", letterSpacing: "0.06em", marginBottom: 8, fontWeight: 500 }}>EVALS CATCH</div>
            <div className="sans" style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>
              Code regressions. Threshold tuning that breaks edge cases. New rules that accidentally undo old fixes.
            </div>
          </div>
          <div>
            <div className="sans" style={{ fontSize: 10, color: "#888", letterSpacing: "0.06em", marginBottom: 8, fontWeight: 500 }}>EVALS DON'T CATCH</div>
            <div className="sans" style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>
              Whether the rules themselves are right. If the test scenarios encode wrong assumptions, the suite will validate the wrong behavior.
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 56, paddingBottom: 48, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", marginBottom: 12 }}>02</div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 14px" }}>
          The test cases
        </h2>
        <p className="sans" style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 600 }}>
          Ten scenarios chosen specifically to hit edge cases. Click any to see the full input, expected output, and what behavior it validates.
        </p>

        {Object.entries(byDetector).map(([detector, results]) => {
          const dPassed = results.filter(r => r.passed).length;
          return (
            <div key={detector} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="serif" style={{ fontSize: 18, fontWeight: 500, color: "#1a1a1a", letterSpacing: "-0.005em" }}>
                  {detectorLabels[detector] || detector}
                </div>
                <div className="sans mono" style={{ fontSize: 11, color: dPassed === results.length ? "#7B9466" : "#9A4D2A" }}>
                  {dPassed} of {results.length} passed
                </div>
              </div>
              {results.map((r) => (
                <TestCaseRow key={r.id} result={r} />
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 32 }}>
        <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", marginBottom: 12 }}>03</div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 14px" }}>
          The honest take
        </h2>
        <p className="sans" style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 16px", maxWidth: 600 }}>
          Ten test cases isn't enough. A production system would have 50–100, covering rare scenarios. Each new bug in the wild becomes a new test case so the bug never returns.
        </p>
        <p className="sans" style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: 0, maxWidth: 600 }}>
          What this suite is good for: catching regressions when code or thresholds change. What it isn't: proof that the rules are right.
        </p>
      </div>

      <div style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <button onClick={onBack} className="link-btn sans" style={{ fontSize: 12, color: "#777" }}>
          ← Back to this week's brief
        </button>
      </div>
    </div>
  );
}

function TestCaseRow({ result }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: "grid", gridTemplateColumns: "20px auto 1fr auto", gap: 14, padding: "16px 0", cursor: "pointer", alignItems: "baseline" }}
      >
        <div style={{ fontSize: 14, color: result.passed ? "#7B9466" : "#9A4D2A", fontWeight: 600 }}>
          {result.passed ? "✓" : "✗"}
        </div>
        <div className="sans mono" style={{ fontSize: 10, color: "#999", letterSpacing: "0.04em" }}>
          {result.id}
        </div>
        <div className="sans" style={{ fontSize: 14, color: "#1a1a1a", fontWeight: 500 }}>
          {result.name}
        </div>
        <div className="sans" style={{ fontSize: 11, color: "#aaa" }}>
          {expanded ? "−" : "+"}
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 0 24px 34px", maxWidth: 580 }}>
          <div className="sans" style={{ fontSize: 13, color: "#666", lineHeight: 1.65, marginBottom: 16 }}>
            {result.description}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 10, fontSize: 12, marginBottom: 16 }}>
            <div className="sans" style={{ color: "#999" }}>Expected</div>
            <div className="sans mono" style={{ color: "#444" }}>{result.expected}</div>
            <div className="sans" style={{ color: "#999" }}>Actual</div>
            <div className="sans mono" style={{ color: result.passed ? "#444" : "#9A4D2A" }}>{result.actual}</div>
            <div className="sans" style={{ color: "#999" }}>Validates</div>
            <div className="sans" style={{ color: "#444" }}>{result.tests.join(", ")}</div>
          </div>
          <div style={{ padding: "12px 14px", background: "rgba(0,0,0,0.025)", borderRadius: 3 }}>
            <div className="sans" style={{ fontSize: 11, color: "#888", marginBottom: 4, letterSpacing: "0.04em" }}>RATIONALE</div>
            <div className="sans" style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>
              {result.rationale}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SignalBook({ onBack }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px 120px" }}>
      <button onClick={onBack} className="link-btn sans" style={{ fontSize: 12, color: "#777", display: "flex", alignItems: "center", gap: 6, marginBottom: 48 }}>
        <ArrowLeft size={12} /> Back to brief
      </button>
      <div style={{ marginBottom: 56 }}>
        <div className="sans" style={{ fontSize: 12, color: "#9A4D2A", marginBottom: 16, letterSpacing: "0.02em" }}>
          Signal book
        </div>
        <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 20px" }}>
          Every alert, <span style={{ fontStyle: "italic" }}>explained.</span>
        </h1>
        <p className="sans" style={{ fontSize: 15, color: "#666", lineHeight: 1.65, maxWidth: 560, margin: 0 }}>
          Sources, rules, thresholds, and noise control — documented per signal so nothing is a black box.
        </p>
      </div>

      <Section kicker="01" title="Where signals come from" body="Every signal is grounded in data you already have. If a source isn't connected, the signals that depend on it are paused, not faked.">
        <SourceTable />
      </Section>
      <Section kicker="02" title="How thresholds are set" body="Each signal compares this week against your team's own 12-week rolling baseline and only fires when the change is statistically meaningful (z-score ≥ 2) and operationally meaningful (a minimum absolute floor).">
        <RuleTable />
      </Section>
      <Section kicker="03" title="How we keep noise down" body="We start strict and let you loosen — not the other way around.">
        <NoiseControls />
      </Section>

      <div style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <button onClick={onBack} className="link-btn sans" style={{ fontSize: 12, color: "#777" }}>
          ← Back to this week's brief
        </button>
      </div>
    </div>
  );
}

function Section({ kicker, title, body, children }) {
  return (
    <div style={{ marginBottom: 64, paddingBottom: 56, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic", marginBottom: 12 }}>{kicker}</div>
      <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.25, margin: "0 0 14px" }}>{title}</h2>
      <p className="sans" style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 600 }}>{body}</p>
      {children}
    </div>
  );
}

function SourceTable() {
  return (
    <div>
      {SOURCES.map((src, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)", alignItems: "baseline" }}>
          <div>
            <div className="sans" style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{src.name}</div>
            <div className="sans mono" style={{ fontSize: 10, color: "#999" }}>{src.type}</div>
          </div>
          <div>
            <div className="sans" style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 6 }}>{src.feeds}</div>
            <div className="sans mono" style={{ fontSize: 10, color: "#999" }}>READ-ONLY · {src.cadence}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RuleTable() {
  return (
    <div>
      {RULES.map((rule, i) => (
        <div key={i} style={{ padding: "24px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="serif" style={{ fontSize: 17, fontWeight: 500, color: "#1a1a1a", marginBottom: 8, letterSpacing: "-0.005em" }}>{rule.name}</div>
          <div className="sans" style={{ fontSize: 13, color: "#666", lineHeight: 1.65, marginBottom: 14 }}>{rule.plain}</div>
          <div className="sans mono" style={{ fontSize: 11, color: "#9A4D2A", padding: "10px 14px", background: "rgba(154,77,42,0.05)", borderRadius: 3, lineHeight: 1.6, marginBottom: 12 }}>
            {rule.expression}
          </div>
          <div className="sans" style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
            <strong style={{ color: "#666", fontWeight: 500 }}>Source of threshold:</strong> {rule.thresholdSource}
          </div>
        </div>
      ))}
    </div>
  );
}

function NoiseControls() {
  return (
    <div>
      {NOISE_CONTROLS.map((n, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 20, padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)", alignItems: "baseline" }}>
          <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic" }}>{String(i + 1).padStart(2, "0")}</div>
          <div>
            <div className="sans" style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>{n.title}</div>
            <div className="sans" style={{ fontSize: 13, color: "#666", lineHeight: 1.65 }}>{n.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function IntegrationPage({ onBack }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px 120px" }}>
      <button onClick={onBack} className="link-btn sans" style={{ fontSize: 12, color: "#777", display: "flex", alignItems: "center", gap: 6, marginBottom: 48 }}>
        <ArrowLeft size={12} /> Back to brief
      </button>

      <div style={{ marginBottom: 56 }}>
        <div className="sans" style={{ fontSize: 12, color: "#9A4D2A", marginBottom: 16, letterSpacing: "0.02em" }}>
          Integration architecture
        </div>
        <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 20px" }}>
          How this connects to <span style={{ fontStyle: "italic" }}>real systems.</span>
        </h1>
        <p className="sans" style={{ fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
          The prototype runs on mock data. This page describes how the production integration layer would be designed — which APIs we'd use, what we'd read, how the sync would work, and where the hard problems are. It's an architectural sketch, not a built integration.
        </p>
      </div>

      <Section kicker="01" title="The three categories of source systems" body="The Workforce Digest reads from three categories of systems. Every integration is read-only. The system never writes back to source systems — that constraint is deliberate.">
        <div>
          {INTEGRATION_CATEGORIES.map((cat, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)", alignItems: "baseline" }}>
              <div>
                <div className="sans" style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{cat.name}</div>
                <div className="sans mono" style={{ fontSize: 10, color: "#999" }}>{cat.requirement}</div>
              </div>
              <div className="sans" style={{ fontSize: 13, color: "#444", lineHeight: 1.65 }}>{cat.purpose}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="02" title="Per-system integration design" body="What we'd actually do for each of the five core integrations.">
        {INTEGRATIONS.map((sys, i) => (
          <div key={i} style={{ padding: "28px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, gap: 16 }}>
              <div className="serif" style={{ fontSize: 19, fontWeight: 500, color: "#1a1a1a", letterSpacing: "-0.005em" }}>{sys.name}</div>
              <div className="sans mono" style={{ fontSize: 10, color: "#9A4D2A", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{sys.category}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 14, fontSize: 12 }}>
              <div className="sans" style={{ color: "#888", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 10, paddingTop: 2 }}>Auth</div>
              <div className="sans" style={{ color: "#444", lineHeight: 1.6 }}>{sys.auth}</div>
              <div className="sans" style={{ color: "#888", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 10, paddingTop: 2 }}>Sync</div>
              <div className="sans" style={{ color: "#444", lineHeight: 1.6 }}>{sys.sync}</div>
              <div className="sans" style={{ color: "#888", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 10, paddingTop: 2 }}>Reads</div>
              <div className="sans" style={{ color: "#444", lineHeight: 1.6 }}>{sys.reads}</div>
              <div className="sans" style={{ color: "#888", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 10, paddingTop: 2 }}>Rate limits</div>
              <div className="sans" style={{ color: "#444", lineHeight: 1.6 }}>{sys.limits}</div>
              <div className="sans" style={{ color: "#888", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 10, paddingTop: 2 }}>Watch out for</div>
              <div className="sans" style={{ color: "#9A4D2A", lineHeight: 1.6 }}>{sys.gotcha}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section kicker="03" title="The sync architecture" body="Three patterns running in parallel. All three write into a unified internal data model that's source-system-agnostic.">
        <div>
          {SYNC_PATTERNS.map((p, i) => (
            <div key={i} style={{ padding: "22px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="serif" style={{ fontSize: 17, fontWeight: 500, color: "#1a1a1a", marginBottom: 8, letterSpacing: "-0.005em" }}>{p.name}</div>
              <div className="sans mono" style={{ fontSize: 10, color: "#9A4D2A", letterSpacing: "0.04em", marginBottom: 10 }}>{p.frequency}</div>
              <div className="sans" style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{p.what}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="04" title="Authentication and trust boundaries" body="Every integration uses customer-scoped credentials. The authorization model is built around four invariants:">
        <div>
          {AUTH_PRINCIPLES.map((a, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 20, padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)", alignItems: "baseline" }}>
              <div className="serif" style={{ fontSize: 14, color: "#bbb", fontStyle: "italic" }}>{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="sans" style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>{a.title}</div>
                <div className="sans" style={{ fontSize: 13, color: "#666", lineHeight: 1.65 }}>{a.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="05" title="Failure modes — the honest list" body="What can go wrong in production, and how we handle each. This list is the difference between a demo and a real system.">
        <div>
          {FAILURE_MODES.map((f, i) => (
            <div key={i} style={{ padding: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="serif" style={{ fontSize: 16, fontWeight: 500, color: "#1a1a1a", marginBottom: 6, letterSpacing: "-0.005em" }}>{f.failure}</div>
              <div className="sans" style={{ fontSize: 13, color: "#666", lineHeight: 1.65 }}>{f.handling}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="06" title="What we deliberately don't build" body="Architectural integrity is partly about what you choose not to build. Four explicit non-goals.">
        <div>
          {NON_GOALS.map((n, i) => (
            <div key={i} style={{ padding: "22px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="serif" style={{ fontSize: 17, fontWeight: 500, color: "#1a1a1a", marginBottom: 8, letterSpacing: "-0.005em" }}>{n.title}</div>
              <div className="sans" style={{ fontSize: 13, color: "#666", lineHeight: 1.65 }}>{n.reason}</div>
            </div>
          ))}
        </div>
      </Section>

      <div style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <button onClick={onBack} className="link-btn sans" style={{ fontSize: 12, color: "#777" }}>
          ← Back to this week's brief
        </button>
      </div>
    </div>
  );
}
// ============= MOCK DATA =============

const CURRENT_WEEK = [
  {
    id: "leave-spike",
    category: "Leave anomaly",
    title: "Engineering has 27% of the team out — double the baseline",
    confidence: {
      level: "high",
      summary: "3 of 4 independent signals agree",
      note: "The unplanned-leave clustering and absence of seasonal precedent are the strongest corroborators. Worth acting on.",
    },
    summary: "Six engineers on leave at once, including two unplanned sick days called in Sunday night. The Payments squad is down to two of five.",
    detail: "Your typical weekly leave rate for Engineering sits at 11–14%. This week jumped to 27% — driven by overlapping vacation planned in February, one parental leave starting Monday, and two unplanned sick days over the weekend.",
    sources: ["BambooHR", "Google Calendar"],
    data: [
      { label: "Engineering on leave", value: "6 of 22", alert: true },
      { label: "12-week baseline", value: "2.6 of 22" },
      { label: "Payments squad coverage", value: "2 of 5", alert: true },
      { label: "Unplanned (last 48h)", value: "2", alert: true },
    ],
    corroboration: [
      { signal: "Same week, prior 2 years", finding: "Spring break weeks in 2024 and 2025 showed 14% and 16% out — well below this year's 27%. This isn't a yearly rhythm.", agrees: true },
      { signal: "Cross-team comparison", finding: "Other teams (Sales, Support, Design) are all within their own baselines this week. Not a company-wide effect.", agrees: true },
      { signal: "Planned-vs-unplanned mix", finding: "33% of this week's absences are unplanned (sick). Baseline unplanned share: 8%. Real spike, not just calendar coincidence.", agrees: true },
      { signal: "Customer/sprint impact signals", finding: "Friday demo on the calendar with Payments squad. Sprint ends Friday. Operational risk is concrete, not theoretical.", agrees: null },
    ],
    provenance: {
      sources: ["BambooHR · time-off records", "Google Calendar · OOO events", "Org chart · team and squad assignments"],
      rule: "Fires when a team's % out this week exceeds its 12-week rolling average by ≥ 2σ AND ≥ 5pp absolute.",
      ruleExpression: "team_out_pct ≥ baseline + (2 × stdev)  AND  team_out_pct − baseline ≥ 5pp",
    },
    action: "Reschedule Friday's Payments demo, or pull in Maya from Platform.",
    actionRationale: "Maya is free Wed–Fri based on her calendar. Without backup coverage, the Payments squad runs the Friday demo with two of five members.",
  },
  {
    id: "onboarding-stalled",
    category: "Onboarding delay",
    title: "Jordan's onboarding has stalled at 40% — second week running",
    confidence: {
      level: "high",
      summary: "All 3 corroborating signals agree",
      note: "Workflow data, manager status, and engagement signals all point to the same root cause: missing buddy during manager absence.",
    },
    summary: "Laptop setup and IT access still pending. No 1:1 scheduled with their manager. Zero Slack messages sent in the past six days.",
    detail: "Jordan started twelve days ago. The cohort average for onboarding milestones at this point is 85%. Jordan is at 40%. Their manager Devon has been on leave for eight days, and no backup buddy was assigned.",
    sources: ["BambooHR", "Slack", "Google Calendar"],
    data: [
      { label: "Onboarding completion", value: "40%", alert: true },
      { label: "Cohort average at day 12", value: "85%" },
      { label: "Slack messages, last 6 days", value: "0", alert: true },
      { label: "Manager status", value: "On leave", alert: true },
    ],
    corroboration: [
      { signal: "Where in the workflow tasks are stuck", finding: "All 6 of Jordan's blocked items require manager approval or pairing. IT queue is clear; the bottleneck is structural.", agrees: true },
      { signal: "Comparable cohort hires", finding: "Other Q1 hires with present managers averaged 87% completion at day 12. Jordan is the only one with a manager on extended leave.", agrees: true },
      { signal: "External-departure signals", finding: "No flagged LinkedIn activity, no recruiter outreach detected. The silence appears to be blocked-not-leaving.", agrees: true },
    ],
    provenance: {
      sources: ["BambooHR · onboarding checklist", "Slack · message volume", "Google Calendar · 1:1 cadence"],
      rule: "Fires when checklist completion is ≥ 25pp below cohort average for ≥ 5 consecutive business days.",
      ruleExpression: "cohort_avg(day_n) − employee_completion ≥ 25pp  for  ≥ 5 days",
    },
    action: "Assign an interim onboarding buddy today — Sasha is a good fit.",
    actionRationale: "Devon doesn't return until May 5. Sasha onboarded in February and sits on the same team.",
  },
  {
    id: "engagement-drop",
    category: "Engagement drop",
    title: "Design team activity has fallen 34% — lowest in six months",
    confidence: {
      level: "medium",
      summary: "2 of 4 signals agree, 1 disagrees",
      note: "The drop is real and concentrated in 2 designers, but a partial Slack outage Wednesday means the magnitude could be inflated. Worth a 1:1 — but go in curious, not alarmed.",
    },
    summary: "Slack messages, meeting attendance, and Figma sessions all down sharply. Two designers haven't posted in #design in nine days.",
    detail: "Design's combined activity score fell from a six-week baseline of 78 to 51. The drop is concentrated in two of the four designers, and no PTO has been logged.",
    sources: ["Slack", "Google Calendar", "Figma"],
    data: [
      { label: "Activity score", value: "51", alert: true },
      { label: "6-week baseline", value: "78" },
      { label: "Designers gone quiet", value: "2 of 4", alert: true },
      { label: "Figma edits, week-over-week", value: "−42%", alert: true },
    ],
    corroboration: [
      { signal: "Concentrated vs distributed pattern", finding: "Drop is concentrated in 2 of 4 designers; the other 2 are at normal activity. Not a team-wide shift.", agrees: true },
      { signal: "Meeting acceptance pattern", finding: "Both quiet designers declined the last 3 team meetings. Their prior attendance was 90%.", agrees: true },
      { signal: "Recent team retro feedback", finding: "Quarterly retro two weeks ago showed high satisfaction scores from this team. Doesn't fit a disengagement narrative — though retros can lag real sentiment by 2–4 weeks.", agrees: false },
      { signal: "External-departure signals", finding: "No recruiter outreach detected for either. LinkedIn profile changes inconclusive.", agrees: null },
    ],
    provenance: {
      sources: ["Slack · message volume", "Google Calendar · attendance", "Figma · edit events"],
      rule: "Composite z-score drop > 25% AND individual silence ≥ 7 days AND no PTO.",
      ruleExpression: "team_score < (baseline × 0.75)  AND  ∃ user: silent_days ≥ 7  AND  pto_days = 0",
    },
    action: "Run informal 1:1s with both quiet designers this week.",
    actionRationale: "Drops of this size, without PTO, correlate with attrition risk. But because of the outage, treat this as a check-in, not a crisis.",
  },
];

const PREVIOUS_WEEK = [
  {
    id: "prev-leave",
    category: "Leave",
    title: "Sales had three reps out — slightly above baseline, no impact",
    confidence: { level: "high", summary: "All signals agree this is routine", note: "Within normal variance and below escalation threshold." },
    summary: "Mild elevation against the typical pattern. No customer escalations followed.",
    detail: "Within tolerance. Logged for trend tracking only.",
    sources: ["BambooHR", "Google Calendar"],
    data: [
      { label: "Sales on leave", value: "3 of 14" },
      { label: "Baseline", value: "2.2 of 14" },
      { label: "Customer escalations", value: "0" },
    ],
    corroboration: [
      { signal: "Pipeline metrics", finding: "Pipeline velocity unchanged. EOQ targets unaffected.", agrees: true },
      { signal: "Customer escalations", finding: "Zero customer-facing impact reported.", agrees: true },
    ],
    provenance: { sources: ["BambooHR · time-off records"], rule: "Same leave-anomaly rule.", ruleExpression: "team_out_pct − baseline = 1.4pp  (below 5pp absolute floor)" },
    action: "No action needed — keep an eye on the trend.",
    actionRationale: "Within normal variance for the team.",
  },
  {
    id: "prev-onboarding",
    category: "Onboarding",
    title: "Mei is tracking on plan at day seven",
    confidence: { level: "high", summary: "All signals point to a healthy ramp", note: "Above cohort, active on Slack, 1:1s on schedule." },
    summary: "All week-one milestones complete, manager 1:1s happening, engaged in #welcome.",
    detail: "Healthy onboarding signal. No intervention needed.",
    sources: ["BambooHR", "Slack"],
    data: [
      { label: "Completion", value: "92%" },
      { label: "Cohort average", value: "78%" },
      { label: "Slack engagement", value: "Active" },
    ],
    corroboration: [
      { signal: "Cohort comparison", finding: "Above cohort average by 14pp.", agrees: true },
      { signal: "Communication signals", finding: "Active in #welcome and direct messages with manager.", agrees: true },
    ],
    provenance: { sources: ["BambooHR · onboarding checklist"], rule: "Onboarding-stall rule did not trigger.", ruleExpression: "cohort_avg − employee_completion = −14pp" },
    action: "No action needed.",
    actionRationale: "Continue the standard 30-day check-in cadence.",
  },
];

const SOURCES = [
  { name: "BambooHR", type: "HRIS", feeds: "Time-off, onboarding checklists, employment status, manager hierarchy.", cadence: "syncs every 6 hours" },
  { name: "Rippling", type: "HRIS (alternative)", feeds: "Same fields as BambooHR.", cadence: "syncs every 6 hours" },
  { name: "Slack", type: "Communication", feeds: "Message volume per user — counts only, never content.", cadence: "rolling 24h window" },
  { name: "Google Calendar", type: "Calendar", feeds: "Meeting load, OOO events, 1:1 cadence, acceptance rates.", cadence: "rolling 7d window" },
  { name: "Figma · Linear · GitHub", type: "Optional · work signals", feeds: "Edit and contribution activity. Strengthens engagement signals when present.", cadence: "rolling 7d window" },
];

const RULES = [
  { name: "Leave anomaly", plain: "A team has materially more people out this week than its own historical pattern would predict.", expression: "team_out_pct ≥ baseline + (2 × stdev)  AND  − baseline ≥ 5pp", thresholdSource: "Defaults from Gallup absence research; per-team baseline learned from 12-week history." },
  { name: "Onboarding stall", plain: "A new hire is falling meaningfully behind the cohort that started around the same time.", expression: "cohort_avg(day_n) − employee_completion ≥ 25pp  for  ≥ 5 days", thresholdSource: "Defaults from BambooHR's published onboarding research; gap and persistence are tunable per company." },
  { name: "Engagement drop", plain: "A team's combined activity is well below its own recent baseline AND someone has gone individually quiet AND there's no PTO to explain it.", expression: "team_score < (baseline × 0.75)  AND  ∃ user: silent_days ≥ 7", thresholdSource: "Internal heuristic, calibrated against attrition outcomes in pilot data. Honest disclosure: this is the rule with the weakest external grounding and the highest customer-tunability." },
  { name: "Process delay", plain: "A scheduled HR process has missed its deadline by a meaningful amount.", expression: "days_overdue ≥ 7  AND  affected_employees ≥ 3", thresholdSource: "Operational threshold set with HR domain experts; tunable." },
];

const NOISE_CONTROLS = [
  { title: "Self-baselining, not global thresholds", body: "Every team has its own 12-week rolling baseline. The system learns each team's normal." },
  { title: "Two gates per signal", body: "An alert needs both statistical significance (z-score) and operational significance (an absolute floor). Both must hold." },
  { title: "Multi-signal confirmation", body: "Engagement drops require team-level decline AND individual silence AND no PTO. Single-source signals are silenced." },
  { title: "Calendar-aware suppression", body: "Holidays, retreats, all-hands weeks, end-of-quarter spikes are auto-detected and suppressed." },
  { title: "Customer feedback loop", body: "Patterns repeatedly marked as not useful auto-raise their threshold for that team." },
];

const VALIDATION_RINGS = [
  {
    name: "Cross-signal corroboration",
    latency: "Real-time",
    what: "When an alert fires, the system independently checks 3–5 signals it did not use to generate the alert. The corroboration result drives the confidence score shown on every insight.",
    catches: "Alerts based on a single data source, transient measurement artifacts, alerts that contradict adjacent evidence.",
    misses: "Patterns where all available signals are correlated but the underlying inference is wrong.",
  },
  {
    name: "Outcome-based validation",
    latency: "30–180 days",
    what: "Some alerts have ground-truth outcomes that arrive automatically: an attrition risk is validated when the person resigns or doesn't, an onboarding stall is validated when the new hire ramps or churns. The HR manager grades nothing.",
    catches: "Whether the alert's predicted outcome actually occurred. Drives the per-signal scorecard.",
    misses: "The causal question. If the manager intervened and the outcome didn't happen, this ring can't tell you whether the intervention saved them or whether they were never going to leave.",
  },
  {
    name: "Counterfactual validation",
    latency: "6+ months, requires opt-in",
    what: "We randomly suppress a small percentage of alerts on qualifying teams (10%, opt-in only) and compare downstream outcomes against the alerted-and-acted-upon group.",
    catches: "Causal impact. Whether the system, in aggregate, actually changes outcomes — not just predicts them.",
    misses: "Per-customer answers. This ring works at the population level across many customers.",
  },
];

const SCORECARD = [
  { signal: "Leave anomaly", total: 47, tp: 79, fp: 11, pending: 10 },
  { signal: "Onboarding stall", total: 23, tp: 87, fp: 9, pending: 4 },
  { signal: "Engagement drop", total: 19, tp: 58, fp: 21, pending: 21 },
  { signal: "Process delay", total: 31, tp: 90, fp: 6, pending: 4 },
];

const OPEN_QUESTIONS = [
  { q: "How does engagement-drop accuracy hold up across companies of different sizes?", a: "Pending — current scorecard data is from 12 design-partner companies, all 50–300 employees. Smaller and larger companies may show different patterns." },
  { q: "Are we systematically over- or under-flagging certain demographics?", a: "Open and important. We're not yet auditing for demographic bias in alert distribution; this is a known gap and a near-term roadmap item." },
  { q: "What's the cost of a false positive vs. a false negative?", a: "Asymmetric and customer-specific. A false positive costs a manager's time on an unnecessary 1:1; a false negative costs an unprevented resignation." },
  { q: "Can the rules themselves be wrong, even when they fire correctly per their own logic?", a: "Yes. A rule can be internally consistent and externally invalid — e.g., \"low Slack activity = disengagement\" assumes Slack is where engagement shows up. For some teams, it isn't." },
];

const EVAL_RESULTS = [
  { id: "LEAVE-01", name: "Real coverage spike", description: "Engineering team, 6 of 22 out (27%), baseline 12%, stdev 4pp.", detector: "leave_anomaly", passed: true, expected: "leave_anomaly (high)", actual: "fired: leave_anomaly (high)", rationale: "Crosses both gates: z=3.75 (≥3σ → high severity), delta=15pp (≥5pp). Must fire as high.", tests: ["statistical gate", "operational gate", "severity escalation"] },
  { id: "LEAVE-02", name: "Tiny-team noise (suppress)", description: "Founding team of 4, 1 out (25%) — z-score crosses 2σ but team is too small.", detector: "leave_anomaly", passed: true, expected: "no alert", actual: "no alert", rationale: "Team size < 6. Single absences in tiny teams cross thresholds spuriously. Must NOT fire.", tests: ["minimum team size", "false-positive prevention"] },
  { id: "LEAVE-03", name: "Statistical-only spike (suppress)", description: "Stable team (baseline 2%, stdev 0.5pp), 2 of 50 out (4%) — z=4 but delta only 2pp.", detector: "leave_anomaly", passed: true, expected: "no alert", actual: "no alert", rationale: "Statistical gate passes (z=4) but operational gate fails (delta=2pp, <5pp floor).", tests: ["dual-gate logic", "absolute floor enforcement"] },
  { id: "LEAVE-04", name: "Holiday suppression", description: "Same data as LEAVE-01, but it's Thanksgiving week.", detector: "leave_anomaly", passed: true, expected: "no alert", actual: "no alert", rationale: "Calendar-aware suppression. High leave during known holidays is expected, not anomalous.", tests: ["calendar suppression"] },
  { id: "ONBOARD-01", name: "Clear stall — Jordan scenario", description: "Day 12, completion 40%, cohort avg 85%, persistent for 7 days.", detector: "onboarding_stall", passed: true, expected: "onboarding_stall (high)", actual: "fired: onboarding_stall (high)", rationale: "Gap 45pp (≥25), persistence 7 days (≥5). Severity high because gap ≥40pp.", tests: ["primary detection"] },
  { id: "ONBOARD-02", name: "Day-2 hire — grace period", description: "New hire at day 2, completion 10% (cohort avg at day 2 is 60%).", detector: "onboarding_stall", passed: true, expected: "no alert", actual: "no alert", rationale: "Grace period (first 3 days). Early gaps are expected.", tests: ["grace period"] },
  { id: "ONBOARD-03", name: "Stall during new-hire PTO", description: "Day 14, completion 30%, cohort avg 80%, but new hire has been on PTO for 6 days.", detector: "onboarding_stall", passed: true, expected: "no alert", actual: "no alert", rationale: "Paused during PTO. The gap has a legitimate explanation.", tests: ["PTO suppression"] },
  { id: "ENGAGE-01", name: "Real disengagement — Design team scenario", description: "Team score 51 (baseline 78), one designer silent for 9 days, no PTO logged.", detector: "engagement_drop", passed: true, expected: "engagement_drop (medium)", actual: "fired: engagement_drop (medium)", rationale: "All three gates: drop 34.6% (≥25%), silent 9 days (≥7), no PTO. Severity medium because drop < 40%.", tests: ["triple-gate logic"] },
  { id: "ENGAGE-02", name: "Team-wide drop with no individual silence (suppress)", description: "Team score down 30%, but every individual still active — likely a sprint week.", detector: "engagement_drop", passed: true, expected: "no alert", actual: "no alert", rationale: "Triple-gate kills this: no individual silence ≥ 7 days. Likely deep-work mode.", tests: ["multi-signal confirmation", "false-positive prevention"] },
  { id: "ENGAGE-03", name: "Drop fully explained by PTO (suppress)", description: "Team score down 30%, two people silent — but both are on PTO.", detector: "engagement_drop", passed: true, expected: "no alert", actual: "no alert", rationale: "Silence is fully explained by PTO. Firing would be a clear false positive.", tests: ["PTO explanation gate"] },
];
const INTEGRATION_CATEGORIES = [
  { name: "HRIS", requirement: "REQUIRED · pick one", purpose: "Source of truth for employment data, time-off records, onboarding milestones, org hierarchy. BambooHR, Rippling, or Workday." },
  { name: "Communication", requirement: "OPTIONAL · recommended", purpose: "Engagement signals — message volume, channel activity. Slack today; Teams and Discord on the roadmap. Metadata only, never message content." },
  { name: "Calendar", requirement: "REQUIRED for full coverage", purpose: "Meeting load, OOO events, manager 1:1 cadence, holiday awareness for noise suppression. Google Calendar today; Outlook on the roadmap." },
];

const INTEGRATIONS = [
  {
    name: "BambooHR",
    category: "HRIS",
    auth: "API key per tenant, generated in BambooHR admin → API Keys",
    sync: "Pull on a 6-hour schedule. No webhooks for time-off changes, so polling is required.",
    reads: "Employee directory + manager hierarchy, time-off requests, onboarding checklist completion (where configured), employment status history.",
    limits: "1,000 requests per hour per API key. Comfortable up to ~5,000 employees with our access pattern.",
    gotcha: "Occasional 429s during BambooHR's nightly backup window. Retry-with-backoff handles it; not a real production issue.",
  },
  {
    name: "Rippling",
    category: "HRIS",
    auth: "OAuth 2.0 with customer-granted scopes; partner program access required for production.",
    sync: "Webhooks for employment status changes; pull every 6 hours for everything else.",
    reads: "Directory + hierarchy, richly-typed time-off (sick / PTO / parental), workflow-based onboarding progress, team assignments.",
    limits: "Higher than BambooHR but not publicly documented; partner program assigns per-customer quotas.",
    gotcha: "Webhook delivery is reliable but order isn't guaranteed. Idempotent processing on our side is required, not optional.",
  },
  {
    name: "Workday",
    category: "HRIS",
    auth: "OAuth 2.0 with refresh tokens, scoped tenant access.",
    sync: "Pull every 6 hours from REST endpoints; consider EIB for initial bulk load. Webhook subscriptions where the customer's tenant supports them.",
    reads: "Workers + supervisory hierarchy, Absence module records, onboarding via Business Process status, supervisory organizations via Worktags.",
    limits: "Tenant-specific and conservative. Production integrations typically combine webhooks with daily reconciliation pulls.",
    gotcha: "Workday tenants have nightly maintenance windows; calls fail during them. Schedule-aware retries are required. Workday's data model is the most complex of any HRIS — proper mapping needs a Workday-certified domain expert.",
  },
  {
    name: "Slack",
    category: "Communication",
    auth: "OAuth 2.0 bot token. Scopes: users:read, channels:read, conversations.history (only for channels the bot is invited to).",
    sync: "Polled by team and channel. Metadata only — never message content.",
    reads: "Per-user message counts (rolling 24h / 7d / 30d), channel membership, user profile email for HRIS identity matching.",
    limits: "Tier 2 methods allow 20 requests/minute. Batched by team, with cached user metadata.",
    gotcha: "Free Slack workspaces lose history beyond 90 days, capping how far back baselines can be established for new customers on free plans.",
  },
  {
    name: "Google Calendar",
    category: "Calendar",
    auth: "OAuth 2.0 with admin-granted domain-wide delegation for org-level access.",
    sync: "Push notifications via webhooks for changes; daily reconciliation pull.",
    reads: "Meeting events (counts, duration, attendees), OOO events, recurring 1:1 detection between manager-report pairs, acceptance/decline status.",
    limits: "1M queries per day per project. Easily sufficient.",
    gotcha: "Domain-wide delegation requires Google Workspace admin to grant access — often takes 1–2 weeks to clear and is the single biggest blocker to customer activation in production.",
  },
];

const SYNC_PATTERNS = [
  { name: "Initial sync", frequency: "ONCE · AT ONBOARDING", what: "Full pull of the past 12 weeks to establish per-team baselines. Heaviest API usage — runs overnight for tenants over 1,000 employees. Carefully rate-limited so we don't burn through customer quotas during their first day." },
  { name: "Incremental sync", frequency: "EVERY 6 HOURS", what: "Pull only what changed since the last sync, using each system's `since` or `updated_at` filter. For systems without delta support, we pull the full directory and diff client-side." },
  { name: "Real-time webhooks", frequency: "WHERE AVAILABLE", what: "Subscribed for employment status changes (joined, left, took leave) on Rippling, Workday, and Google Calendar. Trigger immediate baseline updates rather than waiting for the next scheduled sync." },
];

const AUTH_PRINCIPLES = [
  { title: "Read-only scope on every system", body: "We request the minimum scope that gets the job done. Write access is never requested. This keeps the security review tractable and avoids a whole class of \"the AI changed my data\" risks." },
  { title: "Per-tenant isolation by construction", body: "Each customer's credentials only access their own tenant. Cross-tenant data access is impossible — not as a policy, but as a structural property of how credentials are stored and used." },
  { title: "Auditable, not invasive", body: "Every API call is logged with customer ID, endpoint, and timestamp — never the response body. Debuggable without storing sensitive data unnecessarily." },
  { title: "Customer-revocable, gracefully", body: "Customers can revoke access from their HRIS admin panel at any time. Our system detects revoked tokens within one sync cycle and pauses processing for that tenant — never failing silently." },
];

const FAILURE_MODES = [
  { failure: "API outage on a source system", handling: "Retry with exponential backoff. If the system is down for more than 4 hours, we send a customer-facing notice (\"BambooHR sync paused — retrying\"). We never silently fail." },
  { failure: "Rate limit hit", handling: "Backoff and queue. Initial syncs spread over hours, not minutes. For Workday tenants on tight quotas, per-customer rate limits negotiated directly with Workday support." },
  { failure: "Schema change from the vendor", handling: "Versioned integration adapters plus a daily smoke test that pulls a known-shape payload. If a vendor changes a field, we catch it within 24 hours and patch before customers see broken data." },
  { failure: "Partial data — Slack outage, calendar misconfiguration", handling: "Most common real-world failure. Rather than fire wrong alerts, we degrade gracefully: dependent signals pause, and customers see a \"partial coverage\" indicator on the brief." },
  { failure: "Customer-side OAuth revocation or expiry", handling: "Detected within one sync cycle. Customer gets an email plus an in-app notice to re-authenticate. Alerts pause until reconnected." },
  { failure: "Identity mismatch across systems", handling: "The underrated hard problem — Slack username doesn't always match HRIS email. Solved with deterministic email matching first, then fuzzy matching as a fallback, then human review for edge cases." },
];

const NON_GOALS = [
  { title: "No write-back to source systems", reason: "We will never modify customer HRIS data. Suggested actions are surfaced to humans; they execute manually in the source system. Keeps the security review tractable and avoids \"the AI deleted my employee record\" risks." },
  { title: "No content reading from Slack or email", reason: "Engagement signals come from metadata only — counts, timestamps, channel membership. The system never reads what people are saying. Documented prominently in customer-facing materials." },
  { title: "No browsable per-employee attrition scores", reason: "Team-level patterns surface to managers; individual evidence is visible only when a specific alert fires. Managers who can sort their reports by attrition risk make different (and worse) decisions than managers who get one-off intervention signals." },
  { title: "No raw data exports", reason: "Customers can see insights and the signals behind each insight. They cannot export \"all engagement scores for all employees over time\" — that's a different product (workforce analytics), with different ethics, and would need a different review process." },
];
