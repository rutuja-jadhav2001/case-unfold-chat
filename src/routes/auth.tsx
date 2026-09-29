import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader, PageShell } from "@/components/AppHeader";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CTC Bot" },
      { name: "description", content: "Sign in to CTC Bot to start a critical thinking session on your case." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("Student");
  const [email, setEmail] = useState("student@ctcbot.demo");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/session" });
  }, [user, navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const demoUser = {
      id: "00000000-0000-0000-0000-000000000001",
      email: email.trim() || "student@ctcbot.demo",
      user_metadata: { full_name: name.trim() || "Student" },
    };
    localStorage.setItem("ctc-demo-user", JSON.stringify(demoUser));
    window.dispatchEvent(new Event("ctc-demo-auth"));
    navigate({ to: "/session" });
  }

  const input =
    "w-full rounded-lg border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <PageShell>
      <AppHeader />
      <div className="mx-auto max-w-md animate-rise">
        <div className="glass-strong rounded-2xl p-8 ring-1 ring-border">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            Demo sign in
          </p>
          <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">Welcome to CTC Bot</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            No account or password is required for this demo.
          </p>
          <form onSubmit={submit} className="space-y-3">
            <input
              className={input}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              disabled={busy}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Entering demo…" : "Continue as Demo Student"}
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Demo mode · Authentication is disabled
          </p>
        </div>
      </div>
    </PageShell>
  );
}
