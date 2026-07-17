export type NewsTag = 'Tin y học' | 'Thông báo' | 'Sự kiện';

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
  image: string;
  content?: string;
  isTender?: boolean;
  tenderStartDate?: string;
  tenderEndDate?: string;
  tenderFile?: TenderFile;
  tenderDept?: string;
}