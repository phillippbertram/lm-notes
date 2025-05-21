"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function NavHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          LMNotes
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
