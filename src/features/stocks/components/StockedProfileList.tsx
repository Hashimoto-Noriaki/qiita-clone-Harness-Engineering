"use client";

import ProfileCard from "@/features/profiles/components/ProfileCard";
import { dummyMaleProfiles } from "@/features/profiles/data/maleProfiles";
import { dummyProfiles } from "@/features/profiles/data/profiles";
import type { Profile } from "@/features/profiles/types";
import { useStocks } from "@/features/stocks/hooks/useStocks";

const allProfiles: Profile[] = [...dummyProfiles, ...dummyMaleProfiles];

export default function StockedProfileList() {
  const { stockedIds } = useStocks();
  const stockedProfiles = allProfiles.filter((p) => stockedIds.includes(p.id));

  if (stockedProfiles.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-12">
        ストックしたプロフィールはまだありません。
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stockedProfiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}
