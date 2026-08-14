import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileStack,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  Timer,
  ArrowRight,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdmin, thoiGianTuongDoi, tenDomain } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: TongQuan,
});

type Kpi = {
  nhan: string;
  giaTri: string;
  phu: string;
  icon: typeof FileStack;
  mau: string;
};

function TongQuan() {
  const { audit, toChuc, domainId, evaluations } = useAdmin((s) => s);

  const tongHoSo = toChuc
    .flatMap((o) => o.domains)
    .flatMap((d) => d.docTypes)
    .reduce((a, b) => a + b.soHoSo30Ngay, 0);

  const kpis: Kpi[] = [
    { nhan: "Hồ sơ xử lý (30 ngày)", giaTri: tongHoSo.toLocaleString("vi-VN"), phu: "+8,2% so với kỳ trước", icon: FileStack, mau: "text-info bg-info/12" },
    { nhan: "Tỷ lệ tự động đạt (PASS)", giaTri: "91,4%", phu: "8,6% chuyển rà soát", icon: CheckCircle2, mau: "text-success bg-success/12" },
    { nhan: "Đang chờ rà soát", giaTri: "37", phu: "5 quá hạn SLA", icon: AlertTriangle, mau: "text-warning-foreground bg-warning/20" },
    { nhan: "Độ tin cậy trung bình", giaTri: "0,94", phu: "Hiệu chỉnh 0,93", icon: Gauge, mau: "text-primary bg-primary/12" },
  ];

  const docTypes = toChuc
    .flatMap((o) => o.domains.map((d) => ({ org: o.ten, domain: d })))
    .filter((x) => x.domain.id === domainId)
    .flatMap((x) => x.domain.docTypes.map((dt) => ({ org: x.org, dt })));

  return (
    <AdminShell
      title="Tổng quan hệ thống"
      description={`Đang xem lĩnh vực: ${tenDomain(domainId)}`}
    >
      <div className="flex flex-col gap-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <Card key={k.nhan} className="flex items-start gap-3 p-4">
                <span className={cn("flex size-10 items-center justify-center rounded-lg", k.mau)}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-2xl font-bold leading-tight tracking-tight">{k.giaTri}</p>
                  <p className="truncate text-xs font-medium text-muted-foreground">{k.nhan}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">{k.phu}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Doc types trong domain */}
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Loại tài liệu trong lĩnh vực</h2>
              <Link
                to="/admin/to-chuc"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Quản lý <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại tài liệu</TableHead>
                  <TableHead>Tổ chức</TableHead>
                  <TableHead className="text-right">Hồ sơ / 30 ngày</TableHead>
                  <TableHead className="text-right">Bundle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docTypes.map(({ org, dt }) => (
                  <TableRow key={dt.id}>
                    <TableCell className="font-medium">{dt.ten}</TableCell>
                    <TableCell className="text-muted-foreground">{org}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {dt.soHoSo30Ngay.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {dt.bundlePhienBan ? `v${dt.bundlePhienBan}` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Đánh giá gần đây */}
          <Card>
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Đánh giá gần đây</h2>
              <Link
                to="/admin/danh-gia"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Xem <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ul className="divide-y">
              {evaluations.slice(0, 3).map((ev) => (
                <li key={ev.id} className="flex items-center justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{ev.docType}</p>
                    <p className="text-xs text-muted-foreground">
                      v{ev.bundlePhienBan} · {ev.soMau} mẫu
                    </p>
                  </div>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold tabular-nums">
                      {ev.trangThai === "RUNNING"
                        ? "—"
                        : `${Math.round(ev.chiSo.docAccuracy * 100)}%`}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {ev.trangThai === "RUNNING" ? "Đang chạy" : "Chính xác"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Hoạt động kiểm toán */}
        <Card>
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Timer className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Hoạt động gần đây</h2>
            </div>
            <Link
              to="/admin/audit"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Nhật ký đầy đủ <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul className="divide-y">
            {audit.slice(0, 5).map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">
                  {thoiGianTuongDoi(e.luc)}
                </span>
                <span className="font-medium">{e.actor}</span>
                <span className="text-muted-foreground">{e.hanhDong}</span>
                <span className="ml-auto truncate text-right text-xs text-muted-foreground">
                  {e.doiTuong}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AdminShell>
  );
}
