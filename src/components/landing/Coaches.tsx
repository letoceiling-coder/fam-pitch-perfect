import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Coach = { name: string; role: string; bio?: string; photo?: string };
type Props = { title?: string; subtitle?: string; items?: Coach[] };

export function Coaches({ title, subtitle, items }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: false });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    setSnaps(embla.scrollSnapList());
    embla.on("select", onSelect); onSelect();
  }, [embla]);

  if (!items?.length) return null;

  return (
    <section id="coaches" className="section-light relative py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--royal)]">
              Команда
            </div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black">
              {title ?? "Тренеры"}
            </h2>
            {subtitle && <p className="mt-5 max-w-2xl text-[var(--muted-foreground)]">{subtitle}</p>}
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => embla?.scrollPrev()} className="flex size-12 items-center justify-center rounded-full border border-current/10 hover:bg-current/5">
              <ChevronLeft className="size-5" />
            </button>
            <button onClick={() => embla?.scrollNext()} className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--orange-accent)] to-[var(--orange-glow)] text-white shadow-orange-glow">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </motion.div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {items.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05 }}
                className="group relative w-[78%] shrink-0 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)] text-white shadow-cinematic sm:w-[48%] lg:w-[31.5%]"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  {c.photo ? (
                    <img src={c.photo} alt={c.name} className="size-full object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--royal)]/30 to-[var(--navy-deep)] font-display text-[8rem] font-black text-white/10">
                      {c.name?.[0] ?? "F"}
                    </div>
                  )}
                </div>
                <div className="absolute inset-x-4 bottom-4 rounded-2xl glass p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--orange-accent)]">{c.role}</div>
                  <div className="mt-1.5 font-display text-lg font-bold leading-tight">{c.name}</div>
                  {c.bio && <div className="mt-1 text-xs text-white/60">{c.bio}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-1.5 md:hidden">
          {snaps.map((_, i) => (
            <button key={i} onClick={() => embla?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === selected ? "w-8 bg-[var(--orange-accent)]" : "w-1.5 bg-current/20"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
