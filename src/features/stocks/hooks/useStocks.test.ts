import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useStocks } from "./useStocks";

const STORAGE_KEY = "stocked_profiles";

beforeEach(() => {
  localStorage.clear();
});

describe("useStocks", () => {
  describe("初期状態", () => {
    it("localStorageが空の場合、stockedIdsは空配列を返す", async () => {
      // Given: localStorageが空
      const { result } = renderHook(() => useStocks());

      // When: useEffectが実行される
      await act(async () => {});

      // Then: 空配列
      expect(result.current.stockedIds).toEqual([]);
    });

    it("localStorageに既存データがある場合、そのIDを読み込む", async () => {
      // Given: localStorageにIDが保存済み
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["1", "m2"]));

      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // Then: 保存済みIDが返される
      expect(result.current.stockedIds).toEqual(["1", "m2"]);
    });

    it("localStorageに不正なJSONがある場合、空配列を返す", async () => {
      // Given: 不正なJSON
      localStorage.setItem(STORAGE_KEY, "invalid json{{{");

      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // Then: 空配列にフォールバック
      expect(result.current.stockedIds).toEqual([]);
    });
  });

  describe("isStocked", () => {
    it("ストックされていないプロフィールはfalseを返す", async () => {
      // Given: 空のstock状態
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // Then: ストック未登録IDはfalse
      expect(result.current.isStocked("1")).toBe(false);
    });

    it("ストック済みプロフィールはtrueを返す", async () => {
      // Given: IDが保存済み
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["1"]));
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // Then: ストック済みIDはtrue
      expect(result.current.isStocked("1")).toBe(true);
    });

    it("hydration前(undefined状態)ではfalseを返す", () => {
      // Given: useEffectが実行される前の状態
      const { result } = renderHook(() => useStocks());

      // Then: まだhydrateされていないのでfalse
      expect(result.current.isStocked("1")).toBe(false);
    });
  });

  describe("toggle - ストック追加", () => {
    it("未ストックのIDをtoggleするとstockedIdsに追加される", async () => {
      // Given: 空のstock状態
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // When: toggleを実行
      act(() => {
        result.current.toggle("1");
      });

      // Then: stockedIdsにIDが追加される
      expect(result.current.stockedIds).toContain("1");
    });

    it("toggleするとlocalStorageに保存される", async () => {
      // Given: 空のstock状態
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // When: toggleを実行
      act(() => {
        result.current.toggle("1");
      });

      // Then: localStorageに保存される
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as string[];
      expect(stored).toContain("1");
    });

    it("複数のIDを個別にtoggleして追加できる", async () => {
      // Given: 空のstock状態
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // When: 複数IDをtoggle
      act(() => {
        result.current.toggle("1");
      });
      act(() => {
        result.current.toggle("m1");
      });

      // Then: 両方が追加される
      expect(result.current.stockedIds).toContain("1");
      expect(result.current.stockedIds).toContain("m1");
    });
  });

  describe("toggle - ストック削除", () => {
    it("ストック済みIDをtoggleするとstockedIdsから削除される", async () => {
      // Given: IDが既にストック済み
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["1", "2"]));
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // When: 既存IDをtoggle
      act(() => {
        result.current.toggle("1");
      });

      // Then: IDが削除される
      expect(result.current.stockedIds).not.toContain("1");
      expect(result.current.stockedIds).toContain("2");
    });

    it("ストック解除するとlocalStorageからも削除される", async () => {
      // Given: IDが既にストック済み
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["1"]));
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // When: 既存IDをtoggle
      act(() => {
        result.current.toggle("1");
      });

      // Then: localStorageからも削除される
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as string[];
      expect(stored).not.toContain("1");
    });

    it("同じIDを2回toggleすると元の状態に戻る", async () => {
      // Given: 空のstock状態
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // When: 同じIDを2回toggle
      act(() => {
        result.current.toggle("1");
      });
      act(() => {
        result.current.toggle("1");
      });

      // Then: IDが存在しない（元の空状態）
      expect(result.current.stockedIds).not.toContain("1");
    });
  });

  describe("localStorageのエラーハンドリング", () => {
    it("localStorage.setItemが例外をスローしてもstateは更新される", async () => {
      // Given: setItemが失敗する状況
      const originalSetItem = localStorage.setItem.bind(localStorage);
      localStorage.setItem = () => {
        throw new Error("QuotaExceededError");
      };

      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      // When: toggleを実行
      act(() => {
        result.current.toggle("1");
      });

      // Then: ストレージエラーがあってもstateは更新される
      expect(result.current.stockedIds).toContain("1");

      // Cleanup
      localStorage.setItem = originalSetItem;
    });
  });
});
