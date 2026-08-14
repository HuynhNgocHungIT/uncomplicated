import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Search } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TrangThaiBadge } from "@/components/TrangThaiBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { HoSoTrangThai } from "@/lib/idp-store";
import { useIdpState } from "@/lib/idp-store";
import { ThoiGian } from "@/components/ThoiGian";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ho-so/")({
  head: () => ({
    meta: [
      { title: "Hồ sơ của tôi — Hồ sơ thông minh" },
      {
        name: "description",
        content:
          "Danh sách các giấy tờ bạn đã gửi, trạng thái xử lý và kết quả bóc tách thông tin.",
      },
      { property: "og:title", content: "Hồ sơ của tôi — Hồ sơ thông minh" },
      {
        property: "og:description",
        content: "Theo dõi trạng thái và kết quả của các giấy tờ bạn đã gửi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DanhSachHoSo,
});

const BO_LOC: { id: "tat-ca" | HoSoTrangThai; nhan: string }[] = [
  { id: "tat-ca", nhan: "Tất cả" },
  { id: "dang-xu-ly", nhan: "Đang xử lý" },
  { id: "can-kiem-tra", nhan: "Cần kiểm tra" },
  { id: "hoan-tat", nhan: "Đã xong" },
  { id: "that-bai", nhan: "Không đọc được" },
];

function DanhSachHoSo() {
  const { hoSo, linhVucId } = useIdpState();
  const [loc, setLoc] = useState<"tat-ca" | HoSoTrangThai>("tat-ca");
  const [tim, setTim] = useState("");

  const ds = hoSo
    .filter((h) => h.linhVuc === linhVucId)
    .filter((h) =>
      loc === "tat-ca"
        ? true
        : loc === "dang-xu-ly"
          ? h.trangThai === "dang-xu-ly" || h.trangThai === "dang-tai"
          : h.trangThai === loc,
    )
    .filter(
      (h) =>
        h.tenTep.toLowerCase().includes(tim.toLowerCase()) ||
        h.loaiHoSo.toLowerCase().includes(tim.toLowerCase()),
    );

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Hồ sơ của tôi</h1>
          <Button asChild className="rounded-full">
            <Link to="/gui-ho-so">Gửi hồ sơ mới</Link>
          </Button>
        </div>

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={tim}
            onChange={(e) => setTim(e.target.value)}
            placeholder="Tìm theo tên tệp hoặc loại giấy tờ…"
            className="h-12 rounded-full pl-10"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {BO_LOC.map((b) => (
            <button
              key={b.id}
              onClick={() => setLoc(b.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                loc === b.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {b.nhan}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {ds.map((h) => (
            <Link
              key={h.id}
              to="/ho-so/$id"
              params={{ id: h.id }}
              className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4 shadow-card transition-shadow hover:shadow-lift"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                <FileText className="size-5 text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{h.tenTep}</p>
                <p className="text-sm text-muted-foreground">
                  {h.loaiHoSo} · {h.soTrang} trang · gửi <ThoiGian iso={h.guiLuc} />
                </p>
              </div>
              <TrangThaiBadge trangThai={h.trangThai} />
            </Link>
          ))}

          {ds.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <p className="font-medium">Không có hồ sơ nào phù hợp</p>
                <p className="mt-1 text-muted-foreground">
                  Thử bỏ bớt bộ lọc hoặc gửi một hồ sơ mới.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
