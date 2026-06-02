import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./LoginForm";

const mockLogin = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("フォームの入力フィールドが表示される", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログイン" }),
    ).toBeInTheDocument();
  });

  it("メールアドレスが空のとき validation エラーを表示する", async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    await waitFor(() => {
      expect(
        screen.getByText("メールアドレスを入力してください"),
      ).toBeInTheDocument();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("メールアドレスが不正な形式のとき validation エラーを表示する", async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    await waitFor(() => {
      expect(
        screen.getByText("正しいメールアドレスを入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("パスワードが空のとき validation エラーを表示する", async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    await waitFor(() => {
      expect(
        screen.getByText("パスワードを入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("ログイン失敗時にサーバーエラーを表示する", async () => {
    mockLogin.mockReturnValue({
      error: "メールアドレスまたはパスワードが正しくありません",
    });
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "メールアドレスまたはパスワードが正しくありません",
      );
    });
  });

  it("ログイン成功時に login() が呼ばれる", async () => {
    mockLogin.mockReturnValue({});
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
