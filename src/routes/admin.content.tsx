import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchAllContent, upsertSection, type SiteContentMap } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/content")({ component: ContentPage });

const SECTIONS = ["hero","about","keepers","principles","coaches","location","signup"] as const;
const LABELS: Record<string, string> = {
  hero: "Hero", about: "Об академии", keepers: "Школа вратарей",
  principles: "Принципы", coaches: "Тренеры", location: "Локация", signup: "Блок записи",
};

function ContentPage() {
  const [all, setAll] = useState<SiteContentMap>({});
  const [active, setActive] = useState<string>("hero");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAllContent().then(setAll); }, []);
  const data = all[active] ?? {};
  const update = (patch: any) => setAll({ ...all, [active]: { ...data, ...patch } });

  const save = async () => {
    setSaving(true);
    try { await upsertSection(active, data); toast.success("Сохранено"); }
    catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">CONTENT</div>
          <h1 className="mt-2 font-display text-4xl font-black">Контент сайта</h1>
        </div>
        <Button onClick={save} variant="hero" size="lg" disabled={saving}>
          <Save className="size-4" /> {saving ? "Сохранение..." : "Сохранить раздел"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-2xl bg-white/[0.04] p-1">
        {SECTIONS.map((s) => (
          <button key={s} onClick={() => setActive(s)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${active===s?"bg-white text-[var(--navy-deep)]":"text-white/60 hover:text-white"}`}>
            {LABELS[s]}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        <Editor active={active} data={data} update={update} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{label}</label>
      {children}
    </div>
  );
}
const I = (p: React.ComponentProps<typeof Input>) => <Input {...p} className="bg-white/5 border-white/10" />;
const T = (p: React.ComponentProps<typeof Textarea>) => <Textarea {...p} className="bg-white/5 border-white/10" />;

function Editor({ active, data, update }: { active: string; data: any; update: (p: any) => void }) {
  if (active === "hero") return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Верхняя строка"><I value={data.title_top ?? ""} onChange={(e) => update({ title_top: e.target.value })} /></Field>
      <Field label="Средняя строка"><I value={data.title_mid ?? ""} onChange={(e) => update({ title_mid: e.target.value })} /></Field>
      <Field label="Акцентное слово"><I value={data.title_accent ?? ""} onChange={(e) => update({ title_accent: e.target.value })} /></Field>
      <Field label="Текст кнопки"><I value={data.cta ?? ""} onChange={(e) => update({ cta: e.target.value })} /></Field>
      <div className="md:col-span-2"><Field label="Подзаголовок"><T rows={2} value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} /></Field></div>
    </div>
  );
  if (active === "about") return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Заголовок"><I value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} /></Field>
        <Field label="Подпись на карточке"><I value={data.caption ?? ""} onChange={(e) => update({ caption: e.target.value })} /></Field>
      </div>
      <Field label="URL изображения"><I value={data.image ?? ""} onChange={(e) => update({ image: e.target.value })} placeholder="из медиаменеджера" /></Field>
      <RepeaterText label="Абзацы текста" items={data.paragraphs ?? []} onChange={(paragraphs) => update({ paragraphs })} />
    </div>
  );
  if (active === "keepers") return (
    <div className="space-y-4">
      <Field label="Заголовок"><I value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} /></Field>
      <Field label="Описание"><T rows={4} value={data.description ?? ""} onChange={(e) => update({ description: e.target.value })} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="URL видео"><I value={data.video ?? ""} onChange={(e) => update({ video: e.target.value })} /></Field>
        <Field label="URL постера"><I value={data.poster ?? ""} onChange={(e) => update({ poster: e.target.value })} /></Field>
      </div>
    </div>
  );
  if (active === "principles") return (
    <div className="space-y-4">
      <Field label="Заголовок"><I value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} /></Field>
      <Field label="Подзаголовок"><T rows={2} value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} /></Field>
      <RepeaterCards label="Принципы" items={data.items ?? []} fields={[{key:"title",label:"Название"},{key:"text",label:"Описание",textarea:true}]} onChange={(items) => update({ items })} />
    </div>
  );
  if (active === "coaches") return (
    <div className="space-y-4">
      <Field label="Заголовок"><I value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} /></Field>
      <Field label="Подзаголовок"><T rows={2} value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} /></Field>
      <RepeaterCards label="Тренеры" items={data.items ?? []}
        fields={[{key:"name",label:"ФИО"},{key:"role",label:"Роль"},{key:"bio",label:"Краткая информация"},{key:"photo",label:"URL фото"}]}
        onChange={(items) => update({ items })} />
    </div>
  );
  if (active === "location") return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Заголовок"><I value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} /></Field>
        <Field label="Подпись на карточке"><I value={data.caption ?? ""} onChange={(e) => update({ caption: e.target.value })} /></Field>
      </div>
      <Field label="Описание"><T rows={4} value={data.description ?? ""} onChange={(e) => update({ description: e.target.value })} /></Field>
      <Field label="Адрес"><I value={data.address ?? ""} onChange={(e) => update({ address: e.target.value })} /></Field>
      <Field label="iframe карты (src)"><T rows={2} value={data.map ?? ""} onChange={(e) => update({ map: e.target.value })} /></Field>
    </div>
  );
  if (active === "signup") return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Заголовок"><I value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} /></Field>
        <Field label="Подзаголовок"><I value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} /></Field>
      </div>
      <RepeaterText label="Преимущества" items={data.bullets ?? []} onChange={(bullets) => update({ bullets })} />
    </div>
  );
  return null;
}

function RepeaterText({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex gap-2">
            <T rows={2} value={v} onChange={(e) => { const a = [...items]; a[i] = e.target.value; onChange(a); }} />
            <button onClick={() => onChange(items.filter((_, x) => x !== i))} className="rounded-xl border border-white/10 p-2 text-white/40 hover:text-destructive"><Trash2 className="size-4" /></button>
          </div>
        ))}
        <button onClick={() => onChange([...items, ""])} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-2 text-sm text-white/60 hover:text-white"><Plus className="size-4" /> Добавить</button>
      </div>
    </Field>
  );
}

function RepeaterCards({ label, items, fields, onChange }: {
  label: string; items: any[]; onChange: (v: any[]) => void;
  fields: { key: string; label: string; textarea?: boolean }[];
}) {
  return (
    <Field label={label}>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs text-white/40">№ {i + 1}</div>
              <button onClick={() => onChange(items.filter((_, x) => x !== i))} className="rounded-lg p-1.5 text-white/40 hover:text-destructive"><Trash2 className="size-4" /></button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.textarea ? "md:col-span-2" : ""}>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{f.label}</label>
                  {f.textarea
                    ? <T rows={3} value={it[f.key] ?? ""} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], [f.key]: e.target.value }; onChange(a); }} />
                    : <I value={it[f.key] ?? ""} onChange={(e) => { const a = [...items]; a[i] = { ...a[i], [f.key]: e.target.value }; onChange(a); }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={() => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, ""]))])}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-2 text-sm text-white/60 hover:text-white">
          <Plus className="size-4" /> Добавить
        </button>
      </div>
    </Field>
  );
}
