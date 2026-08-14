import { AlertTriangle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import type { HoSoTrangThai } from "@/lib/idp-store";
import { cn } from "@/lib/utils";

const MAP: Record<
  HoSoTrangThai,
  { nhan: string; icon: typeof Clock; lop: string }
> = {
  "dang-tai": {
    nhan: "Đang tải lên",
    icon: Clock,
    lop: "bg-muted text-muted-foreground",
  },
  "dang-xu-ly": {
    nhan: "Đang xử lý",
    icon: Loader2,
    lop: "bg-info/15 text-info",
  },
  "hoan-tat": {
    nhan: "Đã xong",
    icon: CheckCircle2,
    lop: "bg-success/15 text-success",
  },
  "can-kiem-tra": {
    nhan: "Cần bạn kiểm tra",
    icon: AlertTriangle,
    lop: "bg-warning/20 text-warning-foreground",
  },
  "that-bai": {
    nhan: "Không đọc được",
    icon: XCircle,
    lop: "bg-destructive/12 text-destructive",
  },
};

export function TrangThaiBadge({
  trangThai,
  className,
}: {
  trangThai: HoSoTrangThai;
  className?: string;
}) {
  const c = MAP[trangThai];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        c.lop,
        className,
      )}
    >
      <Icon className={cn("size-4", trangThai === "dang-xu-ly" && "animate-spin")} />
      {c.nhan}
    </span>
  );
}
