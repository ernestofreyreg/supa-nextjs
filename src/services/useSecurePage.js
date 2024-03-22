import {
  useSession,
  useSessionContext,
  useUser,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useSecurePage = (returnPage = "/dashboard") => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    const fn = async () => {
      if (!user) {
        router.replace("/login");
      }
    };
    fn();
  }, [user, router, returnPage]);
};

export function securePage(Page) {
  return () => {
    const { isLoading, session } = useSessionContext();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !session) {
        router.replace("/login");
      }
    }, [isLoading, session, router]);

    if (isLoading) {
      return null;
    }

    if (!session) {
      return null;
    }

    return <Page />;
  };
}
