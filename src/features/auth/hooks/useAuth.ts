"use client";

import { useRouter } from "next/navigation";
import type { LoginInput, SignupInput, User } from "../types";

const STORAGE_KEY = "auth_users";
const SESSION_KEY = "auth_session";

function safeParse<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  return safeParse<User[]>(STORAGE_KEY, []);
}

function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function useAuth() {
  const router = useRouter();

  async function login(input: LoginInput): Promise<{ error?: string }> {
    const users = getUsers();
    const user = users.find((u) => u.email === input.email);
    if (!user) {
      return { error: "メールアドレスまたはパスワードが正しくありません" };
    }
    const stored = localStorage.getItem(`pwd_${user.id}`);
    const hash = await hashPassword(input.password);
    if (stored !== hash) {
      return { error: "メールアドレスまたはパスワードが正しくありません" };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    router.push("/");
    return {};
  }

  async function signup(input: SignupInput): Promise<{ error?: string }> {
    const users = getUsers();
    if (users.some((u) => u.email === input.email)) {
      return { error: "このメールアドレスはすでに登録されています" };
    }
    const user: User = {
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name,
    };
    const hash = await hashPassword(input.password);
    localStorage.setItem(`pwd_${user.id}`, hash);
    saveUsers([...users, user]);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    router.push("/");
    return {};
  }

  function logout(): void {
    localStorage.removeItem(SESSION_KEY);
    router.push("/login");
  }

  function currentUser(): User | null {
    if (typeof window === "undefined") return null;
    return safeParse<User | null>(SESSION_KEY, null);
  }

  return { login, signup, logout, currentUser };
}
