export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-rose-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        {children}
      </div>
    </div>
  );
}
