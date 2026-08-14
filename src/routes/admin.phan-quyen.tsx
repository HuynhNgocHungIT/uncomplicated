import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserPlus, Ban } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  ganVaiTro,
  thuHoiVaiTro,
  tenNguoiDung,
  ngayGio,
  TEN_VAI_TRO,
  TAT_CA_DOMAIN,
  type VaiTro,
} from "@/lib/admin-store";
import { chuCaiDau } from "@/lib/tai-khoan-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/phan-quyen")({
  component: PhanQuyen,
});

const MAU_VAI_TRO: Record<VaiTro, string> = {
  SystemAdministrator: "bg-primary/15 text-primary",
  OrganizationAdmin: "bg-info/15 text-info",
  DomainExpert: "bg-chart-5/15 text-foreground",
  Reviewer: "bg-warning/20 text-warning-foreground",
  EndUser: "bg-muted text-muted-foreground",
};

const VAI_TRO_LIST = Object.keys(TEN_VAI_TRO) as VaiTro[];

function PhanQuyen() {
  const { phanQuyen, nguoiDung, toChuc } = useAdmin((s) => s);

  const [nguoiId, setNguoiId] = useState("");
  const [vaiTro, setVaiTro] = useState<VaiTro | "">("");
  const [phamVi, setPhamVi] = useState("");

  const phamViList = [
    "Toàn hệ thống",
    ...toChuc.map((o) => o.ten),
    ...TAT_CA_DOMAIN.map((d) => d.ten),
  ];

  const hopLe = nguoiId && vaiTro && phamVi;

  const submit = () => {
    if (!hopLe) return;
    ganVaiTro(nguoiId, vaiTro as VaiTro, phamVi);
    setNguoiId("");
    setVaiTro("");
    setPhamVi("");
  };

  const sapXep = [...phanQuyen].sort(
    (a, b) => Number(b.conHieuLuc) - Number(a.conHieuLuc),
  );

  return (
    <AdminShell
      title="Phân quyền"
      description="Gán và thu hồi vai trò theo phạm vi (RBAC). Thu hồi có hiệu lực ngay và được ghi vào nhật ký kiểm toán."
    >
      <div className="flex flex-col gap-6">
        {/* Gán vai trò */}
        <Card>
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <UserPlus className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Gán vai trò mới</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Người dùng</label>
              <Select value={nguoiId} onValueChange={setNguoiId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Chọn người dùng" />
                </SelectTrigger>
                <SelectContent>
                  {nguoiDung.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.hoTen}
                      <span className="ml-1 text-xs text-muted-foreground">· {u.donVi}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Vai trò</label>
              <Select value={vaiTro} onValueChange={(v) => setVaiTro(v as VaiTro)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {VAI_TRO_LIST.map((v) => (
                    <SelectItem key={v} value={v}>
                      {TEN_VAI_TRO[v]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Phạm vi</label>
              <Select value={phamVi} onValueChange={setPhamVi}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Chọn phạm vi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Hệ thống</SelectLabel>
                    <SelectItem value="Toàn hệ thống">Toàn hệ thống</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Tổ chức</SelectLabel>
                    {toChuc.map((o) => (
                      <SelectItem key={o.id} value={o.ten}>
                        {o.ten}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Lĩnh vực</SelectLabel>
                    {TAT_CA_DOMAIN.map((d) => (
                      <SelectItem key={d.id} value={d.ten}>
                        {d.ten}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button className="h-10 gap-1.5" disabled={!hopLe} onClick={submit}>
              <ShieldCheck className="size-4" /> Gán vai trò
            </Button>
          </div>
        </Card>

        {/* Danh sách phân quyền */}
        <Card>
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Vai trò đã gán</h2>
            <span className="text-xs text-muted-foreground">
              {phanQuyen.filter((r) => r.conHieuLuc).length} còn hiệu lực ·{" "}
              {phanQuyen.length} tổng cộng
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Phạm vi</TableHead>
                <TableHead>Ngày gán</TableHead>
                <TableHead>Hiệu lực</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sapXep.map((r) => (
                <TableRow key={r.id} className={cn(!r.conHieuLuc && "opacity-60")}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
                          {chuCaiDau(tenNguoiDung(r.nguoiDungId))}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{tenNguoiDung(r.nguoiDungId)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
                        MAU_VAI_TRO[r.vaiTro],
                      )}
                    >
                      {TEN_VAI_TRO[r.vaiTro]}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.phamVi}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {ngayGio(r.ngayGan)}
                  </TableCell>
                  <TableCell>
                    {r.conHieuLuc ? (
                      <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
                        Còn hiệu lực
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        Đã thu hồi
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.conHieuLuc ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 text-destructive hover:text-destructive"
                        onClick={() => thuHoiVaiTro(r.id)}
                      >
                        <Ban className="size-3.5" /> Thu hồi
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
