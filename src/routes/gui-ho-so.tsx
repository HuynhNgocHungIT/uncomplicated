import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CloudUpload, FileCheck2, Lightbulb } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { guiHoSo, tenLinhVuc, useIdp } from "@/lib/idp-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gui-ho-so")({
  head: () => ({
    meta: [
      { title: "Gửi hồ sơ — Hồ sơ thông minh" },
      {
        name: "description",
        content:
          "Chọn tệp PDF hoặc ảnh chụp giấy tờ để hệ thống đọc và bóc tách thông tin giúp bạn.",
      },
      { property: "og:title", content: "Gửi hồ sơ — Hồ sơ thông minh" },
      {
        property: "og:description",
        content: "Chọn tệp PDF hoặc ảnh chụp giấy tờ, hệ thống sẽ đọc giúp bạn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuiHoSo,
});

function GuiHoSo() {
  const navigate = useNavigate();
  const linhVucId = useIdp((s) => s.linhVucId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [keo, setKeo] = useState(false);

  const xuLy = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    const id = guiHoSo(f.name);
    toast.success("Đã nhận hồ sơ của bạn", {
      description: "Hệ thống đang đọc tài liệu, bạn có thể theo dõi ngay bên dưới.",
    });
    navigate({ to: "/ho-so/$id", params: { id } });
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">Gửi hồ sơ</h1>
        <p className="mt-2 text-muted-foreground">
          Hồ sơ sẽ được xử lý theo lĩnh vực{" "}
          <strong className="text-foreground">{tenLinhVuc(linhVucId)}</strong>. Nếu
          chưa đúng, hãy đổi ở góc trên bên phải.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setKeo(true);
          }}
          onDragLeave={() => setKeo(false)}
          onDrop={(e) => {
            e.preventDefault();
            setKeo(false);
            xuLy(e.dataTransfer.files);
          }}
          className={cn(
            "mt-8 rounded-3xl border-2 border-dashed bg-card p-10 text-center transition-colors sm:p-14",
            keo ? "border-primary bg-accent/40" : "border-border",
          )}
        >
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-hero-gradient text-primary-foreground">
            <CloudUpload className="size-8" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">Kéo tệp vào đây</h2>
          <p className="mt-1.5 text-muted-foreground">hoặc bấm nút bên dưới để chọn tệp</p>
          <Button
            size="lg"
            className="mt-6 rounded-full px-8 text-base"
            onClick={() => inputRef.current?.click()}
          >
            Chọn tệp từ máy
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff"
            className="sr-only"
            onChange={(e) => xuLy(e.target.files)}
          />
          <p className="mt-5 text-sm text-muted-foreground">
            Nhận tệp PDF, ảnh chụp JPG/PNG hoặc bản quét TIFF. Tối đa 50 MB mỗi tệp.
          </p>
        </div>

        <Card className="mt-8 shadow-card">
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <Lightbulb className="size-5 text-warning" />
              Mẹo để kết quả chính xác hơn
            </h3>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              {[
                "Chụp đủ sáng, thấy rõ toàn bộ tờ giấy, không bị che góc.",
                "Đặt giấy phẳng, tránh bị nhàu hoặc chụp nghiêng quá nhiều.",
                "Nếu có nhiều trang, gộp thành một tệp PDF sẽ tiện hơn.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <FileCheck2 className="mt-0.5 size-4 shrink-0 text-success" />
                  {t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
