"use client";

import ProfileCard from "@/features/profiles/components/ProfileCard";
import { useProfileSearch } from "@/features/profiles/hooks/useProfileSearch";
import type { Profile } from "@/features/profiles/types";

type Props = {
  profiles: Profile[];
};

export default function ProfileSearch({ profiles }: Props) {
  const { query, setQuery, filtered } = useProfileSearch(profiles);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="名前・地域・趣味で検索"
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 mb-8"
      />
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-20">
          該当するプロフィールが見つかりませんでした
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
