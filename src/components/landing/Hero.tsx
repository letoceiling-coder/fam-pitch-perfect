import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Props = {
  title_top?: string;
  title_mid?: string;
  title_accent?: string;
  subtitle?: string;
  cta?: string;
  onCta: () => void;
};

export function Hero({ title_top, title_mid, title_accent, subtitle, cta, onCta }: Props) {
  return (
    <section id="hero" className="relative isolate min-h-[100svh] overflow-hidden bg-[var(--navy-deep)] noise">
      {/* Video bg */}
      <video
        autoPlay muted loop playsInline preload="metadata"
        poster=""
        className="absolute inset-0 size-full object-cover opacity-60"
      >
        <source src="/media/hero-720.webm" type="video/webm" />
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy-deep)]/40 via-[var(--navy-deep)]/60 to-[var(--navy-deep)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_color-mix(in_oklab,var(--orange-accent)_22%,transparent),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_color-mix(in_oklab,var(--royal)_30%,transparent),_transparent_60%)]" />
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Floating glows */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-32 top-1/3 size-[480px] rounded-full bg-[var(--orange-accent)]/20 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 bottom-0 size-[420px] rounded-full bg-[var(--royal)]/30 blur-[120px]"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-4 pb-16 pt-40 md:px-8 md:pb-24 md:pt-32">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80"
          >
            <span className="size-1.5 rounded-full bg-[var(--orange-accent)] shadow-[0_0_12px_var(--orange-glow)]" />
            Анапа · Россия · Сезон 2026
          </motion.div>

          <h1 className="font-display text-[clamp(3rem,9vw,9.5rem)] font-black leading-[0.92] tracking-[-0.04em] text-white">
            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="block"
            >
              {title_top ?? "Футбольная"}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block"
            >
              {title_mid ?? "академия"}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="block italic text-gradient-orange"
              style={{ fontStyle: "italic" }}
            >
              {title_accent ?? "Морева"}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 max-w-xl text-base md:text-lg text-white/70"
          >
            {subtitle ?? "Крупнейшая футбольная академия Анапы"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button onClick={onCta} variant="hero" size="xl" className="group">
              {cta ?? "Записать ребёнка"}
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            Scroll
            <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
