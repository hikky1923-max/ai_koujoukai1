"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<{ text: string; kind: "error" | "info" } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage({ text: "メールアドレスまたはパスワードが違います。", kind: "error" });
      else router.push("/");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } },
      });
      if (error) setMessage({ text: `登録できませんでした: ${error.message}`, kind: "error" });
      else if (!data.session)
        setMessage({ text: "確認メールを送りました。メール内のリンクを開いてからログインしてください。", kind: "info" });
      else router.push("/");
    }
    setBusy(false);
  }

  return (
    <div className="narrow">
      <h1 className="page-title">{mode === "login" ? "ログイン" : "アカウントを作成"}</h1>
      <form onSubmit={submit} className="form">
        {mode === "signup" && (
          <label>
            表示名
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} required />
          </label>
        )}
        <label>
          メールアドレス
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label>
          パスワード（6文字以上）
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
        </label>
        {message && (
          <p className={`notice ${message.kind === "error" ? "notice-error" : ""}`} role="alert">
            {message.text}
          </p>
        )}
        <button className="btn btn-primary" disabled={busy}>
          {mode === "login" ? "ログイン" : "アカウントを作成"}
        </button>
      </form>
      <p className="muted switch">
        {mode === "login" ? "はじめての方は " : "アカウントをお持ちの方は "}
        <button className="btn-text" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(null); }}>
          {mode === "login" ? "アカウントを作成" : "ログイン"}
        </button>
      </p>
    </div>
  );
}
