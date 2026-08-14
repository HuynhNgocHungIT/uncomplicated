import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareText, Star, AlertOctagon, Repeat } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdmin, promoteGolden } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/phan-hoi")({
  component: PhanHoi,
});

const tyLe = (a: number, b: number) => (b === 0 ? 0 : a / b);
const pct = (n: number) => `${Math.round(n * 100)}%`;

function PhanHoi() {
  const feedback = useAdmin((s) => s.feedback);

  const tongSua = feedback.reduce((a, b) => a + b.soLanSua, 0);
  const tongLan = feedback.reduce((a, b) => a + b.tongSoLan, 0);
  const soTruongNong = feedback.filter(
    (f) => tyLe(f.soLanSua, f.tongSoLan) >= 0.3,
  ).length;

  const kpis = [
    {
      nhan: "Tổng lượt chỉnh sửa",
      giaTri: tongSua.toLocaleString("vi-VN"),
      phu: `trên ${tongLan.toLocaleString("vi-VN")} lượt trích xuất`,
      icon: MessageSquareText,
      mau: "text-info bg-info/12",
    },
    {
      nhan: "Tỷ lệ chỉnh sửa chung",
      giaTri: pct(tyLe(tongSua, tongLan)),
      phu: "người dùng sửa lại kết quả AI",
      icon: Repeat,
      mau: "text-warning-foreground bg-warning/20",
    },
    {
      nhan: "Trường cần chú ý",
      giaTri: String(soTruongNong),
      phu: "tỷ lệ sửa ≥ 30%",
      icon: AlertOctagon,
      mau: "text-destructive bg-destructive/12",
    },
  ];

  // Sắp xếp theo tỷ lệ sửa giảm dần để trường "nóng" lên đầu.
  const sapXep = [...feedback].sort(
    (a, b) => tyLe(b.soLanSua, b.tongSoLan) - tyLe(a.soLanSua, a.tongSoLan),
  );

  return (
    <AdminShell
      title="Phân tích phản hồi"
      description="Nhận diện trường trích xuất bị người dùng sửa nhiều nhất và đưa vào bộ mẫu vàng để cải thiện cấu hình."
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <Card key={k.nhan} className="flex items-start gap-3 p-4">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    k.mau,
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-2xl font-bold leading-tight tracking-tight">
                    {k.giaTri}
                  </p>
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {k.nhan}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">{k.phu}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Trường trích xuất theo tỷ lệ chỉnh sửa</h2>
            <span className="text-xs text-muted-foreground">
              {feedback.length} trường được theo dõi
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trường</TableHead>
                <TableHead>Loại tài liệu</TableHead>
                <TableHead className="w-48">Tỷ lệ chỉnh sửa</TableHead>
                <TableHead>Mẫu lỗi lặp lại</TableHead>
                <TableHead>Golden</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sapXep.map((f) => {
                const r = tyLe(f.soLanSua, f.tongSoLan);
                const nong = r >= 0.3;
                return (
                  <TableRow key={`${f.docType}-${f.truong}`}>
                    <TableCell className="font-medium">{f.truong}</TableCell>
                    <TableCell className="text-muted-foreground">{f.docType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              nong ? "bg-destructive" : "bg-warning",
                            )}
                            style={{ width: `${Math.round(r * 100)}%` }}
                          />
                        </div>
                        <span className="tabular-nums text-xs font-medium">
                          {pct(r)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          ({f.soLanSua}/{f.tongSoLan})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-52 text-sm text-muted-foreground">
                      {f.mauLap}
                    </TableCell>
                    <TableCell>
                      {f.trongGolden ? (
                        <Badge className="gap-1 bg-success/15 text-success hover:bg-success/15">
                          <Star className="size-3" /> Đã thêm
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Chưa</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5"
                        disabled={f.trongGolden}
                        onClick={() => promoteGolden(f.docType, f.truong)}
                      >
                        <Star className="size-3.5" /> Đưa vào Golden
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminShell>
  );
}
