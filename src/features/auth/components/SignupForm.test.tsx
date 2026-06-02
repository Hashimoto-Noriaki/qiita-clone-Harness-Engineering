import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignupForm } from "./SignupForm";

const mockSignup = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ signup: mockSignup }),
}));

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("フォームの入力フィールドが表示される", () => {
    render(<SignupForm />);
    expect(screen.getByLabelText("名前")).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード（確認）")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "登録する" }),
    ).toBeInTheDocument();
  });

  it("名前が空のとき validation エラーを表示する", async () => {
    render(<SignupForm />);
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));
    await waitFor(() => {
      expect(screen.getByText("名前を入力してください")).toBeInTheDocument();
    });
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it("パスワードが8文字未満のとき validation エラーを表示する", async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText("名前"), {
      target: { value: "テスト太郎" },
    });
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText("パスワード（確認）"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));
    await waitFor(() => {
      expect(
        screen.getByText("パスワードは8文字以上で入力してください"),
      ).toBeInTheDocument();
    });
  });

  it("パスワードが一致しないとき validation エラーを表示する", async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText("名前"), {
      target: { value: "テスト太郎" },
    });
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("パスワード（確認）"), {
      target: { value: "different!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));
    await waitFor(() => {
      expect(screen.getByText("パスワードが一致しません")).toBeInTheDocument();
    });
  });

  it("登録失敗時にサーバーエラーを表示する", async () => {
    mockSignup.mockReturnValue({
      error: "このメールアドレスはすでに登録されています",
    });
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText("名前"), {
      target: { value: "テスト太郎" },
    });
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("パスワード（確認）"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "このメールアドレスはすでに登録されています",
      );
    });
  });

  it("登録成功時に signup() が正しい引数で呼ばれる", async () => {
    mockSignup.mockReturnValue({});
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText("名前"), {
      target: { value: "テスト太郎" },
    });
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("パスワード（確認）"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "登録する" }));
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        name: "テスト太郎",
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
