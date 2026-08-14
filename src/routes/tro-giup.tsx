import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/tro-giup")({
  head: () => ({
    meta: [
      { title: "Trợ giúp — Hồ sơ thông minh" },
      {
        name: "description",
        content:
          "Hướng dẫn gửi giấy tờ, giải thích các trạng thái xử lý và cách liên hệ hỗ trợ.",
      },
      { property: "og:title", content: "Trợ giúp — Hồ sơ thông minh" },
      {
        property: "og:description",
        content: "Câu hỏi thường gặp và cách liên hệ bộ phận hỗ trợ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TroGiup,
});

const CAU_HOI = [
  {
    hoi: "Tôi cần chuẩn bị gì trước khi gửi?",
    dap: "Chỉ cần bản chụp hoặc bản quét rõ nét của giấy tờ. Không cần đổi tên tệp, không cần điền biểu mẫu nào trước.",
  },
  {
    hoi: "Mất bao lâu để có kết quả?",
    dap: "Phần lớn hồ sơ 1–5 trang xong trong vòng 1–3 phút. Hồ sơ dày hơn có thể lâu hơn một chút; bạn sẽ nhận được thông báo khi xong.",
  },
  {
    hoi: "\"Cần bạn kiểm tra\" nghĩa là gì?",
    dap: "Nghĩa là có vài thông tin hệ thống đọc được nhưng chưa thật chắc chắn (ví dụ chữ mờ). Bạn chỉ cần mở hồ sơ, nhìn lại các dòng được đánh dấu rồi bấm xác nhận.",
  },
  {
    hoi: "Vì sao hồ sơ báo \"Không đọc được\"?",
    dap: "Thường do ảnh quá mờ, thiếu sáng hoặc bị mất góc. Bạn hãy chụp/quét lại rõ hơn và gửi lại — không mất phí thêm.",
  },
  {
    hoi: "Ai xem được tài liệu của tôi?",
    dap: "Chỉ bạn và nhân viên được phân quyền trong đơn vị của bạn. Tài liệu không bao giờ được chia sẻ sang lĩnh vực hay đơn vị khác.",
  },
  {
    hoi: "Tôi có thể sửa thông tin bị sai không?",
    dap: "Có. Trong trang kết quả, bấm \"Có chỗ chưa đúng, nhờ hỗ trợ\" và nhân viên sẽ kiểm tra lại giúp bạn.",
  },
];

function TroGiup() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">Trợ giúp</h1>
        <p className="mt-2 text-muted-foreground">
          Những câu hỏi hay gặp nhất, giải thích bằng ngôn ngữ đời thường.
        </p>

        <Accordion type="single" collapsible className="mt-6">
          {CAU_HOI.map((c) => (
            <AccordionItem key={c.hoi} value={c.hoi}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {c.hoi}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {c.dap}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className="mt-10 shadow-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Vẫn cần người hỗ trợ?</h2>
            <p className="mt-1.5 text-muted-foreground">
              Bộ phận hỗ trợ làm việc từ 8:00 đến 17:30 các ngày trong tuần.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <a href="tel:19001234">
                  <Phone className="size-4" /> Gọi 1900 1234
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <a href="mailto:hotro@hosothongminh.vn">
                  <Mail className="size-4" /> hotro@hosothongminh.vn
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/gui-ho-so">Bắt đầu gửi hồ sơ</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
