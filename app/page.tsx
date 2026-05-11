"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, ShieldAlert, CheckCircle2, FileText, AlertTriangle, BookOpen, WifiOff, Wifi, Shield, Library, Scale, Pencil, Moon, Sun, Lock, Code2, Brain, Activity, LogIn, Sparkles } from "lucide-react";
import SugoiAvatar from "@/components/sugoi-avatar";
import FloatingKaomojis from "@/components/floating-kaomojis";
import { getRandomGreeting } from "@/components/sugoi-greetings";
import { useSugoiMood } from "@/components/use-sugoi-mood";

interface SourceCitation { id: string; category: string; query: string; similarity: number; }
interface AgentMeta {
  analyser: { piiEntities: number };
  council: { bid: string | null; bidConfidence: number; documentsFound: number };
  triage: { onnxCategory: string | null; onnxConfidence: number; councilAgreement: boolean; decision: string };
  synthesis: { skillUsed: string | null; isAirGapped: boolean; isGrounded: boolean };
}

const QUICK_EXAMPLES = [
  { label: "🌐 Network Outage", text: "Our office network is completely down. All employees are unable to access the internet or internal systems. The router shows no WAN connectivity and ping to 8.8.8.8 times out." },
  { label: "🗄️ DB Deadlock", text: "Production PostgreSQL database is experiencing severe deadlocks. Multiple transactions are stuck waiting on each other, causing API timeouts. We see 'deadlock detected' errors in pg_logs." },
  { label: "🔑 Password Reset", text: "I'm locked out of my corporate account after too many failed login attempts. My email is john.doe@company.com and my employee ID is EMP-4521. I need urgent access for a client meeting." },
  { label: "💥 Software Crash", text: "The internal CRM application crashes immediately on launch with a Java OutOfMemoryError. This started after the latest deployment v2.4.1. Stack trace shows heap space exhaustion in the report module." },
];

const agentSteps = [
  { name: "Analyser", icon: Shield, desc: "PII + Embedding", color: "from-rainbow-lavender to-rainbow-lilac" },
  { name: "Council", icon: Library, desc: "Hybrid Search", color: "from-rainbow-lilac to-rainbow-sky" },
  { name: "Triage", icon: Scale, desc: "ONNX + Agreement", color: "from-rainbow-sky to-rainbow-cyan" },
  { name: "Synthesis", icon: Pencil, desc: "Runbook + Resolve", color: "from-rainbow-mint to-rainbow-green" },
];

