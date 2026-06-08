import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useStocks } from "./useStocks";

const STORAGE_KEY = "stocked_profiles";

beforeEach(() => {
  localStorage.clear();
});

describe("useStocks", () => {
  describe("初期状態", () => {
    it("localStorage が空の場合 stockedIds は空配列", () => {
      const { result } = renderHook(() => useStocks());
      expect(result.current.stockedIds).toEqual([]);
    });

    it("localStorage に保存済みのIDがあれば初期ロードされる", async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["1", "2"]));
      const { result } = renderHook(() => useStocks());
      // useEffect fires after mount
      await act(async () => {});
      expect(result.current.stockedIds).toEqual(["1", "2"]);
    });

    it("localStorage の JSON が破損している場合は空配列にフォールバックする", async () => {
      localStorage.setItem(STORAGE_KEY, "INVALID_JSON");
      const { result } = renderHook(() => useStocks());
      await act(async () => {});
      expect(result.current.stockedIds).toEqual([]);
    });
  });

  describe("toggle()", () => {
    it("未ストックのIDをトグルするとストック済みになる", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });

      expect(result.current.stockedIds).toContain("profile-1");
    });

    it("ストック済みのIDをトグルするとストックが取り消される", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });
      act(() => {
        result.current.toggle("profile-1");
      });

      expect(result.current.stockedIds).not.toContain("profile-1");
    });

    it("複数のIDを個別にストックできる", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });
      act(() => {
        result.current.toggle("profile-2");
      });

      expect(result.current.stockedIds).toContain("profile-1");
      expect(result.current.stockedIds).toContain("profile-2");
      expect(result.current.stockedIds).toHaveLength(2);
    });

    it("トグル後に localStorage へ保存される", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      expect(stored).toContain("profile-1");
    });

    it("ストック取り消し後に localStorage から削除される", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });
      act(() => {
        result.current.toggle("profile-1");
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      expect(stored).not.toContain("profile-1");
    });

    it("同じIDを偶数回トグルすると元の未ストック状態に戻る", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => result.current.toggle("x"));
      act(() => result.current.toggle("x"));
      act(() => result.current.toggle("x"));
      act(() => result.current.toggle("x"));

      expect(result.current.stockedIds).not.toContain("x");
    });
  });

  describe("isStocked()", () => {
    it("ストックされていないIDに対して false を返す", () => {
      const { result } = renderHook(() => useStocks());
      expect(result.current.isStocked("unknown")).toBe(false);
    });

    it("ストック済みのIDに対して true を返す", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });

      expect(result.current.isStocked("profile-1")).toBe(true);
    });

    it("ストック取り消し後に false を返す", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => result.current.toggle("profile-1"));
      act(() => result.current.toggle("profile-1"));

      expect(result.current.isStocked("profile-1")).toBe(false);
    });
  });
});
