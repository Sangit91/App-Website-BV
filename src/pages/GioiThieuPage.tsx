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
    { name: "Gs.Ts. Nguyá»…n VÄƒn A", role: "GiÃ¡m Ä‘á»‘c", img: "/images/doctors/giamdoc-1.jpeg" },
    { name: "Bs.Ts. Tráº§n Thá»‹ B", role: "PhÃ³ GiÃ¡m Ä‘á»‘c", img: "/images/doctors/truongphong-1.jpeg" },
    { name: "Bs.Ts. LÃª VÄƒn C", role: "PhÃ³ GiÃ¡m Ä‘á»‘c", img: "/images/doctors/phogiamdoc-1.jpeg" }
  ];

  const partners = ["BHYT Quáº£ng Nam", "Báº£o Viá»‡t", "PTI", "PJICO", "Manulife", "Prudential"];

  const facilities = [
    {
      title: "CÆ¡ sá»Ÿ â€“ Trang thiáº¿t bá»‹",
      icon: Building2,
      image: "/images/pages/muangoi-1.jpeg",
      items: ["5 phÃ²ng má»• hiá»‡n Ä‘áº¡i", "200 giÆ°á»ng bá»‡nh", "Thiáº¿t bá»‹ MRI, CT Scanner", "PhÃ²ng ICU vá»›i 20 giÆ°á»ng"]
    },
    {
      title: "HÃ¬nh áº£nh bá»‡nh viá»‡n",
      icon: Award,
      image: "/images/pages/coso-1.jpeg",
      items: ["KhÃ´ng gian sáº¡ch sáº½, thoÃ¡ng mÃ¡t", "Khu vÆ°á»n cÃ¢y xanh mÃ¡t", "PhÃ²ng chá» hiá»‡n Ä‘áº¡i", "KhuÃ´n viÃªn rá»™ng 5 hecta"]
    },
    {
      title: "Tiá»‡n nghi â€“ Sang trá»ng",
      icon: Heart,
      image: "/images/pages/ranghamach-1.jpeg",
      items: ["Wifi miá»…n phÃ­ toÃ n bá»‡nh viá»‡n", "NhÃ  hÃ ng cao cáº¥p", "Khu vui chÆ¡i tráº» em", "BÃ£i Ä‘á»— xe rá»™ng rÃ£i"]
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Giá»›i thiá»‡u Bá»‡nh viá»‡n</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bá»‡nh viá»‡n Äa khoa khu vá»±c Miá»n NÃºi PhÃ­a Báº¯c Quáº£ng Nam - NÆ¡i mang Ä‘áº¿n dá»‹ch vá»¥ y táº¿ cháº¥t lÆ°á»£ng cao cho ngÆ°á»i dÃ¢n
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section id="ve-chung-toi" className="py-16 bg-mint/30">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-green-dark mb-4">Vá» chÃºng tÃ´i</h2>
              <div className="w-20 h-1 bg-brand-green mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollAnimation animation="slide-right" delay={100}>
              <div className="bg-white rounded-2xl p-8 shadow-sm h-full">
                <h3 className="font-display font-bold text-xl text-green-dark mb-6 flex items-center gap-2">
                  <Star className="text-peach" />
                  Táº¡i sao láº¡i chá»n Bá»‡nh viá»‡n?
                </h3>
                <ul className="space-y-4">
                  {[
                    "Äá»™i ngÅ© bÃ¡c sÄ© chuyÃªn mÃ´n cao, giÃ u kinh nghiá»‡m",
                    "Trang thiáº¿t bá»‹ y táº¿ hiá»‡n Ä‘áº¡i, tiÃªn tiáº¿n",
                    "Quy trÃ¬nh khÃ¡m chá»¯a bá»‡nh chuyÃªn nghiá»‡p",
                    "ThÃ¡i Ä‘á»™ phá»¥c vá»¥ táº­n tÃ¢m, chu Ä‘Ã¡o",
                    "Chi phÃ­ há»£p lÃ½, minh báº¡ch"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="text-brand-green w-5 h-5 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <img
                    src="/images/pages/tainha-1.jpeg"
                    alt="Bá»‡nh viá»‡n hiá»‡n Ä‘áº¡i"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="slide-left" delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-sm h-full">
                <h3 className="font-display font-bold text-xl text-green-dark mb-6 flex items-center gap-2">
                  <Shield className="text-brand-green" />
                  Äá»‘i tÃ¡c cá»§a Bá»‡nh viá»‡n
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
                  Ban GiÃ¡m Äá»‘c
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
              Xem sÆ¡ Ä‘á»“ tá»• chá»©c Ä‘áº§y Ä‘á»§
              <ArrowRight size={16} />
            </Link>
          </ScrollAnimation>
        </div>
      </section>

      <section id="co-so-vat-chat" className="py-16">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-green-dark mb-4">CÆ¡ sá»Ÿ váº­t cháº¥t</h2>
              <div className="w-20 h-1 bg-brand-green mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility, idx) => (
              <div key={facility.title}>
                <ScrollAnimation animation="fade-up" delay={idx * 100}>
                  <div className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
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
                            <span className="text-brand-green mt-0.5">â€¢</span>
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
              <h2 className="text-3xl font-display font-bold text-green-dark mb-4">Quy trÃ¬nh chÄƒm sÃ³c</h2>
              <div className="w-20 h-1 bg-brand-green mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Quy trÃ¬nh chÄƒm sÃ³c khÃ©p kÃ­n",
                desc: "Tá»« tiáº¿p nháº­n Ä‘áº¿n xuáº¥t viá»‡n, má»—i bÆ°á»›c Ä‘á»u Ä‘Æ°á»£c theo dÃµi vÃ  chÄƒm sÃ³c táº­n tÃ¬nh",
                img: "/images/pages/tainha-1.jpeg"
              },
              {
                num: "2",
                title: "HÆ°á»›ng dáº«n Ä‘áº·t khÃ¡m nhanh",
                desc: "Äáº·t lá»‹ch khÃ¡m trá»±c tuyáº¿n qua website hoáº·c hotline, tiáº¿t kiá»‡m thá»i gian chá» Ä‘á»£i",
                img: "/images/pages/timmach-1.jpeg"
              },
              {
                num: "3",
                title: "Há»— trá»£ báº£o hiá»ƒm trá»±c tiáº¿p",
                desc: "Bá»‡nh viá»‡n liÃªn káº¿t vá»›i nhiá»u cÃ´ng ty báº£o hiá»ƒm, há»— trá»£ thanh toÃ¡n trá»±c tiáº¿p",
                img: "/images/pages/bhyt-1.jpeg"
              }
            ].map((item, idx) => (
              <div key={item.num}>
                <ScrollAnimation animation="fade-up" delay={idx * 100}>
                  <div className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
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