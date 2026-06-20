"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import {
  LayoutDashboard,
  Search,
  Type,
  LayoutGrid,
  Menu as MenuIcon,
  Newspaper,
  Briefcase,
  Users,
  Star,
  FileText,
  Settings,
  X,
} from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

type NavItem = { label: string; href: string; icon: ComponentType<{ className?: string }>; match?: string };

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "SEO & search", href: "/admin/seo", icon: Search },
  { label: "Page text", href: "/admin/copy", icon: Type },
  { label: "Sections", href: "/admin/sections", icon: LayoutGrid },
  { label: "Navigation", href: "/admin/nav", icon: MenuIcon },
  { label: "Blog", href: "/admin#blog", icon: Newspaper, match: "/admin/edit/blog" },
  { label: "Case studies", href: "/admin#case-studies", icon: Briefcase, match: "/admin/edit/case-studies" },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Legal", href: "/admin/legal", icon: FileText },
  { label: "Site settings", href: "/admin/settings", icon: Settings },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/admin") return pathname === "/admin";
  return pathname.startsWith(item.match ?? item.href);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = isActive(pathname, item);
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-ink text-white" : "text-ink/80 hover:bg-cream hover:text-ink"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-muted"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Drawer behaviour: lock body scroll, close on Escape, and close if the
  // viewport grows to desktop (where the drawer is CSS-hidden anyway).
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mql.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mql.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onChange);
    };
  }, [open]);

  // The login page gets a minimal branded header (no sidebar / search / logout).
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-cream/40 text-ink">
        <header className="border-b border-line bg-white">
          <div className="mx-auto max-w-5xl px-5 py-3.5">
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">
              Alpha <span className="text-bronze">CMS</span>
            </span>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-5 py-8 sm:py-10">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/40 text-ink">
      <AdminTopBar onMenu={() => setOpen(true)} />
      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar — desktop */}
        <aside className="hidden w-60 shrink-0 self-start border-r border-line bg-white lg:sticky lg:top-[63px] lg:block lg:h-[calc(100vh-63px)] lg:overflow-y-auto">
          <NavLinks pathname={pathname} />
        </aside>

        {/* Sidebar — mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-ink/40"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute left-0 top-0 h-full w-64 max-w-[80vw] overflow-y-auto bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="font-display text-base font-extrabold text-ink">
                  Alpha <span className="text-bronze">CMS</span>
                </span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-muted hover:text-ink">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
