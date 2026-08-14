import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Lock,
  Clock,
  UserX,
  Plus,
  ChevronRight,
  Check,
  ShieldAlert,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  themRetention,
  tienBuocXoa,
  ngayGio,
  NHAN_BUOC_XOA,
  TAT_CA_DOMAIN,
  type BuocXoa,
  type RetentionPolicy,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/tuan-thu")({
  component: TuanThu,
});

const CAC_BUOC: BuocXoa[] = ["requested", "approved", "executed", "verified"];

function StepperXoa({ buoc }: { buoc: BuocXoa }) {
  const idx = CAC_BUOC.indexOf(buoc);
  return (
    <div className="flex items-center gap-1">
      {CAC_BUOC.map((b, i) => {
        const xong = i <= idx;
        return (
          <div key={b} className="flex items-center gap-1">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                xong ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              {i < idx ? <Check className="size-3" /> : null}
              {NHAN_BUOC_XOA[b]}
            </span>
            {i < CAC_BUOC.length - 1 ? (
              <ChevronRight className="size-3 text-muted-foreground" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function TuanThu() {
  const { retention, yeuCauXoa } = useAdmin((s) => s);

  const [phamVi, setPhamVi] = useState("");
  const [loai, setLoai] = useState<RetentionPolicy["loai"] | "">("");
  const [soNgay, setSoNgay] = useState("");
  const [hanhDong, setHanhDong] = useState<RetentionPolicy["hanhDong"] | "">("");

  const hopLe = phamVi && loai && soNgay && hanhDong && Number(soNgay) > 0;

  const luu = () => {
    if (!hopLe) return;
    themRetention({
      phamVi,
      loai: loai as RetentionPolicy["loai"],
      soNgay: Number(soNgay),
      hanhDong: hanhDong as RetentionPolicy["hanhDong"],
    });
    setPhamVi("");
    setLoai("");
    setSoNgay("");
    setHanhDong("");
  };

  return (
    <AdminShell
      title="Tuân thủ dữ liệu"
      description="Chính sách lưu trữ (retention) và quy trình xoá dữ liệu cá nhân theo yêu cầu (right-to-erasure)."
    >
      <div className="flex flex-col gap-6">
        {/* Retention */}
        <Card>
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Clock className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Chính sách lưu trữ (Retention)</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 border-b bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Phạm vi</label>
              <Select value={phamVi} onValueChange={setPhamVi}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Chọn lĩnh vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Lĩnh vực</SelectLabel>
                    {TAT_CA_DOMAIN.map((d) => (
                      <SelectItem key={d.id} value={`${d.org} / ${d.ten}`}>
                        {d.org} / {d.ten}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Loại dữ liệu</label>
              <Select value={loai} onValueChange={(v) => setLoai(v as RetentionPolicy["loai"])}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tài liệu">Tài liệu</SelectItem>
                  <SelectItem value="Feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Số ngày giữ</label>
              <Input
                type="number"
                min={1}
                value={soNgay}
                onChange={(e) => setSoNgay(e.target.value)}
                placeholder="vd: 365"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Hành động</label>
              <Select
                value={hanhDong}
                onValueChange={(v) => setHanhDong(v as RetentionPolicy["hanhDong"])}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Xử lý" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ẩn danh">Ẩn danh</SelectItem>
                  <SelectItem value="Xoá/Ẩn danh">Xoá/Ẩn danh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="h-10 gap-1.5 lg:col-span-5 lg:w-fit" disabled={!hopLe} onClick={luu}>
              <Plus className="size-4" /> Thêm chính sách
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phạm vi</TableHead>
                <TableHead>Loại dữ liệu</TableHead>
                <TableHead className="text-right">Thời gian giữ</TableHead>
                <TableHead>Hành động khi hết hạn</TableHead>
                <TableHead className="text-right">Cập nhật</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retention.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.phamVi}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      {r.loai}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.soNgay.toLocaleString("vi-VN")} ngày
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.hanhDong}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {ngayGio(r.capNhat)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Right to erasure */}
        <Card>
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <UserX className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Yêu cầu xoá dữ liệu cá nhân (Right-to-Erasure)</h2>
          </div>

          <div className="flex items-start gap-2 border-b bg-warning/10 px-4 py-2.5 text-xs text-warning-foreground">
            <ShieldAlert className="mt-px size-4 shrink-0" />
            <p>
              Quy trình 4 bước có kiểm soát: Yêu cầu → Duyệt → Thực thi (ẩn danh/xoá) → Xác minh.
              Mỗi bước đều được ghi vào nhật ký kiểm toán.
            </p>
          </div>

          <ul className="divide-y">
            {yeuCauXoa.map((yc) => {
              const xong = yc.buoc === "verified";
              const buocTiep = CAC_BUOC[CAC_BUOC.indexOf(yc.buoc) + 1];
              return (
                <li key={yc.id} className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <Lock className="size-3.5 text-muted-foreground" />
                      {yc.doiTuong}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{yc.lyDo}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/80">
                      Yêu cầu bởi {yc.nguoiYeuCau}
                      {yc.nguoiDuyet ? ` · Duyệt bởi ${yc.nguoiDuyet}` : ""} ·{" "}
                      {ngayGio(yc.taoLuc)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <StepperXoa buoc={yc.buoc} />
                    {xong || !buocTiep ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
                        <Check className="size-3.5" /> Hoàn tất
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className="h-8 gap-1.5"
                        onClick={() => tienBuocXoa(yc.id)}
                      >
                        Chuyển sang: {NHAN_BUOC_XOA[buocTiep]}
                        <ChevronRight className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </AdminShell>
  );
}
