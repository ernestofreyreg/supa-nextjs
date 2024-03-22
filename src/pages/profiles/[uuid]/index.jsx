import { getProfileById } from "@/services/getProfileById";
import { securePage, useSecurePage } from "@/services/useSecurePage";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Container } from "react-bootstrap";

function ProfilePage() {
  useSecurePage();

  const router = useRouter();
  const id = router.query.uuid;
  const supabase = useSupabaseClient();

  const { data, isLoading } = useQuery({
    queryKey: ["profiles", id],
    queryFn: () => getProfileById(supabase, id),
  });

  if (isLoading) {
    return <Container>Loading</Container>;
  }

  return (
    <Container>
      <h2>Profile {data.data.Name}</h2>
      <img
        src={data.data.Picture}
        alt="Profile picture"
        width={100}
        height={100}
      />
      <p>{data.data.Backstory}</p>
    </Container>
  );
}

export default securePage(ProfilePage);
