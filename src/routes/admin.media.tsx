import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Trash2, Search, Film, Image as ImageIcon, Copy } from "lucide-react";

type MediaItem = { id: string; name: string; url: string; type: string; size: number | null; path: string | null; created_at: string };

export const Route = createFileRoute("/admin/media")({ component: MediaPage });

function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [uploading, setUploading] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
        const kind = file.type.startsWith("video") ? "video" : "image";
        const { error: insErr } = await supabase.from("media").insert({ name: file.name, url: pub.publicUrl, type: kind, size: file.size, path });
        if (insErr) throw insErr;
      }
      toast.success("Загружено");
      load();
    } catch (e: any) { toast.error(e.message); }
    finally { setUploading(false); if (input.current) input.current.value = ""; }
  };

  const remove = async (m: MediaItem) => {
    if (!confirm("Удалить файл?")) return;
    if (m.path) await supabase.storage.from("media").remove([m.path]);
    await supabase.from("media").delete().eq("id", m.id);
    setItems((arr) => arr.filter((x) => x.id !== m.id));
  };
  const copy = (url: string) => { navigator.clipboard.writeText(url); toast.success("URL скопирован"); };

  const filtered = items
    .filter((i) => filter === "all" || i.type === filter)
    .filter((i) => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">MEDIA</div>
          <h1 className="mt-2 font-display text-4xl font-black">Медиаменеджер</h1>
        </div>
        <div className="flex gap-2">
          <input ref={input} type="file" multiple hidden accept="image/*,video/*" onChange={(e) => upload(e.target.files)} />
          <button onClick={() => input.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--orange-accent)] to-[var(--orange-glow)] px-5 py-2.5 text-sm font-semibold shadow-orange-glow">
            <Upload className="size-4" /> {uploading ? "Загрузка..." : "Загрузить"}
          </button>
        </div>
      </div>

      <div
        className="rounded-3xl border-2 border-dashed border-white/10 p-8 text-center text-sm text-white/40"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
      >
        Перетащите файлы сюда или нажмите «Загрузить». Поддержка: jpg, png, webp, mp4, webm
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-white/20" />
        </div>
        <div className="flex gap-1.5 rounded-2xl bg-white/[0.04] p-1">
          {[["all","Все"],["image","Фото"],["video","Видео"]].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k as any)}
              className={`rounded-xl px-4 py-1.5 text-sm transition ${filter===k?"bg-white text-[var(--navy-deep)]":"text-white/60"}`}>{l}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-white/40">Файлов нет</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => (
            <div key={m.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="relative aspect-square bg-[var(--navy-deep)]">
                {m.type === "image" ? (
                  <img src={m.url} alt={m.name} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center">
                    <Film className="size-10 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-end justify-end gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => copy(m.url)} className="rounded-lg bg-white/10 p-1.5 backdrop-blur-md hover:bg-white/20" title="Копировать URL">
                    <Copy className="size-3.5" />
                  </button>
                  <button onClick={() => remove(m)} className="rounded-lg bg-destructive/80 p-1.5 backdrop-blur-md" title="Удалить">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <div className="flex items-center gap-1.5">
                  {m.type === "image" ? <ImageIcon className="size-3 text-white/40" /> : <Film className="size-3 text-white/40" />}
                  <div className="truncate text-xs">{m.name}</div>
                </div>
                <div className="mt-1 text-[10px] text-white/30">{m.size ? `${(m.size / 1024).toFixed(0)} KB` : ""}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
