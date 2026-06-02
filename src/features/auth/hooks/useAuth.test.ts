import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "./useAuth";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => {
  localStorage.clear();
  mockPush.mockClear();
});

describe("useAuth", () => {
  describe("signup()", () => {
    it("新規ユーザーを登録できる", async () => {
      const { result } = renderHook(() => useAuth());
      let ret: { error?: string };
      await act(async () => {
        ret = await result.current.signup({
          email: "test@example.com",
          password: "password123",
          name: "テストユーザー",
        });
      });
      expect(ret?.error).toBeDefined();
      const users = JSON.parse(localStorage.getItem("auth_users") ?? "[]");
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe("test@example.com");
    });

    it("重複メールアドレスはエラーを返す", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signup({
          email: "dup@example.com",
          password: "password123",
          name: "ユーザー1",
        });
      });
      let ret: { error?: string };
      await act(async () => {
        ret = await result.current.signup({
          email: "dup@example.com",
          password: "password456",
          name: "ユーザー2",
        });
      });
      expect(ret?.error).toBeDefined();
    });

    it("登録成功後に / へリダイレクトする", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signup({
          email: "test@example.com",
          password: "password123",
          name: "テスト",
        });
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  describe("login()", () => {
    it("存在しないユーザーはエラーを返す", async () => {
      const { result } = renderHook(() => useAuth());
      let ret: { error?: string };
      await act(async () => {
        ret = await result.current.login({
          email: "nobody@example.com",
          password: "password123",
        });
      });
      expect(ret?.error).toBeDefined();
    });

    it("パスワード不一致はエラーを返す", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signup({
          email: "user@example.com",
          password: "correct",
          name: "ユーザー",
        });
      });
      let ret: { error?: string };
      await act(async () => {
        ret = await result.current.login({
          email: "user@example.com",
          password: "wrong",
        });
      });
      expect(ret?.error).toBeDefined();
    });

    it("正しい認証情報でログインできる", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signup({
          email: "user@example.com",
          password: "password123",
          name: "ユーザー",
        });
      });
      mockPush.mockClear();
      let ret: { error?: string };
      await act(async () => {
        ret = await result.current.login({
          email: "user@example.com",
          password: "password123",
        });
      });
      expect(ret?.error).toBeUndefined();
      expect(localStorage.getItem("auth_session")).not.toBeNull();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  describe("破損した localStorage からのフォールバック", () => {
    it("auth_users が不正な JSON でも signup が正常動作する", async () => {
      localStorage.setItem("auth_users", "INVALID_JSON");
      const { result } = renderHook(() => useAuth());
      let ret: { error?: string };
      await act(async () => {
        ret = await result.current.signup({
          email: "test@example.com",
          password: "password123",
          name: "テスト",
        });
      });
      expect(ret?.error).toBeUndefined();
      expect(localStorage.getItem("auth_users")).not.toBe("INVALID_JSON");
    });

    it("auth_session が不正な JSON でも currentUser が null を返す", () => {
      localStorage.setItem("auth_session", "{broken");
      const { result } = renderHook(() => useAuth());
      expect(result.current.currentUser()).toBeNull();
      expect(localStorage.getItem("auth_session")).toBeNull();
    });
  });

  describe("currentUser()", () => {
    it("未ログイン時は null を返す", () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.currentUser()).toBeNull();
    });

    it("ログイン後はユーザーを返す", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signup({
          email: "user@example.com",
          password: "password123",
          name: "ユーザー",
        });
      });
      const user = result.current.currentUser();
      expect(user?.email).toBe("user@example.com");
      expect(user?.name).toBe("ユーザー");
    });
  });

  describe("logout()", () => {
    it("セッションをクリアして /login へリダイレクトする", async () => {
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signup({
          email: "user@example.com",
          password: "password123",
          name: "ユーザー",
        });
      });
      act(() => {
        result.current.logout();
      });
      expect(localStorage.getItem("auth_session")).toBeNull();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});
