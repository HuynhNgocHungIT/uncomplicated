import { useSyncExternalStore } from "react";
import { toast } from "sonner";

/* ------------------------------------------------------------------ *
 * Kho dữ liệu mẫu cho Admin App (IDP Platform).
 * Toàn bộ dữ liệu nằm trong bộ nhớ, mô phỏng backend Phase 0–7.
 * ------------------------------------------------------------------ */

export type VaiTro =
  | "SystemAdministrator"
  | "OrganizationAdmin"
  | "DomainExpert"
  | "Reviewer"
  | "EndUser";

export const TEN_VAI_TRO: Record<VaiTro, string> = {
  SystemAdministrator: "Quản trị hệ thống",
  OrganizationAdmin: "Quản trị tổ chức",
  DomainExpert: "Chuyên gia lĩnh vực",
  Reviewer: "Người rà soát",
  EndUser: "Người dùng cuối",
};

/** Trạng thái vòng đời của cấu hình/bundle — màu nhất quán toàn hệ thống. */
export type TrangThaiArtifact =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "PUBLISHED"
  | "DEPRECATED";

export const NHAN_ARTIFACT: Record<TrangThaiArtifact, string> = {
  DRAFT: "Bản nháp",
  SUBMITTED: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  PUBLISHED: "Đang dùng",
  DEPRECATED: "Ngừng dùng",
};

/** Lớp màu badge cho trạng thái artifact (dùng token semantic). */
export const LOP_ARTIFACT: Record<TrangThaiArtifact, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SUBMITTED: "bg-info/15 text-info",
  APPROVED: "bg-primary/15 text-primary",
  PUBLISHED: "bg-success/15 text-success",
  DEPRECATED: "bg-destructive/12 text-destructive",
};

export type LoaiCauHinh = "CLASSIFIER" | "SCHEMA" | "RULE" | "RAG" | "PROMPT";

export const TEN_LOAI_CAU_HINH: Record<LoaiCauHinh, string> = {
  CLASSIFIER: "Bộ phân loại",
  SCHEMA: "Cấu trúc trường (Schema)",
  RULE: "Bộ quy tắc (Rule)",
  RAG: "Tri thức tham khảo (RAG)",
  PROMPT: "Câu lệnh AI (Prompt)",
};

export type DocType = {
  id: string;
  ten: string;
  bundlePhienBan: number | null; // phiên bản bundle đang PUBLISHED, null = chưa có
  trangThaiBundle: TrangThaiArtifact;
  soHoSo30Ngay: number;
};

export type Domain = {
  id: string;
  ten: string;
  docTypes: DocType[];
};

export type Organization = {
  id: string;
  ten: string;
  maSoThue: string;
  domains: Domain[];
};

export type NguoiDung = {
  id: string;
  hoTen: string;
  email: string;
  donVi: string;
};

export type PhanQuyen = {
  id: string;
  nguoiDungId: string;
  vaiTro: VaiTro;
  phamVi: string; // "Toàn hệ thống" | tên tổ chức | tên domain
  ngayGan: string; // ISO
  conHieuLuc: boolean;
};

export type AuditEvent = {
  id: string;
  luc: string; // ISO
  actor: string;
  hanhDong: string;
  loaiDoiTuong: string;
  doiTuong: string;
  requestId: string;
  phamVi: string;
};

export type RetentionPolicy = {
  id: string;
  phamVi: string; // Org hoặc Domain
  loai: "Tài liệu" | "Feedback";
  soNgay: number;
  hanhDong: "Ẩn danh" | "Xoá/Ẩn danh";
  capNhat: string; // ISO
};

export type BuocXoa = "requested" | "approved" | "executed" | "verified";

export type YeuCauXoa = {
  id: string;
  doiTuong: string; // user cần ẩn danh
  lyDo: string;
  nguoiYeuCau: string;
  nguoiDuyet?: string;
  buoc: BuocXoa;
  taoLuc: string;
};

export type FeedbackField = {
  docType: string;
  truong: string;
  soLanSua: number;
  tongSoLan: number;
  mauLap: string; // mẫu hình lặp lại
  trongGolden: boolean;
};

export type Candidate = {
  id: string;
  docType: string;
  loai: LoaiCauHinh;
  trangThai: TrangThaiArtifact;
  taoBoi: "AI" | "Chuyên gia";
  taoLuc: string;
};

