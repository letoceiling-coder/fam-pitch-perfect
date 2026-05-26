import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

type Props = { title?: string; description?: string; video?: string; poster?: string };

export function Keepers({ title, description, video, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const v = ref.current; if (!v) return;
    if (v.paused) { v.muted = false; v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };
  return (
    <section id="keepers" className="section-light relative py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 md:grid-cols-[1.05fr_1.3fr] md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
        >
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">
            Программа
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95]">
            Школа<br/><span className="text-gradient-royal">вратарей</span>
          </h2>
          <p className="mt-6 max-w-md text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}
          className="group relative aspect-video overflow-hidden rounded-[2rem] shadow-cinematic"
        >
          <video
            ref={ref} loop playsInline preload="metadata"
            poster={poster || undefined}
            className="size-full object-cover"
            onClick={toggle}
          >
            <source src={video || "/media/hero-720.webm"} type="video/webm" />
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity ${playing ? "opacity-0" : "opacity-100"}`} />
          <button
            onClick={toggle}
            aria-label={playing ? "Пауза" : "Воспроизвести"}
            className="absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--orange-accent)] to-[var(--orange-glow)] text-white shadow-orange-glow transition group-hover:scale-110"
            style={{ width: 80, height: 80 }}
          >
            {playing ? <Pause className="size-7" /> : <Play className="size-7 translate-x-0.5" fill="white" />}
          </button>
          <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-white">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-80">FAM · Видео</div>
              <div className="text-lg font-bold">{title ?? "Школа вратарей"}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
