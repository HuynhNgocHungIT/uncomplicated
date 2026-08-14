import { useSyncExternalStore } from "react";

export type HoSoTrangThai =
  | "dang-tai"
  | "dang-xu-ly"
  | "hoan-tat"
  | "can-kiem-tra"
  | "that-bai";

export type TruongDuLieu = {
  nhan: string;
  giaTri: string;
  doTinCay: number; // 0..1
};

export type HoSo = {
  id: string;
  tenTep: string;
  loaiHoSo: string;
  linhVuc: string;
  soTrang: number;
  guiLuc: string; // ISO
  trangThai: HoSoTrangThai;
  tienDo: number; // 0..100
  buoc: string;
  ghiChu?: string;
  truong: TruongDuLieu[];
};

export type ThongBao = {
  id: string;
  tieuDe: string;
  moTa: string;
  luc: string;
  daDoc: boolean;
  hoSoId?: string;
};

export const LINH_VUC = [
  { id: "tai-chinh", ten: "Tài chính – Kế toán", moTa: "Hóa đơn, phiếu chi, sao kê" },
  { id: "nhan-su", ten: "Nhân sự", moTa: "Hợp đồng lao động, hồ sơ ứng viên" },
  { id: "xay-dung", ten: "Xây dựng – Kỹ thuật", moTa: "Bản vẽ, biên bản nghiệm thu" },
  { id: "phap-ly", ten: "Pháp lý", moTa: "Hợp đồng, phụ lục, công văn" },
];

type State = {
  linhVucId: string;
  hoSo: HoSo[];
  thongBao: ThongBao[];
};

const now = Date.now();
const iso = (phutTruoc: number) => new Date(now - phutTruoc * 60000).toISOString();

let state: State = {
  linhVucId: "tai-chinh",
  hoSo: [
    {
      id: "HS-2418",
      tenTep: "Hoa-don-VAT-thang-07.pdf",
      loaiHoSo: "Hóa đơn GTGT",
      linhVuc: "tai-chinh",
      soTrang: 2,
      guiLuc: iso(24),
      trangThai: "hoan-tat",
      tienDo: 100,
      buoc: "Đã xong",
      truong: [
        { nhan: "Số hóa đơn", giaTri: "0007412", doTinCay: 0.99 },
        { nhan: "Ngày lập", giaTri: "18/07/2026", doTinCay: 0.98 },
        { nhan: "Người bán", giaTri: "Công ty TNHH Minh Long", doTinCay: 0.96 },
        { nhan: "Mã số thuế", giaTri: "0312345678", doTinCay: 0.97 },
        { nhan: "Tổng tiền trước thuế", giaTri: "128.400.000 đ", doTinCay: 0.95 },
        { nhan: "Thuế GTGT (8%)", giaTri: "10.272.000 đ", doTinCay: 0.94 },
        { nhan: "Tổng thanh toán", giaTri: "138.672.000 đ", doTinCay: 0.98 },
      ],
    },
    {
      id: "HS-2417",
      tenTep: "Sao-ke-ngan-hang-Q2.pdf",
      loaiHoSo: "Sao kê ngân hàng",
      linhVuc: "tai-chinh",
      soTrang: 14,
      guiLuc: iso(96),
      trangThai: "can-kiem-tra",
      tienDo: 100,
      buoc: "Chờ người kiểm tra",
      ghiChu: "Có 2 thông tin máy đọc chưa chắc chắn, cần bạn xác nhận lại.",
      truong: [
        { nhan: "Chủ tài khoản", giaTri: "CÔNG TY CP AN PHÁT", doTinCay: 0.97 },
        { nhan: "Số tài khoản", giaTri: "0451 0000 87231", doTinCay: 0.72 },
        { nhan: "Kỳ sao kê", giaTri: "01/04/2026 – 30/06/2026", doTinCay: 0.93 },
        { nhan: "Số dư cuối kỳ", giaTri: "2.845.120.500 đ", doTinCay: 0.61 },
      ],
    },
    {
      id: "HS-2415",
      tenTep: "Phieu-chi-085.jpg",
      loaiHoSo: "Phiếu chi",
      linhVuc: "tai-chinh",
      soTrang: 1,
      guiLuc: iso(300),
      trangThai: "hoan-tat",
      tienDo: 100,
      buoc: "Đã xong",
      truong: [
        { nhan: "Số phiếu", giaTri: "PC-085", doTinCay: 0.99 },
        { nhan: "Người nhận", giaTri: "Nguyễn Thị Hà", doTinCay: 0.95 },
        { nhan: "Số tiền", giaTri: "4.500.000 đ", doTinCay: 0.98 },
      ],
    },
    {
      id: "HS-2410",
      tenTep: "Hop-dong-lao-dong-2026.pdf",
      loaiHoSo: "Hợp đồng lao động",
      linhVuc: "nhan-su",
      soTrang: 6,
      guiLuc: iso(1500),
      trangThai: "hoan-tat",
      tienDo: 100,
      buoc: "Đã xong",
      truong: [
        { nhan: "Họ tên nhân viên", giaTri: "Trần Quốc Bảo", doTinCay: 0.99 },
        { nhan: "Vị trí", giaTri: "Kỹ sư phần mềm", doTinCay: 0.96 },
        { nhan: "Thời hạn", giaTri: "12 tháng", doTinCay: 0.97 },
        { nhan: "Lương cơ bản", giaTri: "28.000.000 đ/tháng", doTinCay: 0.93 },
      ],
    },
    {
      id: "HS-2402",
      tenTep: "Ban-ve-mong-B2.tif",
      loaiHoSo: "Bản vẽ kỹ thuật",
      linhVuc: "xay-dung",
      soTrang: 3,
      guiLuc: iso(2600),
      trangThai: "that-bai",
      tienDo: 100,
      buoc: "Không đọc được",
      ghiChu: "Ảnh quá mờ nên máy không đọc được nội dung. Bạn hãy chụp/quét lại rõ hơn rồi gửi lại.",
      truong: [],
    },
  ],
  thongBao: [
    {
      id: "TB-1",
      tieuDe: "Hồ sơ cần bạn kiểm tra",
      moTa: "Sao-ke-ngan-hang-Q2.pdf có 2 thông tin chưa chắc chắn.",
      luc: iso(90),
      daDoc: false,
      hoSoId: "HS-2417",
    },
    {
      id: "TB-2",
      tieuDe: "Đã xử lý xong",
      moTa: "Hoa-don-VAT-thang-07.pdf đã có kết quả.",
      luc: iso(20),
      daDoc: false,
      hoSoId: "HS-2418",
    },
    {
      id: "TB-3",
      tieuDe: "Không đọc được tài liệu",
      moTa: "Ban-ve-mong-B2.tif cần được quét lại.",
      luc: iso(2590),
      daDoc: true,
      hoSoId: "HS-2402",
    },
  ],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (fn: (s: State) => State) => {
  state = fn(state);
  emit();
};

export const idpStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,
};

