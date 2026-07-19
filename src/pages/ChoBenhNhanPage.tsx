import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import { FileText, MapPin, Pill, Users, Search, Clipboard, DollarSign, Bed, Calendar, Phone, ExternalLink } from "lucide-react";

export default function ChoBenhNhanPage() {
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

  const patientInfo = [
    {
      id: "chi-phi-dia-diem",
      title: "Chi phí & Địa điểm",
      icon: MapPin,
      color: "from-blue-50 to-indigo-50",
      heroImage: "/images/pages/hero-chi-phi.jpeg",
      items: [
        {
          name: "Chi phí điều trị công khai",
          desc: "Bảng giá dịch vụ y tế niêm yết công khai",
          action: "Xem bảng giá",
          icon: DollarSign,
          img: "/images/pages/chiphi-1.jpeg"
        },
        {
          name: "Cơ sở điều trị",
          desc: "2 cơ sở: 123 Đường XYZ (CS1) và 456 Đường ABC (CS2)",
          action: "Bản đồ",
          icon: MapPin,
          img: "/images/pages/coso-1.jpeg"
        },
        {
          name: "Danh mục thuốc BHYT",
          desc: "Danh mục thuốc được bảo hiểm y tế chi trả",
          action: "Tra cứu",
          icon: Pill,
          img: "/images/pages/duoc-1.jpeg"
        }
      ]
    },
    {
      id: "huong-dan-tien-ich",
      title: "Hướng dẫn tiện ích",
      icon: Users,
      color: "from-emerald-50 to-teal-50",
      heroImage: "/images/pages/hero-tongquat.jpeg",
      items: [
        {
          name: "Dịch vụ điều trị",
          desc: "Hướng dẫn các dịch vụ y tế tại bệnh viện",
          action: "Tìm hiểu thêm",
          icon: FileText,
          img: "/images/pages/khamtongquat-1.jpeg"
        },
        {
          name: "Dành cho bệnh nhân nội trú",
          desc: "Quy định nhập viện, thăm nom, ăn ở",
          action: "Xem hướng dẫn",
          icon: Bed,
          img: "/images/pages/coso-2.jpeg"
        },
        {
          name: "Dành cho thăm khám ngoại trú",
          desc: "Quy trình đăng ký, khám bệnh, nhận kết quả",
          action: "Xem hướng dẫn",
          icon: Calendar,
          img: "/images/pages/bacsi-1.jpeg"
        }
      ]
    },
    {
      id: "cong-thong-tin",
      title: "Cổng thông tin",
      icon: Search,
      color: "from-purple-50 to-pink-50",
      heroImage: "/images/pages/hero-congthongtin.jpeg",
      items: [
        {
          name: "Tra cứu bệnh sử online",
          desc: "Xem lịch sử khám bệnh, kết quả xét nghiệm",
          action: "Đăng nhập",
          icon: Clipboard,
          img: "/images/pages/timmach-1.jpeg"
        },
        {
          name: "Yêu cầu trích sao hồ sơ",
          desc: "Lấy bản sao hồ sơ y tế, giấy chứng nhận",
          action: "Gửi yêu cầu",
          icon: FileText,
          img: "/images/pages/hoso-1.jpeg"
        },
        {
          name: "Góp ý chất lượng phục vụ",
          desc: "Đóng góp ý kiến để cải thiện dịch vụ",
          action: "Gửi góp ý",
          icon: Phone,
          img: "/images/pages/bacsi-1.jpeg"
        }
      ]
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Dành cho bệnh nhân</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Thông tin hướng dẫn và dịch vụ hỗ trợ bệnh nhân
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={100} className="flex justify-center gap-4 flex-wrap">
            <a
              href="tel:02353747432"
              className="px-4 py-2 bg-peach text-white rounded-full text-sm font-semibold hover:bg-peach/90 transition-colors"
            >
              Cấp cứu: 02353.747.432
            </a>
          </ScrollAnimation>
        </div>
      </section>

      {patientInfo.map((section, sectionIndex) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-16 ${sectionIndex % 2 === 0 ? "bg-gradient-to-br" : ""} ${sectionIndex % 2 === 0 ? section.color : "bg-gray-50/50"}`}
        >
          <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
            <ScrollAnimation animation="fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <section.icon className="w-7 h-7 text-brand-green" />
                </div>
                <h2 className="text-2xl font-display font-bold text-green-dark">{section.title}</h2>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={100}>
              <img
                src={section.heroImage}
                alt={section.title}
                className="w-full h-48 object-cover rounded-[20px] shadow-md mb-8"
              />
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.items.map((item, idx) => (
                <div key={item.name}>
                  <ScrollAnimation
                    animation="fade-up"
                    delay={idx * 100}
                    className="bg-white border border-green-800/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer hover:border-brand-green/30"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between text-left">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-mint rounded-xl flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-brand-green" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-[17px] text-green-dark mb-2 group-hover:text-brand-green transition-colors duration-200">{item.name}</h3>
                          <p className="text-[13px] text-ink/75 leading-relaxed mb-4">{item.desc}</p>
                          <button className="inline-flex items-center gap-1 text-brand-green font-semibold text-sm hover:text-brand-green/80 transition-colors">
                            {item.action}
                            <ExternalLink size={12} />
                          </button>
                        </div>
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