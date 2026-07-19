import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import { Activity, Scissors, Heart, Baby, Microscope, Stethoscope, Eye, Brain, Bone, Users, Bed, FlaskConical, Zap } from "lucide-react";

const DEPARTMENTS = [
  { key: "ngoai-cap-cuu", title: "Ngoại & Cấp cứu", icon: Scissors, color: "bg-red-50", textColor: "text-red-600" },
  { key: "noi-tong-quat", title: "Nội tổng quát", icon: Stethoscope, color: "bg-blue-50", textColor: "text-blue-600" },
  { key: "san-nhi", title: "Sản & Nhi", icon: Baby, color: "bg-pink-50", textColor: "text-pink-600" },
  { key: "can-lam-sang", title: "Cận lâm sàng", icon: Microscope, color: "bg-purple-50", textColor: "text-purple-600" }
];

const departmentData = {
  "ngoai-cap-cuu": {
    heroImage: "/images/pages/hero-chuyenkhoa.jpeg",
    items: [
      { name: "Khoa Ngoại chung", desc: "Phẫu thuật tổng quát, cấp cứu ngoại", img: "/images/pages/ngoai-1.jpeg", highlight: true },
      { name: "Khoa Răng Hàm Mặt", desc: "Phẫu thuật răng, hàm, mặt", img: "/images/pages/ranghamach-1.jpeg" },
      { name: "Khoa Tai – Mũi – Họng", desc: "Phẫu thuật tai, mũi, họng", img: "/images/pages/taimuihong-1.jpeg" },
      { name: "Khoa Hồi sức tích cực ICU", desc: "Hồi sức cấp cứu 24/7", img: "/images/pages/icu-1.jpeg" },
      { name: "Khoa ung bướu", desc: "Phẫu thuật, hóa trị, xạ trị", img: "/images/pages/ungbuou-1.jpeg" }
    ]
  },
  "noi-tong-quat": {
    heroImage: "/images/pages/hero-tongquat.jpeg",
    items: [
      { name: "Khoa Nội chung", desc: "Khám và điều trị các bệnh nội khoa", img: "/images/pages/noi-1.jpeg", highlight: true },
      { name: "Khoa Tim mạch", desc: "Tim mạch can thiệp, phẫu thuật", img: "/images/pages/timmach-1.jpeg" },
      { name: "Khoa Nội tiết", desc: "Đái tháo đường, tuyến giáp", img: "/images/pages/timmach-1.jpeg" },
      { name: "Khoa Thận nhân tạo", desc: "Lọc máu, chạy thận nhân tạo", img: "/images/pages/timmach-1.jpeg" },
      { name: "Khoa Cơ Xương Khớp", desc: "Xương khớp, phục hồi chức năng", img: "/images/pages/noi-1.jpeg" },
      { name: "Khoa Da Liễu", desc: "Da liễu, thẩm mỹ da", img: "/images/pages/thammy-1.jpeg" },
      { name: "Khoa Tâm lý & Sức khỏe", desc: "Tâm thần, tâm lý trị liệu", img: "/images/pages/tamly-1.jpeg" }
    ]
  },
  "san-nhi": {
    heroImage: "/images/pages/hero-thaisan.jpeg",
    items: [
      { name: "Khoa Sản phụ khoa", desc: "Mangled sản, phụ khoa", img: "/images/pages/sanphukhoa-1.jpeg", highlight: true },
      { name: "Khoa Nhi & Sơ sinh", desc: "Nhi khoa, sơ sinh", img: "/images/pages/nhi-1.jpeg" },
      { name: "Khoa Thẩm mỹ và chăm sóc trị liệu", desc: "Thẩm mỹ, spa y tế", img: "/images/pages/thammy-1.jpeg" }
    ]
  },
  "can-lam-sang": {
    heroImage: "/images/pages/hero-chuyenkhoa.jpeg",
    items: [
      { name: "Khoa Dược", desc: "Cung ứng thuốc, tư vấn dược", img: "/images/pages/duoc-1.jpeg", highlight: true },
      { name: "Khoa Mắt", desc: "Mắt, phẫu thuật khúc xạ", img: "/images/pages/mat-1.jpeg" },
      { name: "Khoa Xét nghiệm và Giải phẫu", desc: "Xét nghiệm, giải phẫu bệnh", img: "/images/pages/xetnghiem-1.jpeg" },
      { name: "Khoa Y tế dự phòng", desc: "Phòng bệnh, tiêm chủng", img: "/images/pages/tiemchung-1.jpeg" },
      { name: "Khoa Chẩn đoán hình ảnh", desc: "MRI, CT, X-quang, siêu âm", img: "/images/pages/xetnghiem-1.jpeg" }
    ]
  }
};

