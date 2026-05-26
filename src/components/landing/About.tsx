import { motion } from "framer-motion";

type Props = { title?: string; caption?: string; image?: string; paragraphs?: string[] };

export function About({ title, caption, image, paragraphs }: Props) {
  return (
    <section id="about" className="relative overflow-hidden bg-[var(--navy-deep)] py-24 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -left-40 top-20 size-[400px] rounded-full bg-[var(--royal)]/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 md:grid-cols-2 md:px-8 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}
          className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[var(--royal)]/30 to-[var(--navy)] shadow-cinematic"
        >
          {image ? (
            <img src={image} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="font-display text-[10rem] font-black text-white/5">FAM</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--orange-accent)]">FAM · 2026</div>
            <div className="mt-2 text-2xl font-bold text-white">{caption ?? "Анапа · Россия"}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">
            О нас
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white">
            {title ?? "Об"} <span className="text-gradient-royal">Академии</span>
          </h2>
          <div className="mt-8 space-y-5 text-base md:text-lg text-white/70 leading-relaxed">
            {(paragraphs ?? []).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
