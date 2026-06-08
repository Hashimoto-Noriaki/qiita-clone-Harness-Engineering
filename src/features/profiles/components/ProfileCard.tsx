"use client";

import Image from "next/image";
import { useLikes } from "@/features/likes/hooks/useLikes";
import type { Profile } from "@/features/profiles/types";
import { useStocks } from "@/features/stocks/hooks/useStocks";

type Props = {
  profile: Profile;
};

export default function ProfileCard({ profile }: Props) {
  const { isLiked, toggle: toggleLike } = useLikes();
  const { isStocked, toggle: toggleStock } = useStocks();
  const liked = isLiked(profile.id);
  const stocked = isStocked(profile.id);

  return (
    <div className="bg-gradient-to-br from-rose-500 via-fuchsia-500 to-violet-600 rounded-2xl shadow-xl shadow-rose-300/50 overflow-hidden hover:shadow-2xl transition-shadow">
      <div className="relative h-56 w-full">
        <Image
          src={profile.imageUrl}
          alt={profile.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <button
          type="button"
          onClick={() => toggleLike(profile.id)}
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow hover:scale-110 transition-transform"
          aria-label={liked ? "いいねを取り消す" : "いいねする"}
        >
          <span
            className={`text-xl ${liked ? "text-rose-500" : "text-gray-300"}`}
          >
            ♥
          </span>
        </button>
        <button
          type="button"
          onClick={() => toggleStock(profile.id)}
          className="absolute top-3 left-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow hover:scale-110 transition-transform"
          aria-label={stocked ? "ストックを取り消す" : "ストックする"}
        >
          <span
            className={`text-xl ${stocked ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-xl font-bold text-white">{profile.name}</h2>
          <span className="text-white/80 text-sm">{profile.age}歳</span>
          <span className="text-white/70 text-sm ml-auto">
            {profile.location}
          </span>
        </div>
        <p className="text-white/90 text-sm mb-3 line-clamp-2">{profile.bio}</p>
        <div className="flex flex-wrap gap-1">
          {profile.hobbies.map((hobby) => (
            <span
              key={hobby}
              className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full"
            >
              {hobby}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
