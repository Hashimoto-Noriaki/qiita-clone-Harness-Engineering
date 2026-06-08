import ProfileSearch from "@/features/profiles/components/ProfileSearch";
import { dummyProfiles } from "@/features/profiles/data/profiles";

export default function ProfilesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          みんなのプロフィール
        </h1>
        <p className="text-gray-500 mb-8">気になる人を見つけてみましょう</p>
        <ProfileSearch profiles={dummyProfiles} />
      </div>
    </div>
  );
}