export type Dataset = {
  id: string;
  ten: string;
  soTaiLieu: number;
  trangThaiPhanTich: "Chưa phân tích" | "Đang phân tích" | "Đã phân tích";
  docTypeDeXuat: string[];
};

export type ChiSoDanhGia = {
  docAccuracy: number;
  fieldAccuracy: number;
  validationAccuracy: number;
  hallucinationRate: number;
  confidenceCalibration: number;
};

export type EvaluationRun = {
  id: string;
  docType: string;
  bundlePhienBan: number;
  soMau: number;
  trangThai: "SUCCEEDED" | "RUNNING" | "FAILED";
  chayLuc: string;
  chiSo: ChiSoDanhGia;
};

export type GateThreshold = {
  id: string;
  phamVi: string;
  chiSo: string;
  nguong: number;
  huong: "cao-tot" | "thap-tot";
};

type State = {
  domainId: string;
  toChuc: Organization[];
  nguoiDung: NguoiDung[];
  phanQuyen: PhanQuyen[];
  audit: AuditEvent[];
  retention: RetentionPolicy[];
  yeuCauXoa: YeuCauXoa[];
  feedback: FeedbackField[];
  candidates: Candidate[];
  datasets: Dataset[];
  evaluations: EvaluationRun[];
  gates: GateThreshold[];
};

const now = Date.now();
const iso = (phutTruoc: number) =>
  new Date(now - phutTruoc * 60000).toISOString();

/* ------------------------------- Seed ---------------------------- */

const toChuc: Organization[] = [
  {
    id: "org-anphat",
    ten: "Công ty CP An Phát",
    maSoThue: "0312345678",
    domains: [
      {
        id: "tai-chinh",
        ten: "Tài chính – Kế toán",
        docTypes: [
          { id: "dt-hddt", ten: "Hóa đơn GTGT", bundlePhienBan: 7, trangThaiBundle: "PUBLISHED", soHoSo30Ngay: 1284 },
          { id: "dt-saoke", ten: "Sao kê ngân hàng", bundlePhienBan: 3, trangThaiBundle: "PUBLISHED", soHoSo30Ngay: 412 },
          { id: "dt-phieuchi", ten: "Phiếu chi", bundlePhienBan: 2, trangThaiBundle: "PUBLISHED", soHoSo30Ngay: 356 },
          { id: "dt-hopdongkt", ten: "Hợp đồng kinh tế", bundlePhienBan: null, trangThaiBundle: "SUBMITTED", soHoSo30Ngay: 0 },
        ],
      },
      {
        id: "nhan-su",
        ten: "Nhân sự",
        docTypes: [
          { id: "dt-hdld", ten: "Hợp đồng lao động", bundlePhienBan: 5, trangThaiBundle: "PUBLISHED", soHoSo30Ngay: 189 },
          { id: "dt-hosoud", ten: "Hồ sơ ứng viên", bundlePhienBan: 1, trangThaiBundle: "APPROVED", soHoSo30Ngay: 62 },
        ],
      },
    ],
  },
  {
    id: "org-minhlong",
    ten: "Công ty TNHH Minh Long",
    maSoThue: "0398765432",
    domains: [
      {
        id: "xay-dung",
        ten: "Xây dựng – Kỹ thuật",
        docTypes: [
          { id: "dt-banve", ten: "Bản vẽ kỹ thuật", bundlePhienBan: 2, trangThaiBundle: "PUBLISHED", soHoSo30Ngay: 74 },
          { id: "dt-nghiemthu", ten: "Biên bản nghiệm thu", bundlePhienBan: null, trangThaiBundle: "DRAFT", soHoSo30Ngay: 0 },
        ],
      },
      {
        id: "phap-ly",
        ten: "Pháp lý",
        docTypes: [
          { id: "dt-hopdong", ten: "Hợp đồng", bundlePhienBan: 4, trangThaiBundle: "PUBLISHED", soHoSo30Ngay: 143 },
          { id: "dt-congvan", ten: "Công văn", bundlePhienBan: 1, trangThaiBundle: "PUBLISHED", soHoSo30Ngay: 51 },
        ],
      },
    ],
  },
];

