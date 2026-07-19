import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import { Activity, Scissors, Heart, Baby, Microscope, Stethoscope, Eye, Brain, Bone } from "lucide-react";

export default function ChuyenKhoaPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  const departments = {
    "ngoai-cap-cuu": {
      title: "Ngoại & Cấp cứu",
      icon: Scissors,
      color: "bg-red-50",
      textColor: "text-red-600",
      heroImage: "/images/pages/hero-chuyenkhoa.jpeg",
      items: [
        { name: "Khoa Ngoại chung", desc: "Phẫu thuật tổng quát, cấp cứu ngoại", img: "/images/pages/ngoai-1.jpeg" },
        { name: "Khoa Răng Hàm Mặt", desc: "Phẫu thuật răng, hàm, mặt", img: "/images/pages/ranghamach-1.jpeg" },
        { name: "Khoa Tai – Mũi – Họng", desc: "Phẫu thuật tai, mũi, họng", img: "/images/pages/taimuihong-1.jpeg" },
        { name: "Khoa Hồi sức tích cực ICU", desc: "Hồi sức cấp cứu 24/7", img: "/images/pages/icu-1.jpeg" },
        { name: "Khoa ung bướu", desc: "Phẫu thuật, hóa trị, xạ trị", img: "/images/pages/ungbuou-1.jpeg" }
      ]
    },
    "noi-tong-quat": {
      title: "Nội tổng quát",
      icon: Stethoscope,
      color: "bg-blue-50",
      textColor: "text-blue-600",
      heroImage: "/images/pages/hero-tongquat.jpeg",
      items: [
        { name: "Khoa Nội chung", desc: "Khám và điều trị các bệnh nội khoa", img: "/images/pages/noi-1.jpeg" },
        { name: "Khoa Tim mạch", desc: "Tim mạch can thiệp, phẫu thuật", img: "/images/pages/timmach-1.jpeg" },
        { name: "Khoa Nội tiết", desc: "Đái tháo đường, tuyến giáp", img: "/images/pages/timmach-1.jpeg" },
        { name: "Khoa Thận nhân tạo", desc: "Lọc máu, chạy thận nhân tạo", img: "/images/pages/timmach-1.jpeg" },
        { name: "Khoa Cơ Xương Khớp", desc: "Xương khớp, phục hồi chức năng", img: "/images/pages/noi-1.jpeg" },
        { name: "Khoa Da Liễu", desc: "Da liễu, thẩm mỹ da", img: "/images/pages/thammy-1.jpeg" },
        { name: "Khoa Tâm lý & Sức khỏe", desc: "Tâm thần, tâm lý trị liệu", img: "/images/pages/tamly-1.jpeg" }
      ]
    },
    "san-nhi": {
      title: "Sản & Nhi",
      icon: Baby,
      color: "bg-pink-50",
      textColor: "text-pink-600",
      heroImage: "/images/pages/hero-thaisan.jpeg",
      items: [
        { name: "Khoa Sản phụ khoa", desc: "Mangled sản, phụ khoa", img: "/images/pages/sanphukhoa-1.jpeg" },
        { name: "Khoa Nhi & Sơ sinh", desc: "Nhi khoa, sơ sinh", img: "/images/pages/nhi-1.jpeg" },
        { name: "Khoa Thẩm mỹ và chăm sóc trị liệu", desc: "Thẩm mỹ, spa y tế", img: "/images/pages/thammy-1.jpeg" }
      ]
    },
    "can-lam-sang": {
      title: "Cận lâm sàng",
      icon: Microscope,
      color: "bg-purple-50",
      textColor: "text-purple-600",
      heroImage: "/images/pages/hero-chuyenkhoa.jpeg",
      items: [
        { name: "Khoa Dược", desc: "Cung ứng thuốc, tư vấn dược", img: "/images/pages/duoc-1.jpeg" },
        { name: "Khoa Mắt", desc: "Mắt, phẫu thuật khúc xạ", img: "/images/pages/mat-1.jpeg" },
        { name: "Khoa Xét nghiệm và Giải phẫu", desc: "Xét nghiệm, giải phẫu bệnh", img: "/images/pages/xetnghiem-1.jpeg" },
        { name: "Khoa Y tế dự phòng", desc: "Phòng bệnh, tiêm chủng", img: "/images/pages/tiemchung-1.jpeg" },
        { name: "Khoa Chẩn đoán hình ảnh", desc: "MRI, CT, X-quang, siêu âm", img: "/images/pages/xetnghiem-1.jpeg" }
      ]
    }
  };

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Chuyên khoa</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hệ thống chuyên khoa đa dạng, trang thiết bị hiện đại, đội ngũ bác sĩ chuyên môn cao
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {Object.entries(departments).map(([key, dept], deptIndex) => (
        <section
          key={key}
          id={key}
          className={`py-16 ${deptIndex % 2 === 0 ? "" : "bg-gray-50/50"}`}
        >
          <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
            <ScrollAnimation animation="fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-14 h-14 ${dept.color} rounded-full flex items-center justify-center`}>
                  <dept.icon className="w-7 h-7 text-brand-green" />
                </div>
                <h2 className="text-2xl font-display font-bold text-green-dark">{dept.title}</h2>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={100}>
              <img
                src={dept.heroImage}
                alt={dept.title}
                className="w-full h-64 object-cover rounded-[20px] shadow-md mb-8"
              />
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dept.items.map((item, idx) => (
                <div key={item.name}>
                  <ScrollAnimation
                    animation="fade-up"
                    delay={idx * 50}
                    className="bg-white border border-green-800/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer hover:border-brand-green/30"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute top-3 right-3 ${dept.color} ${dept.textColor} text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>
                        {dept.title}
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between text-left">
                      <div>
                        <h3 className="font-display font-bold text-[17px] text-green-dark mb-2 group-hover:text-brand-green transition-colors duration-200">{item.name}</h3>
                        <p className="text-[13px] text-ink/75 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </ScrollAnimation>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </Layout>
  );
}