import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { signIn, signUp } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) { toast.error(error); return; }
    if (mode === "signup") toast.success("Аккаунт создан. Первый пользователь становится администратором.");
    nav({ to: "/admin" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--navy-deep)] noise">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute -right-32 top-1/3 size-[480px] rounded-full bg-[var(--orange-accent)]/15 blur-[140px]" />
      <div className="absolute -left-32 bottom-0 size-[420px] rounded-full bg-[var(--royal)]/20 blur-[140px]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[var(--navy)]/80 p-8 backdrop-blur-2xl shadow-cinematic md:p-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--orange-accent)]">
            FAM ADMIN
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-black text-white">
            {mode === "signin" ? "Вход в админку" : "Регистрация"}
          </h1>
          <p className="mt-2 text-sm text-white/50">Только для сотрудников Академии</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Email</label>
              <Input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-[var(--navy-deep)]/80 border-white/10 rounded-2xl text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Пароль</label>
              <Input
                type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-[var(--navy-deep)]/80 border-white/10 rounded-2xl text-white"
              />
            </div>
            <Button type="submit" variant="hero" size="xl" disabled={loading} className="w-full">
              {loading ? "..." : mode === "signin" ? "Войти" : "Создать аккаунт"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-white/40">
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="hover:text-white">
              {mode === "signin" ? "Создать аккаунт" : "У меня есть аккаунт"}
            </button>
            <Link to="/" className="hover:text-white">На сайт</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