const nguoiDung: NguoiDung[] = [
  { id: "u1", hoTen: "Nguyễn Thu Hà", email: "ha.nguyen@anphat.vn", donVi: "An Phát" },
  { id: "u2", hoTen: "Trần Quốc Bảo", email: "bao.tran@anphat.vn", donVi: "An Phát" },
  { id: "u3", hoTen: "Lê Minh Châu", email: "chau.le@anphat.vn", donVi: "An Phát" },
  { id: "u4", hoTen: "Phạm Văn Dũng", email: "dung.pham@minhlong.vn", donVi: "Minh Long" },
  { id: "u5", hoTen: "Vũ Thị Én", email: "en.vu@minhlong.vn", donVi: "Minh Long" },
  { id: "u6", hoTen: "Hoàng Gia Khánh", email: "khanh.hoang@platform.vn", donVi: "Vận hành nền tảng" },
];

const phanQuyen: PhanQuyen[] = [
  { id: "ra1", nguoiDungId: "u6", vaiTro: "SystemAdministrator", phamVi: "Toàn hệ thống", ngayGan: iso(43200), conHieuLuc: true },
  { id: "ra2", nguoiDungId: "u1", vaiTro: "OrganizationAdmin", phamVi: "Công ty CP An Phát", ngayGan: iso(20160), conHieuLuc: true },
  { id: "ra3", nguoiDungId: "u2", vaiTro: "DomainExpert", phamVi: "Tài chính – Kế toán", ngayGan: iso(15000), conHieuLuc: true },
  { id: "ra4", nguoiDungId: "u3", vaiTro: "Reviewer", phamVi: "Tài chính – Kế toán", ngayGan: iso(8000), conHieuLuc: true },
  { id: "ra5", nguoiDungId: "u4", vaiTro: "OrganizationAdmin", phamVi: "Công ty TNHH Minh Long", ngayGan: iso(30000), conHieuLuc: true },
  { id: "ra6", nguoiDungId: "u5", vaiTro: "Reviewer", phamVi: "Xây dựng – Kỹ thuật", ngayGan: iso(6000), conHieuLuc: false },
];

const audit: AuditEvent[] = [
  { id: "a1", luc: iso(12), actor: "Nguyễn Thu Hà", hanhDong: "Xuất bản cấu hình (publish)", loaiDoiTuong: "Bundle", doiTuong: "Hóa đơn GTGT v7", requestId: "req-8a1f", phamVi: "An Phát / Tài chính" },
  { id: "a2", luc: iso(48), actor: "Hoàng Gia Khánh", hanhDong: "Gán vai trò", loaiDoiTuong: "RoleAssignment", doiTuong: "Reviewer → Lê Minh Châu", requestId: "req-7b2c", phamVi: "An Phát / Tài chính" },
  { id: "a3", luc: iso(140), actor: "Trần Quốc Bảo", hanhDong: "Duyệt cấu hình (approve)", loaiDoiTuong: "Schema", doiTuong: "Sao kê ngân hàng v3", requestId: "req-6c3d", phamVi: "An Phát / Tài chính" },
  { id: "a4", luc: iso(320), actor: "Hệ thống", hanhDong: "Trạng thái cuối request", loaiDoiTuong: "ProcessingRequest", doiTuong: "HS-2417 → ROUTED_TO_REVIEW", requestId: "req-5d4e", phamVi: "An Phát / Tài chính" },
  { id: "a5", luc: iso(900), actor: "Lê Minh Châu", hanhDong: "Tạo feedback", loaiDoiTuong: "Feedback", doiTuong: "Số dư cuối kỳ (HS-2417)", requestId: "req-4e5f", phamVi: "An Phát / Tài chính" },
  { id: "a6", luc: iso(1500), actor: "Phạm Văn Dũng", hanhDong: "Thu hồi vai trò", loaiDoiTuong: "RoleAssignment", doiTuong: "Reviewer → Vũ Thị Én", requestId: "req-3f6a", phamVi: "Minh Long / Xây dựng" },
  { id: "a7", luc: iso(2600), actor: "Hoàng Gia Khánh", hanhDong: "Rollback cấu hình", loaiDoiTuong: "Bundle", doiTuong: "Hợp đồng v4 (từ v5)", requestId: "req-2a7b", phamVi: "Minh Long / Pháp lý" },
];

