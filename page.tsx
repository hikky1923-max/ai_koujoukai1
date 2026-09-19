"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import { DateRoute } from "@/components/PlanCard";
import { formatYen } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { PLAN_SELECT, type Plan } from "@/lib/types";

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    supabase
      .from("plans")
      .select(PLAN_SELECT)
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPlan(data as unknown as Plan);
          setState("ready");
        } else setState("missing");
      });
  }, [id]);

  async function remove() {
    if (!plan || !confirm("このプランを削除しますか？")) return;
    const { error } = await supabase.from("plans").delete().eq("id", plan.id);
    if (!error) router.push("/");
  }

  if (state === "loading") return <p className="muted">読み込み中…</p>;
  if (state === "missing" || !plan)
    return (
      <div className="empty">
        <p>このプランは見つかりませんでした。削除された可能性があります。</p>
        <Link className="btn btn-primary" href="/">プラン一覧へ</Link>
      </div>
    );

  const budget = formatYen(plan.budget_yen);

  return (
    <article className="detail">
      <p className="card-dest">{plan.destination}</p>
      <h1 className="page-title">{plan.title}</h1>
      <DateRoute start={plan.start_date} end={plan.end_date} />
      <p className="meta">
        {plan.profiles?.display_name ?? "匿名"}
        {budget ? `　予算 ${budget}` : ""}
      </p>
      {plan.description && <p className="detail-desc">{plan.description}</p>}
      {plan.itinerary && (
        <section>
          <h2 className="section-title">行程</h2>
          <p className="itinerary">{plan.itinerary}</p>
        </section>
      )}
      <div className="detail-actions">
        <LikeButton planId={plan.id} initialLikers={plan.likes.map((l) => l.user_id)} />
        {user?.id === plan.user_id && (
          <button className="btn-text danger" onClick={remove}>削除</button>
        )}
      </div>
    </article>
  );
}
