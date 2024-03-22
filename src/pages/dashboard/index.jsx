import { useSecurePage } from "@/services/useSecurePage";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Dashboard() {
  useSecurePage();

  const supabase = useSupabaseClient();

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  return (
    <div>
      Dashboard <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
