import { createFileRoute } from "@tanstack/react-router";
import { Building2, FolderTree, FileText, Hash } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { ArtifactBadge } from "@/components/ArtifactBadge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdmin, chonDomain } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/to-chuc")({
  component: ToChuc,
});

function ToChuc() {
  const { toChuc, domainId } = useAdmin((s) => s);

  const soDomain = toChuc.reduce((a, o) => a + o.domains.length, 0);
  const soDocType = toChuc
    .flatMap((o) => o.domains)
    .reduce((a, d) => a + d.docTypes.length, 0);

  return (
    <AdminShell
      title="Tổ chức & Lĩnh vực"
      description="Cấu trúc phân cấp Tổ chức → Lĩnh vực → Loại tài liệu. Chọn một lĩnh vực để đặt làm phạm vi làm việc."
    >
      <div className="flex flex-col gap-6">
        {/* Tóm tắt */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { nhan: "Tổ chức", giaTri: toChuc.length, icon: Building2, mau: "text-primary bg-primary/12" },
            { nhan: "Lĩnh vực", giaTri: soDomain, icon: FolderTree, mau: "text-info bg-info/12" },
            { nhan: "Loại tài liệu", giaTri: soDocType, icon: FileText, mau: "text-success bg-success/12" },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <Card key={k.nhan} className="flex items-center gap-3 p-4">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    k.mau,
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold leading-tight tracking-tight tabular-nums">
                    {k.giaTri}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">{k.nhan}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Cây phân cấp */}
        {toChuc.map((org) => (
          <Card key={org.id}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <Building2 className="size-[18px]" />
                </span>
                <div className="leading-tight">
                  <h2 className="text-sm font-semibold">{org.ten}</h2>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Hash className="size-3" /> MST: {org.maSoThue}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {org.domains.length} lĩnh vực
              </span>
            </div>

            <div className="flex flex-col divide-y">
              {org.domains.map((d) => {
                const dangChon = d.id === domainId;
                return (
                  <div key={d.id} className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => chonDomain(d.id)}
                      className={cn(
                        "mb-2 inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-sm font-medium transition-colors",
                        dangChon
                          ? "bg-primary/12 text-primary"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <FolderTree className="size-4" />
                      {d.ten}
                      {dangChon ? (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          Đang chọn
                        </span>
                      ) : null}
                    </button>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Loại tài liệu</TableHead>
                          <TableHead className="text-right">Hồ sơ / 30 ngày</TableHead>
                          <TableHead className="text-right">Bundle</TableHead>
                          <TableHead className="text-right">Trạng thái bundle</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {d.docTypes.map((dt) => (
                          <TableRow key={dt.id}>
                            <TableCell className="font-medium">{dt.ten}</TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">
                              {dt.soHoSo30Ngay.toLocaleString("vi-VN")}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {dt.bundlePhienBan ? `v${dt.bundlePhienBan}` : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <ArtifactBadge trangThai={dt.trangThaiBundle} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
