import { NewsItem, TenderStatus } from "../types";

export function parseTenderDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (match) {
    const [, y, m, d, h, min, s] = match;
    const date = new Date(+y, +m - 1, +d, +h, +min, +(s || 0));
    return isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

export function getTenderStatus(item: NewsItem): TenderStatus {
  const endDate = parseTenderDate(item.tenderEndDate || "");
  if (!endDate) return "Đang mở";
  const now = new Date();
  if (endDate < now) return "Đã đóng";
  const daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 7) return "Sắp mở";
  return "Đang mở";
}

export function formatTenderDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = parseTenderDate(dateStr);
  if (!d) return dateStr;
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${h}:${min} - ${day}/${month}/${d.getFullYear()}`;
}

export function getTimeLeft(endDateStr: string): { days: number; hours: number; minutes: number; seconds: number; expired: boolean } {
  const endDate = parseTenderDate(endDateStr);
  if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}

export function getStatusBadge(status: TenderStatus) {
  switch (status) {
    case "Đang mở":
      return { bg: "bg-brand-green", text: "text-white", label: "ĐANG MỞ THẦU" };
    case "Sắp mở":
      return { bg: "bg-peach", text: "text-white", label: "SẮP ĐÓNG THẦU" };
    case "Đã đóng":
      return { bg: "bg-gray-400", text: "text-white", label: "ĐÃ KẾT THÚC" };
  }
}

export function isTenderPost(item: NewsItem): boolean {
  if (item.isTender === true) return true;
  const titleLower = item.title.toLowerCase();
  const tagLower = item.tag.toLowerCase();
  return (
    titleLower.includes("thầu") ||
    titleLower.includes("đấu thầu") ||
    titleLower.includes("mua sắm") ||
    tagLower.includes("thầu")
  );
}