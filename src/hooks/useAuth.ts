import { useEffect, useState } from "react";

export type DemoUser = {
  id: string;
  email: string;
  user_metadata: { full_name: string };
};

const DEMO_KEY = "ctc-demo-user";

function readDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<DemoUser | null>(readDemoUser);
  const [loading, setLoading] = useState(false);
  const [isInstructor] = useState(false);

  useEffect(() => {
    const sync = () => setUser(readDemoUser());
    window.addEventListener("storage", sync);
    window.addEventListener("ctc-demo-auth", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ctc-demo-auth", sync);
    };
  }, []);

  return { user, loading, isInstructor };
}
