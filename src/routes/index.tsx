import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Keepers } from "@/components/landing/Keepers";
import { Principles } from "@/components/landing/Principles";
import { Coaches } from "@/components/landing/Coaches";
import { Location } from "@/components/landing/Location";
import { Signup } from "@/components/landing/Signup";
import { Footer } from "@/components/landing/Footer";
import { SignupDialog } from "@/components/landing/SignupDialog";
import { fetchAllContent, type SiteContentMap } from "@/lib/content";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const [content, setContent] = useState<SiteContentMap>({});
  const [open, setOpen] = useState(false);
  useEffect(() => { fetchAllContent().then(setContent).catch(console.error); }, []);
  const s = content.settings ?? {};
  return (
    <div className="bg-[var(--navy-deep)] text-white">
      <Header phone={s.phone} onCta={() => setOpen(true)} />
      <main>
        <Hero {...(content.hero ?? {})} onCta={() => setOpen(true)} />
        <About {...(content.about ?? {})} />
        <Keepers {...(content.keepers ?? {})} />
        <Principles {...(content.principles ?? {})} />
        <Coaches {...(content.coaches ?? {})} />
        <Location {...(content.location ?? {})} />
        <Signup {...(content.signup ?? {})} phone={s.phone} onCta={() => setOpen(true)} />
      </main>
      <Footer s={s} />
      <SignupDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
