import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StockedProfileList from "./StockedProfileList";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // biome-ignore lint/performance/noImgElement: テスト用モック
    <img src={src} alt={alt} />
  ),
}));

// Spy on useStocks to control which IDs are stocked
const mockUseStocks = vi.fn();
vi.mock("@/features/stocks/hooks/useStocks", () => ({
  useStocks: () => mockUseStocks(),
}));

// Also mock useLikes so ProfileCard can render without side effects
vi.mock("@/features/likes/hooks/useLikes", () => ({
  useLikes: () => ({
    isLiked: () => false,
    toggle: vi.fn(),
  }),
}));

beforeEach(() => {
  localStorage.clear();
  mockUseStocks.mockReset();
});

describe("StockedProfileList", () => {
  describe("ストックなし", () => {
    it("stockedIds が空の場合は空状態メッセージを表示する", () => {
      mockUseStocks.mockReturnValue({
        stockedIds: [],
        toggle: vi.fn(),
        isStocked: () => false,
      });

      render(<StockedProfileList />);

      expect(
        screen.getByText("ストックしたプロフィールはまだありません。"),
      ).toBeInTheDocument();
    });

    it("空状態では ProfileCard が一枚も表示されない", () => {
      mockUseStocks.mockReturnValue({
        stockedIds: [],
        toggle: vi.fn(),
        isStocked: () => false,
      });

      render(<StockedProfileList />);

      // Profile cards are identified by their role="img" for the avatar
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("ストックあり", () => {
    it("ストック済みIDに対応するプロフィールが表示される", () => {
      mockUseStocks.mockReturnValue({
        // ID "1" corresponds to "佐藤 さくら" in dummyProfiles
        stockedIds: ["1"],
        toggle: vi.fn(),
        isStocked: (id: string) => id === "1",
      });

      render(<StockedProfileList />);

      expect(screen.getByText("佐藤 さくら")).toBeInTheDocument();
    });

    it("ストック済みIDに対応する男性プロフィールも表示される", () => {
      mockUseStocks.mockReturnValue({
        // ID "m1" corresponds to "高橋 けんた" in dummyMaleProfiles
        stockedIds: ["m1"],
        toggle: vi.fn(),
        isStocked: (id: string) => id === "m1",
      });

      render(<StockedProfileList />);

      expect(screen.getByText("高橋 けんた")).toBeInTheDocument();
    });

    it("複数ストック済みのプロフィールがすべて表示される", () => {
      mockUseStocks.mockReturnValue({
        stockedIds: ["1", "2", "m1"],
        toggle: vi.fn(),
        isStocked: (id: string) => ["1", "2", "m1"].includes(id),
      });

      render(<StockedProfileList />);

      expect(screen.getByText("佐藤 さくら")).toBeInTheDocument();
      expect(screen.getByText("鈴木 あおい")).toBeInTheDocument();
      expect(screen.getByText("高橋 けんた")).toBeInTheDocument();
    });

    it("ストックされていないプロフィールは表示されない", () => {
      mockUseStocks.mockReturnValue({
        // Only ID "1" is stocked; "2" is not
        stockedIds: ["1"],
        toggle: vi.fn(),
        isStocked: (id: string) => id === "1",
      });

      render(<StockedProfileList />);

      expect(screen.queryByText("鈴木 あおい")).not.toBeInTheDocument();
    });

    it("ストック済みがある場合は空状態メッセージを表示しない", () => {
      mockUseStocks.mockReturnValue({
        stockedIds: ["1"],
        toggle: vi.fn(),
        isStocked: (id: string) => id === "1",
      });

      render(<StockedProfileList />);

      expect(
        screen.queryByText("ストックしたプロフィールはまだありません。"),
      ).not.toBeInTheDocument();
    });

    it("存在しないIDはプロフィールとして表示されない", () => {
      mockUseStocks.mockReturnValue({
        // "nonexistent-id" does not match any profile
        stockedIds: ["nonexistent-id"],
        toggle: vi.fn(),
        isStocked: (id: string) => id === "nonexistent-id",
      });

      render(<StockedProfileList />);

      // Falls through to empty state since no profile matched
      expect(
        screen.getByText("ストックしたプロフィールはまだありません。"),
      ).toBeInTheDocument();
    });
  });
});