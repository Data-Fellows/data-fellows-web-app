import { useEffect, useState } from "react";

export type MemberIdentity = {
  name: string;
  email: string;
};

const STORAGE_KEY = "df-member-identity";

// Visitor identity is intentionally just localStorage, not a real account --
// same trust level as a Discord display name. Wrapped in try/catch since
// localStorage can throw in some in-app browsers (e.g. Instagram/WhatsApp
// webviews) and that shouldn't break the page.
export const useMemberIdentity = () => {
  const [identity, setIdentityState] = useState<MemberIdentity | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setIdentityState(JSON.parse(raw));
      }
    } catch {
      // Treat as unset.
    } finally {
      setHydrated(true);
    }
  }, []);

  const setIdentity = (value: MemberIdentity) => {
    setIdentityState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Non-fatal -- the identity just won't persist across visits.
    }
  };

  return { identity, setIdentity, hydrated };
};
