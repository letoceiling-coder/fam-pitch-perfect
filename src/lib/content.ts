import { supabase } from "@/integrations/supabase/client";

export type SiteContentMap = Record<string, any>;

export async function fetchAllContent(): Promise<SiteContentMap> {
  const { data, error } = await supabase.from("site_content").select("section,data");
  if (error) throw error;
  const map: SiteContentMap = {};
  (data ?? []).forEach((r) => (map[r.section] = r.data));
  return map;
}

export async function fetchSection<T = any>(section: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("site_content").select("data").eq("section", section).maybeSingle();
  if (error) throw error;
  return (data?.data as T) ?? null;
}

export async function upsertSection(section: string, data: any) {
  const { error } = await supabase
    .from("site_content")
    .upsert({ section, data, updated_at: new Date().toISOString() }, { onConflict: "section" });
  if (error) throw error;
}
