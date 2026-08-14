import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScrollText, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { useAdmin, ngayGio, thoiGianTuongDoi } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/audit")({
  component: Audit,
});

function Audit() {
  const audit = useAdmin((s) => s.audit);

  const [tuKhoa, setTuKhoa] = useState("");
  const [loai, setLoai] = useState("all");

  const loaiList = useMemo(
    () => Array.from(new Set(audit.map((e) => e.loaiDoiTuong))),
    [audit],
  );

  const locData = audit.filter((e) => {
    const khopLoai = loai === "all" || e.loaiDoiTuong === loai;
    const q = tuKhoa.trim().toLowerCase();
    const khopTuKhoa =
      !q ||
      [e.actor, e.hanhDong, e.doiTuong, e.phamVi, e.requestId]
        .join(" ")
        .toLowerCase()
        .includes(q);
    return khopLoai && khopTuKhoa;
  });

  return (
    <AdminShell
      title="Nhật ký kiểm toán"
      description="Ghi nhận bất biến mọi hành động quản trị: ai, làm gì, trên đối tượng nào, thuộc phạm vi nào."
      actions={
        <Button
          variant="outline"
          className="gap-1.5 bg-transparent"
          onClick={() => toast.success("Đã xuất nhật ký (mô phỏng)")}
        >
          <Download className="size-4" /> Xuất CSV
        </Button>
      }
    >
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <ScrollText className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Sự kiện ({locData.length})</h2>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
                placeholder="Tìm actor, hành động, đối tượng…"
                className="h-9 w-64 pl-8"
              />
            </div>
            <Select value={loai} onValueChange={setLoai}>
              <SelectTrigger className="h-9 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại đối tượng</SelectItem>
                {loaiList.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Thời điểm</TableHead>
              <TableHead>Người thực hiện</TableHead>
              <TableHead>Hành động</TableHead>
              <TableHead>Đối tượng</TableHead>
              <TableHead>Phạm vi</TableHead>
              <TableHead className="text-right">Request ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locData.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="align-top">
                  <span className="block text-sm">{ngayGio(e.luc)}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {thoiGianTuongDoi(e.luc)}
                  </span>
                </TableCell>
                <TableCell className="align-top font-medium">{e.actor}</TableCell>
                <TableCell className="align-top">
                  <span className="text-sm">{e.hanhDong}</span>
                  <Badge variant="secondary" className="ml-2 font-normal">
                    {e.loaiDoiTuong}
                  </Badge>
                </TableCell>
                <TableCell className="align-top text-muted-foreground">
                  {e.doiTuong}
                </TableCell>
                <TableCell className="align-top text-xs text-muted-foreground">
                  {e.phamVi}
                </TableCell>
                <TableCell className="align-top text-right">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                    {e.requestId}
                  </code>
                </TableCell>
              </TableRow>
            ))}
            {locData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Không có sự kiện nào khớp bộ lọc.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </AdminShell>
  );
}
