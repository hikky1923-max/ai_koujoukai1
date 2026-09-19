"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export default function NewPlanPage() {
  const router = useRouter();
  const { user, ready } = useUser();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return <p className="muted">読み込み中…</p>;
  if (!user)
    return (
      <div className="empty">
        <p>プランを投稿するにはログインが必要です。</p>
        <Link className="btn btn-primary" href="/login">ログイン</Link>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    const start = text("start_date") || null;
    const end = text("end_date") || null;
    if (start && end && end < start) {
      setError("終了日は開始日以降にしてください。");
      return;
    }
    const budget = text("budget_yen");

    setBusy(true);
    setError(null);
    const { data, error } = await supabase
      .from("plans")
      .insert({
        user_id: user.id,
        title: text("title"),
        destination: text("destination"),
        start_date: start,
        end_date: end,
        budget_yen: budget ? Number(budget) : null,
        description: text("description") || null,
        itinerary: text("itinerary") || null,
      })
      .select("id")
      .single();
    setBusy(false);

    if (error) setError("投稿できませんでした。入力内容を確認してもう一度お試しください。");
    else router.push(`/plans/${data.id}`);
  }

  return (
    <div className="narrow">
      <h1 className="page-title">プランを投稿</h1>
      <form onSubmit={submit} className="form">
        <label>
          タイトル
          <input name="title" maxLength={80} required placeholder="例: 京都で紅葉と湯豆腐の2泊3日" />
        </label>
        <label>
          行き先
          <input name="destination" maxLength={60} required placeholder="例: 京都" />
        </label>
        <div className="row">
          <label>
            開始日
            <input type="date" name="start_date" />
          </label>
          <label>
            終了日
            <input type="date" name="end_date" />
          </label>
        </div>
        <label>
          予算（円）
          <input type="number" name="budget_yen" min={0} step={1000} inputMode="numeric" />
        </label>
        <label>
          ひとこと紹介
          <textarea name="description" rows={3} maxLength={2000} />
        </label>
        <label>
          行程
          <textarea name="itinerary" rows={8} maxLength={5000} placeholder={"1日目: 京都駅 → 清水寺 → 祇園\n2日目: 嵐山 → 竹林の小径"} />
        </label>
        {error && <p className="notice notice-error" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>投稿する</button>
      </form>
    </div>
  );
}
