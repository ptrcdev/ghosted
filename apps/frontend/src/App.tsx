import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { supabase } from "./lib/supabase";

const queryClient = new QueryClient();

function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // magic link / otp verification state
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      // 1) handle magic link callback if present
      const params = new URLSearchParams(window.location.search);
      const token_hash = params.get("token_hash");
      const type = params.get("type");

      if (token_hash) {
        if (!mounted) return;
        setVerifying(true);

        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: (type as "email") || "email",
        });

        if (!mounted) return;

        if (error) {
          setAuthError(error.message);
        } else {
          // Clean URL so refresh doesn't re-verify
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        setVerifying(false);
      }

      // 2) load initial session
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setAuthReady(true);

      // 3) subscribe to auth changes
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => sub.subscription.unsubscribe();
    };

    const cleanupPromise = run();

    return () => {
      mounted = false;
      // if run() returned an unsubscribe function, call it
      Promise.resolve(cleanupPromise).then((cleanup) => cleanup?.());
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return { session, authReady, verifying, authError, signOut };
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

function AuthErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-6 bg-card rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold text-destructive mb-2">Authentication Error</h1>
        <p className="text-muted-foreground mb-4">{message}</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

// Guards

function RequireAuth({
  session,
  authReady,
  children,
}: {
  session: Session | null;
  authReady: boolean;
  children: React.ReactNode;
}) {
  const location = useLocation();

  if (!authReady) return <LoadingScreen />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

function RedirectIfAuthed({
  session,
  authReady,
  children,
  to = "/dashboard",
}: {
  session: Session | null;
  authReady: boolean;
  children: React.ReactNode;
  to?: string;
}) {
  if (!authReady) return <LoadingScreen />;
  if (session) return <Navigate to={to} replace />;
  return <>{children}</>;
}

function AppRoutes({
  session,
  authReady,
}: {
  session: Session | null;
  authReady: boolean;
}) {
  return (
    <Routes>
      {/* Landing page for unauthenticated users */}
      <Route
        path="/"
        element={
          <RedirectIfAuthed session={session} authReady={authReady}>
            <Index />
          </RedirectIfAuthed>
        }
      />

      {/* Public auth pages */}
      <Route
        path="/login"
        element={
          <RedirectIfAuthed session={session} authReady={authReady}>
            <Login />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuthed session={session} authReady={authReady}>
            <Signup />
          </RedirectIfAuthed>
        }
      />

      {/* Protected dashboard */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth session={session} authReady={authReady}>
            <Dashboard />
          </RequireAuth>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const { session, authReady, verifying, authError } = useSupabaseAuth();

  if (verifying) return <LoadingScreen />;
  if (authError) return <AuthErrorScreen message={authError} />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes session={session} authReady={authReady} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
