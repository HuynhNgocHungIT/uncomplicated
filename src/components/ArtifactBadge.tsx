import {
  LOP_ARTIFACT,
  NHAN_ARTIFACT,
  type TrangThaiArtifact,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export function ArtifactBadge({
  trangThai,
  className,
}: {
  trangThai: TrangThaiArtifact;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        LOP_ARTIFACT[trangThai],
        className,
      )}
    >
      {NHAN_ARTIFACT[trangThai]}
    </span>
  );
}
