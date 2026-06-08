import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StockedProfileList from "./StockedProfileList";

// useStocksフックをモック
vi.mock("@/features/stocks/hooks/useStocks", () => ({
  useStocks: vi.fn(),
}));

// useLikesフックをモック（ProfileCard内で使用）
vi.mock("@/features/likes/hooks/useLikes", () => ({
  useLikes: vi.fn(() => ({
    isLiked: () => false,
    toggle: vi.fn(),
    likedIds: [],
  })),
}));

// next/imageをモック
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // biome-ignore lint/performance/noImgElement: next/image mock for testing
    <img src={src} alt={alt} />
  ),
}));

import { useStocks } from "@/features/stocks/hooks/useStocks";

const mockUseStocks = vi.mocked(useStocks);

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("StockedProfileList", () => {
  describe("空のストック状態", () => {
    it("ストックがない場合、空メッセージが表示される", () => {
      // Given: ストックが空
      mockUseStocks.mockReturnValue({
        stockedIds: [],
        toggle: vi.fn(),
        isStocked: () => false,
      });

      render(<StockedProfileList />);

      // Then: 空メッセージが表示される
      expect(
        screen.getByText("まだストックしたプロフィールがありません"),
      ).toBeInTheDocument();
    });

    it("ページタイトル「ストック一覧」が表示される", () => {
      // Given: ストックが空
      mockUseStocks.mockReturnValue({
        stockedIds: [],
        toggle: vi.fn(),
        isStocked: () => false,
      });

      render(<StockedProfileList />);

      // Then: タイトルが表示される
      expect(screen.getByRole("heading", { name: "ストック一覧" })).toBeInTheDocument();
    });

    it("説明文が表示される", () => {
      // Given: ストックが空
      mockUseStocks.mockReturnValue({
        stockedIds: [],
        toggle: vi.fn(),
        isStocked: () => false,
      });

      render(<StockedProfileList />);

      // Then: 説明文が表示される
      expect(
        screen.getByText("★ でストックしたプロフィールが表示されます"),
      ).toBeInTheDocument();
    });
  });

  describe("ストック済みプロフィールの表示", () => {
    it("ストック済みのプロフィールが表示される（ID \"1\"はdummyProfilesに存在）", () => {
      // Given: ID "1" のプロフィールがストック済み
      mockUseStocks.mockReturnValue({
        stockedIds: ["1"],
        toggle: vi.fn(),
        isStocked: (id: string) => id === "1",
      });

      render(<StockedProfileList />);

      // Then: プロフィールカードが表示される（佐藤 さくら = ID "1"）
      expect(screen.getByText("佐藤 さくら")).toBeInTheDocument();
    });

    it("ストック済みのプロフィールのみが表示される", () => {
      // Given: ID "1" のみストック済み
      mockUseStocks.mockReturnValue({
        stockedIds: ["1"],
        toggle: vi.fn(),
        isStocked: (id: string) => id === "1",
      });

      render(<StockedProfileList />);

      // Then: 空メッセージは表示されない
      expect(
        screen.queryByText("まだストックしたプロフィールがありません"),
      ).not.toBeInTheDocument();
    });

    it("男性プロフィール（ID \"m1\"）もストック表示できる", () => {
      // Given: 男性プロフィールIDがストック済み
      mockUseStocks.mockReturnValue({
        stockedIds: ["m1"],
        toggle: vi.fn(),
        isStocked: (id: string) => id === "m1",
      });

      render(<StockedProfileList />);

      // Then: 高橋 けんた（男性ID m1）が表示される
      expect(screen.getByText("高橋 けんた")).toBeInTheDocument();
    });

    it("複数のストック済みプロフィールがすべて表示される", () => {
      // Given: 複数プロフィールがストック済み
      mockUseStocks.mockReturnValue({
        stockedIds: ["1", "m1"],
        toggle: vi.fn(),
        isStocked: (id: string) => ["1", "m1"].includes(id),
      });

      render(<StockedProfileList />);

      // Then: 両プロフィールが表示される
      expect(screen.getByText("佐藤 さくら")).toBeInTheDocument();
      expect(screen.getByText("高橋 けんた")).toBeInTheDocument();
    });
  });

  describe("存在しないIDのストック", () => {
    it("allProfilesに存在しないIDがstockedIdsにあっても何も表示しない", () => {
      // Given: 存在しないID
      mockUseStocks.mockReturnValue({
        stockedIds: ["nonexistent-id"],
        toggle: vi.fn(),
        isStocked: (id: string) => id === "nonexistent-id",
      });

      render(<StockedProfileList />);

      // Then: 空メッセージが表示される（存在しないプロフィールは無視）
      expect(
        screen.getByText("まだストックしたプロフィールがありません"),
      ).toBeInTheDocument();
    });
  });
});