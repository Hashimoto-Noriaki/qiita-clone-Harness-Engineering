import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Profile } from "@/features/profiles/types";
import ProfileCard from "./ProfileCard";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // biome-ignore lint/performance/noImgElement: テスト用モック
    <img src={src} alt={alt} />
  ),
}));

const testProfile: Profile = {
  id: "1",
  name: "テスト太郎",
  age: 25,
  location: "東京",
  bio: "テスト用プロフィールです",
  imageUrl: "/test.jpg",
  hobbies: ["読書", "映画"],
};

beforeEach(() => {
  localStorage.clear();
});

describe("ProfileCard", () => {
  describe("プロフィール情報の表示", () => {
    it("名前・年齢・居住地・自己紹介・趣味が表示される", () => {
      // Given: テスト用プロフィール
      render(<ProfileCard profile={testProfile} />);

      // Then: プロフィールの各情報が表示される
      expect(screen.getByText("テスト太郎")).toBeInTheDocument();
      expect(screen.getByText("25歳")).toBeInTheDocument();
      expect(screen.getByText("東京")).toBeInTheDocument();
      expect(screen.getByText("テスト用プロフィールです")).toBeInTheDocument();
      expect(screen.getByText("読書")).toBeInTheDocument();
      expect(screen.getByText("映画")).toBeInTheDocument();
    });
  });

  describe("背景色デザイン", () => {
    it("カードルートにローズ/ヴァイオレット系グラデーション背景クラスが適用されている", () => {
      // Given: テスト用プロフィール
      const { container } = render(<ProfileCard profile={testProfile} />);

      // When: カードのルート要素を取得
      const card = container.firstChild as HTMLElement;

      // Then: グラデーション背景クラスが含まれる
      expect(card.className).toContain("bg-gradient-to-br");
      expect(card.className).toContain("from-rose-500");
      expect(card.className).toContain("to-violet-600");
    });

    it("趣味タグにローズ系カラークラスが適用されている", () => {
      // Given: 趣味を持つプロフィール
      render(<ProfileCard profile={testProfile} />);

      // When: 趣味タグを取得
      const hobbyTag = screen.getByText("読書");

      // Then: 半透明白のカラークラスが含まれる
      expect(hobbyTag.className).toContain("bg-white/20");
      expect(hobbyTag.className).toContain("text-white");
    });
  });

  describe("アクションボタン", () => {
    it("いいねボタンが表示される", () => {
      render(<ProfileCard profile={testProfile} />);

      expect(
        screen.getByRole("button", { name: "いいねする" }),
      ).toBeInTheDocument();
    });

    it("ストックボタンが表示される", () => {
      render(<ProfileCard profile={testProfile} />);

      expect(
        screen.getByRole("button", { name: "ストックする" }),
      ).toBeInTheDocument();
    });

    it("ストックボタンをクリックするとaria-labelが「ストックを取り消す」に変わる", () => {
      render(<ProfileCard profile={testProfile} />);

      const stockButton = screen.getByRole("button", { name: "ストックする" });
      fireEvent.click(stockButton);

      expect(
        screen.getByRole("button", { name: "ストックを取り消す" }),
      ).toBeInTheDocument();
    });

    it("ストックボタンを2回クリックするとaria-labelが「ストックする」に戻る", () => {
      render(<ProfileCard profile={testProfile} />);

      const stockButton = screen.getByRole("button", { name: "ストックする" });
      fireEvent.click(stockButton);
      fireEvent.click(screen.getByRole("button", { name: "ストックを取り消す" }));

      expect(
        screen.getByRole("button", { name: "ストックする" }),
      ).toBeInTheDocument();
    });

    it("ストック前は星アイコンがグレー色クラスを持つ", () => {
      render(<ProfileCard profile={testProfile} />);

      const stockButton = screen.getByRole("button", { name: "ストックする" });
      const star = stockButton.querySelector("span");

      expect(star?.className).toContain("text-gray-300");
    });

    it("ストック後は星アイコンが黄色クラスを持つ", () => {
      render(<ProfileCard profile={testProfile} />);

      const stockButton = screen.getByRole("button", { name: "ストックする" });
      fireEvent.click(stockButton);

      const stockedButton = screen.getByRole("button", { name: "ストックを取り消す" });
      const star = stockedButton.querySelector("span");

      expect(star?.className).toContain("text-yellow-400");
    });

    it("ストックボタンはカード左上（left-3クラス）に配置されている", () => {
      render(<ProfileCard profile={testProfile} />);

      const stockButton = screen.getByRole("button", { name: "ストックする" });

      expect(stockButton.className).toContain("left-3");
    });
  });
});
