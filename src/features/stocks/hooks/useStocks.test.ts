import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useStocks } from "./useStocks";

const STORAGE_KEY = "stocked_profiles";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("useStocks", () => {
  describe("初期状態", () => {
    it("stockedIds は最初は空配列", () => {
      const { result } = renderHook(() => useStocks());
      // useEffect 前の同期的な初期値は []
      expect(result.current.stockedIds).toEqual([]);
    });

    it("localStorage が空の場合、マウント後も stockedIds は空配列", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});
      expect(result.current.stockedIds).toEqual([]);
    });

    it("localStorage に保存済みデータがある場合、マウント後に読み込む", async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["profile-1", "profile-2"]));
      const { result } = renderHook(() => useStocks());
      await act(async () => {});
      expect(result.current.stockedIds).toEqual(["profile-1", "profile-2"]);
    });
  });

  describe("toggle()", () => {
    it("ストックされていない profileId を toggle するとストック状態になる", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });

      expect(result.current.stockedIds).toContain("profile-1");
    });

    it("ストック済みの profileId を toggle するとストックが解除される", async () => {
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

    it("toggle 後に localStorage に保存される", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      expect(stored).toContain("profile-1");
    });

    it("ストック解除後に localStorage からも削除される", async () => {
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

    it("複数の profileId を個別にストックできる", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });
      act(() => {
        result.current.toggle("profile-2");
      });
      act(() => {
        result.current.toggle("profile-3");
      });

      expect(result.current.stockedIds).toContain("profile-1");
      expect(result.current.stockedIds).toContain("profile-2");
      expect(result.current.stockedIds).toContain("profile-3");
    });

    it("1つを解除しても他のストックは残る", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });
      act(() => {
        result.current.toggle("profile-2");
      });
      act(() => {
        result.current.toggle("profile-1");
      });

      expect(result.current.stockedIds).not.toContain("profile-1");
      expect(result.current.stockedIds).toContain("profile-2");
    });
  });

  describe("isStocked()", () => {
    it("ストックされていない profileId に対して false を返す", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      expect(result.current.isStocked("profile-1")).toBe(false);
    });

    it("ストック済みの profileId に対して true を返す", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });

      expect(result.current.isStocked("profile-1")).toBe(true);
    });

    it("ストック解除後は false を返す", async () => {
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      act(() => {
        result.current.toggle("profile-1");
      });
      act(() => {
        result.current.toggle("profile-1");
      });

      expect(result.current.isStocked("profile-1")).toBe(false);
    });

    it("存在しない profileId に対して false を返す（境界値）", async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["profile-1"]));
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      expect(result.current.isStocked("non-existent-id")).toBe(false);
    });
  });

  describe("localStorage エラーハンドリング", () => {
    it("localStorage に不正な JSON が保存されていても空配列で初期化される", async () => {
      localStorage.setItem(STORAGE_KEY, "invalid-json{{{");
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      expect(result.current.stockedIds).toEqual([]);
    });

    it("localStorage に null が保存されていても空配列で初期化される", async () => {
      // localStorage.getItem returns null when key doesn't exist
      localStorage.removeItem(STORAGE_KEY);
      const { result } = renderHook(() => useStocks());
      await act(async () => {});

      expect(result.current.stockedIds).toEqual([]);
    });
  });
});
