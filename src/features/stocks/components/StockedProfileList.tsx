"use client";

import { useMemo } from "react";
import ProfileCard from "@/features/profiles/components/ProfileCard";
import { dummyMaleProfiles } from "@/features/profiles/data/maleProfiles";
import { dummyProfiles } from "@/features/profiles/data/profiles";
import { useStocks } from "@/features/stocks/hooks/useStocks";

const allProfiles = [...dummyProfiles, ...dummyMaleProfiles];

export default function StockedProfileList() {
  const { stockedIds } = useStocks();
  const stocked = useMemo(
    () => allProfiles.filter((p) => stockedIds.includes(p.id)),
    [stockedIds],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ストック一覧</h1>
        <p className="text-gray-500 mb-8">
          ★ でストックしたプロフィールが表示されます
        </p>
        {stocked.length === 0 ? (
          <p className="text-gray-400 text-center py-20">
            まだストックしたプロフィールがありません
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocked.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
