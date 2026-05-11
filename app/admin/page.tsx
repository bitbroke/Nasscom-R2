import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, AlertCircle, CheckCircle2, WifiOff, Brain } from "lucide-react";

export const dynamic = "force-dynamic";

const priorityEmoji: Record<string, string> = { low: "🟢", medium: "🟠", high: "🔴", critical: "🔴" };

export default async function AdminDashboard() {
  let tickets: Record<string, unknown>[] = [];
  try {
    if (supabase) {
      const { data } = await supabase.from("live_tickets").select("*").order("created_at", { ascending: false });
      if (data) tickets = data;
    }
  } catch {}

  const autoResolved = tickets.filter(t => t.status === "AUTO_RESOLVED");
  const needsHuman = tickets.filter(t => t.status === "NEEDS_HUMAN");

  const categoryCounts: Record<string, number> = {};
  for (const t of needsHuman) { const cat = (t.category as string) || "Unknown"; categoryCounts[cat] = (categoryCounts[cat] || 0) + 1; }
  const outageCategories = Object.entries(categoryCounts).filter(([, count]) => count >= 3);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 font-sans text-foreground">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Triage Dashboard</h1>
              <p className="text-muted-foreground mt-1 text-sm">4-Agent Council View</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Badge variant="outline" className="bg-card px-3 py-1 shadow-sm">Total: {tickets.length}</Badge>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 shadow-sm border-emerald-500/20">Auto: {autoResolved.length}</Badge>
            <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1 shadow-sm border-rose-500/20">Human: {needsHuman.length}</Badge>
          </div>
        </header>

        {outageCategories.length > 0 && (
          <div className="mb-6 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5 text-amber-500" /><h3 className="font-bold text-amber-700 dark:text-amber-400">Outage Detection</h3></div>
            {outageCategories.map(([cat, count]) => (<p key={cat} className="text-sm text-amber-700 dark:text-amber-400 ml-7">⚡ <strong>{cat}</strong>: {count} repeated tickets</p>))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-muted/20 p-4 rounded-2xl border border-border/50">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-rose-500" /><h2 className="font-bold">Needs Human</h2></div>
              <Badge className="bg-card shadow-sm border-border">{needsHuman.length}</Badge>
            </div>
            <ScrollArea className="h-[65vh] px-2 pb-6">
              <div className="space-y-3">
                {needsHuman.map((t, i) => <TicketCard key={(t.id as string) || i} ticket={t} type="danger" />)}
                {needsHuman.length === 0 && <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center"><p className="text-muted-foreground text-sm">Queue clear.</p></div>}
              </div>
            </ScrollArea>
          </section>

          <section className="bg-muted/20 p-4 rounded-2xl border border-border/50">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><h2 className="font-bold">Auto-Resolved</h2></div>
              <Badge className="bg-card shadow-sm border-border">{autoResolved.length}</Badge>
            </div>
            <ScrollArea className="h-[65vh] px-2 pb-6">
              <div className="space-y-3">
                {autoResolved.map((t, i) => <TicketCard key={(t.id as string) || i} ticket={t} type="success" />)}
                {autoResolved.length === 0 && <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center"><p className="text-muted-foreground text-sm">No resolved tickets.</p></div>}
              </div>
            </ScrollArea>
          </section>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ ticket, type }: { ticket: Record<string, unknown>; type: "danger" | "success" }) {
  const priority = (ticket.priority as string) || "medium";
  const emoji = priorityEmoji[priority] || "🟠";
  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-wrap gap-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge className={`text-[10px] border-0 ${type === "danger" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>{(ticket.category as string) || "Uncategorized"}</Badge>
          <Badge variant="outline" className="text-[10px]">{emoji} {priority}</Badge>
          {Boolean(ticket.is_air_gapped) && <Badge variant="outline" className="text-[10px] border-amber-500/20 bg-amber-500/5"><WifiOff className="w-3 h-3 mr-1" />Air-Gap</Badge>}
          {Boolean(ticket.council_agreement) && <Badge variant="outline" className="text-[10px] border-emerald-500/20 bg-emerald-500/5"><Brain className="w-3 h-3 mr-1" />Consensus</Badge>}
        </div>
        <div className="text-right"><span className="text-[9px] uppercase font-bold text-muted-foreground">Score</span><br/><span className="text-xs font-mono font-bold">{((ticket.confidence_score as number) || 0).toFixed(2)}</span></div>
      </div>
      <div className="px-4 pb-4 pt-1">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{ticket.original_redacted_text as string}</p>
        {Boolean(ticket.skill_used) && <p className="text-xs text-muted-foreground/70 mt-1.5">Skill: {ticket.skill_used as string}</p>}
      </div>
    </div>
  );
}
