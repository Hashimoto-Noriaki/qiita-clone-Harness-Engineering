"use client";

import { useRouter } from "next/navigation";
import type { LoginInput, SignupInput, User } from "../types";

const STORAGE_KEY = "auth_users";
const SESSION_KEY = "auth_session";

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as User[]) : [];
}

function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function useAuth() {
  const router = useRouter();

  function login(input: LoginInput): { error?: string } {
    const users = getUsers();
    const user = users.find((u) => u.email === input.email);
    if (!user) {
      return { error: "メールアドレスまたはパスワードが正しくありません" };
    }
    const stored = localStorage.getItem(`pwd_${user.id}`);
    if (stored !== input.password) {
      return { error: "メールアドレスまたはパスワードが正しくありません" };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    router.push("/");
    return {};
  }

  function signup(input: SignupInput): { error?: string } {
    const users = getUsers();
    if (users.some((u) => u.email === input.email)) {
      return { error: "このメールアドレスはすでに登録されています" };
    }
    const user: User = {
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name,
    };
    localStorage.setItem(`pwd_${user.id}`, input.password);
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
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  return { login, signup, logout, currentUser };
}