const retention: RetentionPolicy[] = [
  { id: "rp1", phamVi: "An Phát / Tài chính", loai: "Tài liệu", soNgay: 365, hanhDong: "Ẩn danh", capNhat: iso(20000) },
  { id: "rp2", phamVi: "An Phát / Tài chính", loai: "Feedback", soNgay: 730, hanhDong: "Xoá/Ẩn danh", capNhat: iso(20000) },
  { id: "rp3", phamVi: "Minh Long / Pháp lý", loai: "Tài liệu", soNgay: 1095, hanhDong: "Ẩn danh", capNhat: iso(40000) },
];

const yeuCauXoa: YeuCauXoa[] = [
  { id: "rte1", doiTuong: "ung-vien-4821 (Ứng viên)", lyDo: "Yêu cầu xoá dữ liệu cá nhân theo GDPR", nguoiYeuCau: "Nguyễn Thu Hà", nguoiDuyet: "Hoàng Gia Khánh", buoc: "executed", taoLuc: iso(5000) },
  { id: "rte2", doiTuong: "khach-le-207 (Khách hàng)", lyDo: "Khách yêu cầu chấm dứt lưu trữ", nguoiYeuCau: "Phạm Văn Dũng", buoc: "requested", taoLuc: iso(200) },
];

const feedback: FeedbackField[] = [
  { docType: "Sao kê ngân hàng", truong: "Số dư cuối kỳ", soLanSua: 34, tongSoLan: 78, mauLap: "Sai định dạng số (dấu chấm/phẩy)", trongGolden: false },
  { docType: "Sao kê ngân hàng", truong: "Số tài khoản", soLanSua: 21, tongSoLan: 78, mauLap: "Thiếu chữ số đầu", trongGolden: true },
  { docType: "Hóa đơn GTGT", truong: "Mã số thuế", soLanSua: 9, tongSoLan: 512, mauLap: "Nhầm 0/O", trongGolden: true },
  { docType: "Hóa đơn GTGT", truong: "Tổng thanh toán", soLanSua: 5, tongSoLan: 512, mauLap: "—", trongGolden: false },
  { docType: "Hợp đồng lao động", truong: "Lương cơ bản", soLanSua: 12, tongSoLan: 96, mauLap: "Bỏ sót phụ cấp", trongGolden: false },
];

const candidates: Candidate[] = [
  { id: "c1", docType: "Hợp đồng kinh tế", loai: "SCHEMA", trangThai: "SUBMITTED", taoBoi: "AI", taoLuc: iso(300) },
  { id: "c2", docType: "Hợp đồng kinh tế", loai: "PROMPT", trangThai: "SUBMITTED", taoBoi: "AI", taoLuc: iso(300) },
  { id: "c3", docType: "Hợp đồng kinh tế", loai: "RULE", trangThai: "DRAFT", taoBoi: "AI", taoLuc: iso(300) },
  { id: "c4", docType: "Hợp đồng kinh tế", loai: "CLASSIFIER", trangThai: "DRAFT", taoBoi: "AI", taoLuc: iso(300) },
  { id: "c5", docType: "Hợp đồng kinh tế", loai: "RAG", trangThai: "DRAFT", taoBoi: "AI", taoLuc: iso(300) },
  { id: "c6", docType: "Biên bản nghiệm thu", loai: "SCHEMA", trangThai: "APPROVED", taoBoi: "Chuyên gia", taoLuc: iso(1400) },
  { id: "c7", docType: "Biên bản nghiệm thu", loai: "PROMPT", trangThai: "APPROVED", taoBoi: "AI", taoLuc: iso(1400) },
];

const datasets: Dataset[] = [
  { id: "ds1", ten: "Mẫu hợp đồng kinh tế Q3", soTaiLieu: 48, trangThaiPhanTich: "Đã phân tích", docTypeDeXuat: ["Hợp đồng kinh tế", "Phụ lục hợp đồng"] },
  { id: "ds2", ten: "Biên bản nghiệm thu công trình", soTaiLieu: 26, trangThaiPhanTich: "Đã phân tích", docTypeDeXuat: ["Biên bản nghiệm thu"] },
  { id: "ds3", ten: "Chứng từ kho vận 2026", soTaiLieu: 63, trangThaiPhanTich: "Đang phân tích", docTypeDeXuat: [] },
];

