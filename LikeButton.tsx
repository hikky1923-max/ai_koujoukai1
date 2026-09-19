"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export default function LikeButton({
  planId,
  initialLikers,
}: {
  planId: string;
  initialLikers: string[];
}) {
  const { user } = useUser();
  const router = useRouter();
  const [likers, setLikers] = useState(initialLikers);
  const liked = !!user && likers.includes(user.id);

  async function toggle() {
    if (!user) {
      router.push("/login");
      return;
    }
    const previous = likers;
    setLikers(liked ? likers.filter((id) => id !== user.id) : [...likers, user.id]);

    const { error } = liked
      ? await supabase.from("likes").delete().eq("plan_id", planId).eq("user_id", user.id)
      : await supabase.from("likes").insert({ plan_id: planId, user_id: user.id });

    if (error) setLikers(previous);
  }

  return (
    <button
      type="button"
      className={`like ${liked ? "is-liked" : ""}`}
      aria-pressed={liked}
      onClick={toggle}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2 0 3.6 1.1 5.4 3.1 1.8-2 3.4-3.1 5.4-3.1 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <span>いいね</span>
      <span className="like-count">{likers.length}</span>
    </button>
  );
}
