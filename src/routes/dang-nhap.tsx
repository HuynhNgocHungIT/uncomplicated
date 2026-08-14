import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, FileText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dangNhap } from "@/lib/tai-khoan-store";

export const Route = createFileRoute("/dang-nhap")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — Hồ sơ thông minh" },
      {
        name: "description",
        content: "Đăng nhập để gửi giấy tờ và xem kết quả xử lý hồ sơ của bạn.",
      },
      { property: "og:title", content: "Đăng nhập — Hồ sơ thông minh" },
      {
        property: "og:description",
        content: "Đăng nhập để gửi giấy tờ và xem kết quả xử lý hồ sơ của bạn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DangNhapPage,
});

function DangNhapPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [hienMatKhau, setHienMatKhau] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  function guiForm(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setLoi("Bạn hãy nhập đúng địa chỉ email, ví dụ: ten@congty.vn");
      return;
    }
    if (matKhau.length < 6) {
      setLoi("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    setLoi(null);
    dangNhap(email);
    toast.success("Đã đăng nhập. Chúc bạn một ngày làm việc thuận lợi!");
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-hero-gradient text-primary-foreground">
            <FileText className="size-7" />
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Chào mừng bạn trở lại</h1>
          <p className="mt-2 text-muted-foreground">
            Đăng nhập để gửi giấy tờ và xem kết quả đã xử lý.
          </p>
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={guiForm} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email công việc</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ten@congty.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mat-khau">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="mat-khau"
                    type={hienMatKhau ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                    className="h-12 pr-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setHienMatKhau((v) => !v)}
                    aria-label={hienMatKhau ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {hienMatKhau ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              {loi && (
                <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {loi}
                </p>
              )}

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox defaultChecked /> Ghi nhớ máy này
                </label>
                <Link to="/tro-giup" className="text-sm font-medium text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button type="submit" size="lg" className="h-12 w-full text-base">
                Đăng nhập
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link to="/dang-ky" className="font-semibold text-primary hover:underline">
                Tạo tài khoản mới
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-success" />
          Giấy tờ của bạn được bảo mật, chỉ bạn và bộ phận xử lý xem được.
        </p>
      </main>
    </div>
  );
}
