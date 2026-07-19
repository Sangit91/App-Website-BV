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
      heroImage: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&h=400&fit=crop",
      items: [
        { name: "Khoa Ngoại chung", desc: "Phẫu thuật tổng quát, cấp cứu ngoại", img: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop" },
        { name: "Khoa Răng Hàm Mặt", desc: "Phẫu thuật răng, hàm, mặt", img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop" },
        { name: "Khoa Tai – Mũi – Họng", desc: "Phẫu thuật tai, mũi, họng", img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop" },
        { name: "Khoa Hồi sức tích cực ICU", desc: "Hồi sức cấp cứu 24/7", img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop" },
        { name: "Khoa ung bướu", desc: "Phẫu thuật, hóa trị, xạ trị", img: "https://images.unsplash.com/photo-1631815589968-fdb2fc1e0303?w=400&h=300&fit=crop" }
      ]
    },
    "noi-tong-quat": {
      title: "Nội tổng quát",
      icon: Stethoscope,
      color: "bg-blue-50",
      textColor: "text-blue-600",
      heroImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop",
      items: [
        { name: "Khoa Nội chung", desc: "Khám và điều trị các bệnh nội khoa", img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=400&h=300&fit=crop" },
        { name: "Khoa Tim mạch", desc: "Tim mạch can thiệp, phẫu thuật", img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop" },
        { name: "Khoa Nội tiết", desc: "Đái tháo đường, tuyến giáp", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop" },
        { name: "Khoa Thận nhân tạo", desc: "Lọc máu, chạy thận nhân tạo", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop" },
        { name: "Khoa Cơ Xương Khớp", desc: "Xương khớp, phục hồi chức năng", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop" },
        { name: "Khoa Da Liễu", desc: "Da liễu, thẩm mỹ da", img: "https://images.unsplash.com/photo-1576021182211-9ea8dced3690?w=400&h=300&fit=crop" },
        { name: "Khoa Tâm lý & Sức khỏe", desc: "Tâm thần, tâm lý trị liệu", img: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=400&h=300&fit=crop" }
      ]
    },
    "san-nhi": {
      title: "Sản & Nhi",
      icon: Baby,
      color: "bg-pink-50",
      textColor: "text-pink-600",
      heroImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
      items: [
        { name: "Khoa Sản phụ khoa", desc: "Mangled sản, phụ khoa", img: "https://images.unsplash.com/photo-1518584303990-7892c8e5f9f5?w=400&h=300&fit=crop" },
        { name: "Khoa Nhi & Sơ sinh", desc: "Nhi khoa, sơ sinh", img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop" },
        { name: "Khoa Thẩm mỹ và chăm sóc trị liệu", desc: "Thẩm mỹ, spa y tế", img: "https://images.unsplash.com/photo-1598524374912-6e92af34e484?w=400&h=300&fit=crop" }
      ]
    },
    "can-lam-sang": {
      title: "Cận lâm sàng",
      icon: Microscope,
      color: "bg-purple-50",
      textColor: "text-purple-600",
      heroImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=400&fit=crop",
      items: [
        { name: "Khoa Dược", desc: "Cung ứng thuốc, tư vấn dược", img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop" },
        { name: "Khoa Mắt", desc: "Mắt, phẫu thuật khúc xạ", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop" },
        { name: "Khoa Xét nghiệm và Giải phẫu", desc: "Xét nghiệm, giải phẫu bệnh", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop" },
        { name: "Khoa Y tế dự phòng", desc: "Phòng bệnh, tiêm chủng", img: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=300&fit=crop" },
        { name: "Khoa Chẩn đoán hình ảnh", desc: "MRI, CT, X-quang, siêu âm", img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=300&fit=crop" }
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
                    className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
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