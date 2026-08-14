import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Upload,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TrangThaiBadge } from "@/components/TrangThaiBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { tenLinhVuc, useIdpState } from "@/lib/idp-store";
import { ThoiGian } from "@/components/ThoiGian";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hồ sơ thông minh — Gửi và tra cứu tài liệu" },
      {
        name: "description",
        content:
          "Gửi hóa đơn, hợp đồng hay giấy tờ của bạn và nhận lại thông tin đã được bóc tách sẵn, dễ đọc, không cần kiến thức kỹ thuật.",
      },
      { property: "og:title", content: "Hồ sơ thông minh — Gửi và tra cứu tài liệu" },
      {
        property: "og:description",
        content: "Gửi giấy tờ, nhận lại thông tin đã bóc tách sẵn trong vài phút.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrangChinh,
});

const BUOC_HUONG_DAN = [
  {
    icon: Upload,
    tieuDe: "1. Gửi giấy tờ lên",
    moTa: "Chọn tệp PDF hoặc ảnh chụp. Không cần đặt tên hay sắp xếp gì cả.",
  },
  {
    icon: FileSearch,
    tieuDe: "2. Hệ thống đọc giúp bạn",
    moTa: "Máy tự nhận dạng loại giấy tờ và lấy ra các thông tin quan trọng.",
  },
  {
    icon: ClipboardList,
    tieuDe: "3. Xem và tải kết quả",
    moTa: "Thông tin hiện ra rõ ràng theo từng mục, bạn chỉ cần kiểm tra lại.",
  },
];

function TrangChinh() {
  const { hoSo, linhVucId } = useIdpState();
  const cuaToi = hoSo.filter((h) => h.linhVuc === linhVucId);
  const canKiemTra = cuaToi.filter((h) => h.trangThai === "can-kiem-tra").length;
  const dangXuLy = cuaToi.filter(
    (h) => h.trangThai === "dang-xu-ly" || h.trangThai === "dang-tai",
  ).length;
  const daXong = cuaToi.filter((h) => h.trangThai === "hoan-tat").length;

  return (
    <AppShell>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-medium opacity-80">{tenLinhVuc(linhVucId)}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Gửi giấy tờ lên, nhận lại thông tin đã đọc sẵn
          </h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">
            Bạn không cần biết gì về công nghệ. Chỉ cần chọn tệp, phần còn lại
            hệ thống lo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-7 text-base">
              <Link to="/gui-ho-so">
                <Upload className="size-5" />
                Gửi hồ sơ ngay
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full px-7 text-base text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            >
              <Link to="/ho-so">Xem hồ sơ đã gửi</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { nhan: "Đang xử lý", so: dangXuLy, mau: "text-info" },
            { nhan: "Cần bạn kiểm tra", so: canKiemTra, mau: "text-warning-foreground" },
            { nhan: "Đã xong", so: daXong, mau: "text-success" },
          ].map((o) => (
            <Card key={o.nhan} className="shadow-card">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">{o.nhan}</p>
                <p className={`mt-1 text-4xl font-bold ${o.mau}`}>{o.so}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Cách hoạt động</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {BUOC_HUONG_DAN.map((b) => (
              <Card key={b.tieuDe} className="shadow-card">
                <CardContent className="p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <b.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{b.tieuDe}</h3>
                  <p className="mt-1.5 text-muted-foreground">{b.moTa}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Hồ sơ gần đây</h2>
            <Link
              to="/ho-so"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Xem tất cả <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {cuaToi.slice(0, 4).map((h) => (
              <Link
                key={h.id}
                to="/ho-so/$id"
                params={{ id: h.id }}
                className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4 shadow-card transition-shadow hover:shadow-lift"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <CheckCircle2 className="size-5 text-muted-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{h.tenTep}</p>
                  <p className="text-sm text-muted-foreground">
                    {h.loaiHoSo} · gửi <ThoiGian iso={h.guiLuc} />
                  </p>
                </div>
                <TrangThaiBadge trangThai={h.trangThai} />
              </Link>
            ))}
            {cuaToi.length === 0 && (
              <Card className="shadow-card">
                <CardContent className="p-10 text-center">
                  <p className="text-muted-foreground">
                    Bạn chưa gửi hồ sơ nào trong lĩnh vực này.
                  </p>
                  <Button asChild className="mt-4 rounded-full">
                    <Link to="/gui-ho-so">Gửi hồ sơ đầu tiên</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
