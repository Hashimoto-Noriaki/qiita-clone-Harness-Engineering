import type { Metadata } from "next";
import StockedProfileList from "@/features/stocks/components/StockedProfileList";

export const metadata: Metadata = {
  title: "ストック一覧",
  description: "ストックしたプロフィールを表示します",
  openGraph: {
    title: "ストック一覧",
    description: "ストックしたプロフィールを表示します",
  },
};

export default function StocksPage() {
  return <StockedProfileList />;
}
