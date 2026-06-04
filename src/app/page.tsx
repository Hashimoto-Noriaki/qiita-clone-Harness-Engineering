import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-linear-to-br from-cyan-500 to-cyan-600 h-[15vh] p-3">
        <div className="flex justify-between">
          <div className="font-bold">
            <h1 className="text-3xl text-amber-500 mb-5">マッチングアプリ</h1>
            <p className="text-white text-2xl">
              素敵な人と出会えるマッチングアプリです
            </p>
          </div>
          <nav>
            <ul className="flex gap-5 text-white text-lg font-bold p-10">
              <li>
                <Link href="/guide" className="hover:text-amber-400">
                  利用説明
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-amber-400">
                  新規登録
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400">
                  ログイン
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="grow flex flex-col items-center justify-center">
        <div className="bg-linear-to-r from-rose-300 to-cyan-600 px-16 py-24 font-bold text-white w-full max-w-5xl text-center rounded-lg shadow-lg">
          <h1 className="text-5xl">マッチングアプリ</h1>
          <p className="text-3xl mt-5">
            素敵な人と出会えるマッチングアプリです
          </p>
        </div>
        <p className="text-center text-2xl p-5">
          まずは利用説明を読んでみましょう
        </p>
      </main>
    </div>
  );
}