/** Trả về toàn bộ state (snapshot ổn định), tự chọn dữ liệu ở nơi dùng. */
export function useIdpState(): State {
  return useSyncExternalStore(
    idpStore.subscribe,
    () => state,
    () => state,
  );
}

/** Chỉ dùng với selector trả về giá trị nguyên thủy hoặc tham chiếu ổn định. */
export function useIdp<T>(select: (s: State) => T): T {
  const snapshot = useIdpState();
  return select(snapshot);
}

export const chonLinhVuc = (id: string) => set((s) => ({ ...s, linhVucId: id }));

export const danhDauDaDoc = (id: string) =>
  set((s) => ({
    ...s,
    thongBao: s.thongBao.map((t) => (t.id === id ? { ...t, daDoc: true } : t)),
  }));

export const danhDauTatCaDaDoc = () =>
  set((s) => ({ ...s, thongBao: s.thongBao.map((t) => ({ ...t, daDoc: true })) }));

const BUOC: string[] = [
  "Đang tải tệp lên",
  "Kiểm tra chất lượng ảnh",
  "Đọc chữ trong tài liệu",
  "Nhận dạng loại hồ sơ",
  "Bóc tách thông tin",
  "Đối chiếu quy định",
];

const MAU_KET_QUA: TruongDuLieu[] = [
  { nhan: "Số hóa đơn", giaTri: "0007598", doTinCay: 0.97 },
  { nhan: "Ngày lập", giaTri: "12/08/2026", doTinCay: 0.96 },
  { nhan: "Người bán", giaTri: "Công ty CP Thiên Hà", doTinCay: 0.94 },
  { nhan: "Tổng thanh toán", giaTri: "56.320.000 đ", doTinCay: 0.98 },
];

let dem = 2419;

/** Mô phỏng quá trình xử lý một tệp vừa được chọn. */
export function guiHoSo(tenTep: string): string {
  const id = `HS-${dem++}`;
  const moi: HoSo = {
    id,
    tenTep,
    loaiHoSo: "Đang nhận dạng…",
    linhVuc: state.linhVucId,
    soTrang: 1,
    guiLuc: new Date().toISOString(),
    trangThai: "dang-tai",
    tienDo: 4,
    buoc: BUOC[0]!,
    truong: [],
  };
  set((s) => ({ ...s, hoSo: [moi, ...s.hoSo] }));

  let buoc = 0;
  const timer = setInterval(() => {
    buoc += 1;
    const xong = buoc >= BUOC.length;
    set((s) => ({
      ...s,
      hoSo: s.hoSo.map((h) =>
        h.id !== id
          ? h
          : xong
            ? {
                ...h,
                trangThai: "hoan-tat",
                tienDo: 100,
                buoc: "Đã xong",
                loaiHoSo: "Hóa đơn GTGT",
                truong: MAU_KET_QUA,
              }
            : {
                ...h,
                trangThai: "dang-xu-ly",
                tienDo: Math.round((buoc / BUOC.length) * 100),
                buoc: BUOC[buoc]!,
              },
      ),
    }));
    if (xong) {
      clearInterval(timer);
      set((s) => ({
        ...s,
        thongBao: [
          {
            id: `TB-${Date.now()}`,
            tieuDe: "Đã xử lý xong",
            moTa: `${tenTep} đã có kết quả.`,
            luc: new Date().toISOString(),
            daDoc: false,
            hoSoId: id,
          },
          ...s.thongBao,
        ],
      }));
    }
  }, 1400);

  return id;
}

export function thoiGianTuongDoi(iso: string): string {
  const phut = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (phut < 60) return `${phut} phút trước`;
  const gio = Math.round(phut / 60);
  if (gio < 24) return `${gio} giờ trước`;
  return `${Math.round(gio / 24)} ngày trước`;
}

export const tenLinhVuc = (id: string) => LINH_VUC.find((l) => l.id === id)?.ten ?? id;
