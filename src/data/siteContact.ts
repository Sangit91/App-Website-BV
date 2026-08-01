export interface SiteContact {
  address: string;
  addressShort: string;
  emergency: string;
  hotline: string;
  email: string;
  website: string;
  workingHours: string;
  emergencyHours: string;
}

export const DEFAULT_CONTACT: SiteContact = {
  address: "107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng",
  addressShort: "107 Quang Trung, Đại Lộc, Đà Nẵng",
  emergency: "02353.747.432",
  hotline: "02353.747.433",
  email: "bvdkbacquangnam@gmail.com",
  website: "https://bvdakhoaquangnam.vn",
  workingHours: "Thứ 2 - Thứ 6: 7:00 - 17:00",
  emergencyHours: "Cấp cứu: 24/7",
};
