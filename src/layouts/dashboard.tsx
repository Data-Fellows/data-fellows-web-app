import { getUser, removeToken, removeUser } from "@/helpers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  FiBriefcase,
  FiDollarSign,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiUser,
} from "react-icons/fi";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const userItems = [
  { title: "Dashboard", href: "/", icon: FiHome },
  { title: "Problems", href: "/user/problems", icon: FiBriefcase },
  { title: "Matched", href: "/user/matched", icon: FiMessageSquare },
  { title: "Payments", href: "/user/payments", icon: FiDollarSign },
  { title: "Profile", href: "/user/profile", icon: FiUser },
  { title: "Settings", href: "/user/settings", icon: FiSettings },
];

const employerItems = [
  { title: "Dashboard", href: "/", icon: FiHome },
  { title: "Problems", href: "/employer/problems", icon: FiBriefcase },
  { title: "Matched", href: "/employer/matched", icon: FiMessageSquare },
  { title: "Payments", href: "/employer/payments", icon: FiDollarSign },
  { title: "Profile", href: "/employer/profile", icon: FiUser },
  { title: "Settings", href: "/employer/settings", icon: FiSettings },
];

// Filter out settings for mobile nav
function getMobileItems(items: any[]) {
  return items.filter((item) => item.title !== "Settings").slice(0, 5);
}

function SidebarMenuItem({ href, icon: Icon, title, isActive, onClick }: any) {
  return (
    <li>
      <Link href={href} passHref legacyBehavior>
        <a
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium group",
            isActive
              ? "bg-primary text-white"
              : "hover:bg-muted hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
          )}
          onClick={onClick}
        >
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition",
              isActive
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:text-primary"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "text-white")} />
          </span>
          <span className={isActive ? "text-white" : ""}>{title}</span>
        </a>
      </Link>
    </li>
  );
}

function Sidebar({ items, onLogout, activePath, onClose }: any) {
  return (
    <aside className="hidden md:flex flex-col min-h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-primary/10 dark:bg-sidebar dark:text-sidebar-foreground">
      <div className="flex flex-col items-center py-6">
        <Image src="/svgs/data-fellow.svg" height={80} width={80} alt="logo" />
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
      <div className="p-4 border-t border-primary/10 dark:border-border">
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
  );
}

function MobileTabBar({ items, activePath }: any) {
  const mobileItems = getMobileItems(items);
  return (
    <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 flex md:hidden bg-primary/10 dark:bg-sidebar dark:border-border rounded-full px-2 py-1 w-[95%] max-w-xl mx-auto">
      {mobileItems.map((item: any) => {
        const isActive =
          activePath === item.href || activePath.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link href={item.href} key={item.title} passHref legacyBehavior>
            <a
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
            </a>
          </Link>
        );
      })}
    </nav>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  const user = getUser();
  const role = user?.userType === "employer" ? "employer" : "user";
  const items = role === "employer" ? employerItems : userItems;

  const handleLogout = () => {
    removeToken();
    removeUser();
    router.replace("/auth/sign-in");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        items={items}
        onLogout={handleLogout}
        activePath={router.asPath}
        onClose={() => {}}
      />

      <main className="flex-1 pb-24 md:pb-4 md:ml-64">{children}</main>

      <MobileTabBar items={items} activePath={router.asPath} />
    </div>
  );
}