const evaluations: EvaluationRun[] = [
  { id: "ev1", docType: "Hóa đơn GTGT", bundlePhienBan: 7, soMau: 120, trangThai: "SUCCEEDED", chayLuc: iso(60), chiSo: { docAccuracy: 0.972, fieldAccuracy: 0.961, validationAccuracy: 0.988, hallucinationRate: 0.004, confidenceCalibration: 0.93 } },
  { id: "ev2", docType: "Hóa đơn GTGT", bundlePhienBan: 6, soMau: 120, trangThai: "SUCCEEDED", chayLuc: iso(4300), chiSo: { docAccuracy: 0.958, fieldAccuracy: 0.949, validationAccuracy: 0.981, hallucinationRate: 0.009, confidenceCalibration: 0.9 } },
  { id: "ev3", docType: "Sao kê ngân hàng", bundlePhienBan: 3, soMau: 40, trangThai: "SUCCEEDED", chayLuc: iso(220), chiSo: { docAccuracy: 0.881, fieldAccuracy: 0.902, validationAccuracy: 0.94, hallucinationRate: 0.021, confidenceCalibration: 0.84 } },
  { id: "ev4", docType: "Hợp đồng kinh tế", bundlePhienBan: 1, soMau: 12, trangThai: "RUNNING", chayLuc: iso(3), chiSo: { docAccuracy: 0, fieldAccuracy: 0, validationAccuracy: 0, hallucinationRate: 0, confidenceCalibration: 0 } },
];

const gates: GateThreshold[] = [
  { id: "g1", phamVi: "Tài chính (Domain)", chiSo: "Độ chính xác tài liệu", nguong: 0.95, huong: "cao-tot" },
  { id: "g2", phamVi: "Tài chính (Domain)", chiSo: "Tỷ lệ bịa (hallucination)", nguong: 0.01, huong: "thap-tot" },
  { id: "g3", phamVi: "Hệ thống (mặc định)", chiSo: "Độ chính xác trường", nguong: 0.9, huong: "cao-tot" },
];

let state: State = {
  domainId: "tai-chinh",
  toChuc,
  nguoiDung,
  phanQuyen,
  audit,
  retention,
  yeuCauXoa,
  feedback,
  candidates,
  datasets,
  evaluations,
  gates,
};

/* ---------------------------- Store core ------------------------- */

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (fn: (s: State) => State) => {
  state = fn(state);
  emit();
};

function useAdminState(): State {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
}

export function useAdmin<T>(select: (s: State) => T): T {
  return select(useAdminState());
}

/* ------------------------- Derived helpers ----------------------- */

export const TAT_CA_DOMAIN = toChuc.flatMap((o) =>
  o.domains.map((d) => ({ id: d.id, ten: d.ten, org: o.ten })),
);

export const tenDomain = (id: string) =>
  TAT_CA_DOMAIN.find((d) => d.id === id)?.ten ?? id;

export const chonDomain = (id: string) => set((s) => ({ ...s, domainId: id }));

export const tenNguoiDung = (id: string) =>
  state.nguoiDung.find((u) => u.id === id)?.hoTen ?? id;

/* ---------------------------- Actions ---------------------------- */

let auditSeq = 100;
function ghiAudit(e: Omit<AuditEvent, "id" | "luc" | "requestId">) {
  const ev: AuditEvent = {
    ...e,
    id: `a-${auditSeq++}`,
    luc: new Date().toISOString(),
    requestId: `req-${Math.random().toString(16).slice(2, 6)}`,
  };
  set((s) => ({ ...s, audit: [ev, ...s.audit] }));
}

export function duyetCandidate(id: string) {
  const c = state.candidates.find((x) => x.id === id);
  if (!c) return;
  set((s) => ({
    ...s,
    candidates: s.candidates.map((x) =>
      x.id === id ? { ...x, trangThai: "APPROVED" } : x,
    ),
  }));
  ghiAudit({
    actor: "Bạn",
    hanhDong: "Duyệt cấu hình (approve)",
    loaiDoiTuong: c.loai,
    doiTuong: `${TEN_LOAI_CAU_HINH[c.loai]} · ${c.docType}`,
    phamVi: tenDomain(state.domainId),
  });
  toast.success(`Đã duyệt ${TEN_LOAI_CAU_HINH[c.loai]} cho ${c.docType}`);
}

export function guiDuyetCandidate(id: string) {
  set((s) => ({
    ...s,
    candidates: s.candidates.map((x) =>
      x.id === id ? { ...x, trangThai: "SUBMITTED" } : x,
    ),
  }));
  toast("Đã gửi bản nháp đi duyệt");
}

