import React, { useEffect, useMemo, useState } from "react";
import indonesiaRegencies from "./indonesia-regencies.json";

const Icon = ({ name, className = "h-5 w-5" }) => {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    alert: (
      <svg {...common}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    ),
    chart: (
      <svg {...common}><path d="M3 3v18h18" /><path d="M7 16V9" /><path d="M12 16V5" /><path d="M17 16v-3" /></svg>
    ),
    money: (
      <svg {...common}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M12 10v4" /><path d="M10 12h4" /><path d="M7 12h.01" /><path d="M17 12h.01" /></svg>
    ),
    building: (
      <svg {...common}><path d="M3 21h18" /><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /><path d="M9 7h1" /><path d="M14 7h1" /><path d="M9 11h1" /><path d="M14 11h1" /><path d="M9 15h1" /><path d="M14 15h1" /></svg>
    ),
    calendar: (
      <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
    ),
    camera: (
      <svg {...common}><path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z" /><circle cx="12" cy="14" r="3" /></svg>
    ),
    check: (
      <svg {...common}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
    ),
    clipboard: (
      <svg {...common}><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
    ),
    clock: (
      <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
    ),
    download: (
      <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
    ),
    file: (
      <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h6" /></svg>
    ),
    fingerprint: (
      <svg {...common}><path d="M12 10a2 2 0 0 0-2 2c0 1.5-.4 3-1.2 4.3" /><path d="M14 13c-.2 2.2-.8 4.2-1.8 6" /><path d="M6.5 18.2A13 13 0 0 0 8 12a4 4 0 0 1 8 0c0 .8 0 1.6-.1 2.3" /><path d="M4 14v-2a8 8 0 0 1 16 0v1" /><path d="M18 18.5c.4-1.1.7-2.3.8-3.5" /></svg>
    ),
    pin: (
      <svg {...common}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
    menu: (
      <svg {...common}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
    ),
    plus: (
      <svg {...common}><path d="M12 5v14" /><path d="M5 12h14" /></svg>
    ),
    search: (
      <svg {...common}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    settings: (
      <svg {...common}><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" /></svg>
    ),
    shield: (
      <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
    users: (
      <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></svg>
    ),
    wallet: (
      <svg {...common}><path d="M20 7H5a2 2 0 0 1 0-4h14v4Z" /><path d="M20 7v14H5a2 2 0 0 1-2-2V5" /><path d="M16 14h.01" /></svg>
    ),
  };

  return icons[name] || icons.file;
};

const initialEmployees = [
  { id: "EMP-001", name: "Budi Santoso", nik: "5101010101010001", npwp: "01.234.567.8-901.000", bpjsKesehatan: "0001234567890", bpjsKetenagakerjaan: "12001234567", joinDate: "2024-01-15", endDate: "", manager: "Sari Dewi", contractType: "PKWTT", role: "Site Supervisor", department: "Operasional", businessUnit: "Operasional", costCenter: "OPS-BALI", workLocation: "Kantor Bali", branch: "Bali", province: "Bali", city: "Denpasar", status: "Aktif", salary: 5200000, bank: "BCA", bankAccount: "1234567890" },
  { id: "EMP-002", name: "Sari Dewi", nik: "5101010202020002", npwp: "02.234.567.8-901.000", bpjsKesehatan: "0002234567890", bpjsKetenagakerjaan: "12002234567", joinDate: "2023-08-01", endDate: "", manager: "HR Director", contractType: "PKWTT", role: "HR Admin", department: "Human Resource", businessUnit: "Support", costCenter: "HR-BALI", workLocation: "Kantor Bali", branch: "Bali", province: "Bali", city: "Badung", status: "Aktif", salary: 6100000, bank: "Mandiri", bankAccount: "2234567890" },
  { id: "EMP-003", name: "Agus Putra", nik: "3171010303030003", npwp: "03.234.567.8-901.000", bpjsKesehatan: "0003234567890", bpjsKetenagakerjaan: "12003234567", joinDate: "2024-06-10", endDate: "", manager: "Budi Santoso", contractType: "PKWT", role: "Teknisi Lapangan", department: "Proyek", businessUnit: "Delivery", costCenter: "PRJ-JKT", workLocation: "Proyek Jakarta", branch: "Jakarta", province: "DKI Jakarta", city: "Jakarta Selatan", status: "Aktif", salary: 5400000, bank: "BRI", bankAccount: "3234567890" },
  { id: "EMP-004", name: "Maya Lestari", nik: "3578010404040004", npwp: "04.234.567.8-901.000", bpjsKesehatan: "0004234567890", bpjsKetenagakerjaan: "12004234567", joinDate: "2025-02-01", endDate: "2026-12-31", manager: "Finance Manager", contractType: "PKWT", role: "Finance Officer", department: "Finance", businessUnit: "Support", costCenter: "FIN-SBY", workLocation: "Kantor Surabaya", branch: "Surabaya", province: "Jawa Timur", city: "Surabaya", status: "Kontrak", salary: 4600000, bank: "BNI", bankAccount: "4234567890" },
];

const initialAttendance = [
  { id: "ATT-001", employeeId: "EMP-001", employeeName: "Budi Santoso", date: "2026-05-07", checkIn: "08:02", checkOut: "17:13", method: "GPS + Foto", location: "Kantor Bali", status: "Hadir", lateMinutes: 2 },
  { id: "ATT-002", employeeId: "EMP-002", employeeName: "Sari Dewi", date: "2026-05-07", checkIn: "07:55", checkOut: "17:01", method: "GPS", location: "Kantor Bali", status: "Hadir", lateMinutes: 0 },
  { id: "ATT-003", employeeId: "EMP-003", employeeName: "Agus Putra", date: "2026-05-07", checkIn: "08:31", checkOut: "17:20", method: "Fingerprint", location: "Proyek Jakarta", status: "Terlambat", lateMinutes: 31 },
];

const initialExternalWorkers = [
  { id: "EXT-001", name: "Made Wirawan", workerType: "Outsourcing", vendor: "PT Bali Karya", project: "Renovasi Kantor Bali", skill: "Tukang Bangunan", supervisor: "Budi Santoso", workLocation: "Kantor Bali", province: "Bali", city: "Denpasar", startDate: "2026-05-01", endDate: "2026-06-30", dailyRate: 185000, status: "Aktif", phone: "081234567001", bank: "BCA", bankAccount: "7001001" },
  { id: "EXT-002", name: "Rizky Pratama", workerType: "Pekerja Lepas", vendor: "-", project: "Instalasi Jaringan Jakarta", skill: "Teknisi Kabel", supervisor: "Agus Putra", workLocation: "Proyek Jakarta", province: "DKI Jakarta", city: "Jakarta Selatan", startDate: "2026-05-03", endDate: "2026-05-20", dailyRate: 250000, status: "Aktif", phone: "081234567002", bank: "BRI", bankAccount: "7001002" },
  { id: "EXT-003", name: "Slamet Hidayat", workerType: "Pekerja Proyek", vendor: "CV Sinar Mandiri", project: "Gudang Surabaya", skill: "Helper Gudang", supervisor: "Maya Lestari", workLocation: "Gudang Surabaya", province: "Jawa Timur", city: "Surabaya", startDate: "2026-05-05", endDate: "2026-07-15", dailyRate: 175000, status: "Aktif", phone: "081234567003", bank: "BNI", bankAccount: "7001003" },
];

const initialMinimumWages = [
  { id: "MW-001", type: "UMP", province: "Aceh", city: "-", year: 2026, amount: 3932552, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-002", type: "UMP", province: "Sumatera Utara", city: "-", year: 2026, amount: 3228949, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-003", type: "UMP", province: "Sumatera Barat", city: "-", year: 2026, amount: 3182955, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-004", type: "UMP", province: "Riau", city: "-", year: 2026, amount: 3780495, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-005", type: "UMP", province: "Jambi", city: "-", year: 2026, amount: 3471497, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-006", type: "UMP", province: "Sumatera Selatan", city: "-", year: 2026, amount: 3942963, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-007", type: "UMP", province: "Bengkulu", city: "-", year: 2026, amount: 2827250, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-008", type: "UMP", province: "Lampung", city: "-", year: 2026, amount: 3047734, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-009", type: "UMP", province: "Kep. Bangka Belitung", city: "-", year: 2026, amount: 4035000, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-010", type: "UMP", province: "Kepulauan Riau", city: "-", year: 2026, amount: 3879520, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-011", type: "UMP", province: "DKI Jakarta", city: "-", year: 2026, amount: 5729876, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-012", type: "UMP", province: "Jawa Barat", city: "-", year: 2026, amount: 2317601, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-013", type: "UMP", province: "Jawa Tengah", city: "-", year: 2026, amount: 2327386, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-014", type: "UMP", province: "DI Yogyakarta", city: "-", year: 2026, amount: 2417495, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-015", type: "UMP", province: "Jawa Timur", city: "-", year: 2026, amount: 2446880, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-016", type: "UMP", province: "Banten", city: "-", year: 2026, amount: 3100881, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-017", type: "UMP", province: "Bali", city: "-", year: 2026, amount: 3207459, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-018", type: "UMP", province: "Nusa Tenggara Barat", city: "-", year: 2026, amount: 2673861, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-019", type: "UMP", province: "Nusa Tenggara Timur", city: "-", year: 2026, amount: 2455898, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-020", type: "UMP", province: "Kalimantan Barat", city: "-", year: 2026, amount: 3054552, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-021", type: "UMP", province: "Kalimantan Tengah", city: "-", year: 2026, amount: 3686138, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-022", type: "UMP", province: "Kalimantan Selatan", city: "-", year: 2026, amount: 3725000, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-023", type: "UMP", province: "Kalimantan Timur", city: "-", year: 2026, amount: 3762431, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-024", type: "UMP", province: "Kalimantan Utara", city: "-", year: 2026, amount: 3775243, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-025", type: "UMP", province: "Sulawesi Utara", city: "-", year: 2026, amount: 4002630, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-026", type: "UMP", province: "Sulawesi Tengah", city: "-", year: 2026, amount: 3179565, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-027", type: "UMP", province: "Sulawesi Selatan", city: "-", year: 2026, amount: 3921088, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-028", type: "UMP", province: "Sulawesi Tenggara", city: "-", year: 2026, amount: 3306496, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-029", type: "UMP", province: "Gorontalo", city: "-", year: 2026, amount: 3405144, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-030", type: "UMP", province: "Sulawesi Barat", city: "-", year: 2026, amount: 3315934, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-031", type: "UMP", province: "Maluku", city: "-", year: 2026, amount: 3334490, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-032", type: "UMP", province: "Maluku Utara", city: "-", year: 2026, amount: 3510240, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-033", type: "UMP", province: "Papua Barat", city: "-", year: 2026, amount: 3841000, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-034", type: "UMP", province: "Papua", city: "-", year: 2026, amount: 4436283, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-035", type: "UMP", province: "Papua Tengah", city: "-", year: 2026, amount: 4285848, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-036", type: "UMP", province: "Papua Pegunungan", city: "-", year: 2026, amount: 4508714, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-037", type: "UMP", province: "Papua Selatan", city: "-", year: 2026, amount: 4508100, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-038", type: "UMP", province: "Papua Barat Daya", city: "-", year: 2026, amount: 3766000, source: "Kemnaker 2026", status: "Aktif" },
  { id: "MW-039", type: "UMK", province: "Bali", city: "Badung", year: 2026, amount: 3534600, source: "SK Gubernur", status: "Aktif" },
];

const initialPayrollRows = [
  { id: "PAY-001", employeeId: "EMP-001", name: "Budi Santoso", period: "Mei 2026", baseSalary: 5200000, allowance: 650000, overtime: 320000, deduction: 185000, netSalary: 5985000, status: "Ready" },
  { id: "PAY-002", employeeId: "EMP-002", name: "Sari Dewi", period: "Mei 2026", baseSalary: 6100000, allowance: 800000, overtime: 0, deduction: 220000, netSalary: 6680000, status: "Ready" },
  { id: "PAY-003", employeeId: "EMP-003", name: "Agus Putra", period: "Mei 2026", baseSalary: 5400000, allowance: 500000, overtime: 780000, deduction: 245000, netSalary: 6435000, status: "Perlu Review" },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "chart" },
  { id: "employees", label: "Karyawan", icon: "users" },
  { id: "externalWorkers", label: "Tenaga Lepas", icon: "building" },
  { id: "attendance", label: "Absensi", icon: "clock" },
  { id: "minimumWages", label: "UMP/UMK", icon: "shield" },
  { id: "payroll", label: "Payroll", icon: "wallet" },
  { id: "payslips", label: "Slip Gaji", icon: "file" },
  { id: "reports", label: "Laporan", icon: "clipboard" },
  { id: "settings", label: "Pengaturan", icon: "settings" },
];

const roleAccess = {
  "Admin HR": ["dashboard", "employees", "externalWorkers", "attendance", "minimumWages", "payroll", "payslips", "reports", "settings"],
  Finance: ["dashboard", "employees", "minimumWages", "payroll", "payslips", "reports"],
  Supervisor: ["dashboard", "employees", "externalWorkers", "attendance", "reports"],
  Karyawan: ["dashboard", "attendance", "payslips"],
};

function canAccess(role, tab) {
  return (roleAccess[role] || roleAccess["Admin HR"]).includes(tab);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);
}

function getMinimumWage(employee, wageRows = initialMinimumWages) {
  const cityWage = wageRows.find((item) => item.type === "UMK" && item.status !== "Fallback UMP" && item.province === employee.province && item.city === employee.city && item.year === 2026);
  const provinceWage = wageRows.find((item) => item.type === "UMP" && item.province === employee.province && item.year === 2026);
  return cityWage || provinceWage;
}

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function getAttendanceMethodLabel(method) {
  if (method === "gps_photo") return "GPS + Foto";
  if (method === "fingerprint") return "Fingerprint";
  return "GPS";
}

const defaultUsers = [
  { id: "USR-001", name: "HR Admin", email: "admin@payroll.local", password: "admin123", role: "Admin HR", status: "Aktif" },
];

function normalizeRegionName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/^kabupaten\s+/, "")
    .replace(/^kota\s+/, "")
    .replace("kep. ", "kepulauan ")
    .replace(/\s+/g, " ")
    .trim();
}

