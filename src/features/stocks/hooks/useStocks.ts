"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "stocked_profiles";

function loadStockedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useStocks() {
  const [stockedIds, setStockedIds] = useState<string[]>([]);

  useEffect(() => {
    setStockedIds(loadStockedIds());
  }, []);

  const toggle = useCallback((profileId: string) => {
    setStockedIds((prev) => {
      const next = prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isStocked = useCallback(
    (profileId: string) => stockedIds.includes(profileId),
    [stockedIds],
  );

  return { stockedIds, toggle, isStocked };
}
