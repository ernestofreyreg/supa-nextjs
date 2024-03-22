export async function getProfileById(supabase, id) {
  const { data: company } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  return company;
}
