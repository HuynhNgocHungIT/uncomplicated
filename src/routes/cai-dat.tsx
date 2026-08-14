import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  Mail,
  MessageSquare,
  Monitor,
  Moon,
  Sun,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { GiaoDien } from "@/lib/tai-khoan-store";
import { capNhatCaiDat, useTaiKhoan } from "@/lib/tai-khoan-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cai-dat")({
  head: () => ({
    meta: [
      { title: "Cài đặt — Hồ sơ thông minh" },
      {
        name: "description",
        content:
          "Chọn cách nhận thông báo, bật chữ to dễ đọc và đổi nền sáng/tối theo ý bạn.",
      },
      { property: "og:title", content: "Cài đặt — Hồ sơ thông minh" },
      {
        property: "og:description",
        content: "Tùy chỉnh thông báo, cỡ chữ và giao diện sáng/tối.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaiDatPage,
});

function DongCaiDat({
  icon: Icon,
  tieuDe,
  moTa,
  bat,
  onDoi,
}: {
  icon: LucideIcon;
  tieuDe: string;
  moTa: string;
  bat: boolean;
  onDoi: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4 px-5 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{tieuDe}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{moTa}</span>
      </span>
      <Switch checked={bat} onCheckedChange={onDoi} aria-label={tieuDe} />
    </label>
  );
}

const LUA_CHON_GIAO_DIEN: { id: GiaoDien; nhan: string; icon: LucideIcon }[] = [
  { id: "sang", nhan: "Nền sáng", icon: Sun },
  { id: "toi", nhan: "Nền tối", icon: Moon },
  { id: "theo-may", nhan: "Theo máy", icon: Monitor },
];

function CaiDatPage() {
  const { caiDat } = useTaiKhoan();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">Cài đặt</h1>
        <p className="mt-2 text-muted-foreground">
          Chỉnh cho vừa ý bạn. Thay đổi được lưu lại ngay, không cần bấm nút nào.
        </p>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Thông báo</h2>
          <p className="text-sm text-muted-foreground">
            Chọn cách bạn muốn được báo khi hồ sơ có kết quả.
          </p>
          <Card className="mt-3 overflow-hidden shadow-card">
            <div className="divide-y">
              <DongCaiDat
                icon={Mail}
                tieuDe="Nhận thông báo qua email"
                moTa="Gửi kết quả và nhắc việc cần kiểm tra vào email của bạn."
                bat={caiDat.nhanEmail}
                onDoi={(v) => capNhatCaiDat({ nhanEmail: v })}
              />
              <DongCaiDat
                icon={MessageSquare}
                tieuDe="Nhận tin nhắn SMS"
                moTa="Nhắn tin vào số điện thoại khi có việc gấp cần bạn xem."
                bat={caiDat.nhanSms}
                onDoi={(v) => capNhatCaiDat({ nhanSms: v })}
              />
              <DongCaiDat
                icon={Bell}
                tieuDe="Tự xác nhận khi kết quả chắc chắn"
                moTa="Hồ sơ mà máy đọc rất chắc chắn sẽ được duyệt luôn, đỡ mất công."
                bat={caiDat.tuXacNhan}
                onDoi={(v) => capNhatCaiDat({ tuXacNhan: v })}
              />
            </div>
          </Card>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Hiển thị</h2>
          <p className="text-sm text-muted-foreground">
            Giúp màn hình dễ nhìn hơn với bạn.
          </p>
          <Card className="mt-3 overflow-hidden shadow-card">
            <div className="divide-y">
              <DongCaiDat
                icon={Type}
                tieuDe="Chữ to, dễ đọc"
                moTa="Phóng to toàn bộ chữ trong ứng dụng cho đỡ mỏi mắt."
                bat={caiDat.coChuTo}
                onDoi={(v) => capNhatCaiDat({ coChuTo: v })}
              />
              <div className="px-5 py-4">
                <p className="font-medium">Nền sáng hay nền tối</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Chọn tông màu bạn thấy dễ chịu nhất khi nhìn lâu.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {LUA_CHON_GIAO_DIEN.map((o) => {
                    const chon = caiDat.giaoDien === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => capNhatCaiDat({ giaoDien: o.id })}
                        aria-pressed={chon}
                        className={cn(
                          "relative flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-sm font-medium transition-colors",
                          chon
                            ? "border-primary bg-accent/40 text-foreground"
                            : "border-border text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {chon && (
                          <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3.5" />
                          </span>
                        )}
                        <o.icon className="size-6" />
                        {o.nhan}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
