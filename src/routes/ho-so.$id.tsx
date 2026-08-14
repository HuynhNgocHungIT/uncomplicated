import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Download,
  Printer,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { TrangThaiBadge } from "@/components/TrangThaiBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useIdp } from "@/lib/idp-store";
import { ThoiGian } from "@/components/ThoiGian";

export const Route = createFileRoute("/ho-so/$id")({
  head: () => ({
    meta: [
      { title: "Kết quả hồ sơ — Hồ sơ thông minh" },
      {
        name: "description",
        content:
          "Xem thông tin đã được bóc tách từ giấy tờ bạn gửi, kèm trạng thái xử lý từng bước.",
      },
      { property: "og:title", content: "Kết quả hồ sơ — Hồ sơ thông minh" },
      {
        property: "og:description",
        content: "Thông tin đã bóc tách từ giấy tờ của bạn, trình bày dễ đọc.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChiTietHoSo,
});

function MucTinCay({ giaTri }: { giaTri: number }) {
  if (giaTri >= 0.9)
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
        <Check className="size-4" /> Chắc chắn
      </span>
    );
  if (giaTri >= 0.8)
    return <span className="text-sm font-medium text-muted-foreground">Khá chắc</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-warning-foreground">
      <AlertTriangle className="size-4" /> Nên kiểm tra lại
    </span>
  );
}

function ChiTietHoSo() {
  const { id } = Route.useParams();
  const hoSo = useIdp((s) => s.hoSo.find((h) => h.id === id));

  if (!hoSo) {
    throw notFound();
  }

  const dangChay = hoSo.trangThai === "dang-tai" || hoSo.trangThai === "dang-xu-ly";

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <Link
          to="/ho-so"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Quay lại danh sách
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{hoSo.tenTep}</h1>
            <p className="mt-1.5 text-muted-foreground">
              Mã hồ sơ {hoSo.id} · {hoSo.loaiHoSo} · gửi{" "}
              <ThoiGian iso={hoSo.guiLuc} />
            </p>
          </div>
          <TrangThaiBadge trangThai={hoSo.trangThai} />
        </div>

        {dangChay && (
          <Card className="mt-6 shadow-card">
            <CardContent className="p-6">
              <p className="font-semibold">Đang xử lý, bạn chờ một chút nhé</p>
              <p className="mt-1 text-muted-foreground">{hoSo.buoc}…</p>
              <Progress value={hoSo.tienDo} className="mt-4 h-2.5" />
              <p className="mt-2 text-sm text-muted-foreground">
                Bạn có thể rời khỏi trang này, chúng tôi sẽ báo khi xong.
              </p>
            </CardContent>
          </Card>
        )}

        {hoSo.ghiChu && (
          <Card className="mt-6 border-warning/50 bg-warning/10 shadow-card">
            <CardContent className="flex gap-3 p-5">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning-foreground" />
              <div>
                <p className="font-semibold text-warning-foreground">Cần bạn lưu ý</p>
                <p className="mt-1 text-warning-foreground/90">{hoSo.ghiChu}</p>
                {hoSo.trangThai === "that-bai" && (
                  <Button asChild className="mt-4 rounded-full">
                    <Link to="/gui-ho-so">
                      <RefreshCw className="size-4" /> Gửi lại tài liệu
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {hoSo.truong.length > 0 && (
          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Thông tin đã đọc được</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => toast.success("Đã tải kết quả về máy của bạn")}
                >
                  <Download className="size-4" /> Tải về
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => window.print()}
                >
                  <Printer className="size-4" /> In
                </Button>
              </div>
            </div>

            <Card className="mt-4 overflow-hidden shadow-card">
              <ul className="divide-y">
                {hoSo.truong.map((t) => (
                  <li
                    key={t.nhan}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4"
                  >
                    <p className="w-48 shrink-0 text-sm text-muted-foreground">
                      {t.nhan}
                    </p>
                    <p className="min-w-0 flex-1 text-lg font-semibold">{t.giaTri}</p>
                    <MucTinCay giaTri={t.doTinCay} />
                  </li>
                ))}
              </ul>
            </Card>

            {hoSo.trangThai === "can-kiem-tra" && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  className="rounded-full"
                  onClick={() => toast.success("Cảm ơn bạn, thông tin đã được xác nhận")}
                >
                  <Check className="size-4" /> Thông tin đúng, xác nhận
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() =>
                    toast("Chúng tôi đã chuyển hồ sơ cho nhân viên hỗ trợ xem lại")
                  }
                >
                  Có chỗ chưa đúng, nhờ hỗ trợ
                </Button>
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}
