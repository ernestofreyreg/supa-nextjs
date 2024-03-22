export async function getProfiles(supabase) {
  const { data: companies } = await supabase.from("profiles").select("*");
  return companies;
}
