export type NewsTag = 'Tin y học' | 'Thông báo' | 'Sự kiện';

export type TenderStatus = 'Đang mở' | 'Sắp mở' | 'Đã đóng';

export type TenderMethod = 'Đấu thầu rộng rãi' | 'Chỉ định thầu' | 'Mua sắm trực tiếp' | 'Tự chuẩn bị';

export interface TenderFile {
  name: string;
  size: string;
  url?: string;
  fileType?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  tag: NewsTag;
  date: string;
  publishedAt?: string;
  image: string;
  content?: string;
  isTender?: boolean;
  tenderNumber?: string;
  tenderStartDate?: string;
  tenderEndDate?: string;
  tenderFile?: TenderFile;
  tenderDept?: string;
  tenderMethod?: TenderMethod;
  tenderEstimateValue?: string;
  tenderReceivedLocation?: string;
  tenderContact?: string;
  tenderContactPhone?: string;
  tenderDownloadCount?: number;
}