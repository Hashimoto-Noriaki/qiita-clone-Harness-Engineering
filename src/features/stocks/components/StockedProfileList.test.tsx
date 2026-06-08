import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StockedProfileList from "./StockedProfileList";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // biome-ignore lint/performance/noImgElement: テスト用モック
    <img src={src} alt={alt} />
  ),
}));

vi.mock("@/features/stocks/hooks/useStocks", () => ({
  useStocks: vi.fn(),
}));

vi.mock("@/features/likes/hooks/useLikes", () => ({
  useLikes: () => ({
    isLiked: () => false,
    toggle: vi.fn(),
  }),
}));

import { useStocks } from "@/features/stocks/hooks/useStocks";

const mockUseStocks = vi.mocked(useStocks);

beforeEach(() => {
  localStorage.clear();
  mockUseStocks.mockReturnValue({
    stockedIds: [],
    toggle: vi.fn(),
    isStocked: vi.fn(() => false),
  });
});

describe("StockedProfileList", () => {
  describe("ストックなし（空状態）", () => {
    it("ストックがない場合は空状態メッセージを表示する", () => {
      mockUseStocks.mockReturnValue({
        stockedIds: [],
        toggle: vi.fn(),
        isStocked: vi.fn(() => false),
      });

      render(<StockedProfileList />);

      expect(
        screen.getByText("ストックしたプロフィールはまだありません。"),
      ).toBeInTheDocument();
    });

    it("ストックがない場合はプロフィールカードを表示しない", () => {
      mockUseStocks.mockReturnValue({
        stockedIds: [],
        toggle: vi.fn(),
        isStocked: vi.fn(() => false),
      });

      render(<StockedProfileList />);

      // グリッドレイアウトは表示されない
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("ストックあり", () => {
    it("ストックされたプロフィールを表示する", () => {
      // dummyProfiles の id "1" (佐藤 さくら) をストック
      mockUseStocks.mockReturnValue({
        stockedIds: ["1"],
        toggle: vi.fn(),
        isStocked: vi.fn((id: string) => id === "1"),
      });

      render(<StockedProfileList />);

      expect(screen.getByText("佐藤 さくら")).toBeInTheDocument();
    });

    it("ストックされた複数のプロフィールをすべて表示する", () => {
      // id "1" (佐藤 さくら) と id "2" (鈴木 あおい) をストック
      mockUseStocks.mockReturnValue({
        stockedIds: ["1", "2"],
        toggle: vi.fn(),
        isStocked: vi.fn((id: string) => ["1", "2"].includes(id)),
      });

      render(<StockedProfileList />);

      expect(screen.getByText("佐藤 さくら")).toBeInTheDocument();
      expect(screen.getByText("鈴木 あおい")).toBeInTheDocument();
    });

    it("ストックされていないプロフィールは表示しない", () => {
      // id "1" のみストック
      mockUseStocks.mockReturnValue({
        stockedIds: ["1"],
        toggle: vi.fn(),
        isStocked: vi.fn((id: string) => id === "1"),
      });

      render(<StockedProfileList />);

      expect(screen.getByText("佐藤 さくら")).toBeInTheDocument();
      expect(screen.queryByText("鈴木 あおい")).not.toBeInTheDocument();
    });

    it("ストックありの場合は空状態メッセージを表示しない", () => {
      mockUseStocks.mockReturnValue({
        stockedIds: ["1"],
        toggle: vi.fn(),
        isStocked: vi.fn((id: string) => id === "1"),
      });

      render(<StockedProfileList />);

      expect(
        screen.queryByText("ストックしたプロフィールはまだありません。"),
      ).not.toBeInTheDocument();
    });

    it("存在しない profileId がストックに含まれていても無視する（境界値）", () => {
      mockUseStocks.mockReturnValue({
        stockedIds: ["non-existent-id-9999"],
        toggle: vi.fn(),
        isStocked: vi.fn(() => false),
      });

      render(<StockedProfileList />);

      // 存在しない ID なので空状態メッセージが表示される
      expect(
        screen.getByText("ストックしたプロフィールはまだありません。"),
      ).toBeInTheDocument();
    });
  });
});