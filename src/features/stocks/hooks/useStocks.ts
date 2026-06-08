"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [stockedIds, setStockedIds] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    setStockedIds(loadStockedIds());
  }, []);

  const toggle = useCallback((profileId: string) => {
    setStockedIds((prev) => {
      const current = prev ?? [];
      const next = current.includes(profileId)
        ? current.filter((id) => id !== profileId)
        : [...current, profileId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage quota exceeded or storage unavailable
      }
      return next;
    });
  }, []);

  const isStocked = useMemo(
    () => (profileId: string) => stockedIds?.includes(profileId) ?? false,
    [stockedIds],
  );

  return { stockedIds: stockedIds ?? [], toggle, isStocked };
}
