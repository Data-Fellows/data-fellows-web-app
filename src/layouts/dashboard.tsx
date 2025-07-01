import { clearCookies, getToken, getUser } from "@/helpers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import {
  FiBell,
  FiBriefcase,
  FiChevronDown,
  FiDollarSign,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const userItems = [
  { title: "Dashboard", href: "/dashboard/home", icon: FiHome },
  { title: "Problems", href: "/dashboard/problems", icon: FiBriefcase },
  { title: "Matches", href: "/dashboard/matches", icon: FiMessageSquare },
  { title: "Payments", href: "/dashboard/payments", icon: FiDollarSign },
  { title: "Profile", href: "/dashboard/profile", icon: FiUser },
  { title: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

const employerItems = [
  { title: "Dashboard", href: "/dashboard/home", icon: FiHome },
  { title: "Problems", href: "/dashboard/problems", icon: FiBriefcase },
  { title: "Matches", href: "/dashboard/matches", icon: FiMessageSquare },
  { title: "Payments", href: "/dashboard/payments", icon: FiDollarSign },
  { title: "Profile", href: "/dashboard/profile", icon: FiUser },
  { title: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

function getMobileItems(items: any[]) {
  return items.filter((item) => item.title !== "Settings").slice(0, 5);
}

function SidebarMenuItem({ href, icon: Icon, title, isActive, onClick }: any) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium group",
          isActive
            ? "bg-primary/30 text-white"
            : "hover:bg-muted hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
        )}
        onClick={onClick}
      >
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition",
            isActive
              ? "bg-primary text-foreground"
              : "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:text-primary"
          )}
        >
          <Icon className={cn("h-5 w-5", isActive && "text-white")} />
        </span>
        <span
          className={isActive ? "text-foreground font-bold text-sm" : "text-sm"}
        >
          {title}
        </span>
      </Link>
    </li>
  );
}

function Sidebar({ items, onLogout, activePath, onClose, isOpen }: any) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed md:relative z-50 md:z-auto flex flex-col min-h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-primary/10 dark:bg-sidebar dark:text-sidebar-foreground transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="hidden md:flex flex-col items-center py-6">
          <Image
            src="/svgs/data-fellow.svg"
            height={50}
            width={50}
            alt="logo"
          />
        </div>

        <nav className="flex-1">
          <ul className="space-y-3 px-2 mx-2">
            {items.map((item: any) => (
              <SidebarMenuItem
                key={item.title}
                href={item.href}
                icon={item.icon}
                title={item.title}
                isActive={
                  activePath === item.href || activePath.startsWith(item.href)
                }
                onClick={onClose}
              />
            ))}
          </ul>
        </nav>

        {/* Desktop Logout Button */}
        <div className="hidden md:block p-4 border-t border-primary/10 dark:border-border">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-destructive/15 text-destructive font-semibold hover:bg-destructive/25 transition"
            onClick={onLogout}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15">
              <FiLogOut className="h-5 w-5 text-destructive" />
            </span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function MobileTabBar({ items, activePath }: any) {
  const mobileItems = getMobileItems(items);
  return (
    <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 flex md:hidden bg-card  rounded-full px-2 py-1 w-[95%] max-w-xl mx-auto shadow-lg">
      {mobileItems.map((item: any) => {
        const isActive =
          activePath === item.href || activePath.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            href={item.href}
            key={item.title}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-2 px-1 mx-1 rounded-3xl transition",
              isActive ? "" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6 mb-1",
                isActive && "text-primary scale-110"
              )}
            />
            <span
              className={cn(
                "text-[10px]",
                isActive && "text-primary scale-110"
              )}
            >
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function Navbar({ user, onLogout }: any) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.email?.[0]?.toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown="profile"]')) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isProfileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Logo - Show only on mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Image
              src="/svgs/data-fellow.svg"
              height={32}
              width={32}
              alt="logo"
            />
            <span className="font-bold text-lg text-foreground">
              Data Fellows
            </span>
          </div>

          {/* Search Bar - Desktop only */}
          <div className="hidden md:flex items-center relative">
            <FiSearch className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search problems, candidates..."
              className="pl-10 pr-4 py-2 w-80 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
              <FiBell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full animate-pulse"></span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative" data-dropdown="profile">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-primary">
                    {userInitials}
                  </span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.firstName || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.userType || "Member"}
                </p>
              </div>
              <FiChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform hidden md:block",
                  isProfileMenuOpen && "rotate-180"
                )}
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-foreground">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium capitalize">
                      {user?.userType}
                    </div>
                    {user?.verified && (
                      <div className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                        Verified
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors w-full"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <FiSettings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </div>

                <div className="p-2 border-t border-border">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors w-full"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    const token = getToken();

    if (!user || !token) {
      window.location.href = "/auth/sign-in";
      return;
    }
  }, [router.pathname]);

  const user = getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const role = user?.userType === "employer" ? "employer" : "user";
  const items = role === "employer" ? employerItems : userItems;

  const handleLogout = () => {
    clearCookies();
    setTimeout(() => {
      window.location.href = "/auth/sign-in";
    }, 100);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="hidden md:block">
        <Sidebar
          items={items}
          onLogout={handleLogout}
          activePath={router.asPath}
          onClose={() => {}}
          isOpen={false}
        />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto pb-24 md:pb-4 scrollbar-hide">
          {children}
        </main>
      </div>{" "}
      <MobileTabBar items={items} activePath={router.asPath} />
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardContent>{children}</DashboardContent>;
}
