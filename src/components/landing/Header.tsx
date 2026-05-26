import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { id: "about", label: "Академия" },
  { id: "keepers", label: "Школа вратарей" },
  { id: "principles", label: "Принципы" },
  { id: "coaches", label: "Тренеры" },
  { id: "location", label: "Локация" },
  { id: "signup", label: "Контакты" },
];

export function Header({ phone, onCta }: { phone?: string; onCta: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8 transition-all duration-500 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <div
          className={`flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-2.5 transition-all duration-500 ${
            scrolled ? "bg-white/90 backdrop-blur-xl shadow-cinematic" : "bg-white/0"
          }`}
          style={scrolled ? { color: "var(--navy-deep)" } : { color: "white" }}
        >
          <button onClick={() => goTo("hero")} className="shrink-0">
            <Logo />
          </button>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goTo(n.id)}
                className="rounded-lg px-3 py-2 text-sm font-medium opacity-80 transition hover:opacity-100 hover:bg-current/5"
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="hidden md:inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold opacity-80 hover:opacity-100 transition"
              >
                <Phone className="size-4" />
                {phone}
              </a>
            )}
            <Button onClick={onCta} variant="hero" className="hidden sm:inline-flex">
              Записать ребёнка
            </Button>
            <button
              className="lg:hidden inline-flex size-10 items-center justify-center rounded-xl border border-current/10"
              onClick={() => setOpen(true)}
              aria-label="Меню"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--navy-deep)]/80 backdrop-blur-md lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-full w-[85%] max-w-sm flex-col bg-[var(--navy)] p-6 text-white shadow-cinematic"
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <button onClick={() => setOpen(false)} className="rounded-xl border border-white/10 p-2">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => goTo(n.id)}
                    className="rounded-xl px-4 py-3 text-left text-base font-semibold hover:bg-white/5"
                  >
                    {n.label}
                  </button>
                ))}
              </nav>
              <div className="mt-auto space-y-3">
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold"
                  >
                    <Phone className="size-4" /> {phone}
                  </a>
                )}
                <Button onClick={() => { setOpen(false); onCta(); }} variant="hero" className="w-full">
                  Записать ребёнка
                </Button>
                <Link to="/login" className="block text-center text-xs text-white/40 hover:text-white/70">
                  Вход в админку
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
