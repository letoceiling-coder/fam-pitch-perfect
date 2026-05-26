import { useEffect } from "react";
import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard, Inbox, Settings, Image as ImageIcon, FileText, LogOut, ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const ITEMS = [
  { to: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { to: "/admin/leads", label: "Заявки", icon: Inbox },
  { to: "/admin/content", label: "Контент сайта", icon: FileText },
  { to: "/admin/media", label: "Медиаменеджер", icon: ImageIcon },
  { to: "/admin/settings", label: "Настройки", icon: Settings },
];

function AdminLayout() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [loading, user, nav]);

  if (loading) return <div className="grid min-h-screen place-items-center bg-[var(--navy-deep)] text-white/50">Загрузка...</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--navy-deep)] px-4 text-white">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Доступ ограничен</h1>
          <p className="mt-2 text-white/60">У вас нет прав администратора.</p>
          <button onClick={() => signOut().then(() => nav({ to: "/login" }))} className="mt-6 rounded-2xl bg-[var(--orange-accent)] px-6 py-3 font-semibold">Выйти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--navy-deep)] text-white">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/5 bg-[var(--navy)]/60 backdrop-blur-xl p-5 md:flex">
        <div className="px-2 py-3">
          <Logo />
        </div>
        <nav className="mt-6 flex-1 space-y-1">
          {ITEMS.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-gradient-to-r from-[var(--orange-accent)]/20 to-transparent text-white border-l-2 border-[var(--orange-accent)]" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}>
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-white/5 pt-4">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white">
            <ExternalLink className="size-4" /> Открыть сайт
          </a>
          <button onClick={() => signOut().then(() => nav({ to: "/login" }))} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white">
            <LogOut className="size-4" /> Выйти
          </button>
          <div className="px-3 pt-2 text-[10px] text-white/30">{user.email}</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/5 bg-[var(--navy-deep)]/80 px-4 py-3 backdrop-blur-xl md:px-8">
          <div className="md:hidden"><Logo size={28} withText={false} /></div>
          <div className="hidden md:block text-sm text-white/50">FAM CMS</div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="rounded-lg p-2 text-white/60 hover:bg-white/5 md:hidden"><ExternalLink className="size-4" /></a>
            <button onClick={() => signOut().then(() => nav({ to: "/login" }))} className="rounded-lg p-2 text-white/60 hover:bg-white/5 md:hidden"><LogOut className="size-4" /></button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
