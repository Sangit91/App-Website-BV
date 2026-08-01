export interface SiteProcessStep {
  id: string;
  step: number;
  title: string;
  desc: string;
  icon: string;
}

export interface SiteBringItem {
  id: string;
  text: string;
  icon: string;
}

export interface SiteFaq {
  id: string;
  question: string;
  answer: string;
}

export interface SitePatient {
  processSteps: SiteProcessStep[];
  whatToBring: SiteBringItem[];
  faqs: SiteFaq[];
}

export const DEFAULT_PATIENT: SitePatient = {
  processSteps: [
    { id: "1", step: 1, title: "Đăng ký lịch hẹn", desc: "Qua website, điện thoại hoặc trực tiếp", icon: "calendar" },
    { id: "2", step: 2, title: "Xác nhận lịch hẹn", desc: "Nhận SMS/email xác nhận thời gian khám", icon: "check" },
    { id: "3", step: 3, title: "Đến bệnh viện", desc: "Đến quầy lễ tân với CCCD và mã lịch hẹn", icon: "user" },
    { id: "4", step: 4, title: "Khám và chẩn đoán", desc: "Gặp bác sĩ chuyên khoa", icon: "stethoscope" },
    { id: "5", step: 5, title: "Thanh toán", desc: "Thanh toán tại quầy thu ngân", icon: "wallet" },
    { id: "6", step: 6, title: "Nhận kết quả", desc: "Kết quả xét nghiệm, đơn thuốc", icon: "clipboard" },
  ],
  whatToBring: [
    { id: "1", text: "Chứng minh nhân dân / Căn cước công dân", icon: "card" },
    { id: "2", text: "Thẻ BHYT (nếu có)", icon: "shield" },
    { id: "3", text: "Kết quả xét nghiệm, siêu âm trước đó", icon: "document" },
    { id: "4", text: "Đơn thuốc đang dùng", icon: "pill" },
    { id: "5", text: "Giấy chuyển tuyến (nếu có)", icon: "referral" },
    { id: "6", text: "Tiền mặt / Thẻ thanh toán", icon: "wallet" },
  ],
  faqs: [
    { id: "1", question: "Giờ làm việc của bệnh viện?", answer: "Thứ 2 - Thứ 6: 7:00 - 17:00. Cấp cứu 24/7." },
    { id: "2", question: "Làm sao để đặt lịch khám?", answer: "Qua website, gọi hotline hoặc đến trực tiếp quầy lễ tân." },
    { id: "3", question: "Bệnh viện có hỗ trợ BHYT không?", answer: "Có, bệnh viện chấp nhận BHYT theo quy định của Bộ Y tế." },
    { id: "4", question: "Thời gian chờ khám trung bình?", answer: "Khoảng 15-30 phút sau giờ hẹn, tùy tình trạng." },
  ],
};
