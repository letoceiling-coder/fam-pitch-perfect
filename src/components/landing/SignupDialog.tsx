import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  experience: z.string().max(200).optional().or(z.literal("")),
  guardian_name: z.string().trim().min(2, "Введите ФИО").max(120),
  student_name: z.string().trim().min(2, "Введите ФИО ученика").max(120),
  birth_date: z.string().optional().or(z.literal("")),
  phone: z.string().trim().min(10, "Введите телефон").max(30),
  comment: z.string().max(800).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Требуется согласие" }) }),
});
type Form = z.infer<typeof schema>;

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  const r = d.startsWith("8") ? "7" + d.slice(1) : d.startsWith("7") ? d : "7" + d;
  const p = r.padEnd(11, "_");
  return `+7 (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7, 9)}-${p.slice(9, 11)}`.replace(/_+/g, (m) => "");
}

export function SignupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [done, setDone] = useState(false);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { experience: "", guardian_name: "", student_name: "", birth_date: "", phone: "", comment: "", consent: false as any },
  });

  const onSubmit = async (values: Form) => {
    const { error } = await supabase.from("leads").insert({
      experience: values.experience || null,
      guardian_name: values.guardian_name,
      student_name: values.student_name,
      birth_date: values.birth_date || null,
      phone: values.phone,
      comment: values.comment || null,
    });
    if (error) { toast.error("Не удалось отправить заявку. Попробуйте позже."); return; }
    setDone(true);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(() => setDone(false), 200); }}>
      <DialogContent className="max-w-lg bg-[var(--navy)] border-white/10 text-white">
        {done ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--orange-accent)]/20">
              <CheckCircle2 className="size-9 text-[var(--orange-accent)]" />
            </div>
            <DialogTitle className="text-2xl font-bold">Заявка отправлена!</DialogTitle>
            <p className="mt-3 text-white/60">Мы свяжемся с вами в течение дня.</p>
            <Button onClick={() => onOpenChange(false)} variant="hero" className="mt-6">Закрыть</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--orange-accent)]">FAM</div>
              <DialogTitle className="font-display text-3xl font-black">Записать ребёнка</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <Field label="Опыт занятий футболом">
                <Input {...form.register("experience")} placeholder="Например: 1 год" className="bg-white/5 border-white/10" />
              </Field>
              <Field label="ФИО родителя / опекуна" error={form.formState.errors.guardian_name?.message}>
                <Input {...form.register("guardian_name")} className="bg-white/5 border-white/10" />
              </Field>
              <Field label="ФИО ученика" error={form.formState.errors.student_name?.message}>
                <Input {...form.register("student_name")} className="bg-white/5 border-white/10" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Дата рождения">
                  <Input type="date" {...form.register("birth_date")} className="bg-white/5 border-white/10" />
                </Field>
                <Field label="Телефон" error={form.formState.errors.phone?.message}>
                  <Input
                    placeholder="+7 (___) ___-__-__"
                    value={form.watch("phone")}
                    onChange={(e) => form.setValue("phone", maskPhone(e.target.value), { shouldValidate: true })}
                    className="bg-white/5 border-white/10"
                  />
                </Field>
              </div>
              <Field label="Комментарий">
                <Textarea {...form.register("comment")} rows={3} className="bg-white/5 border-white/10" />
              </Field>
              <label className="flex items-start gap-3 pt-1">
                <Checkbox checked={!!form.watch("consent")} onCheckedChange={(v) => form.setValue("consent", v as any, { shouldValidate: true })} className="mt-1 border-white/30" />
                <span className="text-xs text-white/60">Согласен на обработку персональных данных в соответствии с политикой конфиденциальности.</span>
              </label>
              {form.formState.errors.consent && <div className="text-xs text-destructive">{form.formState.errors.consent.message}</div>}
              <Button type="submit" variant="hero" size="lg" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? "Отправка..." : "Отправить заявку"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{label}</label>
      {children}
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}
