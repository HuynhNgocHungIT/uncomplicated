import { createFileRoute } from "@tanstack/react-router";
import { Database, Sparkles, Check, Send } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { ArtifactBadge } from "@/components/ArtifactBadge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TEN_LOAI_CAU_HINH,
  duyetCandidate,
  guiDuyetCandidate,
  useAdmin,
  type LoaiCauHinh,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/knowledge-studio")({
  component: KnowledgeStudio,
});

const MAU_LOAI: Record<LoaiCauHinh, string> = {
  CLASSIFIER: "bg-chart-5/15 text-foreground",
  SCHEMA: "bg-info/15 text-info",
  RULE: "bg-warning/20 text-warning-foreground",
  RAG: "bg-success/15 text-success",
  PROMPT: "bg-primary/15 text-primary",
};

function KnowledgeStudio() {
  const { datasets, candidates } = useAdmin((s) => s);

  const theoDocType = candidates.reduce<Record<string, typeof candidates>>(
    (acc, c) => {
      (acc[c.docType] ||= []).push(c);
      return acc;
    },
    {},
  );

  return (
    <AdminShell
      title="Knowledge Studio"
      description="Sinh cấu hình bằng AI từ tài liệu mẫu, rồi gửi duyệt trước khi đưa vào sử dụng."
    >
      <div className="flex flex-col gap-6">
        {/* Datasets */}
        <Card>
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Database className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Bộ dữ liệu mẫu (Dataset)</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên bộ dữ liệu</TableHead>
                <TableHead className="text-right">Số tài liệu</TableHead>
                <TableHead>Trạng thái phân tích</TableHead>
                <TableHead>Loại tài liệu đề xuất</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((ds) => (
                <TableRow key={ds.id}>
                  <TableCell className="font-medium">{ds.ten}</TableCell>
                  <TableCell className="text-right tabular-nums">{ds.soTaiLieu}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        ds.trangThaiPhanTich === "Đã phân tích"
                          ? "bg-success/15 text-success"
                          : ds.trangThaiPhanTich === "Đang phân tích"
                            ? "bg-info/15 text-info"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {ds.trangThaiPhanTich}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ds.docTypeDeXuat.length ? (
                        ds.docTypeDeXuat.map((t) => (
                          <Badge key={t} variant="secondary" className="font-normal">
                            {t}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="h-8 gap-1.5">
                      <Sparkles className="size-3.5" /> Sinh cấu hình
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Candidates theo doc type */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Bản nháp cấu hình (candidates) theo loại tài liệu
          </h2>
          {Object.entries(theoDocType).map(([docType, list]) => (
            <Card key={docType}>
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold">{docType}</h3>
                <span className="text-xs text-muted-foreground">
                  {list.length} bản nháp · {list.filter((c) => c.trangThai === "APPROVED").length} đã duyệt
                </span>
              </div>
              <ul className="divide-y">
                {list.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
                        MAU_LOAI[c.loai],
                      )}
                    >
                      {TEN_LOAI_CAU_HINH[c.loai]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Tạo bởi {c.taoBoi}
                    </span>
                    <div className="ml-auto flex items-center gap-3">
                      <ArtifactBadge trangThai={c.trangThai} />
                      {c.trangThai === "DRAFT" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1.5"
                          onClick={() => guiDuyetCandidate(c.id)}
                        >
                          <Send className="size-3.5" /> Gửi duyệt
                        </Button>
                      ) : c.trangThai === "SUBMITTED" ? (
                        <Button
                          size="sm"
                          className="h-8 gap-1.5"
                          onClick={() => duyetCandidate(c.id)}
                        >
                          <Check className="size-3.5" /> Duyệt
                        </Button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