const stats = [
  { value: "12", label: "Chuyên khoa", icon: Activity },
  { value: "50+", label: "Bác sĩ", icon: Users },
  { value: "200", label: "Giường bệnh", icon: Bed },
  { value: "5", label: "Phòng mổ", icon: Scissors }
];

export default function ChuyenKhoaPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("ngoai-cap-cuu");

  useEffect(() => {
    if (location.hash) {
      const tab = location.hash.replace("#", "");
      if (departmentData[tab as keyof typeof departmentData]) {
        setActiveTab(tab);
      }
    }
  }, [location]);

  const currentDept = DEPARTMENTS.find(d => d.key === activeTab)!;
  const currentData = departmentData[activeTab as keyof typeof departmentData];
  const featuredItem = currentData.items.find(item => item.highlight) || currentData.items[0];
  const otherItems = currentData.items.filter(item => item !== featuredItem);

  return (
    <Layout>
      <section className="py-12 bg-gradient-to-b from-mint/30 to-white">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up" className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Chuyên khoa</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-10">
              Hệ thống chuyên khoa đa dạng, trang thiết bị hiện đại, đội ngũ bác sĩ chuyên môn cao
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-800/5 hover:shadow-md transition-shadow">
                      <Icon className="w-6 h-6 text-brand-green mx-auto mb-2" />
                      <div className="text-2xl font-display font-bold text-green-dark">{stat.value}</div>
                      <div className="text-xs text-ink/60 font-medium">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up" className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 bg-mint/20 p-2 rounded-2xl">
              {DEPARTMENTS.map(dept => {
                const Icon = dept.icon;
                const isActive = activeTab === dept.key;
                return (
                  <button
                    key={dept.key}
                    onClick={() => setActiveTab(dept.key)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-green text-white shadow-md"
                        : "bg-white text-ink/70 hover:bg-mint hover:text-green-dark"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{dept.title}</span>
                  </button>
                );
              })}
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={100}>
            <img
              src={currentData.heroImage}
              alt={currentDept.title}
              className="w-full h-48 object-cover rounded-[20px] shadow-md mb-8"
              referrerPolicy="no-referrer"
            />
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ScrollAnimation animation="fade-up" delay={150} className="lg:col-span-1">
              <div className="bg-white border border-green-800/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer hover:border-brand-green/30 h-full">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={featuredItem.img}
                    alt={featuredItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className={`inline-flex items-center gap-1 ${currentDept.color} ${currentDept.textColor} text-xs font-bold px-3 py-1 rounded-full mb-2`}>
                      {currentDept.title}
                    </span>
                    <h3 className="font-display font-bold text-xl text-white leading-tight">{featuredItem.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{featuredItem.desc}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherItems.map((item, idx) => (
                <div key={item.name} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${200 + idx * 50}ms`, animationFillMode: 'forwards' }}>
                  <div className="bg-white border border-green-800/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer hover:border-brand-green/30 h-full">
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute top-3 right-3 ${currentDept.color} ${currentDept.textColor} text-[10px] font-bold px-2 py-1 rounded-full shadow-sm`}>
                        {currentDept.title}
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between text-left">
                      <div>
                        <h3 className="font-display font-bold text-[15px] text-green-dark mb-1 group-hover:text-brand-green transition-colors duration-200">{item.name}</h3>
                        <p className="text-[12px] text-ink/70 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}