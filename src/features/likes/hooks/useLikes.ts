"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "liked_profiles";

function loadLikedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useLikes() {
  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    setLikedIds(loadLikedIds());
  }, []);

  const toggle = useCallback((profileId: string) => {
    setLikedIds((prev) => {
      const next = prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isLiked = useCallback(
    (profileId: string) => likedIds.includes(profileId),
    [likedIds],
  );

  return { likedIds, toggle, isLiked };
}
