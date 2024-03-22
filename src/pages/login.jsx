import { getDashboardUrl } from "@/services/routes";
import {
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

export default function Login() {
  const supabase = useSupabaseClient();
  const { isLoading: isLoadingSession, session } = useSessionContext();
  const router = useRouter();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoadingSession && session && session.user) {
      router.replace(getDashboardUrl());
    }
  }, [session, router, isLoadingSession]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = useCallback(
    async (login) => {
      setError(undefined);
      setIsLoading(true);
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: login.email,
          password: login.password,
        });

      if (signInError) {
        setError("Auth error");
        setIsLoading(false);
      }

      if (!signInError && data && data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        setIsLoading(false);
        router.replace(getDashboardUrl());
      }
    },
    [supabase, router]
  );

  const handleRegister = useCallback(
    async (register) => {
      setError(undefined);
      setIsLoading(true);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: register.email,
        password: register.password,
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          setError("User already registered");
        }
        if (signUpError.message.includes("Password should be at least")) {
          setError(
            `Password should be at least ${signUpError.message.replace(
              /\D/g,
              ""
            )} characters`
          );
        }

        setIsLoading(false);
      }
      if (!signUpError && data && data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        setIsLoading(false);
        router.replace(getDashboardUrl());
      }
    },
    [supabase.auth, router]
  );

  const handleLoginClick = () => {
    const values = form.getValues();
    handleLogin(values);
  };

  const handleSignupClick = () => {
    const values = form.getValues();
    handleRegister(values);
  };

  return (
    <div>
      Login
      <label>Email</label>
      <input type="email" {...form.register("email")} />
      <label>Password</label>
      <input type="password" {...form.register("password")} />
      <button type="button" onClick={handleLoginClick}>
        Log in
      </button>
      <button type="button" onClick={handleSignupClick}>
        Sign up
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
