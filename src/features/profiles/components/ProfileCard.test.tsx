import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Profile } from "@/features/profiles/types";
import ProfileCard from "./ProfileCard";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // biome-ignore lint/performance/noImgElement: next/image mock for testing
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
      // Given: テスト用プロフィール
      render(<ProfileCard profile={testProfile} />);

      // Then: いいねボタンが表示される
      expect(
        screen.getByRole("button", { name: "いいねする" }),
      ).toBeInTheDocument();
    });
  });

  describe("ストックボタン", () => {
    it("ストックボタンが表示される", () => {
      // Given: テスト用プロフィール
      render(<ProfileCard profile={testProfile} />);

      // Then: ストックボタンが表示される
      expect(
        screen.getByRole("button", { name: "ストックする" }),
      ).toBeInTheDocument();
    });

    it("初期状態でストックボタンのaria-labelは「ストックする」", () => {
      // Given: localStorageが空
      render(<ProfileCard profile={testProfile} />);

      // Then: 未ストック状態のラベル
      expect(
        screen.getByRole("button", { name: "ストックする" }),
      ).toBeInTheDocument();
    });

    it("ストックボタンをクリックするとストック済み状態になる", () => {
      // Given: テスト用プロフィール
      render(<ProfileCard profile={testProfile} />);
      const stockButton = screen.getByRole("button", { name: "ストックする" });

      // When: ストックボタンをクリック
      fireEvent.click(stockButton);

      // Then: aria-labelが「ストックを取り消す」に変わる
      expect(
        screen.getByRole("button", { name: "ストックを取り消す" }),
      ).toBeInTheDocument();
    });

    it("ストック済み状態のボタンを再クリックするとストック解除される", () => {
      // Given: テスト用プロフィール
      render(<ProfileCard profile={testProfile} />);
      const stockButton = screen.getByRole("button", { name: "ストックする" });
      fireEvent.click(stockButton);

      // When: 再度クリック
      const stockedButton = screen.getByRole("button", { name: "ストックを取り消す" });
      fireEvent.click(stockedButton);

      // Then: aria-labelが「ストックする」に戻る
      expect(
        screen.getByRole("button", { name: "ストックする" }),
      ).toBeInTheDocument();
    });

    it("ストック済みの場合、★アイコンが黄色になる", () => {
      // Given: テスト用プロフィール
      render(<ProfileCard profile={testProfile} />);
      const stockButton = screen.getByRole("button", { name: "ストックする" });

      // When: ストックボタンをクリック
      fireEvent.click(stockButton);

      // Then: ★スパンのクラスにtext-yellow-400が含まれる
      const starSpan = screen.getByText("★");
      expect(starSpan.className).toContain("text-yellow-400");
    });

    it("未ストック状態では★アイコンがグレーになる", () => {
      // Given: テスト用プロフィール（ストックなし）
      render(<ProfileCard profile={testProfile} />);

      // Then: ★スパンのクラスにtext-gray-300が含まれる
      const starSpan = screen.getByText("★");
      expect(starSpan.className).toContain("text-gray-300");
    });

    it("ストックするとlocalStorageに保存される", () => {
      // Given: テスト用プロフィール
      render(<ProfileCard profile={testProfile} />);
      const stockButton = screen.getByRole("button", { name: "ストックする" });

      // When: ストックボタンをクリック
      fireEvent.click(stockButton);

      // Then: localStorageに保存される
      const stored = JSON.parse(
        localStorage.getItem("stocked_profiles") ?? "[]",
      ) as string[];
      expect(stored).toContain("1");
    });

    it("localStorageに既存ストックがある場合、初期状態で「ストックを取り消す」ラベルになる", () => {
      // Given: localStorageに既存ストック
      localStorage.setItem("stocked_profiles", JSON.stringify(["1"]));

      render(<ProfileCard profile={testProfile} />);

      // Then: 初期状態でストック済みラベルが表示される
      expect(
        screen.getByRole("button", { name: "ストックを取り消す" }),
      ).toBeInTheDocument();
    });
  });
});
