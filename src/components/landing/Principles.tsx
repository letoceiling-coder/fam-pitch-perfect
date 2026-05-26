import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

type Item = { title: string; text: string };
type Props = { title?: string; subtitle?: string; items?: Item[] };

export function Principles({ title, subtitle, items }: Props) {
  const [open, setOpen] = useState(0);
  return (
    <section id="principles" className="relative overflow-hidden bg-[var(--navy-deep)] py-24 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute right-0 top-0 size-[500px] rounded-full bg-[var(--royal)]/15 blur-[140px]" />
      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">
            Подход
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white">
            Наши <span className="text-gradient-orange italic">принципы</span>
          </h2>
          {subtitle && <p className="mt-5 max-w-2xl text-white/60">{subtitle}</p>}
        </motion.div>

        <div className="mt-14 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          {(items ?? []).map((it, i) => {
            const isOpen = i === open;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="group flex w-full items-center gap-6 px-6 py-6 text-left md:px-10"
                >
                  <span className="font-mono text-sm font-semibold text-[var(--orange-accent)] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-2xl md:text-3xl font-bold text-white">
                    {it.title}
                  </span>
                  <span className={`flex size-10 items-center justify-center rounded-full transition ${
                    isOpen ? "bg-[var(--orange-accent)] text-white" : "border border-white/15 text-white/60 group-hover:border-white/40"
                  }`}>
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-7 md:px-10 md:pl-[7.5rem] text-base text-white/70 leading-relaxed max-w-3xl">
                        {it.text}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
