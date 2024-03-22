import { getProfiles } from "@/services/getProfiles";
import { securePage, useSecurePage } from "@/services/useSecurePage";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Container } from "react-bootstrap";

function ProfilesPage() {
  useSecurePage();
  const supabase = useSupabaseClient();

  const { data, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => getProfiles(supabase),
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <Container>Loading</Container>;
  }

  return (
    <Container>
      Profiles
      <ul>
        {data.map((profile) => (
          <li key={profile.id}>
            <Link href={`/profiles/${profile.id}`}>{profile.data.Name}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default securePage(ProfilesPage);
