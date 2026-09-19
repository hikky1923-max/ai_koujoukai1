import Link from "next/link";
import LikeButton from "./LikeButton";
import { formatMD, formatYen } from "@/lib/format";
import type { Plan } from "@/lib/types";

export function DateRoute({ start, end }: { start: string | null; end: string | null }) {
  const s = formatMD(start);
  const e = formatMD(end);
  if (!s && !e) return <p className="route route-empty">日程は未定</p>;
  if (s && (!e || e === s)) return <p className="route"><span>{s}</span></p>;
  return (
    <p className="route" aria-label={`${s ?? ""}から${e ?? ""}まで`}>
      <span>{s ?? "?"}</span>
      <i aria-hidden="true" />
      <span>{e}</span>
    </p>
  );
}

export default function PlanCard({ plan }: { plan: Plan }) {
  const budget = formatYen(plan.budget_yen);
  return (
    <article className="card">
      <p className="card-dest">{plan.destination}</p>
      <h2 className="card-title">
        <Link href={`/plans/${plan.id}`}>{plan.title}</Link>
      </h2>
      <DateRoute start={plan.start_date} end={plan.end_date} />
      {plan.description && <p className="card-desc">{plan.description}</p>}
      <div className="card-foot">
        <span className="meta">
          {plan.profiles?.display_name ?? "匿名"}
          {budget ? `　予算 ${budget}` : ""}
        </span>
        <LikeButton planId={plan.id} initialLikers={plan.likes.map((l) => l.user_id)} />
      </div>
    </article>
  );
}
