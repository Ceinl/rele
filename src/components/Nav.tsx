"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut, Library, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Nav({ role, name }: { role: string; name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/categories", label: "Categories", icon: Library },
  ];

  return (
    <nav className="border-b border-border bg-abyss/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/categories"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-wide text-chalk transition-colors hover:text-amber"
        >
          <BookOpen className="h-5 w-5 text-amber" strokeWidth={1.5} />
          Rele
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all duration-200",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-amber/10 text-amber"
                  : "text-ash hover:text-chalk hover:bg-elevated"
              )}
            >
              <link.icon className="h-4 w-4" strokeWidth={1.5} />
              {link.label}
            </Link>
          ))}

          <div className="mx-2 h-4 w-px bg-border" />

          <span className="text-xs text-muted">{name}</span>

          <form action="/logout" method="POST">
            <button
              type="submit"
              className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted transition-all duration-200 hover:text-ember-light hover:bg-ember/10"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </form>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-muted hover:text-chalk hover:bg-elevated transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-abyss px-4 pb-4">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-amber/10 text-amber"
                    : "text-ash hover:text-chalk hover:bg-elevated"
                )}
              >
                <link.icon className="h-4 w-4" strokeWidth={1.5} />
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-border">
              <span className="text-xs text-muted">{name}</span>
              <form action="/logout" method="POST">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted hover:text-ember-light hover:bg-ember/10 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}