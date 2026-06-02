"use client";

import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useAuth } from "../hooks/useAuth";

type FieldErrors = {
  email?: string;
  password?: string;
};

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email) {
    errors.email = "メールアドレスを入力してください";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "正しいメールアドレスを入力してください";
  }
  if (!password) {
    errors.password = "パスワードを入力してください";
  }
  return errors;
}

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate(email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError("");
    setLoading(true);
    const result = await login({ email, password });
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
        autoComplete="current-password"
      />
      <Button type="submit" loading={loading}>
        ログイン
      </Button>
      <p className="text-center text-sm text-gray-500">
        アカウントをお持ちでない方は{" "}
        <a href="/signup" className="text-rose-500 hover:underline">
          新規登録
        </a>
      </p>
    </form>
  );
}