export default function SubmissionPortal() {
  const { theme, toggle } = useTheme();
  const { mood, isEnraged, handleClick: handleSugoiClick } = useSugoiMood();
  const [greeting, setGreeting] = useState("");
  const [issueText, setIssueText] = useState("");
  const [logText, setLogText] = useState("");
  const [airGapped, setAirGapped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);
  const [thoughtProcess, setThoughtProcess] = useState<string[]>([]);
  const [finalResolution, setFinalResolution] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [sourceCitations, setSourceCitations] = useState<SourceCitation[]>([]);
  const [groundingScore, setGroundingScore] = useState<number | null>(null);
  const [automationSuggestion, setAutomationSuggestion] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentMeta | null>(null);
  const [activeAgent, setActiveAgent] = useState<number>(0);

  useEffect(() => { setGreeting(getRandomGreeting()); }, []);

  async function submitTicket() {
    if (!issueText.trim()) return;
    setLoading(true); setTicketStatus(null); setThoughtProcess([]); setFinalResolution(null);
    setConfidenceScore(null); setSourceCitations([]); setGroundingScore(null);
    setAutomationSuggestion(null); setCategory(null); setAgents(null); setActiveAgent(0);
    setThoughtProcess(["Initializing 4-Agent Council..."]);
    const timer = setInterval(() => setActiveAgent(p => Math.min(p + 1, 3)), 2000);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);
      const res = await fetch("/api/process-ticket", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: issueText, logContent: logText || null, airGapped }),
        signal: controller.signal,
      });
      clearTimeout(timeout); clearInterval(timer);
      const data = await res.json();
      if (res.ok) {
        setThoughtProcess(data.thoughtProcess || []); setSourceCitations(data.sourceCitations || []);
        setGroundingScore(data.groundingScore ?? null); setAutomationSuggestion(data.automationSuggestion ?? null);
        setCategory(data.category ?? null); setAgents(data.agents ?? null); setActiveAgent(4);
        setTicketStatus(data.status === "SUCCESS" ? "AUTO_RESOLVED" : "ESCALATED");
        setFinalResolution(data.status === "SUCCESS" ? data.resolution : "Routed to human engineering team for review.");
        setConfidenceScore(data.confidenceScore);
      } else { clearInterval(timer); setTicketStatus("ESCALATED"); setFinalResolution("Error connecting to AI system."); }
    } catch { clearInterval(timer); setTicketStatus("ESCALATED"); setFinalResolution("Server may be starting up. Please try again."); }
    setLoading(false);
  }

  const moodLabel = mood === "enraged" ? "💢 ZERO-TRUST ERROR!" : mood === "annoyed" ? "😓 Stop poking me..." : mood === "happy" ? "✨ Sugoi is happy!" : "🐱 Sugoi Online";

  return (
    <div className={`min-h-screen bg-background text-foreground font-sans relative ${isEnraged ? "buttons-disabled" : ""}`}>
      <FloatingKaomojis />
      {isEnraged && <div className="enraged-overlay" />}

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rainbow-lilac to-rainbow-sky flex items-center justify-center shadow-lg shadow-rainbow-lilac/25">
              <Zap className="text-white w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight rainbow-text">IT Helpdesk AI</h1>
              <p className="text-[11px] font-medium text-muted-foreground -mt-0.5">4-Agent Council · Zero-Trust</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button id="airgap-toggle" onClick={() => setAirGapped(!airGapped)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[3rem] text-xs font-medium transition-all border ${airGapped ? "bg-rainbow-peach border-rainbow-pink/60 text-rose-primary" : "border-border text-muted-foreground hover:border-rainbow-lilac/50"}`}>
              {airGapped ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              {airGapped ? "Air-Gapped" : "Cloud"}
            </button>
            <button onClick={toggle} className="p-2 rounded-[3rem] border border-border text-muted-foreground hover:text-foreground hover:border-rainbow-lilac/50 transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3rem] text-xs font-medium bg-gradient-to-r from-rainbow-lilac to-rainbow-sky text-white hover:opacity-90 transition-opacity shadow-md shadow-rainbow-lilac/20">
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </button>
              </DialogTrigger>
              <DialogContent><DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rainbow-lilac to-rainbow-sky flex items-center justify-center"><Lock className="text-white w-5 h-5" /></div>
                  <DialogTitle className="text-xl">Secure Access Restricted</DialogTitle>
                </div>
                <DialogDescription className="text-sm leading-relaxed mt-3">
                  Authentication for the NASSCOM Helpdesk Council is currently in <strong>Beta</strong>. Administrative access is restricted to authorized personnel only.<br /><br />
                  Please use the <strong>Public Ticket Submission</strong> flow to test the 4-Agent pipeline. Admin dashboard is available at <code className="px-1.5 py-0.5 rounded-lg bg-rainbow-peach text-xs text-rose-primary font-semibold">/admin</code>.
                </DialogDescription>
              </DialogHeader></DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* SUGOI GREETING BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <SugoiAvatar mood={mood} size={72} onClick={handleSugoiClick} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">{moodLabel}</p>
            <p className="greeting-text text-muted-foreground truncate">{greeting}</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {agentSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = loading && activeAgent === i;
              const isDone = activeAgent > i;
              return (
                <motion.div key={i} className="flex flex-col items-center w-14"
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDone ? `bg-gradient-to-br ${step.color} shadow-lg` : isActive ? `bg-gradient-to-br ${step.color} shadow-lg animate-pulse` : "bg-rainbow-cream/60 text-muted-foreground dark:bg-muted/50"}`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />}
                  </div>
                  <span className={`text-[9px] mt-1 font-semibold ${isDone || isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* LEFT — Secure Input */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h2 className="column-title flex items-center gap-2"><Lock className="w-5 h-5 text-rainbow-lilac" /> Secure Input</h2>
          <div className="glass-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-rainbow-lilac" /> Submit Issue</h3>
              <p className="text-xs text-muted-foreground mt-0.5">PII is scrubbed on-server before any external call.</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Quick Examples</label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_EXAMPLES.map((ex) => (
                  <button key={ex.label} onClick={() => setIssueText(ex.text)}
                    className="px-2.5 py-1 rounded-[3rem] text-[11px] font-medium border border-rainbow-lilac/30 bg-rainbow-lavender/30 text-foreground hover:bg-rainbow-lilac hover:text-white transition-all duration-200 dark:bg-muted/40 dark:border-rainbow-lilac/20 dark:hover:bg-rainbow-lilac">
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Issue Description</label>
              <textarea id="issue-input"
                className="w-full bg-rainbow-cream/40 border border-border rounded-[1.5rem] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rainbow-lilac/30 focus:border-rainbow-lilac/50 transition-all resize-none h-28 placeholder:text-muted-foreground/50 dark:bg-muted/30"
                placeholder="E.g. The production DB is locking up, my IP is 192.168.1.5..."
                value={issueText} onChange={e => setIssueText(e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">System Logs (Optional)</label>
              <textarea id="log-input"
                className="w-full bg-rainbow-cream/20 border border-dashed border-border rounded-[1.5rem] p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rainbow-lilac/20 transition-all resize-none h-20 placeholder:text-muted-foreground/40 dark:bg-muted/20"
                placeholder="Paste stack traces or raw logs here..."
                value={logText} onChange={e => setLogText(e.target.value)} />
            </div>
            <Button id="submit-btn" onClick={submitTicket} disabled={loading || !issueText.trim() || isEnraged}
              className="w-full h-11 rounded-[3rem] bg-gradient-to-r from-rainbow-lilac to-rainbow-sky hover:from-rainbow-lavender hover:to-rainbow-lilac text-white font-semibold shadow-lg shadow-rainbow-lilac/25 transition-all disabled:opacity-50">
              {loading ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Council Processing...</span> : "✨ Initialize Resolution"}
            </Button>
          </div>
          {/* Agent Meta Cards */}
          <AnimatePresence>
            {agents && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-2.5">
                <MetaCard icon={Shield} color="text-rainbow-lavender" label="Analyser" value={`${agents.analyser.piiEntities} PII redacted`} />
                <MetaCard icon={Library} color="text-rainbow-lilac" label="Council" value={`Bid: ${agents.council.bid || "—"} (${(agents.council.bidConfidence * 100).toFixed(0)}%)`} />
                <MetaCard icon={Scale} color="text-rainbow-sky" label="Triage" value={`ONNX: ${agents.triage.onnxCategory || "N/A"} (${(agents.triage.onnxConfidence * 100).toFixed(0)}%)${agents.triage.councilAgreement ? " ✓" : ""}`} />
                <MetaCard icon={Pencil} color="text-rainbow-mint" label="Synthesis" value={`${agents.synthesis.isAirGapped ? "🔌 Air-Gapped" : "☁️ Cloud"} | ${agents.synthesis.skillUsed || "—"}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* RIGHT — Neural Core Telemetry */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col">
          <h2 className="column-title flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-rainbow-cyan" /> Neural Core Telemetry</h2>
          <div className="glass-card flex flex-col flex-1 overflow-hidden max-h-[700px]">
            <div className="p-4 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rainbow-cyan animate-pulse" />
                <h3 className="font-semibold text-sm">Observability Stream</h3>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {airGapped && <Badge className="text-[10px] bg-rainbow-peach text-rose-primary border-0">Air-Gapped</Badge>}
                {category && <Badge className="text-[10px] bg-rainbow-lilac/20 text-foreground border-0">{category}</Badge>}
                {ticketStatus && (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <Badge className={`text-[10px] border-0 font-semibold ${ticketStatus === "AUTO_RESOLVED" ? "bg-rainbow-green/60 text-[#1a6b2a] dark:bg-rainbow-green/20 dark:text-rainbow-green" : "bg-rainbow-pink/40 text-rose-primary"}`}>
                      {ticketStatus.replace("_", " ")}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll p-4 font-mono text-xs text-muted-foreground min-h-[180px]">
              <AnimatePresence>
                {thoughtProcess.length === 0 && !loading && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="italic text-muted-foreground/50">Waiting for input stream...</motion.p>
                )}
                {loading && thoughtProcess.length <= 1 && (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-5 h-5 rounded-xl bg-rainbow-lilac/30 dark:bg-muted/50" />
                        <div className="h-3 rounded-full bg-rainbow-lilac/20 dark:bg-muted/40" style={{ width: `${40 + Math.random() * 40}%` }} />
                      </div>
                    ))}
                    <p className="text-center text-muted-foreground/40 text-[10px] mt-4 animate-pulse">🏛️ Agents deliberating...</p>
                  </div>
                )}
                {thoughtProcess.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }} className="mb-2 flex items-start">
                    <span className="text-rainbow-lilac mr-2 mt-0.5 flex-shrink-0">&gt;</span>
                    <span className="leading-relaxed">{step}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* RESULT */}
            <AnimatePresence>
              {finalResolution && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-t border-white/20 overflow-y-auto custom-scroll max-h-[350px]">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {ticketStatus === "AUTO_RESOLVED" ? <CheckCircle2 className="w-4.5 h-4.5 text-rainbow-mint" /> : <ShieldAlert className="w-4.5 h-4.5 text-rainbow-pink" />}
                        <h3 className={`text-sm font-bold ${ticketStatus === "AUTO_RESOLVED" ? "text-[#1a6b2a] dark:text-rainbow-mint" : "text-rose-primary"}`}>Final Resolution</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {groundingScore !== null && <ScoreBadge label="Ground" value={groundingScore.toFixed(2)} />}
                        {confidenceScore !== null && <ScoreBadge label="Score" value={confidenceScore.toFixed(2)} />}
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] glass-peach p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{finalResolution}</p>
                    </div>
                  </div>
                  {automationSuggestion && (
                    <div className="mx-5 mb-3 bg-rainbow-peach/40 border border-rainbow-pink/30 rounded-[1.5rem] p-3 flex items-start gap-2 dark:bg-muted/30">
                      <AlertTriangle className="w-4 h-4 text-rose-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-rose-dark dark:text-rainbow-pink">{automationSuggestion}</p>
                    </div>
                  )}
                  <div className="px-5 pb-4">
                    <Accordion type="single">
                      <AccordionItem value="insights">
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          <div className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> Council Insights</div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-1">
                            {agents && (
                              <div className="flex flex-wrap gap-2">
                                <Badge className="text-[10px] bg-rainbow-lavender/30 text-foreground border-0 gap-1"><Shield className="w-3 h-3" /> PII Redacted</Badge>
                                <Badge className={`text-[10px] border-0 gap-1 ${agents.triage.onnxConfidence >= 0.7 ? "bg-rainbow-green/40 text-[#1a6b2a] dark:text-rainbow-green" : "bg-rainbow-pink/30 text-rose-primary"}`}><Scale className="w-3 h-3" /> ONNX: {(agents.triage.onnxConfidence * 100).toFixed(0)}%</Badge>
                                <Badge className={`text-[10px] border-0 gap-1 ${agents.triage.councilAgreement ? "bg-rainbow-green/40 text-[#1a6b2a] dark:text-rainbow-green" : "bg-rainbow-pink/30 text-rose-primary"}`}><Brain className="w-3 h-3" /> {agents.triage.councilAgreement ? "Matched" : "Diverged"}</Badge>
                                {agents.synthesis.skillUsed && (<Badge className="text-[10px] bg-rainbow-peach text-foreground border-0 gap-1 dark:bg-muted/40"><Code2 className="w-3 h-3" /> {agents.synthesis.skillUsed}</Badge>)}
                              </div>
                            )}
                            {sourceCitations.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1 mb-1.5"><BookOpen className="w-3 h-3 text-muted-foreground" /><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sources</span></div>
                                <div className="space-y-1">
                                  {sourceCitations.slice(0, 3).map((cite, i) => (
                                    <div key={i} className="glass-peach rounded-[1.5rem] px-3 py-2 flex items-center justify-between">
                                      <div className="flex items-center gap-2 min-w-0"><FileText className="w-3 h-3 text-rainbow-lilac flex-shrink-0" /><span className="text-[11px] truncate">{cite.query}</span></div>
                                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        <Badge className="text-[9px] bg-rainbow-cream/60 text-muted-foreground border-0 dark:bg-muted/40">{cite.category}</Badge>
                                        <span className="text-[10px] font-mono text-muted-foreground">{(cite.similarity * 100).toFixed(0)}%</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

function MetaCard({ icon: Icon, color, label, value }: { icon: React.ComponentType<{ className?: string }>; color: string; label: string; value: string }) {
  return (
    <div className="glass-card p-3">
      <div className="flex items-center gap-1.5 mb-1"><Icon className={`w-3.5 h-3.5 ${color}`} /><span className="text-[10px] font-bold text-muted-foreground">{label}</span></div>
      <p className="text-[11px] text-foreground/80 leading-tight">{value}</p>
    </div>
  );
}

function ScoreBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-rainbow-lilac/20 px-2 py-1 rounded-[3rem] flex items-center gap-1 dark:bg-muted/50">
      <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">{label}</span>
      <span className="text-xs font-mono font-semibold">{value}</span>
    </div>
  );
}
