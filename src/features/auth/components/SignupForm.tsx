"use client";

import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useAuth } from "../hooks/useAuth";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

function validate(
  name: string,
  email: string,
  password: string,
  confirm: string,
): FieldErrors {
  const errors: FieldErrors = {};
  if (!name) errors.name = "名前を入力してください";
  if (!email) {
    errors.email = "メールアドレスを入力してください";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "正しいメールアドレスを入力してください";
  }
  if (!password) {
    errors.password = "パスワードを入力してください";
  } else if (password.length < 8) {
    errors.password = "パスワードは8文字以上で入力してください";
  }
  if (!confirm) {
    errors.confirm = "確認用パスワードを入力してください";
  } else if (password !== confirm) {
    errors.confirm = "パスワードが一致しません";
  }
  return errors;
}

export function SignupForm() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate(name, email, password, confirm);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError("");
    setLoading(true);
    const result = signup({ name, email, password });
    setLoading(false);
    if (result.error) {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {serverError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600"
        >
          {serverError}
        </p>
      )}
      <Input
        label="名前"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={fieldErrors.name}
        autoComplete="name"
      />
      <Input
        label="メールアドレス"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        autoComplete="email"
      />
      <Input
        label="パスワード"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        autoComplete="new-password"
      />
      <Input
        label="パスワード（確認）"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={fieldErrors.confirm}
        autoComplete="new-password"
      />
      <Button type="submit" loading={loading}>
        登録する
      </Button>
      <p className="text-center text-sm text-gray-500">
        すでにアカウントをお持ちの方は{" "}
        <a href="/login" className="text-rose-500 hover:underline">
          ログイン
        </a>
      </p>
    </form>
  );
}
