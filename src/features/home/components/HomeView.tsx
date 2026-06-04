"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { User } from "@/features/auth/types";
import { BottomNav } from "@/shared/components/BottomNav";

const DUMMY_PROFILES = [
  {
    id: "1",
    name: "山田 花子",
    age: 24,
    bio: "旅行と料理が好きです。のんびりした週末が理想です☕",
    imageColor: "from-rose-300 to-pink-400",
  },
  {
    id: "2",
    name: "鈴木 美咲",
    age: 27,
    bio: "読書・映画鑑賞・ヨガが趣味。一緒に成長できる人を探しています。",
    imageColor: "from-violet-300 to-purple-400",
  },
  {
    id: "3",
    name: "田中 さくら",
    age: 22,
    bio: "カフェ巡りが大好き！おいしいお店を一緒に開拓しましょう☕",
    imageColor: "from-amber-300 to-orange-400",
  },
];

export function HomeView() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cardIndex, setCardIndex] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once on mount to check auth
  useEffect(() => {
    const u = currentUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, []);

  if (!user) return null;

  const profile = DUMMY_PROFILES[cardIndex];
  const hasMore = cardIndex < DUMMY_PROFILES.length;

  function handleLike() {
    setCardIndex((i) => i + 1);
  }

  function handleSkip() {
    setCardIndex((i) => i + 1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
        <span className="text-xl font-bold text-rose-500">Match</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-600">{user.name}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 hover:bg-zinc-100"
          >
            ログアウト
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-6">
        {hasMore && profile ? (
          <>
            <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-lg">
              <div
                className={`flex h-80 items-end bg-gradient-to-br ${profile.imageColor} p-5`}
              >
                <div>
                  <p className="text-2xl font-bold text-white">
                    {profile.name}
                    <span className="ml-2 text-lg font-normal">
                      {profile.age}歳
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-white/90">{profile.bio}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-6">
              <button
                type="button"
                onClick={handleSkip}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-300 bg-white text-2xl shadow transition hover:scale-110 hover:border-zinc-400"
                aria-label="スキップ"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={handleLike}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-300 bg-white text-2xl shadow transition hover:scale-110 hover:border-rose-500"
                aria-label="いいね"
              >
                ❤️
              </button>
            </div>

            <p className="mt-4 text-xs text-zinc-400">
              残り {DUMMY_PROFILES.length - cardIndex} 人
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-5xl">🎉</span>
            <p className="text-lg font-semibold text-zinc-700">
              今日のおすすめは終了しました
            </p>
            <p className="text-sm text-zinc-400">
              また明日チェックしてみてください
            </p>
            <button
              type="button"
              onClick={() => setCardIndex(0)}
              className="mt-2 rounded-full bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600"
            >
              もう一度見る
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
