import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

type Settings = {
  phone?: string; email?: string; telegram?: string; whatsapp?: string;
  max?: string; address?: string; copyright?: string;
};

const NAV = [
  { id: "about", label: "Академия" },
  { id: "keepers", label: "Школа вратарей" },
  { id: "principles", label: "Принципы" },
  { id: "coaches", label: "Тренеры" },
  { id: "location", label: "Локация" },
  { id: "signup", label: "Запись" },
];

export function Footer({ s }: { s: Settings }) {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer className="relative overflow-hidden bg-[var(--navy-deep)] pt-20 pb-10 text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--orange-accent)]/40 to-transparent" />
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 md:grid-cols-3 md:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-white/60 leading-relaxed">
            Футбольная Академия Морева — крупнейшая академия Анапы. Современный подход, профессиональные тренеры и любовь к игре.
          </p>
        </div>
        <div>
          <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">
            Разделы
          </div>
          <ul className="space-y-2.5">
            {NAV.map((n) => (
              <li key={n.id}>
                <button onClick={() => go(n.id)} className="text-sm text-white/70 hover:text-white transition">
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">
            Контакты
          </div>
          <ul className="space-y-2.5 text-sm text-white/70">
            {s.phone && <li><a href={`tel:${s.phone.replace(/\D/g, "")}`} className="hover:text-white">{s.phone}</a></li>}
            {s.email && <li><a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a></li>}
            {s.telegram && <li><a target="_blank" rel="noreferrer" href={s.telegram} className="hover:text-white">Telegram</a></li>}
            {s.whatsapp && <li><a target="_blank" rel="noreferrer" href={s.whatsapp} className="hover:text-white">WhatsApp</a></li>}
            {s.max && <li><a target="_blank" rel="noreferrer" href={s.max} className="hover:text-white">MAX</a></li>}
            {s.address && <li>{s.address}</li>}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-white/10 px-4 pt-8 text-xs text-white/40 md:px-8">
        <div>{s.copyright ?? "© Футбольная Академия Морева"}</div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-white">Политика</a>
          <a href="#" className="hover:text-white">Оферта</a>
          <a href="#" className="hover:text-white">Соглашение</a>
          <Link to="/login" className="hover:text-white">Админка</Link>
        </div>
      </div>
    </footer>
  );
}
