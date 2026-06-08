"use client";

import { useMemo, useState } from "react";
import type { Profile } from "@/features/profiles/types";

export function useProfileSearch(profiles: Profile[]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        p.hobbies.some((h) => h.toLowerCase().includes(q)),
    );
  }, [profiles, query]);

  return { query, setQuery, filtered };
}
