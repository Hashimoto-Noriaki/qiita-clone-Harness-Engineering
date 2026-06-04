"use client";

import Image from "next/image";
import { useLikes } from "@/features/likes/hooks/useLikes";
import type { Profile } from "@/features/profiles/types";

type Props = {
  profile: Profile;
};

export default function ProfileCard({ profile }: Props) {
  const { isLiked, toggle } = useLikes();
  const liked = isLiked(profile.id);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
          onClick={() => toggle(profile.id)}
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow hover:scale-110 transition-transform"
          aria-label={liked ? "いいねを取り消す" : "いいねする"}
        >
          <span
            className={`text-xl ${liked ? "text-rose-500" : "text-gray-300"}`}
          >
            ♥
          </span>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
          <span className="text-gray-500 text-sm">{profile.age}歳</span>
          <span className="text-gray-400 text-sm ml-auto">
            {profile.location}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{profile.bio}</p>
        <div className="flex flex-wrap gap-1">
          {profile.hobbies.map((hobby) => (
            <span
              key={hobby}
              className="bg-cyan-50 text-cyan-700 text-xs font-medium px-2 py-1 rounded-full"
            >
              {hobby}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
