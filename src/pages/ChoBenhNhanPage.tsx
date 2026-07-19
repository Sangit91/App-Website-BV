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
      title: "Chi phÃ­ & Äá»‹a Ä‘iá»ƒm",
      icon: MapPin,
      color: "from-blue-50 to-indigo-50",
      heroImage: "/images/pages/hero-chi-phi.jpeg",
      items: [
        {
          name: "Chi phÃ­ Ä‘iá»u trá»‹ cÃ´ng khai",
          desc: "Báº£ng giÃ¡ dá»‹ch vá»¥ y táº¿ niÃªm yáº¿t cÃ´ng khai",
          action: "Xem báº£ng giÃ¡",
          icon: DollarSign,
          img: "/images/pages/chiphi-1.jpeg"
        },
        {
          name: "CÆ¡ sá»Ÿ Ä‘iá»u trá»‹",
          desc: "2 cÆ¡ sá»Ÿ: 123 ÄÆ°á»ng XYZ (CS1) vÃ  456 ÄÆ°á»ng ABC (CS2)",
          action: "Báº£n Ä‘á»“",
          icon: MapPin,
          img: "/images/pages/coso-2.jpeg"
        },
        {
          name: "Danh má»¥c thuá»‘c BHYT",
          desc: "Danh má»¥c thuá»‘c Ä‘Æ°á»£c báº£o hiá»ƒm y táº¿ chi tráº£",
          action: "Tra cá»©u",
          icon: Pill,
          img: "/images/pages/duoc-1.jpeg"
        }
      ]
    },
    {
      id: "huong-dan-tien-ich",
      title: "HÆ°á»›ng dáº«n tiá»‡n Ã­ch",
      icon: Users,
      color: "from-emerald-50 to-teal-50",
      heroImage: "/images/pages/hero-muangoi.jpeg",
      items: [
        {
          name: "Dá»‹ch vá»¥ Ä‘iá»u trá»‹",
          desc: "HÆ°á»›ng dáº«n cÃ¡c dá»‹ch vá»¥ y táº¿ táº¡i bá»‡nh viá»‡n",
          action: "TÃ¬m hiá»ƒu thÃªm",
          icon: FileText,
          img: "/images/pages/tainha-1.jpeg"
        },
        {
          name: "DÃ nh cho bá»‡nh nhÃ¢n ná»™i trÃº",
          desc: "Quy Ä‘á»‹nh nháº­p viá»‡n, thÄƒm nom, Äƒn á»Ÿ",
          action: "Xem hÆ°á»›ng dáº«n",
          icon: Bed,
          img: "/images/pages/muangoi-1.jpeg"
        },
        {
          name: "DÃ nh cho thÄƒm khÃ¡m ngoáº¡i trÃº",
          desc: "Quy trÃ¬nh Ä‘Äƒng kÃ½, khÃ¡m bá»‡nh, nháº­n káº¿t quáº£",
          action: "Xem hÆ°á»›ng dáº«n",
          icon: Calendar,
          img: "/images/pages/ngoai-1.jpeg"
        }
      ]
    },
    {
      id: "cong-thong-tin",
      title: "Cá»•ng thÃ´ng tin",
      icon: Search,
      color: "from-purple-50 to-pink-50",
      heroImage: "/images/pages/hero-congthongtin.jpeg",
      items: [
        {
          name: "Tra cá»©u bá»‡nh sá»­ online",
          desc: "Xem lá»‹ch sá»­ khÃ¡m bá»‡nh, káº¿t quáº£ xÃ©t nghiá»‡m",
          action: "ÄÄƒng nháº­p",
          icon: Clipboard,
          img: "/images/pages/timmach-1.jpeg"
        },
        {
          name: "YÃªu cáº§u trÃ­ch sao há»“ sÆ¡",
          desc: "Láº¥y báº£n sao há»“ sÆ¡ y táº¿, giáº¥y chá»©ng nháº­n",
          action: "Gá»­i yÃªu cáº§u",
          icon: FileText,
          img: "/images/pages/hoso-1.jpeg"
        },
        {
          name: "GÃ³p Ã½ cháº¥t lÆ°á»£ng phá»¥c vá»¥",
          desc: "ÄÃ³ng gÃ³p Ã½ kiáº¿n Ä‘á»ƒ cáº£i thiá»‡n dá»‹ch vá»¥",
          action: "Gá»­i gÃ³p Ã½",
          icon: Phone,
          img: "/images/pages/noi-1.jpeg"
        }
      ]
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">DÃ nh cho bá»‡nh nhÃ¢n</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ThÃ´ng tin hÆ°á»›ng dáº«n vÃ  dá»‹ch vá»¥ há»— trá»£ bá»‡nh nhÃ¢n
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={100} className="flex justify-center gap-4 flex-wrap">
            <a
              href="tel:02353747432"
              className="px-4 py-2 bg-peach text-white rounded-full text-sm font-semibold hover:bg-peach/90 transition-colors"
            >
              Cáº¥p cá»©u: 02353.747.432
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
                    className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
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