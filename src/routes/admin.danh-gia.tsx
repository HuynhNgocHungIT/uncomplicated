import { createFileRoute } from "@tanstack/react-router";
import {
  FlaskConical,
  Play,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  useAdmin,
  ngayGio,
  type ChiSoDanhGia,
  type EvaluationRun,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/danh-gia")({
  component: DanhGia,
});

type MetricKey = keyof ChiSoDanhGia;

const CHI_SO: {
  key: MetricKey;
  nhan: string;
  huong: "cao-tot" | "thap-tot";
}[] = [
  { key: "docAccuracy", nhan: "Độ chính xác tài liệu", huong: "cao-tot" },
  { key: "fieldAccuracy", nhan: "Độ chính xác trường", huong: "cao-tot" },
  { key: "validationAccuracy", nhan: "Độ chính xác kiểm định", huong: "cao-tot" },
  { key: "hallucinationRate", nhan: "Tỷ lệ bịa (hallucination)", huong: "thap-tot" },
  { key: "confidenceCalibration", nhan: "Hiệu chỉnh độ tin cậy", huong: "cao-tot" },
];

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

/** Thanh đo trực quan cho một chỉ số. */
function ThanhDo({
  giaTri,
  huong,
}: {
  giaTri: number;
  huong: "cao-tot" | "thap-tot";
}) {
  const rong = Math.min(100, Math.round(giaTri * 100));
  // Với chỉ số "thấp tốt", giá trị nhỏ = tốt → hiển thị dải rất ngắn.
  const tot = huong === "cao-tot" ? giaTri >= 0.9 : giaTri <= 0.01;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", tot ? "bg-success" : "bg-warning")}
          style={{ width: `${huong === "thap-tot" ? Math.max(4, rong * 6) : rong}%` }}
        />
      </div>
      <span className="tabular-nums text-xs font-medium">{pct(giaTri)}</span>
    </div>
  );
}

function TrangThaiRun({ trangThai }: { trangThai: EvaluationRun["trangThai"] }) {
  const map = {
    SUCCEEDED: { nhan: "Thành công", icon: CheckCircle2, lop: "bg-success/15 text-success" },
    RUNNING: { nhan: "Đang chạy", icon: Loader2, lop: "bg-info/15 text-info" },
    FAILED: { nhan: "Thất bại", icon: XCircle, lop: "bg-destructive/12 text-destructive" },
  }[trangThai];
  const Icon = map.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        map.lop,
      )}
    >
      <Icon className={cn("size-3.5", trangThai === "RUNNING" && "animate-spin")} />
      {map.nhan}
    </span>
  );
}

function DanhGia() {
  const { evaluations, gates } = useAdmin((s) => s);

  const latest = evaluations.find((e) => e.trangThai === "SUCCEEDED");

  return (
    <AdminShell
      title="Đánh giá chất lượng"
      description="Đo lường độ chính xác của bundle cấu hình trên bộ mẫu vàng trước khi xuất bản."
      actions={
        <Button
          className="gap-1.5"
          onClick={() => toast("Đã thêm lượt đánh giá vào hàng đợi (mô phỏng)")}
        >
          <Play className="size-4" /> Chạy đánh giá
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Chỉ số của lượt chạy mới nhất */}
        {latest ? (
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">
                  Lượt chạy mới nhất · {latest.docType} v{latest.bundlePhienBan}
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {latest.soMau} mẫu · {ngayGio(latest.chayLuc)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5">
              {CHI_SO.map((c) => {
                const v = latest.chiSo[c.key];
                const tot = c.huong === "cao-tot" ? v >= 0.9 : v <= 0.01;
                return (
                  <div key={c.key} className="bg-card p-4">
                    <p className="text-2xl font-bold tabular-nums tracking-tight">
                      {pct(v)}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {c.nhan}
                    </p>
                    <span
                      className={cn(
                        "mt-2 inline-flex items-center gap-1 text-[11px] font-medium",
                        tot ? "text-success" : "text-warning-foreground",
                      )}
                    >
                      {c.huong === "cao-tot" ? (
                        <TrendingUp className="size-3" />
                      ) : (
                        <TrendingDown className="size-3" />
                      )}
                      {c.huong === "cao-tot" ? "Càng cao càng tốt" : "Càng thấp càng tốt"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : null}

        {/* Ngưỡng chất lượng (Quality Gates) */}
        <Card>
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <ShieldCheck className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Ngưỡng chất lượng (Quality Gates)</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chỉ số</TableHead>
                <TableHead>Phạm vi áp dụng</TableHead>
                <TableHead className="text-right">Ngưỡng</TableHead>
                <TableHead>Hướng</TableHead>
                <TableHead className="text-right">Kết quả mới nhất</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gates.map((g) => {
                const chiSo = CHI_SO.find((c) => c.nhan === g.chiSo);
                const v = chiSo && latest ? latest.chiSo[chiSo.key] : null;
                const dat =
                  v == null
                    ? null
                    : g.huong === "cao-tot"
                      ? v >= g.nguong
                      : v <= g.nguong;
                return (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.chiSo}</TableCell>
                    <TableCell className="text-muted-foreground">{g.phamVi}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {pct(g.nguong)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {g.huong === "cao-tot" ? "≥ ngưỡng" : "≤ ngưỡng"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {dat == null ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            dat
                              ? "bg-success/15 text-success"
                              : "bg-destructive/12 text-destructive",
                          )}
                        >
                          {dat ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : (
                            <XCircle className="size-3.5" />
                          )}
                          {v != null ? pct(v) : ""} · {dat ? "Đạt" : "Chưa đạt"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Lịch sử các lượt chạy */}
        <Card>
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Lịch sử đánh giá</h2>
            <span className="text-xs text-muted-foreground">
              {evaluations.length} lượt chạy
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại tài liệu</TableHead>
                <TableHead className="text-right">Bản</TableHead>
                <TableHead className="text-right">Mẫu</TableHead>
                <TableHead>Độ chính xác tài liệu</TableHead>
                <TableHead>Tỷ lệ bịa</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thời điểm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell className="font-medium">{ev.docType}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    <Badge variant="secondary" className="font-normal">
                      v{ev.bundlePhienBan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {ev.soMau}
                  </TableCell>
                  <TableCell>
                    {ev.trangThai === "SUCCEEDED" ? (
                      <ThanhDo giaTri={ev.chiSo.docAccuracy} huong="cao-tot" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {ev.trangThai === "SUCCEEDED" ? (
                      <ThanhDo giaTri={ev.chiSo.hallucinationRate} huong="thap-tot" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <TrangThaiRun trangThai={ev.trangThai} />
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {ngayGio(ev.chayLuc)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminShell>
  );
}
