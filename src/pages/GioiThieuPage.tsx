import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import WhyChooseUs from "../components/public/WhyChooseUs";
import Organization from "../components/public/Organization";
import { CheckCircle, Star, Shield, Heart, Users, Building2, Stethoscope, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GioiThieuPage() {
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

  const directors = [
    { name: "Gs.Ts. Nguyễn Văn A", role: "Giám đốc", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop" },
    { name: "Bs.Ts. Trần Thị B", role: "Phó Giám đốc", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop" },
    { name: "Bs.Ts. Lê Văn C", role: "Phó Giám đốc", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop" }
  ];

  const partners = ["BHYT Quảng Nam", "Bảo Việt", "PTI", "PJICO", "Manulife", "Prudential"];

  const facilities = [
    {
      title: "Cơ sở – Trang thiết bị",
      icon: Building2,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
      items: ["5 phòng mổ hiện đại", "200 giường bệnh", "Thiết bị MRI, CT Scanner", "Phòng ICU với 20 giường"]
    },
    {
      title: "Hình ảnh bệnh viện",
      icon: Award,
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8f0a3?w=400&h=300&fit=crop",
      items: ["Không gian sạch sẽ, thoáng mát", "Khu vườn cây xanh mát", "Phòng chờ hiện đại", "Khuôn viên rộng 5 hecta"]
    },
    {
      title: "Tiện nghi – Sang trọng",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop",
      items: ["Wifi miễn phí toàn bệnh viện", "Nhà hàng cao cấp", "Khu vui chơi trẻ em", "Bãi đỗ xe rộng rãi"]
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Giới thiệu Bệnh viện</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bệnh viện Đa khoa khu vực Miền Núi Phía Bắc Quảng Nam - Nơi mang đến dịch vụ y tế chất lượng cao cho người dân
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section id="ve-chung-toi" className="py-16 bg-mint/30">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-green-dark mb-4">Về chúng tôi</h2>
              <div className="w-20 h-1 bg-brand-green mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollAnimation animation="slide-right" delay={100}>
              <div className="bg-white rounded-2xl p-8 shadow-sm h-full">
                <h3 className="font-display font-bold text-xl text-green-dark mb-6 flex items-center gap-2">
                  <Star className="text-peach" />
                  Tại sao lại chọn Bệnh viện?
                </h3>
                <ul className="space-y-4">
                  {[
                    "Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm",
                    "Trang thiết bị y tế hiện đại, tiên tiến",
                    "Quy trình khám chữa bệnh chuyên nghiệp",
                    "Thái độ phục vụ tận tâm, chu đáo",
                    "Chi phí hợp lý, minh bạch"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="text-brand-green w-5 h-5 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop"
                    alt="Bệnh viện hiện đại"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="slide-left" delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-sm h-full">
                <h3 className="font-display font-bold text-xl text-green-dark mb-6 flex items-center gap-2">
                  <Shield className="text-brand-green" />
                  Đối tác của Bệnh viện
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {partners.map((partner) => (
                    <div key={partner} className="bg-mint/50 rounded-xl p-3 text-center">
                      <span className="font-semibold text-green-dark text-sm">{partner}</span>
                    </div>
                  ))}
                </div>
                <h3 className="font-display font-bold text-xl text-green-dark mt-6 mb-4 flex items-center gap-2">
                  <Users className="text-brand-green" />
                  Ban Giám Đốc
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {directors.map((leader) => (
                    <div key={leader.name} className="text-center">
                      <img
                        src={leader.img}
                        alt={leader.name}
                        className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-brand-green/20"
                      />
                      <p className="font-semibold text-ink text-sm">{leader.name}</p>
                      <p className="text-xs text-gray-500">{leader.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          </div>

          <ScrollAnimation className="mt-8" animation="fade-up" delay={300}>
            <Link
              to="/so-do-to-chuc"
              className="inline-flex items-center gap-2 text-brand-green font-semibold hover:text-brand-green/80 transition-colors"
            >
              <Stethoscope size={18} />
              Xem sơ đồ tổ chức đầy đủ
              <ArrowRight size={16} />
            </Link>
          </ScrollAnimation>
        </div>
      </section>

      <section id="co-so-vat-chat" className="py-16">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-green-dark mb-4">Cơ sở vật chất</h2>
              <div className="w-20 h-1 bg-brand-green mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility, idx) => (
              <div key={facility.title}>
                <ScrollAnimation animation="fade-up" delay={idx * 100}>
                  <div className="bg-white border border-green-800/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer hover:border-brand-green/30">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={facility.image}
                        alt={facility.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6 flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center">
                          <facility.icon className="w-6 h-6 text-brand-green" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-green-dark">{facility.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {facility.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-ink/75 text-sm">
                            <span className="text-brand-green mt-0.5">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quy-trinh-cham-soc" className="py-16 bg-green-dark/5">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-green-dark mb-4">Quy trình chăm sóc</h2>
              <div className="w-20 h-1 bg-brand-green mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Quy trình chăm sóc khép kín",
                desc: "Từ tiếp nhận đến xuất viện, mỗi bước đều được theo dõi và chăm sóc tận tình",
                img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop"
              },
              {
                num: "2",
                title: "Hướng dẫn đặt khám nhanh",
                desc: "Đặt lịch khám trực tuyến qua website hoặc hotline, tiết kiệm thời gian chờ đợi",
                img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop"
              },
              {
                num: "3",
                title: "Hỗ trợ bảo hiểm trực tiếp",
                desc: "Bệnh viện liên kết với nhiều công ty bảo hiểm, hỗ trợ thanh toán trực tiếp",
                img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop"
              }
            ].map((item, idx) => (
              <div key={item.num}>
                <ScrollAnimation animation="fade-up" delay={idx * 100}>
                  <div className="bg-white border border-green-800/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer hover:border-brand-green/30">
                    <div className="relative h-48 overflow-hidden">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-6 text-center">
                      <div className="w-14 h-14 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        {item.num}
                      </div>
                      <h3 className="font-display font-bold text-lg text-green-dark mb-2">{item.title}</h3>
                      <p className="text-ink/75 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <Organization />
    </Layout>
  );
}