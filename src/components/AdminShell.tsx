import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Sparkles,
  FlaskConical,
  MessageSquareText,
  Building2,
  ShieldCheck,
  ScrollText,
  Lock,
  Moon,
  Sun,
  ArrowLeftRight,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TAT_CA_DOMAIN, chonDomain, useAdmin } from "@/lib/admin-store";
import {
  apDungCaiDat,
  capNhatCaiDat,
  chuCaiDau,
  napTaiKhoan,
  useTaiKhoan,
} from "@/lib/tai-khoan-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", nhan: "Tổng quan", icon: LayoutDashboard, exact: true },
  { to: "/admin/knowledge-studio", nhan: "Knowledge Studio", icon: Sparkles },
  { to: "/admin/danh-gia", nhan: "Đánh giá chất lượng", icon: FlaskConical },
  { to: "/admin/phan-hoi", nhan: "Phân tích phản hồi", icon: MessageSquareText },
  { to: "/admin/to-chuc", nhan: "Tổ chức & Lĩnh vực", icon: Building2 },
  { to: "/admin/phan-quyen", nhan: "Phân quyền", icon: ShieldCheck },
  { to: "/admin/audit", nhan: "Nhật ký kiểm toán", icon: ScrollText },
  { to: "/admin/tuan-thu", nhan: "Tuân thủ dữ liệu", icon: Lock },
] as const;

function NutDoiGiaoDien() {
  const caiDat = useTaiKhoan().caiDat;
  const dangToi =
    caiDat.giaoDien === "toi" ||
    (caiDat.giaoDien === "theo-may" &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-lg"
      aria-label={dangToi ? "Chuyển nền sáng" : "Chuyển nền tối"}
      onClick={() => capNhatCaiDat({ giaoDien: dangToi ? "sang" : "toi" })}
    >
      {dangToi ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </Button>
  );
}

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const domainId = useAdmin((s) => s.domainId);
  const { nguoiDung, caiDat } = useTaiKhoan();
  const navigate = useNavigate();

  useEffect(() => {
    napTaiKhoan();
  }, []);
  useEffect(() => {
    apDungCaiDat(caiDat);
  }, [caiDat]);

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
          <span className="flex size-8 items-center justify-center rounded-lg bg-hero-gradient text-primary-foreground">
            <BarChart3 className="size-[18px]" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold">IDP Admin</p>
            <p className="text-[11px] text-muted-foreground">Bảng điều khiển quản trị</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    <span className="truncate">{item.nhan}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 rounded-lg bg-transparent"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeftRight className="size-4" />
            Sang giao diện người dùng
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur lg:px-6">
          <Select value={domainId} onValueChange={chonDomain}>
            <SelectTrigger className="h-9 w-[13rem] rounded-lg text-sm" aria-label="Chọn lĩnh vực">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Lĩnh vực (Domain)</SelectLabel>
                {TAT_CA_DOMAIN.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.ten}
                    <span className="ml-1 text-xs text-muted-foreground">· {d.org}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <NutDoiGiaoDien />
            <div className="flex items-center gap-2 rounded-lg border bg-background/60 py-1 pl-1 pr-3">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                  {chuCaiDau(nguoiDung.hoTen)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-semibold">{nguoiDung.hoTen}</p>
                <p className="text-[11px] text-muted-foreground">Quản trị viên</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-3 border-b bg-card px-4 py-4 lg:px-6">
          <div className="min-w-0">
            <h1 className="text-pretty text-xl font-bold tracking-tight">{title}</h1>
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
