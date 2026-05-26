import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, createRootRouteWithContext, useRouter,
  HeadContent, Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--navy-deep)] px-4 text-white">
      <div className="text-center">
        <div className="font-display text-[10rem] font-black leading-none text-gradient-orange">404</div>
        <div className="mt-2 text-xl font-bold">Страница не найдена</div>
        <a href="/" className="mt-6 inline-block rounded-2xl bg-[var(--orange-accent)] px-6 py-3 font-semibold">На главную</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--navy-deep)] px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold">Что-то пошло не так</h1>
        <p className="mt-2 text-sm text-white/60">Попробуйте обновить страницу.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-2xl bg-[var(--orange-accent)] px-6 py-3 font-semibold"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Футбольная Академия Морева — FAM, Анапа" },
      { name: "description", content: "Крупнейшая футбольная академия Анапы. Современный подход к обучению, школа вратарей, опытные тренеры. Запишите ребёнка на пробное занятие." },
      { name: "theme-color", content: "#0e1430" },
      { property: "og:title", content: "Футбольная Академия Морева" },
      { property: "og:description", content: "Крупнейшая футбольная академия Анапы. Запишите ребёнка на пробное занятие." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster theme="dark" richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
