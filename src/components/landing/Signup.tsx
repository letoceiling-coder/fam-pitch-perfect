import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  subtitle?: string;
  bullets?: string[];
  phone?: string;
  onCta: () => void;
};

export function Signup({ title, subtitle, bullets, phone, onCta }: Props) {
  return (
    <section id="signup" className="section-light relative py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 md:grid-cols-[1fr_1.05fr] md:px-8 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--royal)]">
            Запись
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black">
            {title ?? "Записать"}<br/><span className="text-gradient-orange italic">ребёнка</span>
          </h2>
          <p className="mt-6 max-w-md text-[var(--muted-foreground)]">{subtitle}</p>
          <ul className="mt-8 space-y-3">
            {(bullets ?? []).map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--orange-accent)] text-white">
                  <Check className="size-3" />
                </span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--navy-deep)] to-[var(--navy)] p-8 text-white shadow-cinematic md:p-12"
        >
          <div className="absolute -right-20 -top-20 size-60 rounded-full bg-[var(--orange-accent)]/30 blur-3xl" />
          <div className="relative">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">
              Пробное занятие
            </div>
            <div className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight">
              Оставьте заявку — мы свяжемся в течение дня
            </div>
            {phone && (
              <a href={`tel:${phone.replace(/\D/g, "")}`} className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 px-5 py-4 hover:bg-white/10 transition">
                <Phone className="size-5 text-[var(--orange-accent)]" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Телефон</div>
                  <div className="text-lg font-bold">{phone}</div>
                </div>
              </a>
            )}
            <Button onClick={onCta} variant="hero" size="xl" className="mt-6 w-full">
              Записаться на пробное
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
