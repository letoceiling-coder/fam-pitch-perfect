import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchSection, upsertSection } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

const FIELDS: { key: string; label: string; placeholder?: string }[] = [
  { key: "phone", label: "Телефон", placeholder: "+7 (000) 000-00-00" },
  { key: "email", label: "Email" },
  { key: "telegram", label: "Telegram (ссылка)" },
  { key: "whatsapp", label: "WhatsApp (ссылка)" },
  { key: "max", label: "MAX (ссылка)" },
  { key: "address", label: "Адрес" },
  { key: "map_embed", label: "Карта (iframe src)" },
  { key: "copyright", label: "Copyright" },
];

function SettingsPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetchSection<Record<string, string>>("settings").then((d) => setData(d ?? {})); }, []);
  const save = async () => {
    setSaving(true);
    try { await upsertSection("settings", data); toast.success("Сохранено"); }
    catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">SETTINGS</div>
        <h1 className="mt-2 font-display text-4xl font-black">Настройки сайта</h1>
      </div>
      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{f.label}</label>
            {f.key === "map_embed" || f.key === "address" ? (
              <Textarea rows={2} value={data[f.key] ?? ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                className="bg-white/5 border-white/10" placeholder={f.placeholder} />
            ) : (
              <Input value={data[f.key] ?? ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                className="bg-white/5 border-white/10" placeholder={f.placeholder} />
            )}
          </div>
        ))}
        <Button onClick={save} disabled={saving} variant="hero" size="lg">
          <Save className="size-4" /> {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </div>
  );
}
