export type RequestStatus = "pending" | "confirmed" | "cancelled";
export type BookingRequest = {
  id: string;
  name: string;
  phone: string;
  note: string;
  packageId: string;
  addons: string[];
  date: string;
  time: string;
  total: number;
  status: RequestStatus;
  source: "sample" | "visitor";
};
export const STORAGE_KEY = "angel-demo-requests-v1";
export const statusLabels = {
  pending: "بانتظار المراجعة",
  confirmed: "مؤكد تجريبيًا",
  cancelled: "ملغي تجريبيًا",
};
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
const nextDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return localDate(d);
};
export const seedRequests = (): BookingRequest[] => [
  {
    id: "sample-1",
    name: "سارة",
    phone: "01000000000",
    note: "بيانات توضيحية",
    packageId: "vip",
    addons: ["lounge"],
    date: nextDate(2),
    time: "٣:٠٠ عصرًا",
    total: 2300,
    status: "pending",
    source: "sample",
  },
  {
    id: "sample-2",
    name: "نور",
    phone: "01100000000",
    note: "بيانات توضيحية",
    packageId: "relax",
    addons: [],
    date: nextDate(3),
    time: "٥:٠٠ مساءً",
    total: 1450,
    status: "confirmed",
    source: "sample",
  },
  {
    id: "sample-3",
    name: "مريم",
    phone: "01200000000",
    note: "بيانات توضيحية",
    packageId: "ritual",
    addons: ["facial"],
    date: nextDate(4),
    time: "١:٠٠ ظهرًا",
    total: 1250,
    status: "cancelled",
    source: "sample",
  },
];
export function readRequests(): BookingRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedRequests();
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return seedRequests();
    return data.filter(
      (r): r is BookingRequest =>
        !!r &&
        typeof r.id === "string" &&
        typeof r.name === "string" &&
        typeof r.total === "number" &&
        Array.isArray(r.addons) &&
        ["pending", "confirmed", "cancelled"].includes(r.status),
    );
  } catch {
    return seedRequests();
  }
}
export function saveRequests(requests: BookingRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event("angel-requests"));
}
export function normalizePhone(value: string) {
  return value
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[\s()-]/g, "");
}
export function validPhone(value: string) {
  return /^(?:\+?20|0)1[0125]\d{8}$/.test(normalizePhone(value));
}
export const formatDate = (value: string) =>
  new Date(value + "T12:00:00").toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
