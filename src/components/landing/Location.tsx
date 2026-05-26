import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  description?: string;
  address?: string;
  caption?: string;
  map?: string;
  images?: string[];
};

export function Location({ title, description, address, caption, map, images }: Props) {
  return (
    <section id="location" className="relative overflow-hidden bg-[var(--navy-deep)] py-24 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 md:grid-cols-2 md:px-8 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">
            База
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white">
            Где мы<br /><span className="text-gradient-royal">тренируемся</span>
          </h2>
          <p className="mt-6 max-w-md text-white/70 leading-relaxed">{description}</p>
          {address && (
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl glass px-5 py-4 text-white">
              <MapPin className="size-5 text-[var(--orange-accent)]" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Адрес</div>
                <div className="font-semibold">{address}</div>
              </div>
            </div>
          )}
          <div className="mt-6">
            <Button asChild variant="hero">
              <a target="_blank" rel="noreferrer" href={`https://yandex.ru/maps/?text=${encodeURIComponent(address ?? "")}`}>
                Открыть в Яндекс.Картах <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 shadow-cinematic"
        >
          {map ? (
            <iframe src={map} className="size-full" loading="lazy" title="Карта" />
          ) : images?.[0] ? (
            <img src={images[0]} alt="" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center bg-gradient-to-br from-[var(--royal)]/30 to-[var(--navy-deep)] font-display text-[8rem] font-black text-white/5">
              FIELD
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl glass p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--orange-accent)]">FAM · База</div>
            <div className="text-lg font-bold text-white">{caption ?? "Тренировочное поле"}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
