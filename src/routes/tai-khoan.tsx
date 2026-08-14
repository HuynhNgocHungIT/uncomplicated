import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { capNhatNguoiDung, chuCaiDau, useTaiKhoan } from "@/lib/tai-khoan-store";

export const Route = createFileRoute("/tai-khoan")({
  head: () => ({
    meta: [
      { title: "Thông tin tài khoản — Hồ sơ thông minh" },
      {
        name: "description",
        content: "Xem và cập nhật họ tên, email, số điện thoại và đơn vị của bạn.",
      },
      { property: "og:title", content: "Thông tin tài khoản — Hồ sơ thông minh" },
      {
        property: "og:description",
        content: "Xem và cập nhật thông tin cá nhân của bạn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaiKhoanPage,
});

function TaiKhoanPage() {
  const { nguoiDung } = useTaiKhoan();
  const [hoTen, setHoTen] = useState(nguoiDung.hoTen);
  const [email, setEmail] = useState(nguoiDung.email);
  const [soDienThoai, setSoDienThoai] = useState(nguoiDung.soDienThoai);
  const [donVi, setDonVi] = useState(nguoiDung.donVi);
  const [chucDanh, setChucDanh] = useState(nguoiDung.chucDanh);

  const daDoi =
    hoTen !== nguoiDung.hoTen ||
    email !== nguoiDung.email ||
    soDienThoai !== nguoiDung.soDienThoai ||
    donVi !== nguoiDung.donVi ||
    chucDanh !== nguoiDung.chucDanh;

  function luu(e: React.FormEvent) {
    e.preventDefault();
    capNhatNguoiDung({ hoTen, email, soDienThoai, donVi, chucDanh });
    toast.success("Đã lưu thông tin của bạn");
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Thông tin tài khoản</h1>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/cai-dat">
              <Settings className="size-4" /> Cài đặt
            </Link>
          </Button>
        </div>
        <p className="mt-2 text-muted-foreground">
          Đây là thông tin của bạn. Bạn có thể chỉnh sửa bất cứ lúc nào rồi bấm lưu.
        </p>

        <div className="mt-6 flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary text-xl text-primary-foreground">
              {chuCaiDau(nguoiDung.hoTen)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{nguoiDung.hoTen}</p>
            <p className="truncate text-muted-foreground">{nguoiDung.chucDanh}</p>
            <p className="truncate text-sm text-muted-foreground">{nguoiDung.donVi}</p>
          </div>
        </div>

        <Card className="mt-6 shadow-card">
          <CardContent className="p-6">
            <form onSubmit={luu} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ho-ten">Họ và tên</Label>
                  <Input
                    id="ho-ten"
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chuc-danh">Chức danh</Label>
                  <Input
                    id="chuc-danh"
                    value={chucDanh}
                    onChange={(e) => setChucDanh(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sdt">Số điện thoại</Label>
                  <Input
                    id="sdt"
                    type="tel"
                    value={soDienThoai}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="don-vi">Đơn vị / phòng ban</Label>
                  <Input
                    id="don-vi"
                    value={donVi}
                    onChange={(e) => setDonVi(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full px-8"
                  disabled={!daDoi}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