export function ganVaiTro(nguoiDungId: string, vaiTro: VaiTro, phamVi: string) {
  const ra: PhanQuyen = {
    id: `ra-${Date.now()}`,
    nguoiDungId,
    vaiTro,
    phamVi,
    ngayGan: new Date().toISOString(),
    conHieuLuc: true,
  };
  set((s) => ({ ...s, phanQuyen: [ra, ...s.phanQuyen] }));
  ghiAudit({
    actor: "Bạn",
    hanhDong: "Gán vai trò",
    loaiDoiTuong: "RoleAssignment",
    doiTuong: `${TEN_VAI_TRO[vaiTro]} → ${tenNguoiDung(nguoiDungId)}`,
    phamVi,
  });
  toast.success(`Đã gán ${TEN_VAI_TRO[vaiTro]} cho ${tenNguoiDung(nguoiDungId)}`);
}

export function thuHoiVaiTro(id: string) {
  const ra = state.phanQuyen.find((x) => x.id === id);
  if (!ra) return;
  set((s) => ({
    ...s,
    phanQuyen: s.phanQuyen.map((x) =>
      x.id === id ? { ...x, conHieuLuc: false } : x,
    ),
  }));
  ghiAudit({
    actor: "Bạn",
    hanhDong: "Thu hồi vai trò",
    loaiDoiTuong: "RoleAssignment",
    doiTuong: `${TEN_VAI_TRO[ra.vaiTro]} → ${tenNguoiDung(ra.nguoiDungId)}`,
    phamVi: ra.phamVi,
  });
  toast("Đã thu hồi vai trò (hiệu lực ngay lập tức)");
}

export function themRetention(p: Omit<RetentionPolicy, "id" | "capNhat">) {
  const rp: RetentionPolicy = {
    ...p,
    id: `rp-${Date.now()}`,
    capNhat: new Date().toISOString(),
  };
  set((s) => ({ ...s, retention: [rp, ...s.retention] }));
  toast.success("Đã lưu chính sách lưu trữ");
}

const BUOC_TIEP: Record<BuocXoa, BuocXoa | null> = {
  requested: "approved",
  approved: "executed",
  executed: "verified",
  verified: null,
};

export function tienBuocXoa(id: string) {
  const yc = state.yeuCauXoa.find((x) => x.id === id);
  if (!yc) return;
  const tiep = BUOC_TIEP[yc.buoc];
  if (!tiep) return;
  set((s) => ({
    ...s,
    yeuCauXoa: s.yeuCauXoa.map((x) =>
      x.id === id
        ? {
            ...x,
            buoc: tiep,
            nguoiDuyet: tiep === "approved" ? "Bạn" : x.nguoiDuyet,
          }
        : x,
    ),
  }));
  ghiAudit({
    actor: "Bạn",
    hanhDong: `Xoá dữ liệu — bước ${NHAN_BUOC_XOA[tiep]}`,
    loaiDoiTuong: "RightToErasure",
    doiTuong: yc.doiTuong,
    phamVi: "Tuân thủ dữ liệu",
  });
  toast.success(`Đã chuyển sang bước: ${NHAN_BUOC_XOA[tiep]}`);
}

export const NHAN_BUOC_XOA: Record<BuocXoa, string> = {
  requested: "Yêu cầu",
  approved: "Đã duyệt",
  executed: "Đã thực thi",
  verified: "Đã xác minh",
};

export function promoteGolden(docType: string, truong: string) {
  set((s) => ({
    ...s,
    feedback: s.feedback.map((f) =>
      f.docType === docType && f.truong === truong
        ? { ...f, trongGolden: true }
        : f,
    ),
  }));
  ghiAudit({
    actor: "Bạn",
    hanhDong: "Đưa vào Golden Dataset",
    loaiDoiTuong: "Feedback",
    doiTuong: `${truong} · ${docType}`,
    phamVi: tenDomain(state.domainId),
  });
  toast.success("Đã đưa vào Golden Dataset");
}

export function thoiGianTuongDoi(iso: string): string {
  const phut = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (phut < 60) return `${phut} phút trước`;
  const gio = Math.round(phut / 60);
  if (gio < 24) return `${gio} giờ trước`;
  return `${Math.round(gio / 24)} ngày trước`;
}

export function ngayGio(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
