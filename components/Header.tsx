"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export default function Header() {
  const { user, ready } = useUser();

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          たびプラン
        </Link>
        <nav className="nav" aria-label="メイン">
          {ready &&
            (user ? (
              <>
                <Link className="btn btn-signal" href="/new">
                  プランを投稿
                </Link>
                <button className="btn-text" onClick={() => supabase.auth.signOut()}>
                  ログアウト
                </button>
              </>
            ) : (
              <Link className="btn btn-signal" href="/login">
                ログイン
              </Link>
            ))}
        </nav>
      </div>
    </header>
  );
}