function findProvinceWage(provinceName, wages) {
  return wages.find((item) => item.type === "UMP" && normalizeRegionName(item.province) === normalizeRegionName(provinceName));
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Browser storage can be blocked in private or restricted contexts.
    }
  }, [key, value]);

  return [value, setValue];
}

function getLocalDateISO(date = new Date()) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function getTimeValue(date = new Date()) {
  return date.toTimeString().slice(0, 5);
}

function getPeriodLabel(date = new Date()) {
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

function minutesAfterShiftStart(time, shiftStart = "08:00") {
  if (!time || time === "-") return 0;
  const [hour, minute] = time.split(":").map(Number);
  const [startHour, startMinute] = shiftStart.split(":").map(Number);
  return Math.max(0, hour * 60 + minute - (startHour * 60 + startMinute));
}

function downloadCsv(filename, headers, rows) {
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function createExcelTable(headers, rows) {
  const headerStyle = { fontWeight: "bold", backgroundColor: "#0f172a", textColor: "#ffffff", align: "center", alignVertical: "center", borderColor: "#cbd5e1" };
  const bodyStyle = { borderColor: "#cbd5e1", alignVertical: "center" };
  const sheetRows = [
    headers.map((value) => ({ value, ...headerStyle })),
    ...rows.map((row, rowIndex) => row.map((value) => ({
      value,
      ...bodyStyle,
      backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#f8fafc",
      ...(typeof value === "number" ? { type: Number, format: "#,##0" } : {}),
    }))),
  ];
  const columns = headers.map((header, index) => {
    const maxLength = Math.max(String(header).length, ...rows.slice(0, 100).map((row) => String(row[index] ?? "").length));
    return { width: Math.min(32, Math.max(12, maxLength + 2)) };
  });
  return { sheetRows, columns };
}

async function downloadExcel(filename, sheetName, headers, rows) {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");
  const { sheetRows, columns } = createExcelTable(headers, rows);
  await writeXlsxFile(sheetRows, { sheet: sheetName, columns, orientation: headers.length > 8 ? "landscape" : "portrait" }, { fontFamily: "Calibri", fontSize: 11 }).toFile(filename);
}

function ensureExcelFile(file, onInvalid) {
  if (/\.(xlsx|xls)$/i.test(file.name)) return true;
  onInvalid?.("File import harus Excel dengan format .xlsx atau .xls.");
  return false;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((item) => item.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((item) => item.trim())) rows.push(row);
  return rows;
}

function normalizeCsvHeader(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseMoneyValue(value) {
  if (typeof value === "number") return Math.round(value);
  const raw = String(value || "").trim();
  if (!raw) return 0;
  const cleaned = raw.replace(/[^\d,.-]/g, "");
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");

  if (hasComma && hasDot) {
    const lastComma = cleaned.lastIndexOf(",");
    const lastDot = cleaned.lastIndexOf(".");
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    const normalized = cleaned.replaceAll(thousandsSeparator, "").replace(decimalSeparator, ".");
    return Math.round(Number(normalized) || 0);
  }

  if (hasComma) {
    const [whole, fraction] = cleaned.split(",");
    if ((fraction || "").length === 3) return Number(`${whole}${fraction}`) || 0;
    return Math.round(Number(cleaned.replace(",", ".")) || 0);
  }

  if (hasDot) {
    const parts = cleaned.split(".");
    if (parts.length > 2 || parts.at(-1)?.length === 3) return Number(parts.join("")) || 0;
    return Math.round(Number(cleaned) || 0);
  }

  return Number(cleaned.replace(/\D/g, "")) || 0;
}

function readTableFile(file, callback) {
  const reader = new FileReader();

  reader.onload = async () => {
    if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls")) {
      const { default: readXlsxFile } = await import("read-excel-file/browser");
      callback(await readXlsxFile(file));
      return;
    }

    callback(parseCsv(String(reader.result || "")));
  };

  if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls")) {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
}

function toTitleCase(value) {
  return String(value || "").toLowerCase().split(" ").map((part) => part ? part.charAt(0).toUpperCase() + part.slice(1) : "").join(" ");
}

async function downloadTemplate(type, wageRows = []) {
  const baseType = type.replace("_xlsx", "");
  let filename = "";
  let headers = [];
  let rows = [];

  if (baseType === "ump") {
    const provinces = [...new Set(initialMinimumWages.filter((item) => item.type === "UMP").map((item) => item.province))].sort();
    filename = "template-ump-provinsi";
    headers = ["Provinsi", "Tahun", "UMP", "Sumber"];
    rows = provinces.map((province) => {
      const provinceName = toTitleCase(province);
      const wage = wageRows.find((item) => item.type === "UMP" && normalizeRegionName(item.province) === normalizeRegionName(provinceName) && item.year === 2026);
      return [provinceName, 2026, wage?.amount || "", wage?.source || "SK Gubernur"];
    });
  } else {
    filename = "template-umk-kabupaten-kota";
    headers = ["Provinsi", "Kabupaten/Kota", "Tahun", "UMK", "Sumber", "Status"];
    rows = indonesiaRegencies.map((item) => {
      const province = toTitleCase(item.province);
      const city = toTitleCase(item.regency);
      const wage = wageRows.find((row) => row.type === "UMK" && normalizeRegionName(row.province) === normalizeRegionName(province) && normalizeRegionName(row.city) === normalizeRegionName(city) && row.year === 2026);
      return [province, city, 2026, wage?.amount || "", wage?.source || "SK Gubernur", wage ? "Terisi" : "Perlu Diisi"];
    });
  }

  await downloadExcel(`${filename}.xlsx`, baseType.toUpperCase(), headers, rows);
}

async function downloadEmployeeTemplate(employees = []) {
  const headers = ["ID", "Nama", "NIK", "NPWP", "BPJS Kesehatan", "BPJS Ketenagakerjaan", "Tanggal Masuk", "Tanggal Keluar", "Atasan", "Kontrak", "Jabatan", "Divisi", "Business Unit", "Cost Center", "Lokasi Kerja", "Cabang", "Provinsi", "Kota/Kab", "Status", "Gaji Pokok", "Bank", "No Rekening"];
  const rows = (employees.length ? employees : initialEmployees).map((employee) => [employee.id, employee.name, employee.nik || "", employee.npwp || "", employee.bpjsKesehatan || "", employee.bpjsKetenagakerjaan || "", employee.joinDate || "", employee.endDate || "", employee.manager || "", employee.contractType || "", employee.role, employee.department, employee.businessUnit || "", employee.costCenter || "", employee.workLocation || "", employee.branch, employee.province, employee.city, employee.status, employee.salary, employee.bank || "", employee.bankAccount || ""]);
  await downloadExcel("template-import-karyawan.xlsx", "Template Karyawan", headers, rows);
}

async function downloadExternalWorkerTemplate(externalWorkers = []) {
  const headers = ["ID", "Nama", "Tipe", "Vendor", "Proyek", "Keahlian", "Supervisor", "Lokasi", "Provinsi", "Kota", "Mulai", "Selesai", "Rate Harian", "Status", "Telepon", "Bank", "No Rekening"];
  const rows = (externalWorkers.length ? externalWorkers : initialExternalWorkers).map((worker) => [worker.id, worker.name, worker.workerType, worker.vendor, worker.project, worker.skill, worker.supervisor, worker.workLocation, worker.province, worker.city, worker.startDate, worker.endDate, worker.dailyRate, worker.status, worker.phone, worker.bank, worker.bankAccount]);
  await downloadExcel("template-import-tenaga-lepas.xlsx", "Template Tenaga Lepas", headers, rows);
}

function runSmokeTests() {
  console.assert(formatCurrency(1000).includes("1.000"), "formatCurrency should format IDR values");
  console.assert(getMinimumWage({ province: "Bali", city: "Badung" }, [...initialMinimumWages, { type: "UMK", province: "Bali", city: "Badung", year: 2026, amount: 3534600 }])?.type === "UMK", "Badung should use UMK before UMP when UMK exists");
  console.assert(getMinimumWage({ province: "Bali", city: "Denpasar" })?.type === "UMP", "Denpasar should fallback to UMP");
  console.assert(classNames("a", false, "b") === "a b", "classNames should remove falsy values");
  console.assert(getAttendanceMethodLabel("gps_photo") === "GPS + Foto", "gps_photo should display as GPS + Foto");
}

if (typeof window !== "undefined" && !window.__PAYROLL_APP_TESTED__) {
  window.__PAYROLL_APP_TESTED__ = true;
  runSmokeTests();
}

function StatCard({ title, value, description, icon, tone = "blue" }) {
  const toneMap = { blue: "bg-blue-50 text-blue-700 ring-blue-100", green: "bg-emerald-50 text-emerald-700 ring-emerald-100", amber: "bg-amber-50 text-amber-700 ring-amber-100", red: "bg-rose-50 text-rose-700 ring-rose-100", purple: "bg-violet-50 text-violet-700 ring-violet-100" };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-sm text-slate-500">{description}</p></div>
        <div className={classNames("rounded-2xl p-3 ring-1", toneMap[tone])}><Icon name={icon} className="h-5 w-5" /></div>
      </div>
    </div>
  );
}

function Badge({ children, tone = "slate" }) {
  const toneMap = { slate: "bg-slate-100 text-slate-700", green: "bg-emerald-100 text-emerald-700", amber: "bg-amber-100 text-amber-800", red: "bg-rose-100 text-rose-700", blue: "bg-blue-100 text-blue-700", purple: "bg-violet-100 text-violet-700" };
  return <span className={classNames("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", toneMap[tone])}>{children}</span>;
}

function Header({ activeLabel, sidebarOpen, setSidebarOpen, currentUser, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"><Icon name="menu" className="h-5 w-5" /></button>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Payroll & Absensi</p><h1 className="text-lg font-bold text-slate-950">{activeLabel}</h1></div>
        </div>
        <div className="flex items-center gap-3"><div className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 md:block">Periode Payroll: <span className="font-semibold text-slate-900">Mei 2026</span></div><div className="hidden text-right text-sm md:block"><p className="font-bold text-slate-950">{currentUser?.name}</p><p className="text-xs text-slate-500">{currentUser?.role}</p></div><button type="button" onClick={onLogout} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Logout</button><div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{currentUser?.name?.slice(0, 2).toUpperCase() || "HR"}</div></div>
      </div>
    </header>
  );
}

function AuthScreen({ users, setUsers, setCurrentUser }) {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Admin HR" });

  function submitAuth(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const existing = users.find((user) => user.email.toLowerCase() === email);

    if (mode === "login") {
      if (!existing || existing.password !== form.password) {
        setMessage("Email atau password salah.");
        return;
      }
      setCurrentUser(existing);
      setMessage("");
      return;
    }

    if (existing) {
      setMessage("Email sudah terdaftar.");
      return;
    }

    const nextUser = { id: `USR-${String(users.length + 1).padStart(3, "0")}`, name: form.name, email, password: form.password, role: form.role, status: "Aktif" };
    setUsers([...users, nextUser]);
    setCurrentUser(nextUser);
    setMessage("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white"><Icon name="money" /></div>
          <div>
            <p className="text-sm text-slate-500">Aplikasi</p>
            <h1 className="text-xl font-bold text-slate-950">PayRollix</h1>
          </div>
        </div>
        <div className="mb-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
          <button type="button" onClick={() => setMode("login")} className={classNames("rounded-xl px-4 py-2 text-sm font-bold", mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500")}>Login</button>
          <button type="button" onClick={() => setMode("register")} className={classNames("rounded-xl px-4 py-2 text-sm font-bold", mode === "register" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500")}>Register</button>
        </div>
        <form onSubmit={submitAuth} className="space-y-3">
          {mode === "register" && <label className="block"><span className="text-sm font-semibold text-slate-600">Nama</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-blue-100 focus:ring-4" /></label>}
          <label className="block"><span className="text-sm font-semibold text-slate-600">Email</span><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-blue-100 focus:ring-4" /></label>
          <label className="block"><span className="text-sm font-semibold text-slate-600">Password</span><input required type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-blue-100 focus:ring-4" /></label>
          {mode === "register" && <label className="block"><span className="text-sm font-semibold text-slate-600">Role</span><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-blue-100 focus:ring-4"><option>Admin HR</option><option>Finance</option><option>Supervisor</option><option>Karyawan</option></select></label>}
          {message && <div className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{message}</div>}
          <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">{mode === "login" ? "Masuk" : "Daftar & Masuk"}</button>
        </form>
        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          Default admin: <span className="font-semibold text-slate-950">admin@payroll.local</span> / <span className="font-semibold text-slate-950">admin123</span>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, currentUser }) {
  const allowedNavItems = navItems.filter((item) => canAccess(currentUser?.role, item.id));
  return (
    <aside className={classNames("fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
      <div className="mb-8 flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><Icon name="money" className="h-6 w-6" /></div><div><p className="text-sm text-white/60">Aplikasi</p><p className="text-lg font-bold">PayRollix</p></div></div>
      <nav className="space-y-1">
        {allowedNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={classNames("flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition", isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950")}><Icon name={item.icon} className="h-5 w-5" />{item.label}</button>;
        })}
      </nav>
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4"><div className="flex gap-3"><Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><div><p className="text-sm font-bold text-amber-900">Validasi UMP/UMK</p><p className="mt-1 text-sm leading-6 text-amber-800">Sistem memberi peringatan jika gaji pokok karyawan di bawah standar minimum lokasi kerja.</p></div></div></div>
    </aside>
  );
}

function Dashboard({ employees, attendance, externalWorkers, minimumWages, payrollRows, auditLogs, currentUser }) {
  const today = getLocalDateISO();
  const todayAttendance = attendance.filter((item) => item.date === today);
  const attendanceRows = todayAttendance.length ? todayAttendance : attendance;
  const presentToday = attendanceRows.filter((item) => item.status === "Hadir" || item.status === "Terlambat").length;
  const lateToday = attendanceRows.filter((item) => item.lateMinutes > 0 || item.status === "Terlambat").length;
  const missingAttendance = Math.max(0, employees.filter((employee) => employee.status !== "Nonaktif").length - presentToday);
  const warningEmployees = employees.filter((employee) => { const wage = getMinimumWage(employee, minimumWages); return wage && employee.salary < wage.amount; });
  const activeEmployees = employees.filter((employee) => employee.status === "Aktif").length;
  const contractEmployees = employees.filter((employee) => employee.status === "Kontrak").length;
  const activeExternalWorkers = externalWorkers.filter((worker) => worker.status === "Aktif").length;
  const totalPayroll = payrollRows.reduce((sum, row) => sum + Number(row.netSalary || 0), 0);
  const totalGrossPayroll = payrollRows.reduce((sum, row) => sum + Number(row.grossSalary || row.baseSalary + row.allowance + row.overtime || 0), 0);
  const totalDeductions = payrollRows.reduce((sum, row) => sum + Number(row.deduction || 0), 0);
  const approvedPayroll = payrollRows.filter((row) => row.status === "Approved").length;
  const reviewPayroll = payrollRows.filter((row) => row.status === "Perlu Review").length;
  const attendanceRate = employees.length ? Math.round((presentToday / employees.length) * 100) : 0;
  const lateMinutes = attendanceRows.reduce((sum, row) => sum + Number(row.lateMinutes || 0), 0);
  const attendanceDateLabel = attendanceRows[0]?.date || today;
  const payrollPeriod = payrollRows[0]?.period || getPeriodLabel();
  const departmentSummary = Object.entries(employees.reduce((acc, employee) => {
    const department = employee.department || "Tanpa Divisi";
    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const locationSummary = Object.entries(employees.reduce((acc, employee) => {
    const location = employee.workLocation || employee.branch || "Tanpa Lokasi";
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const upcomingContracts = employees
    .filter((employee) => employee.endDate)
    .map((employee) => ({ ...employee, daysLeft: Math.ceil((new Date(employee.endDate) - new Date(today)) / 86400000) }))
    .filter((employee) => employee.daysLeft >= 0 && employee.daysLeft <= 90)
    .sort((a, b) => a.daysLeft - b.daysLeft);
  const payrollStatus = payrollRows.length && approvedPayroll === payrollRows.length ? "Approved" : reviewPayroll ? "Perlu Review" : "Ready";
  const payrollStatusTone = payrollStatus === "Approved" ? "green" : payrollStatus === "Perlu Review" ? "amber" : "blue";
  const latestAuditLogs = auditLogs.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Ringkasan Operasional</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Selamat bekerja, {currentUser?.name || "Tim HR"}</h2>
            <p className="mt-1 text-sm text-slate-500">Data absensi {attendanceDateLabel}, payroll {payrollPeriod}, validasi UMP/UMK, dan komposisi tenaga kerja.</p>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">Tingkat Hadir</p><p className="mt-1 text-xl font-bold text-slate-950">{attendanceRate}%</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">Tenaga Lepas Aktif</p><p className="mt-1 text-xl font-bold text-slate-950">{activeExternalWorkers}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">Status Payroll</p><p className="mt-2"><Badge tone={payrollStatusTone}>{payrollStatus}</Badge></p></div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Karyawan Aktif" value={activeEmployees} description={`${contractEmployees} kontrak, ${employees.length} total data`} icon="users" tone="blue" />
        <StatCard title="Hadir Hari Ini" value={presentToday} description={`${missingAttendance} belum check-in`} icon="check" tone="green" />
        <StatCard title="Terlambat" value={lateToday} description={`${lateMinutes} menit akumulasi terlambat`} icon="clock" tone="amber" />
        <StatCard title="Payroll Bersih" value={formatCurrency(totalPayroll)} description={`Bruto ${formatCurrency(totalGrossPayroll)}`} icon="wallet" tone="purple" />
      </div>
      <div className="grid gap-6 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-950">Ringkasan Absensi Hari Ini</h2><p className="text-sm text-slate-500">Monitoring check-in, check-out, GPS, foto, dan fingerprint.</p></div><Badge tone="blue">Real-time</Badge></div>
          <DataTable headers={["Karyawan", "Masuk", "Pulang", "Metode", "Status"]} rows={attendanceRows.map((row) => [row.employeeName, row.checkIn, row.checkOut, row.method, <Badge tone={row.status === "Terlambat" ? "amber" : "green"}>{row.status}</Badge>])} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Peringatan UMP/UMK</h2><p className="mt-1 text-sm text-slate-500">Validasi otomatis berdasarkan lokasi kerja.</p>
          <div className="mt-5 space-y-3">{warningEmployees.length === 0 ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">Semua gaji pokok karyawan sudah memenuhi UMP/UMK aktif.</div> : warningEmployees.map((employee) => { const wage = getMinimumWage(employee, minimumWages); return <div key={employee.id} className="rounded-2xl border border-rose-200 bg-rose-50 p-4"><p className="font-bold text-rose-800">{employee.name}</p><p className="mt-1 text-sm text-rose-700">Gaji {formatCurrency(employee.salary)} di bawah {wage.type} {formatCurrency(wage.amount)}.</p></div>; })}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Payroll</h2><p className="mt-1 text-sm text-slate-500">Ringkasan nominal periode berjalan.</p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Bruto</span><strong>{formatCurrency(totalGrossPayroll)}</strong></div>
            <div className="flex justify-between text-rose-600"><span>Total potongan</span><strong>-{formatCurrency(totalDeductions)}</strong></div>
            <div className="flex justify-between rounded-2xl bg-slate-950 p-4 text-white"><span>Gaji bersih</span><strong>{formatCurrency(totalPayroll)}</strong></div>
            <div className="flex items-center justify-between pt-1"><span className="text-slate-500">Approved</span><Badge tone="green">{approvedPayroll}/{payrollRows.length}</Badge></div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Komposisi Divisi</h2>
          <div className="mt-5 space-y-4">{departmentSummary.map(([department, count]) => <div key={department}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-slate-700">{department}</span><span className="text-slate-500">{count} orang</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${employees.length ? Math.round((count / employees.length) * 100) : 0}%` }} /></div></div>)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Lokasi Kerja</h2>
          <div className="mt-5 space-y-3">{locationSummary.map(([location, count]) => <div key={location} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm"><span className="font-semibold text-slate-700">{location}</span><Badge tone="blue">{count} orang</Badge></div>)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Kontrak Mendekati Akhir</h2><p className="mt-1 text-sm text-slate-500">Dalam 90 hari ke depan.</p>
          <div className="mt-5 space-y-3">{upcomingContracts.length === 0 ? <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Tidak ada kontrak yang segera berakhir.</div> : upcomingContracts.map((employee) => <div key={employee.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="font-bold text-amber-900">{employee.name}</p><p className="mt-1 text-sm text-amber-800">Berakhir {employee.endDate}, sisa {employee.daysLeft} hari.</p></div>)}</div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Perlu Tindak Lanjut</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-800">Absensi Belum Lengkap</p><p className="mt-2 text-2xl font-bold text-amber-900">{missingAttendance}</p></div>
            <div className="rounded-2xl bg-rose-50 p-4"><p className="text-sm font-semibold text-rose-700">Gaji di Bawah Minimum</p><p className="mt-2 text-2xl font-bold text-rose-800">{warningEmployees.length}</p></div>
            <div className="rounded-2xl bg-blue-50 p-4"><p className="text-sm font-semibold text-blue-700">Payroll Perlu Review</p><p className="mt-2 text-2xl font-bold text-blue-800">{reviewPayroll}</p></div>
            <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-sm font-semibold text-emerald-700">Tenaga Lepas Aktif</p><p className="mt-2 text-2xl font-bold text-emerald-800">{activeExternalWorkers}</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Aktivitas Terakhir</h2><p className="mt-1 text-sm text-slate-500">Jejak audit terbaru dari aplikasi.</p>
          <div className="mt-5 space-y-3">{latestAuditLogs.length === 0 ? <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Belum ada aktivitas audit.</div> : latestAuditLogs.map((log) => <div key={log.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><p className="font-bold text-slate-900">{log.action}</p><span className="text-xs text-slate-400">{log.time}</span></div><p className="mt-1 text-sm text-slate-500">{log.detail || log.user}</p></div>)}</div>
        </div>
      </div>
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase text-slate-400"><tr>{headers.map((header) => <th key={header} className="py-3 pr-4">{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className="py-3 pr-4 text-slate-600">{cell}</td>)}</tr>)}</tbody></table></div>
  );
}

function Employees({ employees, setEmployees, minimumWages }) {
  const [query, setQuery] = useState("");
  const emptyForm = { name: "", nik: "", npwp: "", bpjsKesehatan: "", bpjsKetenagakerjaan: "", joinDate: "", endDate: "", manager: "", contractType: "PKWTT", role: "", department: "", businessUnit: "", costCenter: "", workLocation: "", branch: "Bali", province: "Bali", city: "Denpasar", status: "Aktif", salary: "", bank: "", bankAccount: "" };
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(employees[0]?.id || "");
  const [editingId, setEditingId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const filteredEmployees = useMemo(() => employees.filter((employee) => [employee.name, employee.id, employee.department, employee.role].join(" ").toLowerCase().includes(query.toLowerCase())), [employees, query]);
  const selected = employees.find((employee) => employee.id === selectedId) || filteredEmployees[0] || employees[0];

  function addEmployee(event) {
    event.preventDefault();
    const payload = { ...form, id: editingId || `EMP-${String(employees.length + 1).padStart(3, "0")}`, salary: Number(form.salary || 0), bank: form.bank || "-", status: form.status || "Aktif" };
    setEmployees(editingId ? employees.map((employee) => employee.id === editingId ? payload : employee) : [...employees, payload]);
    setSelectedId(payload.id);
    setEditingId("");
    setForm(emptyForm);
    setShowForm(false);
  }

  function editEmployee(employee) {
    setEditingId(employee.id);
    setForm({ ...emptyForm, ...employee, salary: String(employee.salary || "") });
    setShowForm(true);
  }

  function deleteEmployee(id) {
    setEmployees(employees.filter((employee) => employee.id !== id));
    setSelectedId(employees.find((employee) => employee.id !== id)?.id || "");
  }

  function exportEmployees(format) {
    const headers = ["ID", "Nama", "NIK", "NPWP", "BPJS Kesehatan", "BPJS Ketenagakerjaan", "Tanggal Masuk", "Tanggal Keluar", "Atasan", "Kontrak", "Jabatan", "Divisi", "Business Unit", "Cost Center", "Lokasi Kerja", "Cabang", "Provinsi", "Kota/Kab", "Status", "Gaji Pokok", "Bank", "No Rekening"];
    const rows = employees.map((employee) => [employee.id, employee.name, employee.nik || "", employee.npwp || "", employee.bpjsKesehatan || "", employee.bpjsKetenagakerjaan || "", employee.joinDate || "", employee.endDate || "", employee.manager || "", employee.contractType || "", employee.role, employee.department, employee.businessUnit || "", employee.costCenter || "", employee.workLocation || "", employee.branch, employee.province, employee.city, employee.status, employee.salary, employee.bank || "", employee.bankAccount || ""]);
    if (format === "excel") downloadExcel("master-karyawan.xlsx", "Karyawan", headers, rows);
    else downloadCsv("master-karyawan.csv", headers, rows);
  }

  function importEmployees(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ensureExcelFile(file, alert)) {
      event.target.value = "";
      return;
    }
    readTableFile(file, (rows) => {
      const [headers, ...records] = rows;
      const headerMap = Object.fromEntries((headers || []).map((header, index) => [normalizeCsvHeader(header), index]));
      const get = (record, keys) => record[keys.map((key) => headerMap[normalizeCsvHeader(key)]).find((index) => index !== undefined)] || "";
      const imported = records.map((record, index) => ({
        id: get(record, ["ID"]) || `EMP-IMP-${Date.now()}-${index}`,
        name: get(record, ["Nama", "Nama Lengkap"]),
        nik: get(record, ["NIK", "NIK/KTP"]),
        npwp: get(record, ["NPWP"]),
        bpjsKesehatan: get(record, ["BPJS Kesehatan"]),
        bpjsKetenagakerjaan: get(record, ["BPJS Ketenagakerjaan"]),
        joinDate: get(record, ["Tanggal Masuk"]),
        endDate: get(record, ["Tanggal Keluar"]),
        manager: get(record, ["Atasan"]),
        contractType: get(record, ["Kontrak", "Tipe Kontrak"]) || "PKWTT",
        role: get(record, ["Jabatan"]),
        department: get(record, ["Divisi", "Departemen"]),
        businessUnit: get(record, ["Business Unit"]),
        costCenter: get(record, ["Cost Center"]),
        workLocation: get(record, ["Lokasi Kerja"]),
        branch: get(record, ["Cabang"]) || "-",
        province: get(record, ["Provinsi", "Provinsi Kerja"]),
        city: get(record, ["Kota/Kab", "Kota/Kabupaten Kerja", "Kota"]),
        status: get(record, ["Status"]) || "Aktif",
        salary: parseMoneyValue(get(record, ["Gaji Pokok", "Salary"])),
        bank: get(record, ["Bank"]) || "-",
        bankAccount: get(record, ["No Rekening", "Nomor Rekening"]),
      })).filter((employee) => employee.name);
      const importedIds = new Set(imported.map((employee) => employee.id));
      setEmployees([...employees.filter((employee) => !importedIds.has(employee.id)), ...imported]);
      event.target.value = "";
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-bold text-slate-950">Database Karyawan</h2><p className="text-sm text-slate-500">Kelola master data, dokumen, payroll, dan struktur ERP.</p></div><div className="flex flex-col gap-2 md:flex-row"><button type="button" onClick={() => { setEditingId(""); setForm(emptyForm); setShowForm(true); }} className="rounded-2xl bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700">Tambah Karyawan</button><label className="cursor-pointer rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Import Excel<input type="file" accept=".xlsx,.xls" onChange={importEmployees} className="hidden" /></label><button type="button" onClick={() => downloadEmployeeTemplate(employees)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Template Excel</button><button type="button" onClick={() => exportEmployees("csv")} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Export CSV</button><button type="button" onClick={() => exportEmployees("excel")} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Export Excel</button><div className="relative w-full md:w-72"><Icon name="search" className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari karyawan..." className="w-full rounded-2xl border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none ring-blue-100 focus:ring-4" /></div></div></div>
        <DataTable headers={["ID", "Nama", "Unit", "Cost Center", "Lokasi", "Gaji Pokok", "Status", "Aksi"]} rows={filteredEmployees.map((employee) => { const wage = getMinimumWage(employee, minimumWages); const belowMinimum = wage && employee.salary < wage.amount; return [employee.id, <button type="button" onClick={() => { setSelectedId(employee.id); setShowPreview(true); }} className="text-left"><p className="font-bold text-slate-900">{employee.name}</p><p className="text-xs text-slate-500">{employee.role}</p></button>, <div><p>{employee.department}</p><p className="text-xs text-slate-400">{employee.businessUnit || "-"}</p></div>, employee.costCenter || "-", <div><p>{employee.workLocation || employee.branch}</p><p className="text-xs text-slate-400">{employee.city}, {employee.province}</p></div>, <div><p className="font-semibold text-slate-900">{formatCurrency(employee.salary)}</p>{belowMinimum && <p className="text-xs font-semibold text-rose-600">Di bawah {wage.type}</p>}</div>, <Badge tone={employee.status === "Aktif" ? "green" : "amber"}>{employee.status}</Badge>, <div className="flex gap-2"><button type="button" onClick={() => { setSelectedId(employee.id); setShowPreview(true); }} className="text-xs font-bold text-slate-700">Preview</button><button type="button" onClick={() => editEmployee(employee)} className="text-xs font-bold text-blue-700">Edit</button><button type="button" onClick={() => deleteEmployee(employee.id)} className="text-xs font-bold text-rose-700">Hapus</button></div>]; })} />
      </div>
      {showPreview && selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-lg font-bold text-slate-950">Preview Data Karyawan</h3><p className="text-sm text-slate-500">{selected.id} • {selected.name}</p></div><button type="button" onClick={() => setShowPreview(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Tutup</button></div><div className="grid gap-3 text-sm md:grid-cols-3">{[["NIK", selected.nik], ["NPWP", selected.npwp], ["BPJS Kesehatan", selected.bpjsKesehatan], ["BPJS Ketenagakerjaan", selected.bpjsKetenagakerjaan], ["Tanggal Masuk", selected.joinDate], ["Tanggal Keluar", selected.endDate || "-"], ["Atasan", selected.manager], ["Kontrak", selected.contractType], ["Bank", `${selected.bank || "-"} ${selected.bankAccount || ""}`], ["Jabatan", selected.role], ["Divisi", selected.department], ["Business Unit", selected.businessUnit], ["Cost Center", selected.costCenter], ["Lokasi", selected.workLocation], ["Cabang", selected.branch], ["Wilayah", `${selected.city}, ${selected.province}`], ["Gaji Pokok", formatCurrency(selected.salary)], ["Status", selected.status]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-800">{value || "-"}</p></div>)}</div></div></div>}
      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={addEmployee} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-950">{editingId ? "Edit Karyawan" : "Tambah Karyawan"}</h2><p className="text-sm text-slate-500">Master data HR lengkap.</p></div><button type="button" onClick={() => setShowForm(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Tutup</button></div><div className="grid gap-3 md:grid-cols-3">{[["name", "Nama Lengkap"], ["nik", "NIK/KTP"], ["npwp", "NPWP"], ["bpjsKesehatan", "BPJS Kesehatan"], ["bpjsKetenagakerjaan", "BPJS Ketenagakerjaan"], ["joinDate", "Tanggal Masuk"], ["endDate", "Tanggal Keluar"], ["manager", "Atasan"], ["contractType", "Tipe Kontrak"], ["role", "Jabatan"], ["department", "Divisi"], ["businessUnit", "Business Unit"], ["costCenter", "Cost Center"], ["workLocation", "Lokasi Kerja"], ["branch", "Cabang"], ["province", "Provinsi Kerja"], ["city", "Kota/Kabupaten Kerja"], ["status", "Status"], ["salary", "Gaji Pokok"], ["bank", "Bank"], ["bankAccount", "No Rekening"]].map(([name, label]) => <label key={name} className="block"><span className="text-sm font-semibold text-slate-600">{label}</span><input required={name === "name" || name === "salary"} type={name === "salary" ? "number" : name.includes("Date") ? "date" : "text"} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none ring-blue-100 focus:ring-4" /></label>)}</div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => { setEditingId(""); setForm(emptyForm); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Reset</button><button className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700">Simpan</button></div></form></div>}
    </div>
  );
}

function MobileAttendanceScreen({
  employees,
  selectedEmployee,
  setSelectedEmployee,
  method,
  setMethod,
  locationStatus,
  photoStatus,
  fingerprintStatus,
  getLocation,
  createAttendance,
}) {
  const selected = employees.find((employee) => employee.id === selectedEmployee) || employees[0];
  const now = new Date();
  const currentTime = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const currentDate = now.toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[2.2rem] border border-slate-300 bg-slate-950 p-3 shadow-2xl">
      <div className="overflow-hidden rounded-[1.7rem] bg-slate-50">
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-slate-950 px-5 pb-6 pt-4 text-white">
          <div className="mb-5 flex items-center justify-between text-xs text-white/80">
            <span>{currentTime}</span>
            <span className="rounded-full bg-white/15 px-2 py-1">4G • 89%</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/70">Absensi Mobile</p>
              <h2 className="mt-1 text-2xl font-bold">Halo, {selected?.name?.split(" ")[0] || "Karyawan"}</h2>
              <p className="mt-1 text-sm text-white/70">{currentDate}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 ring-1 ring-white/20">
              <Icon name="clock" className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Pilih Karyawan</span>
              <select
                value={selectedEmployee}
                onChange={(event) => setSelectedEmployee(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none ring-blue-100 focus:ring-4"
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Lokasi Kerja</p>
                <p className="mt-1 font-bold text-slate-900">{selected?.branch || "-"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Shift</p>
                <p className="mt-1 font-bold text-slate-900">08:00 - 17:00</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Metode Absensi</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{getAttendanceMethodLabel(method)}</p>
              </div>
              <Badge tone="green">Siap</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["gps", "GPS", "pin"],
                ["gps_photo", "Foto", "camera"],
                ["fingerprint", "Finger", "fingerprint"],
              ].map(([value, label, icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMethod(value)}
                  className={classNames(
                    "flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold transition",
                    method === value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon name={icon} className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <Icon name="pin" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-950">Validasi Lokasi</p>
                <p className="mt-1 break-words text-sm leading-6 text-slate-500">{locationStatus}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={getLocation}
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Ambil GPS Sekarang
            </button>
            <div className="mt-3 grid gap-2 text-xs text-slate-500">
              <p>{photoStatus}</p>
              <p>{fingerprintStatus}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => createAttendance("check_in")}
              className="rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
            >
              Check-in
            </button>
            <button
              type="button"
              onClick={() => createAttendance("check_out")}
              className="rounded-3xl bg-slate-950 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800"
            >
              Check-out
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 rounded-3xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-500">
            {[["Home", "chart"], ["Absen", "clock"], ["Slip", "file"], ["Profil", "users"]].map(([label, icon]) => (
              <button key={label} className={classNames("flex flex-col items-center gap-1 rounded-2xl px-2 py-2", label === "Absen" && "bg-blue-50 text-blue-700")}>
                <Icon name={icon} className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExternalWorkers({ externalWorkers, setExternalWorkers }) {
  const emptyForm = { name: "", workerType: "Outsourcing", vendor: "", project: "", skill: "", supervisor: "", workLocation: "", province: "", city: "", startDate: "", endDate: "", dailyRate: "", status: "Aktif", phone: "", bank: "", bankAccount: "" };
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [selectedId, setSelectedId] = useState(externalWorkers[0]?.id || "");
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const filtered = externalWorkers.filter((worker) => {
    const matchesType = typeFilter === "all" || worker.workerType === typeFilter;
    const text = [worker.name, worker.workerType, worker.vendor, worker.project, worker.skill, worker.supervisor, worker.workLocation].join(" ").toLowerCase();
    return matchesType && text.includes(query.toLowerCase());
  });
  const selected = externalWorkers.find((worker) => worker.id === selectedId) || filtered[0] || externalWorkers[0];
  const activeCount = externalWorkers.filter((worker) => worker.status === "Aktif").length;
  const estimatedCost = externalWorkers.reduce((sum, worker) => sum + Number(worker.dailyRate || 0), 0);

  function saveWorker(event) {
    event.preventDefault();
    const payload = { ...form, id: editingId || `EXT-${String(externalWorkers.length + 1).padStart(3, "0")}`, dailyRate: Number(form.dailyRate || 0) };
    setExternalWorkers(editingId ? externalWorkers.map((worker) => worker.id === editingId ? payload : worker) : [...externalWorkers, payload]);
    setSelectedId(payload.id);
    setEditingId("");
    setForm(emptyForm);
    setShowForm(false);
  }

  function editWorker(worker) {
    setEditingId(worker.id);
    setForm({ ...emptyForm, ...worker, dailyRate: String(worker.dailyRate || "") });
    setShowForm(true);
  }

  function deleteWorker(id) {
    setExternalWorkers(externalWorkers.filter((worker) => worker.id !== id));
    setSelectedId(externalWorkers.find((worker) => worker.id !== id)?.id || "");
  }

  function exportWorkers(format) {
    const headers = ["ID", "Nama", "Tipe", "Vendor", "Proyek", "Keahlian", "Supervisor", "Lokasi", "Provinsi", "Kota", "Mulai", "Selesai", "Rate Harian", "Status", "Telepon", "Bank", "No Rekening"];
    const rows = externalWorkers.map((worker) => [worker.id, worker.name, worker.workerType, worker.vendor, worker.project, worker.skill, worker.supervisor, worker.workLocation, worker.province, worker.city, worker.startDate, worker.endDate, worker.dailyRate, worker.status, worker.phone, worker.bank, worker.bankAccount]);
    if (format === "excel") downloadExcel("tenaga-lepas.xlsx", "Tenaga Lepas", headers, rows);
    else downloadCsv("tenaga-lepas.csv", headers, rows);
  }

  function importWorkers(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ensureExcelFile(file, alert)) {
      event.target.value = "";
      return;
    }
    readTableFile(file, (rows) => {
      const [headers, ...records] = rows;
      const headerMap = Object.fromEntries((headers || []).map((header, index) => [normalizeCsvHeader(header), index]));
      const get = (record, keys) => record[keys.map((key) => headerMap[normalizeCsvHeader(key)]).find((index) => index !== undefined)] || "";
      const imported = records.map((record, index) => ({
        id: get(record, ["ID"]) || `EXT-IMP-${Date.now()}-${index}`,
        name: get(record, ["Nama"]),
        workerType: get(record, ["Tipe"]) || "Pekerja Lepas",
        vendor: get(record, ["Vendor"]),
        project: get(record, ["Proyek", "Proyek/Unit"]),
        skill: get(record, ["Keahlian", "Skill"]),
        supervisor: get(record, ["Supervisor"]),
        workLocation: get(record, ["Lokasi", "Lokasi Kerja"]),
        province: get(record, ["Provinsi"]),
        city: get(record, ["Kota", "Kota/Kabupaten"]),
        startDate: get(record, ["Mulai", "Tanggal Mulai"]),
        endDate: get(record, ["Selesai", "Tanggal Selesai"]),
        dailyRate: parseMoneyValue(get(record, ["Rate", "Rate Harian"])),
        status: get(record, ["Status"]) || "Aktif",
        phone: get(record, ["Telepon", "Phone"]),
        bank: get(record, ["Bank"]),
        bankAccount: get(record, ["No Rekening", "Nomor Rekening"]),
      })).filter((worker) => worker.name);
      const importedIds = new Set(imported.map((worker) => worker.id));
      setExternalWorkers([...externalWorkers.filter((worker) => !importedIds.has(worker.id)), ...imported]);
      event.target.value = "";
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Tenaga" value={externalWorkers.length} description="Outsourcing/lepas/proyek" icon="users" tone="blue" />
        <StatCard title="Aktif" value={activeCount} description="Sedang bekerja" icon="check" tone="green" />
        <StatCard title="Estimasi Harian" value={formatCurrency(estimatedCost)} description="Akumulasi rate per hari" icon="wallet" tone="amber" />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div><h2 className="text-lg font-bold text-slate-950">Tenaga Outsourcing / Lepas / Proyek</h2><p className="text-sm text-slate-500">Kelola pekerja non-karyawan untuk proyek, vendor, outlet, gudang, atau unit kerja sementara.</p></div>
          <div className="flex flex-col gap-2 md:flex-row">
            <button type="button" onClick={() => { setEditingId(""); setForm(emptyForm); setShowForm(true); }} className="rounded-2xl bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700">Tambah Tenaga</button>
            <label className="cursor-pointer rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Import Excel<input type="file" accept=".xlsx,.xls" onChange={importWorkers} className="hidden" /></label>
            <button type="button" onClick={() => downloadExternalWorkerTemplate(externalWorkers)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Template Excel</button>
            <button type="button" onClick={() => exportWorkers("csv")} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Export CSV</button>
            <button type="button" onClick={() => exportWorkers("excel")} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Export Excel</button>
          </div>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative"><Icon name="search" className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, vendor, proyek, skill..." className="w-full rounded-2xl border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none ring-blue-100 focus:ring-4" /></div>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"><option value="all">Semua tipe</option><option>Outsourcing</option><option>Pekerja Lepas</option><option>Pekerja Proyek</option></select>
        </div>
        <DataTable headers={["ID", "Nama", "Tipe", "Vendor/Proyek", "Skill", "Rate", "Status", "Aksi"]} rows={filtered.map((worker) => [worker.id, <button type="button" onClick={() => { setSelectedId(worker.id); setShowPreview(true); }} className="text-left"><p className="font-bold text-slate-900">{worker.name}</p><p className="text-xs text-slate-500">{worker.phone || "-"}</p></button>, <Badge tone={worker.workerType === "Outsourcing" ? "blue" : worker.workerType === "Pekerja Proyek" ? "purple" : "slate"}>{worker.workerType}</Badge>, <div><p>{worker.vendor || "-"}</p><p className="text-xs text-slate-400">{worker.project || "-"}</p></div>, worker.skill, formatCurrency(worker.dailyRate), <Badge tone={worker.status === "Aktif" ? "green" : "amber"}>{worker.status}</Badge>, <div className="flex gap-2"><button type="button" onClick={() => { setSelectedId(worker.id); setShowPreview(true); }} className="text-xs font-bold text-slate-700">Preview</button><button type="button" onClick={() => editWorker(worker)} className="text-xs font-bold text-blue-700">Edit</button><button type="button" onClick={() => deleteWorker(worker.id)} className="text-xs font-bold text-rose-700">Hapus</button></div>])} />
      </div>
      {showPreview && selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-lg font-bold text-slate-950">Preview Tenaga Lepas</h3><p className="text-sm text-slate-500">{selected.id} • {selected.name}</p></div><button type="button" onClick={() => setShowPreview(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Tutup</button></div><div className="grid gap-3 text-sm md:grid-cols-3">{[["Tipe", selected.workerType], ["Vendor", selected.vendor], ["Proyek/Unit", selected.project], ["Keahlian", selected.skill], ["Supervisor", selected.supervisor], ["Lokasi", selected.workLocation], ["Wilayah", `${selected.city}, ${selected.province}`], ["Periode", `${selected.startDate || "-"} s/d ${selected.endDate || "-"}`], ["Rate Harian", formatCurrency(selected.dailyRate)], ["Status", selected.status], ["Telepon", selected.phone], ["Bank", `${selected.bank || "-"} ${selected.bankAccount || ""}`]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-800">{value || "-"}</p></div>)}</div></div></div>}
      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={saveWorker} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-950">{editingId ? "Edit Tenaga" : "Tambah Tenaga"}</h2><p className="text-sm text-slate-500">Data vendor, proyek, skill, periode, dan rate.</p></div><button type="button" onClick={() => setShowForm(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Tutup</button></div><div className="grid gap-3 md:grid-cols-3">{[["name", "Nama"], ["workerType", "Tipe"], ["vendor", "Vendor"], ["project", "Proyek/Unit"], ["skill", "Keahlian"], ["supervisor", "Supervisor"], ["workLocation", "Lokasi Kerja"], ["province", "Provinsi"], ["city", "Kota/Kabupaten"], ["startDate", "Tanggal Mulai"], ["endDate", "Tanggal Selesai"], ["dailyRate", "Rate Harian"], ["status", "Status"], ["phone", "Telepon"], ["bank", "Bank"], ["bankAccount", "No Rekening"]].map(([name, label]) => <label key={name} className="block"><span className="text-sm font-semibold text-slate-600">{label}</span><input required={name === "name" || name === "dailyRate"} type={name === "dailyRate" ? "number" : name.includes("Date") ? "date" : "text"} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none ring-blue-100 focus:ring-4" /></label>)}</div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => { setEditingId(""); setForm(emptyForm); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Reset</button><button className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">Simpan</button></div></form></div>}
    </div>
  );
}

function Attendance({ attendance, setAttendance, employees }) {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]?.id || "");
  const [method, setMethod] = useState("gps_photo");
  const [locationStatus, setLocationStatus] = useState("Belum mengambil lokasi");
  const [latestLocation, setLatestLocation] = useState(null);
  const [photoStatus, setPhotoStatus] = useState("Foto belum diambil");
  const [photoProof, setPhotoProof] = useState("");
  const [fingerprintStatus, setFingerprintStatus] = useState("Fingerprint belum diverifikasi");
  const [fingerprintVerified, setFingerprintVerified] = useState(false);

  function createAttendance(type) {
    const employee = employees.find((item) => item.id === selectedEmployee);
    if (!employee) return;
    const now = new Date();
    const currentDate = getLocalDateISO(now);
    const currentTime = getTimeValue(now);
    const lateMinutes = type === "check_in" ? minutesAfterShiftStart(currentTime) : 0;
    const location = latestLocation ? `${latestLocation.latitude.toFixed(6)}, ${latestLocation.longitude.toFixed(6)}` : "Belum ada GPS";
    const existing = attendance.find((item) => item.employeeId === employee.id && item.date === currentDate);
    const nextRecord = existing ? {
      ...existing,
      checkIn: type === "check_in" ? currentTime : existing.checkIn,
      checkOut: type === "check_out" ? currentTime : existing.checkOut,
      method: getAttendanceMethodLabel(method),
      location,
      photoProof,
      fingerprintVerified,
      status: lateMinutes > 0 || existing.lateMinutes > 0 ? "Terlambat" : "Hadir",
      lateMinutes: Math.max(existing.lateMinutes || 0, lateMinutes),
    } : {
      id: `ATT-${String(attendance.length + 1).padStart(3, "0")}`,
      employeeId: employee.id,
      employeeName: employee.name,
      date: currentDate,
      checkIn: type === "check_in" ? currentTime : "-",
      checkOut: type === "check_out" ? currentTime : "-",
      method: getAttendanceMethodLabel(method),
      location,
      photoProof,
      fingerprintVerified,
      status: lateMinutes > 0 ? "Terlambat" : "Hadir",
      lateMinutes,
    };
    setAttendance(existing ? attendance.map((item) => item.id === existing.id ? nextRecord : item) : [nextRecord, ...attendance]);
  }

  function getLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Browser tidak mendukung GPS/geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        setLatestLocation(coords);
        setLocationStatus(`Lokasi terdeteksi: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
      },
      (error) => setLocationStatus(`Gagal mengambil lokasi: ${error.message}`)
    );
  }

  function capturePhoto() {
    const proof = `Foto simulasi ${new Date().toLocaleString("id-ID")}`;
    setPhotoProof(proof);
    setPhotoStatus(`${proof} tersimpan`);
  }

  function verifyFingerprint() {
    setFingerprintVerified(true);
    setFingerprintStatus(`Fingerprint tervalidasi ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Absensi Harian</h2>
              <p className="text-sm text-slate-500">Catatan check-in/check-out beserta metode validasi.</p>
            </div>
            <Badge tone="green">GPS Aktif</Badge>
          </div>
          <DataTable
            headers={["Tanggal", "Karyawan", "Check-in", "Check-out", "Metode", "Lokasi"]}
            rows={attendance.map((row) => [
              row.date,
              row.employeeName,
              row.checkIn,
              row.checkOut,
              <Badge tone={row.method === "Fingerprint" ? "purple" : row.method === "GPS + Foto" ? "blue" : "slate"}>{row.method}</Badge>,
              <div><p>{row.location}</p><p className="text-xs text-slate-400">{row.photoProof || "Tanpa foto"} • {row.fingerprintVerified ? "Fingerprint OK" : "Fingerprint -"}</p></div>,
            ])}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Form Absensi Web</h2>
          <p className="mt-1 text-sm text-slate-500">Form ini untuk admin/desktop. Preview HP ada di sisi kanan.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-600">Karyawan</span>
              <select value={selectedEmployee} onChange={(event) => setSelectedEmployee(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none ring-blue-100 focus:ring-4">
                {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-600">Metode Absensi</span>
              <select value={method} onChange={(event) => setMethod(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none ring-blue-100 focus:ring-4">
                <option value="gps">GPS</option>
                <option value="gps_photo">GPS + Foto</option>
                <option value="fingerprint">Sidik Jari / Fingerprint</option>
              </select>
            </label>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={getLocation} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Icon name="pin" /> GPS</button>
            <button type="button" onClick={capturePhoto} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Icon name="camera" /> Foto</button>
            <button type="button" onClick={verifyFingerprint} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Icon name="fingerprint" /> Fingerprint</button>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p>{locationStatus}</p><p>{photoStatus}</p><p>{fingerprintStatus}</p></div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => createAttendance("check_in")} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700">Check-in</button>
            <button type="button" onClick={() => createAttendance("check_out")} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">Check-out</button>
          </div>
        </div>
      </div>

      <MobileAttendanceScreen
        employees={employees}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        method={method}
        setMethod={setMethod}
        locationStatus={locationStatus}
        photoStatus={photoStatus}
        fingerprintStatus={fingerprintStatus}
        getLocation={getLocation}
        createAttendance={createAttendance}
      />
    </div>
  );
}

function MinimumWages({ minimumWages, setMinimumWages }) {
  const [form, setForm] = useState({ type: "UMP", province: "", city: "-", amount: "", source: "Input Admin" });
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [updateStatus, setUpdateStatus] = useState("");

  const nationalUmpCount = minimumWages.filter((item) => item.type === "UMP" && item.year === 2026).length;
  const umkRows = minimumWages.filter((item) => item.type === "UMK");
  const regencyCount = indonesiaRegencies.length;
  const filteredRows = minimumWages.filter((item) => {
    const matchesCategory = category === "all" || item.type === category;
    const text = [item.type, item.province, item.city, item.source, item.status].join(" ").toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  });
  const visibleUmpRows = filteredRows.filter((item) => item.type === "UMP");
  const visibleUmkRows = filteredRows.filter((item) => item.type === "UMK");

  useEffect(() => {
    if (minimumWages.some((item) => item.status === "Fallback UMP")) {
      setMinimumWages(minimumWages.filter((item) => item.status !== "Fallback UMP"));
    }
  }, [minimumWages, setMinimumWages]);

  function addWage(event) {
    event.preventDefault();
    const city = form.type === "UMP" ? "-" : form.city;
    const nextWage = {
      id: `MW-${String(minimumWages.length + 1).padStart(3, "0")}`,
      type: form.type,
      province: form.province,
      city,
      year: 2026,
      amount: Number(form.amount || 0),
      source: form.source,
      status: "Aktif",
    };
    setMinimumWages([...minimumWages.filter((item) => !(item.type === form.type && normalizeRegionName(item.province) === normalizeRegionName(form.province) && normalizeRegionName(item.city) === normalizeRegionName(city))), nextWage]);
    setForm({ type: "UMP", province: "", city: "-", amount: "", source: "Input Admin" });
  }

  function syncNationalUmp() {
    const customUmk = minimumWages.filter((item) => item.type === "UMK");
    setMinimumWages([...initialMinimumWages.filter((item) => item.type === "UMP"), ...customUmk]);
  }

  function clearFallbackRows() {
    setMinimumWages(minimumWages.filter((item) => item.status !== "Fallback UMP"));
    setUpdateStatus(`Referensi wilayah tersedia: ${indonesiaRegencies.length} kabupaten/kota. Tidak ada nilai UMK yang dibuat otomatis dari UMP.`);
  }

  function importUmkExcel(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ensureExcelFile(file, setUpdateStatus)) {
      event.target.value = "";
      return;
    }
    readTableFile(file, (rows) => {
      const [headers, ...records] = rows;
      const headerMap = Object.fromEntries((headers || []).map((header, index) => [normalizeCsvHeader(header), index]));
      const provinceIndex = headerMap.provinsi ?? headerMap.province;
      const cityIndex = headerMap.kabupatenkota ?? headerMap.kabkota ?? headerMap.kota ?? headerMap.city;
      const amountIndex = headerMap.umk ?? headerMap.nilai ?? headerMap.amount;
      const sourceIndex = headerMap.sumber ?? headerMap.source ?? headerMap.sk;
      const yearIndex = headerMap.tahun ?? headerMap.year;

      if ([provinceIndex, cityIndex, amountIndex].some((index) => index === undefined)) {
        setUpdateStatus("Excel UMK harus punya kolom Provinsi, Kabupaten/Kota, dan UMK/Nilai.");
        return;
      }

      const importedRows = records.map((record, index) => ({
        id: `MW-IMPORT-${Date.now()}-${index}`,
        type: "UMK",
        province: String(record[provinceIndex] || "").trim(),
        city: String(record[cityIndex] || "").trim(),
        year: Number(record[yearIndex] || 2026),
        amount: parseMoneyValue(record[amountIndex]),
        source: String(record[sourceIndex] || "").trim() || file.name,
        status: "Aktif",
      })).filter((item) => item.province && item.city && item.amount > 0 && item.amount < 50000000);

      const baseRows = minimumWages.filter((item) => item.type !== "UMK");
      const oldUmkRows = minimumWages.filter((item) => item.type === "UMK");
      const importedKeys = new Set(importedRows.map((item) => `${normalizeRegionName(item.province)}|${normalizeRegionName(item.city)}|${item.year}`));
      const preservedUmkRows = oldUmkRows.filter((item) => !importedKeys.has(`${normalizeRegionName(item.province)}|${normalizeRegionName(item.city)}|${item.year}`));
      setMinimumWages([...baseRows, ...preservedUmkRows, ...importedRows]);
      setUpdateStatus(`Import selesai: ${importedRows.length} data UMK masuk dari ${file.name}. Tidak ada fallback UMP dibuat.`);
      event.target.value = "";
    });
  }

  function importUmpExcel(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ensureExcelFile(file, setUpdateStatus)) {
      event.target.value = "";
      return;
    }
    readTableFile(file, (rows) => {
      const [headers, ...records] = rows;
      const headerMap = Object.fromEntries((headers || []).map((header, index) => [normalizeCsvHeader(header), index]));
      const provinceIndex = headerMap.provinsi ?? headerMap.province;
      const amountIndex = headerMap.ump ?? headerMap.nilai ?? headerMap.amount;
      const sourceIndex = headerMap.sumber ?? headerMap.source ?? headerMap.sk;
      const yearIndex = headerMap.tahun ?? headerMap.year;

      if ([provinceIndex, amountIndex].some((index) => index === undefined)) {
        setUpdateStatus("Excel UMP harus punya kolom Provinsi dan UMP/Nilai.");
        return;
      }

      const importedRows = records.map((record, index) => ({
        id: `MW-UMP-IMPORT-${Date.now()}-${index}`,
        type: "UMP",
        province: String(record[provinceIndex] || "").trim(),
        city: "-",
        year: Number(record[yearIndex] || 2026),
        amount: parseMoneyValue(record[amountIndex]),
        source: String(record[sourceIndex] || "").trim() || file.name,
        status: "Aktif",
      })).filter((item) => item.province && item.amount > 0 && item.amount < 50000000);

      const oldUmpRows = minimumWages.filter((item) => item.type === "UMP");
      const importedKeys = new Set(importedRows.map((item) => `${normalizeRegionName(item.province)}|${item.year}`));
      const preservedUmpRows = oldUmpRows.filter((item) => !importedKeys.has(`${normalizeRegionName(item.province)}|${item.year}`));
      const umkRowsOnly = minimumWages.filter((item) => item.type === "UMK");
      setMinimumWages([...preservedUmpRows, ...importedRows, ...umkRowsOnly]);
      setUpdateStatus(`Import selesai: ${importedRows.length} data UMP masuk dari ${file.name}.`);
      event.target.value = "";
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Database UMP/UMK</h2>
            <p className="text-sm text-slate-500">UMP untuk level provinsi. UMK kabupaten/kota hanya ditampilkan jika ada angka resmi/custom.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"><Icon name="plus" className="h-4 w-4" /> Tambah UMK Resmi</button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Icon name="download" className="h-4 w-4" /> Import Excel UMK<input type="file" accept=".xlsx,.xls" onChange={importUmkExcel} className="hidden" /></label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Icon name="download" className="h-4 w-4" /> Import Excel UMP<input type="file" accept=".xlsx,.xls" onChange={importUmpExcel} className="hidden" /></label>
            <button type="button" onClick={() => downloadTemplate("ump_xlsx", minimumWages)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Icon name="download" className="h-4 w-4" /> Template Excel UMP</button>
            <button type="button" onClick={() => downloadTemplate("umk_xlsx", minimumWages)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Icon name="download" className="h-4 w-4" /> Template Excel UMK</button>
            <button type="button" onClick={clearFallbackRows} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">Bersihkan Fallback</button>
            <button type="button" onClick={syncNationalUmp} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Sinkron UMP</button>
            <button type="button" onClick={() => downloadCsv("ump-umk.csv", ["Jenis", "Provinsi", "Kota", "Tahun", "Nilai", "Sumber", "Status"], minimumWages.map((item) => [item.type, item.province, item.city, item.year, item.amount, item.source, item.status]))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Icon name="download" className="h-4 w-4" /> Export</button>
          </div>
        </div>
        {updateStatus && <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">{updateStatus}</div>}
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <StatCard title="UMP Provinsi" value={`${nationalUmpCount}/38`} description="Dasar upah minimum" icon="building" tone="blue" />
          <StatCard title="UMK Resmi" value={umkRows.length} description="Tanpa fallback" icon="pin" tone="purple" />
          <StatCard title="Referensi Kab/Kota" value={regencyCount} description="Wilayah tersedia" icon="shield" tone="amber" />
          <StatCard title="Total Data Upah" value={minimumWages.length} description="UMP + UMK resmi" icon="clipboard" tone="green" />
        </div>
        {showForm && (
          <form onSubmit={addWage} className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 md:grid-cols-5">
              <label className="block"><span className="text-sm font-semibold text-slate-600">Jenis</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value, city: event.target.value === "UMP" ? "-" : "" })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"><option>UMP</option><option>UMK</option></select></label>
              {[["province", "Provinsi"], ["city", "Kabupaten/Kota"], ["amount", "Nilai Resmi"], ["source", "Sumber/SK"]].map(([name, label]) => <label key={name} className="block"><span className="text-sm font-semibold text-slate-600">{label}</span><input required={name !== "city" || form.type === "UMK"} disabled={name === "city" && form.type === "UMP"} type={name === "amount" ? "number" : "text"} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none ring-blue-100 focus:ring-4 disabled:bg-slate-100" /></label>)}
            </div>
            <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setShowForm(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white">Tutup</button><button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Simpan</button></div>
          </form>
        )}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="relative"><Icon name="search" className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari provinsi, kabupaten/kota, sumber..." className="w-full rounded-2xl border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none ring-blue-100 focus:ring-4" /></div>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 outline-none ring-blue-100 focus:ring-4"><option value="all">Semua kategori</option><option value="UMP">UMP Provinsi</option><option value="UMK">UMK Kabupaten/Kota</option></select>
        </div>
        {category !== "UMK" && <div className="mb-6"><div className="mb-3 flex items-center justify-between"><div><h3 className="font-bold text-slate-950">UMP Provinsi</h3><p className="text-sm text-slate-500">Daftar upah minimum level provinsi.</p></div><Badge tone="blue">{visibleUmpRows.length} data</Badge></div><DataTable headers={["Provinsi", "Tahun", "Nilai UMP", "Sumber", "Status"]} rows={visibleUmpRows.map((item) => [item.province, item.year, <strong className="text-slate-950">{formatCurrency(item.amount)}</strong>, item.source, <Badge tone="green">{item.status}</Badge>])} /></div>}
        {category !== "UMP" && <div><div className="mb-3 flex items-center justify-between"><div><h3 className="font-bold text-slate-950">UMK Kabupaten/Kota</h3><p className="text-sm text-slate-500">Hanya berisi UMK yang diinput sebagai data resmi/custom. Tidak ada fallback UMP.</p></div><Badge tone="purple">{visibleUmkRows.length} data</Badge></div><DataTable headers={["Provinsi", "Kabupaten/Kota", "Tahun", "Nilai UMK", "Sumber", "Status"]} rows={visibleUmkRows.map((item) => [item.province, item.city, item.year, <strong className="text-slate-950">{formatCurrency(item.amount)}</strong>, item.source, <Badge tone="green">{item.status}</Badge>])} /></div>}
      </div>
    </div>
  );
}

function Payroll({ employees, attendance, payrollRows, setPayrollRows, addAuditLog, currentUser }) {
  const [selectedPayrollId, setSelectedPayrollId] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const selectedPayroll = payrollRows.find((row) => row.id === selectedPayrollId) || payrollRows[0];

  function generatePayroll() {
    const rows = employees.map((employee, index) => {
      const employeeAttendance = attendance.filter((item) => item.employeeId === employee.id);
      const lateDeduction = employeeAttendance.reduce((sum, item) => sum + (item.lateMinutes || 0) * 10000, 0);
      const mealAllowance = employeeAttendance.length * 25000;
      const transportAllowance = employeeAttendance.length * 20000;
      const positionAllowance = Math.round(employee.salary * 0.05);
      const communicationAllowance = 150000;
      const shiftAllowance = employeeAttendance.filter((item) => item.checkOut && item.checkOut > "20:00").length * 50000;
      const bonus = 0;
      const thr = 0;
      const reimburse = 0;
      const allowance = mealAllowance + transportAllowance + positionAllowance + communicationAllowance + shiftAllowance + bonus + thr + reimburse;
      const overtime = employeeAttendance.filter((item) => item.checkOut && item.checkOut > "17:00").length * 75000;
      const bpjs = Math.round(employee.salary * 0.03);
      const tax = Math.round(Math.max(0, employee.salary + allowance + overtime - 4500000) * 0.05);
      const cashAdvance = 0;
      const loanDeduction = 0;
      const unpaidLeaveDeduction = 0;
      const absenceDeduction = 0;
      const otherDeduction = 0;
      const deduction = lateDeduction + bpjs + tax + cashAdvance + loanDeduction + unpaidLeaveDeduction + absenceDeduction + otherDeduction;
      const period = getPeriodLabel();
      return { id: `PAY-${String(index + 1).padStart(3, "0")}`, slipNo: `SLIP-${period.replace(/\s/g, "-").toUpperCase()}-${String(index + 1).padStart(3, "0")}`, employeeId: employee.id, name: employee.name, department: employee.department, businessUnit: employee.businessUnit || "-", costCenter: employee.costCenter || "-", workLocation: employee.workLocation || employee.branch || "-", period, baseSalary: employee.salary, mealAllowance, transportAllowance, positionAllowance, communicationAllowance, shiftAllowance, bonus, thr, reimburse, allowance, overtime, bpjs, tax, lateDeduction, cashAdvance, loanDeduction, unpaidLeaveDeduction, absenceDeduction, otherDeduction, deduction, grossSalary: employee.salary + allowance + overtime, netSalary: employee.salary + allowance + overtime - deduction, status: deduction > 0 ? "Perlu Review" : "Ready", approvedBy: "", approvedAt: "" };
    });
    setPayrollRows(rows);
    addAuditLog("Generate payroll", `${rows.length} slip dibuat oleh ${currentUser?.name || "-"}`);
  }

  function approvePayroll() {
    const approvedAt = new Date().toLocaleString("id-ID");
    setPayrollRows(payrollRows.map((row) => ({ ...row, status: "Approved", approvedBy: currentUser?.name || "System", approvedAt })));
    addAuditLog("Approve payroll", `Payroll disetujui oleh ${currentUser?.name || "-"}`);
  }

  const totalNetSalary = payrollRows.reduce((sum, item) => sum + item.netSalary, 0);
  const totalDeductions = payrollRows.reduce((sum, item) => sum + item.deduction, 0);
  return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-3"><StatCard title="Total Net Salary" value={formatCurrency(totalNetSalary)} description={getPeriodLabel()} icon="wallet" tone="green" /><StatCard title="Total Potongan" value={formatCurrency(totalDeductions)} description="BPJS, pajak, telat, kasbon" icon="money" tone="amber" /><StatCard title="Status Payroll" value={payrollRows.some((row) => row.status === "Perlu Review") ? "Review" : payrollRows.every((row) => row.status === "Approved") ? "Approved" : "Ready"} description="Berdasarkan data absensi" icon="shield" tone="purple" /></div><Panel title={`Payroll ${getPeriodLabel()}`} description="Generate payroll dari absensi, lembur, tunjangan, potongan, pajak, BPJS, dan UMP/UMK." action="Generate Payroll" onAction={generatePayroll}><DataTable headers={["Karyawan", "Bruto", "Tunjangan", "Potongan", "Gaji Bersih", "Status", "Aksi"]} rows={payrollRows.map((row) => [<div><p className="font-bold text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{row.employeeId} • {row.slipNo || row.id}</p></div>, formatCurrency(row.grossSalary || (row.baseSalary + row.allowance + row.overtime)), formatCurrency(row.allowance), <span className="text-rose-600">-{formatCurrency(row.deduction)}</span>, <strong className="text-slate-950">{formatCurrency(row.netSalary)}</strong>, <Badge tone={row.status === "Approved" ? "green" : row.status === "Ready" ? "blue" : "amber"}>{row.status}</Badge>, <button type="button" onClick={() => { setSelectedPayrollId(row.id); setShowPreview(true); }} className="text-xs font-bold text-blue-700">Preview</button>])} /></Panel><div className="flex flex-wrap gap-2"><button type="button" onClick={approvePayroll} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">Approve Payroll</button><button type="button" onClick={() => { downloadCsv("payroll.csv", ["Slip", "ID", "Nama", "Gaji Pokok", "Tunjangan", "Lembur", "BPJS", "Pajak", "Telat", "Kasbon", "Pinjaman", "Gaji Bersih", "Status"], payrollRows.map((row) => [row.slipNo || row.id, row.employeeId, row.name, row.baseSalary, row.allowance, row.overtime, row.bpjs || 0, row.tax || 0, row.lateDeduction || 0, row.cashAdvance || 0, row.loanDeduction || 0, row.netSalary, row.status])); addAuditLog("Export payroll CSV", `${payrollRows.length} baris`); }} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Export CSV</button><button type="button" onClick={() => { downloadExcel("payroll.xlsx", "Payroll", ["Slip", "ID", "Nama", "Gaji Pokok", "Tunjangan", "Lembur", "BPJS", "Pajak", "Telat", "Kasbon", "Pinjaman", "Gaji Bersih", "Status"], payrollRows.map((row) => [row.slipNo || row.id, row.employeeId, row.name, row.baseSalary, row.allowance, row.overtime, row.bpjs || 0, row.tax || 0, row.lateDeduction || 0, row.cashAdvance || 0, row.loanDeduction || 0, row.netSalary, row.status])); addAuditLog("Export payroll Excel", `${payrollRows.length} baris`); }} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Export Excel</button></div>{showPreview && selectedPayroll && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-lg font-bold text-slate-950">Preview Detail Payroll</h3><p className="text-sm text-slate-500">{selectedPayroll.slipNo || selectedPayroll.id} • {selectedPayroll.name} • {selectedPayroll.period}</p></div><button type="button" onClick={() => setShowPreview(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Tutup</button></div><div className="grid gap-4 lg:grid-cols-3"><div className="rounded-2xl border border-slate-200 p-4"><h4 className="font-bold text-slate-950">Pendapatan</h4><div className="mt-3 space-y-2 text-sm">{[["Gaji Pokok", selectedPayroll.baseSalary], ["Tunjangan Makan", selectedPayroll.mealAllowance], ["Tunjangan Transport", selectedPayroll.transportAllowance], ["Tunjangan Jabatan", selectedPayroll.positionAllowance], ["Tunjangan Komunikasi", selectedPayroll.communicationAllowance], ["Tunjangan Shift", selectedPayroll.shiftAllowance], ["Bonus/Insentif", selectedPayroll.bonus], ["THR", selectedPayroll.thr], ["Reimburse", selectedPayroll.reimburse], ["Lembur", selectedPayroll.overtime]].map(([label, value]) => <div key={label} className="flex justify-between"><span>{label}</span><strong>{formatCurrency(value || 0)}</strong></div>)}</div></div><div className="rounded-2xl border border-slate-200 p-4"><h4 className="font-bold text-slate-950">Potongan</h4><div className="mt-3 space-y-2 text-sm">{[["BPJS", selectedPayroll.bpjs], ["Pajak", selectedPayroll.tax], ["Potongan Telat", selectedPayroll.lateDeduction], ["Kasbon", selectedPayroll.cashAdvance], ["Pinjaman", selectedPayroll.loanDeduction], ["Cuti Tidak Dibayar", selectedPayroll.unpaidLeaveDeduction], ["Alpa/Izin Tanpa Bayar", selectedPayroll.absenceDeduction], ["Potongan Lain", selectedPayroll.otherDeduction]].map(([label, value]) => <div key={label} className="flex justify-between text-rose-600"><span>{label}</span><strong>-{formatCurrency(value || 0)}</strong></div>)}</div></div><div className="rounded-2xl border border-slate-200 p-4"><h4 className="font-bold text-slate-950">Ringkasan</h4><div className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><span>Business Unit</span><strong>{selectedPayroll.businessUnit || "-"}</strong></div><div className="flex justify-between"><span>Cost Center</span><strong>{selectedPayroll.costCenter || "-"}</strong></div><div className="flex justify-between"><span>Lokasi</span><strong>{selectedPayroll.workLocation || "-"}</strong></div><div className="flex justify-between"><span>Bruto</span><strong>{formatCurrency(selectedPayroll.grossSalary || 0)}</strong></div><div className="flex justify-between"><span>Total Potongan</span><strong>{formatCurrency(selectedPayroll.deduction || 0)}</strong></div><div className="mt-4 flex justify-between rounded-2xl bg-slate-950 p-4 text-white"><span>Gaji Bersih</span><strong>{formatCurrency(selectedPayroll.netSalary || 0)}</strong></div><p className="text-xs text-slate-500">Approved: {selectedPayroll.approvedBy || "-"} {selectedPayroll.approvedAt || ""}</p></div></div></div></div></div>}</div>;
}

function Payslips({ payrollRows, addAuditLog }) {
  const [selectedId, setSelectedId] = useState(payrollRows[0]?.id || "");
  const selected = payrollRows.find((row) => row.id === selectedId) || payrollRows[0];
  if (!selected) return <Panel title="Daftar Slip Gaji" description="Generate payroll terlebih dahulu.">Belum ada data slip gaji.</Panel>;
  return <div className="grid gap-6 xl:grid-cols-3"><Panel title="Daftar Slip Gaji" description="Slip gaji digital per periode payroll." action="Export CSV" onAction={() => { downloadCsv("slip-gaji.csv", ["Slip", "ID", "Nama", "Periode", "Gaji Bersih", "Status"], payrollRows.map((row) => [row.slipNo || row.id, row.employeeId, row.name, row.period, row.netSalary, row.status])); addAuditLog("Export slip CSV", `${payrollRows.length} slip`); }}><div className="space-y-3">{payrollRows.map((row) => <button type="button" onClick={() => setSelectedId(row.id)} key={row.id} className={classNames("flex w-full items-center justify-between rounded-2xl border p-4 text-left", selected.id === row.id ? "border-blue-300 bg-blue-50" : "border-slate-200")}><div><p className="font-bold text-slate-950">{row.name}</p><p className="text-sm text-slate-500">{row.slipNo || row.id} • {row.employeeId}</p></div><div className="text-right"><p className="font-bold text-slate-950">{formatCurrency(row.netSalary)}</p><Badge tone={row.status === "Approved" ? "green" : "blue"}>{row.status || "Issued"}</Badge></div></button>)}</div><button type="button" onClick={() => { downloadExcel("slip-gaji.xlsx", "Slip Gaji", ["Slip", "ID", "Nama", "Periode", "Gaji Bersih", "Status"], payrollRows.map((row) => [row.slipNo || row.id, row.employeeId, row.name, row.period, row.netSalary, row.status])); addAuditLog("Export slip Excel", `${payrollRows.length} slip`); }} className="mt-4 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Export Excel</button></Panel><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="border-b border-slate-200 pb-4"><p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Preview Slip Gaji</p><h2 className="mt-1 text-xl font-bold text-slate-950">{selected.name}</h2><p className="text-sm text-slate-500">{selected.slipNo || selected.id} • Periode {selected.period}</p><p className="mt-1 text-xs text-slate-400">Approved by: {selected.approvedBy || "-"} {selected.approvedAt ? `• ${selected.approvedAt}` : ""}</p></div><div className="space-y-2 py-4 text-sm"><div className="flex justify-between"><span>Gaji Pokok</span><strong>{formatCurrency(selected.baseSalary)}</strong></div>{[["Makan", selected.mealAllowance], ["Transport", selected.transportAllowance], ["Jabatan", selected.positionAllowance], ["Komunikasi", selected.communicationAllowance], ["Shift", selected.shiftAllowance], ["Bonus", selected.bonus], ["THR", selected.thr], ["Reimburse", selected.reimburse], ["Lembur", selected.overtime]].map(([label, value]) => <div key={label} className="flex justify-between"><span>{label}</span><strong>{formatCurrency(value || 0)}</strong></div>)}{[["BPJS", selected.bpjs], ["Pajak", selected.tax], ["Telat", selected.lateDeduction], ["Kasbon", selected.cashAdvance], ["Pinjaman", selected.loanDeduction], ["Cuti Tidak Dibayar", selected.unpaidLeaveDeduction], ["Alpa/Izin Tanpa Bayar", selected.absenceDeduction]].map(([label, value]) => <div key={label} className="flex justify-between text-rose-600"><span>{label}</span><strong>-{formatCurrency(value || 0)}</strong></div>)}</div><div className="flex justify-between rounded-2xl bg-slate-950 p-4 text-white"><span className="font-semibold">Gaji Bersih</span><strong>{formatCurrency(selected.netSalary)}</strong></div><button type="button" onClick={() => { window.print(); addAuditLog("Cetak slip", selected.slipNo || selected.id); }} className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Cetak / Simpan PDF</button></div></div>;
}

function Panel({ title, description, action, onAction, children }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2"><div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-lg font-bold text-slate-950">{title}</h2><p className="text-sm text-slate-500">{description}</p></div>{action && <button type="button" onClick={onAction} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"><Icon name={action.includes("Export") ? "download" : "plus"} className="h-4 w-4" /> {action}</button>}</div>{children}</div>;
}

function Reports({ employees, attendance, payrollRows, minimumWages, auditLogs, addAuditLog }) {
  const [reportType, setReportType] = useState("attendance");
  const [dateFrom, setDateFrom] = useState(getLocalDateISO(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [dateTo, setDateTo] = useState(getLocalDateISO());
  const filteredAttendance = attendance.filter((row) => row.date >= dateFrom && row.date <= dateTo);
  const definitions = {
    attendance: { title: "Laporan Absensi", headers: ["Tanggal", "ID", "Nama", "Masuk", "Pulang", "Metode", "Lokasi", "Telat"], rows: filteredAttendance.map((row) => [row.date, row.employeeId, row.employeeName, row.checkIn, row.checkOut, row.method, row.location, row.lateMinutes || 0]) },
    payroll: { title: "Laporan Payroll", headers: ["Slip", "ID", "Nama", "Gaji Pokok", "BPJS", "Pajak", "Potongan", "Gaji Bersih"], rows: payrollRows.map((row) => [row.slipNo || row.id, row.employeeId, row.name, row.baseSalary, row.bpjs || 0, row.tax || 0, row.deduction, row.netSalary]) },
    wage: { title: "Validasi UMP/UMK", headers: ["ID", "Nama", "Gaji", "Upah Minimum", "Status"], rows: employees.map((employee) => { const wage = getMinimumWage(employee, minimumWages); return [employee.id, employee.name, employee.salary, wage?.amount || "-", wage && employee.salary < wage.amount ? "Di bawah minimum" : "OK"]; }) },
    overtime: { title: "Laporan Lembur", headers: ["Tanggal", "Nama", "Check-out", "Estimasi Lembur"], rows: filteredAttendance.map((row) => [row.date, row.employeeName, row.checkOut, row.checkOut && row.checkOut > "17:00" ? "Ya" : "Tidak"]) },
    division: { title: "Laporan Divisi", headers: ["Business Unit", "Divisi", "Cost Center", "Cabang", "Lokasi Kerja", "Jumlah Karyawan"], rows: employees.map((employee) => [employee.businessUnit || "-", employee.department, employee.costCenter || "-", employee.branch, employee.workLocation || employee.branch, 1]) },
    audit: { title: "Audit Log", headers: ["Waktu", "User", "Aktivitas", "Detail"], rows: auditLogs.map((row) => [row.time, row.user, row.action, row.detail]) },
  };
  const active = definitions[reportType];

  function exportReport(format) {
    const name = active.title.toLowerCase().replace(/\s+/g, "-");
    if (format === "excel") downloadExcel(`${name}.xlsx`, active.title, active.headers, active.rows);
    else downloadCsv(`${name}.csv`, active.headers, active.rows);
    addAuditLog(`Export ${active.title} ${format.toUpperCase()}`, `${active.rows.length} baris`);
  }

  return <div className="space-y-6"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid gap-3 lg:grid-cols-[220px_1fr_1fr_auto_auto]"><select value={reportType} onChange={(event) => setReportType(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold"><option value="attendance">Absensi</option><option value="payroll">Payroll</option><option value="wage">Validasi UMP/UMK</option><option value="overtime">Lembur</option><option value="division">Divisi</option><option value="audit">Audit Log</option></select><input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm" /><input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm" /><button type="button" onClick={() => exportReport("csv")} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Export CSV</button><button type="button" onClick={() => exportReport("excel")} className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Export Excel</button></div></div><Panel title={active.title} description={`Preview ${active.rows.length} baris data.`}><DataTable headers={active.headers} rows={active.rows.slice(0, 25)} /></Panel></div>;
}

function SettingsPage({ backupData, restoreData }) {
  const [settings, setSettings] = usePersistentState("payroll-settings", {
    "Wajib GPS saat absensi": true,
    "Wajib foto/selfie saat check-in": true,
    "Aktifkan validasi radius geofence": true,
    "Blokir payroll jika gaji di bawah UMP/UMK": true,
    "Kunci payroll setelah approval finance": true,
  });

  function toggleSetting(label) {
    setSettings({ ...settings, [label]: !settings[label] });
  }

  return <div className="grid gap-6 xl:grid-cols-2"><Panel title="Pengaturan Perusahaan" description="Konfigurasi cabang, role, approval, dan kebijakan absensi.">{Object.keys(settings).map((label) => <label key={label} className="mb-3 flex items-center justify-between rounded-2xl border border-slate-200 p-4"><span className="text-sm font-semibold text-slate-700">{label}</span><input type="checkbox" checked={settings[label]} onChange={() => toggleSetting(label)} className="h-5 w-5 accent-blue-600" /></label>)}<div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Pengaturan tersimpan otomatis di browser lokal.</div><div className="mt-4 grid gap-2 md:grid-cols-2"><button type="button" onClick={backupData} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">Backup Data</button><label className="cursor-pointer rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50">Restore Data<input type="file" accept=".json,application/json" onChange={restoreData} className="hidden" /></label></div></Panel><Panel title="Integrasi" description="Rencana integrasi untuk tahap enterprise.">{[["REST API", "Endpoint untuk ERP, accounting, POS, warehouse, dan sistem lain"], ["Webhook", "Kirim event check-in, payroll approved, dan perubahan master data"], ["Mesin Fingerprint", "Sinkron data scan dari device absensi fisik"], ["Bank Disbursement", "Pembayaran gaji massal ke rekening karyawan"], ["Email Gateway", "Kirim slip gaji otomatis"], ["API UMP/UMK", "Sinkron data upah minimum dari sumber resmi"]].map(([title, desc]) => <div key={title} className="mb-3 rounded-2xl border border-slate-200 p-4"><p className="font-bold text-slate-950">{title}</p><p className="mt-1 text-sm text-slate-500">{desc}</p></div>)}</Panel></div>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = usePersistentState("payroll-employees", initialEmployees);
  const [attendance, setAttendance] = usePersistentState("payroll-attendance", initialAttendance);
  const [externalWorkers, setExternalWorkers] = usePersistentState("payroll-external-workers", initialExternalWorkers);
  const [minimumWages, setMinimumWages] = usePersistentState("payroll-minimum-wages", initialMinimumWages);
  const [payrollRows, setPayrollRows] = usePersistentState("payroll-rows", initialPayrollRows);
  const [users, setUsers] = usePersistentState("payroll-users", defaultUsers);
  const [currentUser, setCurrentUser] = usePersistentState("payroll-current-user", null);
  const [auditLogs, setAuditLogs] = usePersistentState("payroll-audit-logs", []);
  const activeLabel = navItems.find((item) => item.id === activeTab)?.label || "Dashboard";

  useEffect(() => {
    const nationalUmpCount = minimumWages.filter((item) => item.type === "UMP" && item.year === 2026).length;
    if (nationalUmpCount < 38) {
      const customUmk = minimumWages.filter((item) => item.type === "UMK");
      setMinimumWages([...initialMinimumWages.filter((item) => item.type === "UMP"), ...customUmk]);
    }
  }, [minimumWages, setMinimumWages]);

  useEffect(() => {
    if (employees.some((employee) => employee.businessUnit === undefined || employee.costCenter === undefined || employee.workLocation === undefined || employee.nik === undefined || employee.bankAccount === undefined)) {
      setEmployees(employees.map((employee) => ({
        ...employee,
        nik: employee.nik ?? "",
        npwp: employee.npwp ?? "",
        bpjsKesehatan: employee.bpjsKesehatan ?? "",
        bpjsKetenagakerjaan: employee.bpjsKetenagakerjaan ?? "",
        joinDate: employee.joinDate ?? "",
        endDate: employee.endDate ?? "",
        manager: employee.manager ?? "",
        contractType: employee.contractType ?? "PKWTT",
        businessUnit: employee.businessUnit ?? employee.department ?? "-",
        costCenter: employee.costCenter ?? `${employee.department || "UNIT"}-${employee.branch || "LOC"}`.toUpperCase().replace(/\s+/g, "-"),
        workLocation: employee.workLocation ?? employee.branch ?? "-",
        bankAccount: employee.bankAccount ?? "",
      })));
    }
  }, [employees, setEmployees]);

  function logout() {
    addAuditLog("Logout", currentUser?.email || "-");
    setCurrentUser(null);
    setActiveTab("dashboard");
  }

  useEffect(() => {
    if (currentUser && !canAccess(currentUser.role, activeTab)) {
      setActiveTab(roleAccess[currentUser.role]?.[0] || "dashboard");
    }
  }, [activeTab, currentUser]);

  function addAuditLog(action, detail = "") {
    setAuditLogs([{ id: `AUD-${Date.now()}`, time: new Date().toLocaleString("id-ID"), user: currentUser?.email || "system", action, detail }, ...auditLogs].slice(0, 500));
  }

  function backupData() {
    const payload = { employees, externalWorkers, attendance, minimumWages, payrollRows, users, auditLogs, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payroll-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    addAuditLog("Backup data", "payroll-backup.json");
  }

  function restoreData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || "{}"));
        if (Array.isArray(data.employees)) setEmployees(data.employees);
        if (Array.isArray(data.externalWorkers)) setExternalWorkers(data.externalWorkers);
        if (Array.isArray(data.attendance)) setAttendance(data.attendance);
        if (Array.isArray(data.minimumWages)) setMinimumWages(data.minimumWages);
        if (Array.isArray(data.payrollRows)) setPayrollRows(data.payrollRows);
        if (Array.isArray(data.users)) setUsers(data.users);
        if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
        addAuditLog("Restore data", file.name);
      } catch {
        addAuditLog("Restore data gagal", file.name);
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  if (!currentUser) {
    return <AuthScreen users={users} setUsers={setUsers} setCurrentUser={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentUser={currentUser} />
        {sidebarOpen && <button aria-label="Close sidebar overlay" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden" />}
        <main className="min-w-0 flex-1">
          <Header activeLabel={activeLabel} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentUser={currentUser} onLogout={logout} />
          <div className="p-4 lg:p-8">
            {activeTab === "dashboard" && <Dashboard employees={employees} attendance={attendance} externalWorkers={externalWorkers} minimumWages={minimumWages} payrollRows={payrollRows} auditLogs={auditLogs} currentUser={currentUser} />}
            {activeTab === "employees" && <Employees employees={employees} setEmployees={setEmployees} minimumWages={minimumWages} />}
            {activeTab === "externalWorkers" && <ExternalWorkers externalWorkers={externalWorkers} setExternalWorkers={setExternalWorkers} />}
            {activeTab === "attendance" && <Attendance attendance={attendance} setAttendance={setAttendance} employees={employees} />}
            {activeTab === "minimumWages" && <MinimumWages minimumWages={minimumWages} setMinimumWages={setMinimumWages} />}
            {activeTab === "payroll" && <Payroll employees={employees} attendance={attendance} payrollRows={payrollRows} setPayrollRows={setPayrollRows} addAuditLog={addAuditLog} currentUser={currentUser} />}
            {activeTab === "payslips" && <Payslips payrollRows={payrollRows} addAuditLog={addAuditLog} />}
            {activeTab === "reports" && <Reports employees={employees} attendance={attendance} payrollRows={payrollRows} minimumWages={minimumWages} auditLogs={auditLogs} addAuditLog={addAuditLog} />}
            {activeTab === "settings" && <SettingsPage backupData={backupData} restoreData={restoreData} />}
          </div>
        </main>
      </div>
    </div>
  );
}
