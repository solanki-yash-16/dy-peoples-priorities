"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifySession } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];

    if (token && verifySession(token)) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-white text-sm">Loading...</div>
    </div>
  );
}
