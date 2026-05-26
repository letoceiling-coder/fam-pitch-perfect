import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, FileText, Image as ImageIcon, Settings } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const [stats, setStats] = useState({ leads: 0, newLeads: 0, media: 0 });
  useEffect(() => {
    (async () => {
      const [{ count: leads }, { count: newLeads }, { count: media }] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("media").select("*", { count: "exact", head: true }),
      ]);
      setStats({ leads: leads ?? 0, newLeads: newLeads ?? 0, media: media ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Всего заявок", value: stats.leads, icon: Inbox, to: "/admin/leads" },
    { label: "Новые заявки", value: stats.newLeads, icon: Inbox, to: "/admin/leads", accent: true },
    { label: "Файлов", value: stats.media, icon: ImageIcon, to: "/admin/media" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">FAM CMS</div>
        <h1 className="mt-2 font-display text-4xl font-black">Дашборд</h1>
        <p className="mt-1 text-white/50">Управление сайтом и заявками</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className={`group rounded-3xl border border-white/10 p-6 transition hover:border-white/20 ${c.accent ? "bg-gradient-to-br from-[var(--orange-accent)]/20 to-transparent" : "bg-white/[0.02]"}`}>
            <div className="flex items-center justify-between">
              <c.icon className="size-5 text-white/40" />
              <span className="text-xs text-white/30 group-hover:text-white">→</span>
            </div>
            <div className="mt-6 font-display text-5xl font-black">{c.value}</div>
            <div className="mt-1 text-sm text-white/60">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/admin/content" className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20">
          <FileText className="size-5 text-[var(--orange-accent)]" />
          <div className="mt-4 font-display text-2xl font-bold">Редактор контента</div>
          <p className="mt-2 text-sm text-white/50">Hero, об академии, принципы, тренеры, локация — всё управляется здесь.</p>
        </Link>
        <Link to="/admin/settings" className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20">
          <Settings className="size-5 text-[var(--orange-accent)]" />
          <div className="mt-4 font-display text-2xl font-bold">Настройки сайта</div>
          <p className="mt-2 text-sm text-white/50">Контакты, телефон, мессенджеры, копирайт.</p>
        </Link>
      </div>
    </div>
  );
}
