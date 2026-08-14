import { ThoiGian } from "@/components/ThoiGian";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  FileText,
  HelpCircle,
  Home,
  Upload,
  Check,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LINH_VUC,
  chonLinhVuc,
  danhDauDaDoc,
  danhDauTatCaDaDoc,
  useIdp,
} from "@/lib/idp-store";
import {
  apDungCaiDat,
  capNhatCaiDat,
  chuCaiDau,
  dangXuat,
  napTaiKhoan,
  useTaiKhoan,
} from "@/lib/tai-khoan-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", nhan: "Trang chính", icon: Home },
  { to: "/gui-ho-so", nhan: "Gửi hồ sơ", icon: Upload },
  { to: "/ho-so", nhan: "Hồ sơ của tôi", icon: FileText },
  { to: "/tro-giup", nhan: "Trợ giúp", icon: HelpCircle },
] as const;

function ThongBaoBell() {
  const thongBao = useIdp((s) => s.thongBao);
  const chuaDoc = thongBao.filter((t) => !t.daDoc).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label={`Thông báo${chuaDoc ? `, ${chuaDoc} mục mới` : ""}`}
        >
          <Bell className="size-5" />
          {chuaDoc > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[11px] font-semibold text-destructive-foreground">
              {chuaDoc}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Thông báo</p>
          <button
            onClick={danhDauTatCaDaDoc}
            className="text-xs font-medium text-primary hover:underline"
          >
            Đánh dấu đã đọc hết
          </button>
        </div>
        <ul className="max-h-80 divide-y overflow-y-auto">
          {thongBao.map((t) => (
            <li key={t.id}>
              <Link
                to="/ho-so/$id"
                params={{ id: t.hoSoId ?? "" }}
                onClick={() => danhDauDaDoc(t.id)}
                className={cn(
                  "block px-4 py-3 transition-colors hover:bg-muted",
                  !t.daDoc && "bg-accent/40",
                )}
              >
                <p className="text-sm font-medium">{t.tieuDe}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{t.moTa}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <ThoiGian iso={t.luc} />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

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
      className="rounded-full"
      aria-label={dangToi ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      onClick={() => capNhatCaiDat({ giaoDien: dangToi ? "sang" : "toi" })}
    >
      {dangToi ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}

function MenuNguoiDung() {
  const { nguoiDung } = useTaiKhoan();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 rounded-full pl-1 pr-2"
          aria-label="Tài khoản của bạn"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-sm text-primary-foreground">
              {chuCaiDau(nguoiDung.hoTen)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[9rem] truncate text-sm font-medium sm:inline">
            {nguoiDung.hoTen}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-semibold">{nguoiDung.hoTen}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {nguoiDung.donVi}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/tai-khoan" })}>
          <User className="size-4" /> Thông tin tài khoản
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/cai-dat" })}>
          <Settings className="size-4" /> Cài đặt
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
          <LayoutDashboard className="size-4" /> Trang quản trị
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            dangXuat();
            toast("Bạn đã đăng xuất. Hẹn gặp lại!");
            navigate({ to: "/dang-nhap" });
          }}
        >
          <LogOut className="size-4" /> Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const linhVucId = useIdp((s) => s.linhVucId);
  const caiDat = useTaiKhoan().caiDat;

  // Nạp tài khoản đã lưu một lần khi mở ứng dụng.
  useEffect(() => {
    napTaiKhoan();
  }, []);

  // Áp dụng giao diện sáng/tối và cỡ chữ mỗi khi cài đặt thay đổi.
  useEffect(() => {
    apDungCaiDat(caiDat);
  }, [caiDat]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground">
              <FileText className="size-5" />
            </span>
            <span className="hidden text-lg font-bold tracking-tight sm:inline">
              Hồ sơ thông minh
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Select value={linhVucId} onValueChange={chonLinhVuc}>
              <SelectTrigger
                className="h-10 w-[11rem] rounded-full sm:w-[15rem]"
                aria-label="Chọn lĩnh vực"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LINH_VUC.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.ten}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <NutDoiGiaoDien />
            <ThongBaoBell />
            <MenuNguoiDung />
          </div>
        </div>

        <nav className="mx-auto w-full max-w-6xl px-2">
          <ul className="flex items-center gap-1 overflow-x-auto pb-1">
            {NAV.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 rounded-t-lg border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.nhan}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <Check className="size-4 text-success" />
            Tài liệu của bạn được lưu trữ riêng, chỉ bạn và bộ phận xử lý xem được.
          </p>
          <Link to="/tro-giup" className="font-medium text-primary hover:underline">
            Cần hỗ trợ? Xem hướng dẫn
          </Link>
        </div>
      </footer>
    </div>
  );
}
