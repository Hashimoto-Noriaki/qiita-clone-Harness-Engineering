import ProfileCard from "@/features/profiles/components/ProfileCard";
import { dummyMaleProfiles } from "@/features/profiles/data/maleProfiles";

export default function MenProfilesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          男性プロフィール一覧
        </h1>
        <p className="text-gray-500 mb-8">気になる人を見つけてみましょう</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyMaleProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  );
}
