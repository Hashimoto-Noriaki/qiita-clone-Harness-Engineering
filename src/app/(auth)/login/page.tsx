import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        ログイン
      </h1>
      <LoginForm />
    </>
  );
}
