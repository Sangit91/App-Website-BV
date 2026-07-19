import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import { Link } from "react-router-dom";
import { Calendar, Home, Syringe, Shield, Heart, Truck, Sparkles, Baby, Plane, Stethoscope } from "lucide-react";

export default function DichVuPage() {
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

  const serviceCategories = [
    {
      id: "dich-vu-tron-goi",
      title: "Dịch vụ trọn gói",
      icon: Calendar,
      color: "from-orange-50 to-yellow-50",
      heroImage: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&h=400&fit=crop",
      items: [
        { name: "Dịch vụ trọn gói", desc: "Gói khám, điều trị toàn diện", price: "Từ 5.000.000đ", img: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=400&h=300&fit=crop" },
        { name: "Kiến thức thai sản", desc: "Tư vấn, chăm sóc mẹ và bé", price: "Miễn phí", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop" },
        { name: "Điều trị vô sinh, hiếm muộn", desc: "IVF, IUI, các phương pháp hỗ trợ", price: "Từ 15.000.000đ", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop" },
        { name: "Dịch vụ thai sản và sinh trọn gói", desc: "Theo dõi thai kỳ, sinh con", price: "Từ 25.000.000đ", img: "https://images.unsplash.com/photo-1518584303990-7892c8e5f9f5?w=400&h=300&fit=crop" }
      ]
    },
    {
      id: "tai-nha-van-chuyen",
      title: "Tại nhà & Vận chuyển",
      icon: Home,
      color: "from-blue-50 to-cyan-50",
      heroImage: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop",
      items: [
        { name: "Dịch vụ khám tại nhà", desc: "Bác sĩ đến tận nhà khám", price: "Từ 500.000đ", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop" },
        { name: "Dịch vụ vận chuyển cấp cứu", desc: "Xe cấp cứu 24/7", price: "Theo km", img: "https://images.unsplash.com/photo-1587613865765-5e33e4零点bd58?w=400&h=300&fit=crop" },
        { name: "Khám bệnh và xét nghiệm tại nhà", desc: "Lấy mẫu xét nghiệm tại nhà", price: "Từ 300.000đ", img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=300&fit=crop" }
      ]
    },
    {
      id: "tiem-chung",
      title: "Tiêm chủng",
      icon: Syringe,
      color: "from-green-50 to-emerald-50",
      heroImage: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=400&fit=crop",
      items: [
        { name: "Tiêm chủng – Vaccine", desc: "Đầy đủ các loại vaccine", price: "Từ 200.000đ", img: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=300&fit=crop" },
        { name: "Dịch vụ tiêm chủng", desc: "Tiêm tại bệnh viện hoặc tại nhà", price: "Từ 150.000đ", img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop" },
        { name: "Tiêm vaccine tại Bệnh viện", desc: "Phòng tiêm hiện đại, an toàn", price: "Theo loại vaccine", img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop" },
        { name: "Tư vấn tiêm chủng trẻ em", desc: "Lịch tiêm, giấy tờ đầy đủ", price: "Miễn phí", img: "https://images.unsplash.com/photo-1546823零da49c4d-a3b3b3a9a4c1?w=400&h=300&fit=crop" }
      ]
    },
    {
      id: "bao-hiem-vip",
      title: "Bảo hiểm & VIP",
      icon: Shield,
      color: "from-purple-50 to-violet-50",
      heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop",
      items: [
        { name: "Bảo hiểm Bệnh viện", desc: "Các gói bảo hiểm y tế", price: "Theo gói", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop" },
        { name: "Dịch vụ VIP", desc: "Phòng VIP, bác sĩ riêng", price: "Từ 2.000.000đ/ngày", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop" },
        { name: "Trung tâm Khám bệnh Quốc tế IMC", desc: "Dịch vụ quốc tế", price: "Liên hệ", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop" },
        { name: "Tour Du lịch – Sức khỏe", desc: "Kết hợp khám và du lịch", price: "Theo tour", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
        { name: "Thẩm mỹ & Spa da liễu", desc: "Làm đẹp, chăm sóc da", price: "Từ 500.000đ", img: "https://images.unsplash.com/photo-1598524374912-6e92af34e484?w=400&h=300&fit=crop" }
      ]
    },
    {
      id: "goi-kham",
      title: "Gói khám",
      icon: Heart,
      color: "from-pink-50 to-rose-50",
      heroImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop",
      items: [
        { name: "Gói khám sức khỏe định kỳ", desc: "Tổng quát, toàn diện", price: "Từ 1.500.000đ", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop" },
        { name: "Khám sức khỏe công ty", desc: "Kiểm tra sức khỏi nhân viên", price: "Từ 500.000đ/người", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop" },
        { name: "Khám sức khỏe tổng quát cá nhân", desc: "Gói cơ bản, nâng cao", price: "Từ 800.000đ", img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=400&h=300&fit=crop" },
        { name: "Khám xuất khẩu lao động", desc: "Giấy khám sức khỏe chuẩn", price: "Từ 300.000đ", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop" }
      ]
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Dịch vụ y tế</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đa dạng dịch vụ chăm sóc sức khỏe chất lượng cao
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={100} className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/thong-tin-thau"
              className="px-4 py-2 bg-brand-green text-white rounded-full text-sm font-semibold hover:bg-brand-green/90 transition-colors"
            >
              Thông tin đấu thầu
            </Link>
          </ScrollAnimation>
        </div>
      </section>

      {serviceCategories.map((category, deptIndex) => (
        <section
          key={category.id}
          id={category.id}
          className={`py-16 ${deptIndex % 2 === 0 ? "bg-gradient-to-br" : ""} ${deptIndex % 2 === 0 ? category.color : "bg-gray-50/50"}`}
        >
          <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
            <ScrollAnimation animation="fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <category.icon className="w-7 h-7 text-brand-green" />
                </div>
                <h2 className="text-2xl font-display font-bold text-green-dark">{category.title}</h2>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={100}>
              <img
                src={category.heroImage}
                alt={category.title}
                className="w-full h-64 object-cover rounded-[20px] shadow-md mb-8"
              />
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((item, idx) => (
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
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between text-left">
                      <div>
                        <h3 className="font-display font-bold text-[17px] text-green-dark mb-2 group-hover:text-brand-green transition-colors duration-200">{item.name}</h3>
                        <p className="text-[13px] text-ink/75 leading-relaxed mb-4">{item.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-green-800/5">
                        <span className="text-brand-green font-semibold text-sm">{item.price}</span>
                        <button className="px-3 py-1.5 bg-mint text-green-dark text-xs font-semibold rounded-full hover:bg-brand-green hover:text-white transition-colors">
                          Đặt lịch
                        </button>
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