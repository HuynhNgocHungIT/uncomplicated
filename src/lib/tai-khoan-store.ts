import { useSyncExternalStore } from "react";

export type NguoiDung = {
  hoTen: string;
  email: string;
  soDienThoai: string;
  donVi: string; // tổ chức / phòng ban
  chucDanh: string;
};

export type GiaoDien = "sang" | "toi" | "theo-may";

export type CaiDat = {
  nhanEmail: boolean;
  nhanSms: boolean;
  tuXacNhan: boolean; // tự xác nhận khi kết quả chắc chắn
  coChuTo: boolean; // hiển thị chữ to, dễ đọc
  giaoDien: GiaoDien; // sáng / tối / theo máy
};

type State = {
  daDangNhap: boolean;
  nguoiDung: NguoiDung;
  caiDat: CaiDat;
};

const MAC_DINH: State = {
  daDangNhap: true,
  nguoiDung: {
    hoTen: "Nguyễn Thu Hà",
    email: "thuha@congty.vn",
    soDienThoai: "0912 345 678",
    donVi: "Phòng Kế toán — Công ty An Phát",
    chucDanh: "Kế toán viên",
  },
  caiDat: {
    nhanEmail: true,
    nhanSms: false,
    tuXacNhan: false,
    coChuTo: false,
    giaoDien: "theo-may",
  },
};

const KHOA = "idp-tai-khoan";

let state: State = MAC_DINH;
const listeners = new Set<() => void>();

function phatTin() {
  listeners.forEach((l) => l());
}

function luu() {
  try {
    localStorage.setItem(KHOA, JSON.stringify(state));
  } catch {
    /* bỏ qua */
  }
}

function set(next: (s: State) => State) {
  state = next(state);
  luu();
  phatTin();
}

/** Nạp dữ liệu đã lưu ở trình duyệt (gọi một lần sau khi trang hiển thị). */
export function napTaiKhoan() {
  try {
    const raw = localStorage.getItem(KHOA);
    if (!raw) return;
    const doc = JSON.parse(raw) as Partial<State>;
    state = {
      daDangNhap: doc.daDangNhap ?? MAC_DINH.daDangNhap,
      nguoiDung: { ...MAC_DINH.nguoiDung, ...doc.nguoiDung },
      caiDat: { ...MAC_DINH.caiDat, ...doc.caiDat },
    };
    phatTin();
  } catch {
    /* bỏ qua */
  }
}

export function useTaiKhoan(): State {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => MAC_DINH,
  );
}

export function dangNhap(email: string) {
  set((s) => ({
    ...s,
    daDangNhap: true,
    nguoiDung: { ...s.nguoiDung, email: email || s.nguoiDung.email },
  }));
}

export function dangKy(thongTin: Partial<NguoiDung>) {
  set((s) => ({
    ...s,
    daDangNhap: true,
    nguoiDung: { ...s.nguoiDung, ...thongTin },
  }));
}

export function dangXuat() {
  set((s) => ({ ...s, daDangNhap: false }));
}

export function capNhatNguoiDung(thongTin: Partial<NguoiDung>) {
  set((s) => ({ ...s, nguoiDung: { ...s.nguoiDung, ...thongTin } }));
}

export function capNhatCaiDat(thayDoi: Partial<CaiDat>) {
  set((s) => ({ ...s, caiDat: { ...s.caiDat, ...thayDoi } }));
}

/** Áp dụng giao diện sáng/tối và cỡ chữ lên toàn trang. Gọi ở trình duyệt. */
export function apDungCaiDat(caiDat: CaiDat) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  const thichToi =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const dungToi =
    caiDat.giaoDien === "toi" || (caiDat.giaoDien === "theo-may" && !!thichToi);
  root.classList.toggle("dark", dungToi);

  // Cỡ chữ lớn: phóng to gốc rem để mọi thứ to đều, dễ đọc hơn.
  root.classList.toggle("chu-to", caiDat.coChuTo);
}

export function chuCaiDau(hoTen: string) {
  return hoTen
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((t) => t[0] ?? "")
    .join("")
    .toUpperCase();
}
