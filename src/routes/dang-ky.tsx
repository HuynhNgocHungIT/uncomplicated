import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, FileText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dangKy } from "@/lib/tai-khoan-store";

export const Route = createFileRoute("/dang-ky")({
  head: () => ({
    meta: [
      { title: "Tạo tài khoản — Hồ sơ thông minh" },
      {
        name: "description",
        content:
          "Tạo tài khoản để bắt đầu gửi giấy tờ và nhận lại thông tin đã được đọc sẵn.",
      },
      { property: "og:title", content: "Tạo tài khoản — Hồ sơ thông minh" },
      {
        property: "og:description",
        content: "Tạo tài khoản để bắt đầu gửi giấy tờ và nhận kết quả đã đọc sẵn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DangKyPage,
});

function DangKyPage() {
  const navigate = useNavigate();
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [donVi, setDonVi] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [hienMatKhau, setHienMatKhau] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  function guiForm(e: React.FormEvent) {
    e.preventDefault();
    if (hoTen.trim().length < 2) {
      setLoi("Bạn hãy nhập họ và tên của mình.");
      return;
    }
    if (!email.includes("@")) {
      setLoi("Bạn hãy nhập đúng địa chỉ email, ví dụ: ten@congty.vn");
      return;
    }
    if (matKhau.length < 6) {
      setLoi("Mật khẩu cần ít nhất 6 ký tự để bảo vệ tài khoản.");
      return;
    }
    setLoi(null);
    dangKy({ hoTen: hoTen.trim(), email: email.trim(), donVi: donVi.trim() });
    toast.success("Đã tạo tài khoản. Chào mừng bạn!");
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-hero-gradient text-primary-foreground">
            <FileText className="size-7" />
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Tạo tài khoản mới</h1>
          <p className="mt-2 text-muted-foreground">
            Chỉ mất một phút. Sau đó bạn có thể gửi giấy tờ ngay.
          </p>
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={guiForm} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="ho-ten">Họ và tên</Label>
                <Input
                  id="ho-ten"
                  autoComplete="name"
                  placeholder="Ví dụ: Nguyễn Thu Hà"
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

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
                <Label htmlFor="don-vi">
                  Đơn vị / phòng ban{" "}
                  <span className="font-normal text-muted-foreground">(không bắt buộc)</span>
                </Label>
                <Input
                  id="don-vi"
                  autoComplete="organization"
                  placeholder="Ví dụ: Phòng Kế toán — Công ty An Phát"
                  value={donVi}
                  onChange={(e) => setDonVi(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mat-khau">Tạo mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="mat-khau"
                    type={hienMatKhau ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Ít nhất 6 ký tự"
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
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {loi}
                </p>
              )}

              <Button type="submit" size="lg" className="h-12 w-full text-base">
                Tạo tài khoản
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link to="/dang-nhap" className="font-semibold text-primary hover:underline">
                Đăng nhập
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
