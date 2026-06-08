import StockedProfileList from "@/features/stocks/components/StockedProfileList";

export default function StocksPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ストック一覧</h1>
      <StockedProfileList />
    </main>
  );
}
