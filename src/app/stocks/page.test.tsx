import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StocksPage from "./page";

vi.mock("@/features/stocks/components/StockedProfileList", () => ({
  default: () => <div data-testid="stocked-profile-list" />,
}));

describe("StocksPage", () => {
  it("「ストック一覧」見出しが表示される", () => {
    render(<StocksPage />);

    expect(
      screen.getByRole("heading", { name: "ストック一覧" }),
    ).toBeInTheDocument();
  });

  it("StockedProfileList コンポーネントが描画される", () => {
    render(<StocksPage />);

    expect(screen.getByTestId("stocked-profile-list")).toBeInTheDocument();
  });

  it("ページコンテンツが main 要素内にある", () => {
    render(<StocksPage />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toContainElement(
      screen.getByRole("heading", { name: "ストック一覧" }),
    );
  });
});