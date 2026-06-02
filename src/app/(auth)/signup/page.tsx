import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        新規登録
      </h1>
      <SignupForm />
    </>
  );
}
