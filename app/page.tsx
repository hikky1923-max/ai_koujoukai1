"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PlanCard from "@/components/PlanCard";
import { supabase } from "@/lib/supabase";
import { PLAN_SELECT, type Plan } from "@/lib/types";

export default function FeedPage() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("plans")
      .select(PLAN_SELECT)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) setError("プランを読み込めませんでした。時間をおいて再読み込みしてください。");
        else setPlans((data ?? []) as unknown as Plan[]);
      });
  }, []);

  return (
    <>
      <h1 className="page-title">みんなの旅行プラン</h1>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      {!error && plans === null && <p className="muted">読み込み中…</p>}
      {plans && plans.length === 0 && (
        <div className="empty">
          <p>まだプランがありません。</p>
          <Link className="btn btn-primary" href="/new">最初のプランを投稿</Link>
        </div>
      )}
      <div className="stack">
        {plans?.map((p) => <PlanCard key={p.id} plan={p} />)}
      </div>
    </>
  );
}
