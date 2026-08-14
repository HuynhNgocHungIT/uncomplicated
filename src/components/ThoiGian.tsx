import { useEffect, useState } from "react";
import { thoiGianTuongDoi } from "@/lib/idp-store";

/** Hiển thị thời gian tương đối, chỉ tính ở trình duyệt để tránh lệch nội dung khi tải trang. */
export function ThoiGian({ iso }: { iso: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(thoiGianTuongDoi(iso));
    const t = setInterval(() => setText(thoiGianTuongDoi(iso)), 30000);
    return () => clearInterval(t);
  }, [iso]);

  return <span suppressHydrationWarning>{text ?? "vừa xong"}</span>;
}
