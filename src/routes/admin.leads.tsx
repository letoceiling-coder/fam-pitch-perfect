import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, Calendar, MessageSquare, Trash2 } from "lucide-react";

type Lead = {
  id: string; experience: string | null; guardian_name: string; student_name: string;
  birth_date: string | null; phone: string; comment: string | null; status: string; created_at: string;
};
const STATUSES: Record<string, { label: string; cls: string }> = {
  new: { label: "Новая", cls: "bg-[var(--orange-accent)]/20 text-[var(--orange-accent)] border-[var(--orange-accent)]/30" },
  processed: { label: "Обработана", cls: "bg-[var(--royal)]/20 text-blue-300 border-blue-400/30" },
  archived: { label: "Архив", cls: "bg-white/5 text-white/40 border-white/10" },
};

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setLeads(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((l) => l.map((x) => x.id === id ? { ...x, status } : x));
  };
  const del = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((l) => l.filter((x) => x.id !== id));
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">CRM</div>
          <h1 className="mt-2 font-display text-4xl font-black">Заявки</h1>
        </div>
        <div className="flex gap-1.5 rounded-full bg-white/[0.04] p-1">
          {[["all","Все"],["new","Новые"],["processed","Обработанные"],["archived","Архив"]].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter===k?"bg-white text-[var(--navy-deep)]":"text-white/60 hover:text-white"}`}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="text-white/40">Загрузка...</div> : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-white/40">Заявок пока нет</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div key={l.id} className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl font-bold">{l.student_name}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUSES[l.status]?.cls}`}>{STATUSES[l.status]?.label ?? l.status}</span>
                  </div>
                  <div className="mt-1 text-sm text-white/50">Опекун: {l.guardian_name}</div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                    <a href={`tel:${l.phone.replace(/\D/g,"")}`} className="inline-flex items-center gap-2 hover:text-white"><Phone className="size-4" />{l.phone}</a>
                    {l.birth_date && <span className="inline-flex items-center gap-2"><Calendar className="size-4" />{new Date(l.birth_date).toLocaleDateString("ru-RU")}</span>}
                    {l.experience && <span>Опыт: {l.experience}</span>}
                  </div>
                  {l.comment && (
                    <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white/[0.03] p-3 text-sm text-white/70">
                      <MessageSquare className="mt-0.5 size-4 shrink-0 text-white/40" />
                      <span>{l.comment}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}
                    className="rounded-xl border border-white/10 bg-[var(--navy)] px-3 py-2 text-sm">
                    <option value="new">Новая</option>
                    <option value="processed">Обработана</option>
                    <option value="archived">Архив</option>
                  </select>
                  <button onClick={() => del(l.id)} className="rounded-xl border border-white/10 p-2 text-white/40 hover:text-destructive hover:border-destructive/40">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 text-xs text-white/30">{new Date(l.created_at).toLocaleString("ru-RU")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
