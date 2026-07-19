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
      title: "Ngoáº¡i & Cáº¥p cá»©u",
      icon: Scissors,
      color: "bg-red-50",
      textColor: "text-red-600",
      heroImage: "/images/pages/hero-chuyenkhoa.jpeg",
      items: [
        { name: "Khoa Ngoáº¡i chung", desc: "Pháº«u thuáº­t tá»•ng quÃ¡t, cáº¥p cá»©u ngoáº¡i", img: "/images/pages/ngoai-1.jpeg" },
        { name: "Khoa RÄƒng HÃ m Máº·t", desc: "Pháº«u thuáº­t rÄƒng, hÃ m, máº·t", img: "/images/pages/ranghamach-1.jpeg" },
        { name: "Khoa Tai â€“ MÅ©i â€“ Há»ng", desc: "Pháº«u thuáº­t tai, mÅ©i, há»ng", img: "/images/pages/taimuihong-1.jpeg" },
        { name: "Khoa Há»“i sá»©c tÃ­ch cá»±c ICU", desc: "Há»“i sá»©c cáº¥p cá»©u 24/7", img: "/images/pages/icu-1.jpeg" },
        { name: "Khoa ung bÆ°á»›u", desc: "Pháº«u thuáº­t, hÃ³a trá»‹, xáº¡ trá»‹", img: "/images/pages/ungbuou-1.jpeg" }
      ]
    },
    "noi-tong-quat": {
      title: "Ná»™i tá»•ng quÃ¡t",
      icon: Stethoscope,
      color: "bg-blue-50",
      textColor: "text-blue-600",
      heroImage: "/images/pages/hero-dichvu.jpeg",
      items: [
        { name: "Khoa Ná»™i chung", desc: "KhÃ¡m vÃ  Ä‘iá»u trá»‹ cÃ¡c bá»‡nh ná»™i khoa", img: "/images/pages/vanchuyen-1.jpeg" },
        { name: "Khoa Tim máº¡ch", desc: "Tim máº¡ch can thiá»‡p, pháº«u thuáº­t", img: "/images/pages/vanchuyen-1.jpeg" },
        { name: "Khoa Ná»™i tiáº¿t", desc: "ÄÃ¡i thÃ¡o Ä‘Æ°á»ng, tuyáº¿n giÃ¡p", img: "/images/pages/timmach-1.jpeg" },
        { name: "Khoa Tháº­n nhÃ¢n táº¡o", desc: "Lá»c mÃ¡u, cháº¡y tháº­n nhÃ¢n táº¡o", img: "/images/pages/khamtongquat-1.jpeg" },
        { name: "Khoa CÆ¡ XÆ°Æ¡ng Khá»›p", desc: "XÆ°Æ¡ng khá»›p, phá»¥c há»“i chá»©c nÄƒng", img: "/images/pages/bacsi-1.jpeg" },
        { name: "Khoa Da Liá»…u", desc: "Da liá»…u, tháº©m má»¹ da", img: "/images/pages/daliem-1.jpeg" },
        { name: "Khoa TÃ¢m lÃ½ & Sá»©c khá»e", desc: "TÃ¢m tháº§n, tÃ¢m lÃ½ trá»‹ liá»‡u", img: "/images/pages/tamly-1.jpeg" }
      ]
    },
    "san-nhi": {
      title: "Sáº£n & Nhi",
      icon: Baby,
      color: "bg-pink-50",
      textColor: "text-pink-600",
      heroImage: "/images/pages/hero-thaisan.jpeg",
      items: [
        { name: "Khoa Sáº£n phá»¥ khoa", desc: "Mangled sáº£n, phá»¥ khoa", img: "/images/pages/sanphukhoa-1.jpeg" },
        { name: "Khoa Nhi & SÆ¡ sinh", desc: "Nhi khoa, sÆ¡ sinh", img: "/images/pages/nhi-1.jpeg" },
        { name: "Khoa Tháº©m má»¹ vÃ  chÄƒm sÃ³c trá»‹ liá»‡u", desc: "Tháº©m má»¹, spa y táº¿", img: "/images/pages/thammy-1.jpeg" }
      ]
    },
    "can-lam-sang": {
      title: "Cáº­n lÃ¢m sÃ ng",
      icon: Microscope,
      color: "bg-purple-50",
      textColor: "text-purple-600",
      heroImage: "/images/pages/hero-tongquat.jpeg",
      items: [
        { name: "Khoa DÆ°á»£c", desc: "Cung á»©ng thuá»‘c, tÆ° váº¥n dÆ°á»£c", img: "/images/pages/duoc-1.jpeg" },
        { name: "Khoa Máº¯t", desc: "Máº¯t, pháº«u thuáº­t khÃºc xáº¡", img: "/images/pages/mat-1.jpeg" },
        { name: "Khoa XÃ©t nghiá»‡m vÃ  Giáº£i pháº«u", desc: "XÃ©t nghiá»‡m, giáº£i pháº«u bá»‡nh", img: "/images/pages/tainha-1.jpeg" },
        { name: "Khoa Y táº¿ dá»± phÃ²ng", desc: "PhÃ²ng bá»‡nh, tiÃªm chá»§ng", img: "/images/pages/tiemchung-1.jpeg" },
        { name: "Khoa Cháº©n Ä‘oÃ¡n hÃ¬nh áº£nh", desc: "MRI, CT, X-quang, siÃªu Ã¢m", img: "/images/pages/xetnghiem-1.jpeg" }
      ]
    }
  };

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">ChuyÃªn khoa</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Há»‡ thá»‘ng chuyÃªn khoa Ä‘a dáº¡ng, trang thiáº¿t bá»‹ hiá»‡n Ä‘áº¡i, Ä‘á»™i ngÅ© bÃ¡c sÄ© chuyÃªn mÃ´n cao
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