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
      title: "Dá»‹ch vá»¥ trá»n gÃ³i",
      icon: Calendar,
      color: "from-orange-50 to-yellow-50",
      heroImage: "/images/pages/hero-chuyenkhoa.jpeg",
      items: [
        { name: "Dá»‹ch vá»¥ trá»n gÃ³i", desc: "GÃ³i khÃ¡m, Ä‘iá»u trá»‹ toÃ n diá»‡n", price: "Tá»« 5.000.000Ä‘", img: "/images/pages/trongoi-1.jpeg" },
        { name: "Kiáº¿n thá»©c thai sáº£n", desc: "TÆ° váº¥n, chÄƒm sÃ³c máº¹ vÃ  bÃ©", price: "Miá»…n phÃ­", img: "/images/pages/sanphukhoa-hero.jpeg" },
        { name: "Äiá»u trá»‹ vÃ´ sinh, hiáº¿m muá»™n", desc: "IVF, IUI, cÃ¡c phÆ°Æ¡ng phÃ¡p há»— trá»£", price: "Tá»« 15.000.000Ä‘", img: "/images/pages/timmach-1.jpeg" },
        { name: "Dá»‹ch vá»¥ thai sáº£n vÃ  sinh trá»n gÃ³i", desc: "Theo dÃµi thai ká»³, sinh con", price: "Tá»« 25.000.000Ä‘", img: "/images/pages/sanphukhoa-1.jpeg" }
      ]
    },
    {
      id: "tai-nha-van-chuyen",
      title: "Táº¡i nhÃ  & Váº­n chuyá»ƒn",
      icon: Home,
      color: "from-blue-50 to-cyan-50",
      heroImage: "/images/pages/hero-tainha.jpeg",
      items: [
        { name: "Dá»‹ch vá»¥ khÃ¡m táº¡i nhÃ ", desc: "BÃ¡c sÄ© Ä‘áº¿n táº­n nhÃ  khÃ¡m", price: "Tá»« 500.000Ä‘", img: "/images/pages/tainha-1.jpeg" },
        { name: "Dá»‹ch vá»¥ váº­n chuyá»ƒn cáº¥p cá»©u", desc: "Xe cáº¥p cá»©u 24/7", price: "Theo km", img: "/images/pages/vanchuyen-1.jpeg" },
        { name: "KhÃ¡m bá»‡nh vÃ  xÃ©t nghiá»‡m táº¡i nhÃ ", desc: "Láº¥y máº«u xÃ©t nghiá»‡m táº¡i nhÃ ", price: "Tá»« 300.000Ä‘", img: "/images/pages/xetnghiem-1.jpeg" }
      ]
    },
    {
      id: "tiem-chung",
      title: "TiÃªm chá»§ng",
      icon: Syringe,
      color: "from-green-50 to-emerald-50",
      heroImage: "/images/pages/hero-tiemchung.jpeg",
      items: [
        { name: "TiÃªm chá»§ng â€“ Vaccine", desc: "Äáº§y Ä‘á»§ cÃ¡c loáº¡i vaccine", price: "Tá»« 200.000Ä‘", img: "/images/pages/tiemchung-1.jpeg" },
        { name: "Dá»‹ch vá»¥ tiÃªm chá»§ng", desc: "TiÃªm táº¡i bá»‡nh viá»‡n hoáº·c táº¡i nhÃ ", price: "Tá»« 150.000Ä‘", img: "/images/pages/duoc-1.jpeg" },
        { name: "TiÃªm vaccine táº¡i Bá»‡nh viá»‡n", desc: "PhÃ²ng tiÃªm hiá»‡n Ä‘áº¡i, an toÃ n", price: "Theo loáº¡i vaccine", img: "/images/pages/nhi-1.jpeg" },
        { name: "TÆ° váº¥n tiÃªm chá»§ng tráº» em", desc: "Lá»‹ch tiÃªm, giáº¥y tá» Ä‘áº§y Ä‘á»§", price: "Miá»…n phÃ­", img: "/images/pages/muangoi-1.jpeg" }
      ]
    },
    {
      id: "bao-hiem-vip",
      title: "Báº£o hiá»ƒm & VIP",
      icon: Shield,
      color: "from-purple-50 to-violet-50",
      heroImage: "/images/pages/hero-muangoi.jpeg",
      items: [
        { name: "Báº£o hiá»ƒm Bá»‡nh viá»‡n", desc: "CÃ¡c gÃ³i báº£o hiá»ƒm y táº¿", price: "Theo gÃ³i", img: "/images/pages/bhyt-1.jpeg" },
        { name: "Dá»‹ch vá»¥ VIP", desc: "PhÃ²ng VIP, bÃ¡c sÄ© riÃªng", price: "Tá»« 2.000.000Ä‘/ngÃ y", img: "/images/pages/muangoi-1.jpeg" },
        { name: "Trung tÃ¢m KhÃ¡m bá»‡nh Quá»‘c táº¿ IMC", desc: "Dá»‹ch vá»¥ quá»‘c táº¿", price: "LiÃªn há»‡", img: "/images/pages/khamtongquat-1.jpeg" },
        { name: "Tour Du lá»‹ch â€“ Sá»©c khá»e", desc: "Káº¿t há»£p khÃ¡m vÃ  du lá»‹ch", price: "Theo tour", img: "/images/pages/vip-1.jpeg" },
        { name: "Tháº©m má»¹ & Spa da liá»…u", desc: "LÃ m Ä‘áº¹p, chÄƒm sÃ³c da", price: "Tá»« 500.000Ä‘", img: "/images/pages/thammy-1.jpeg" }
      ]
    },
    {
      id: "goi-kham",
      title: "GÃ³i khÃ¡m",
      icon: Heart,
      color: "from-pink-50 to-rose-50",
      heroImage: "/images/pages/hero-dichvu.jpeg",
      items: [
        { name: "GÃ³i khÃ¡m sá»©c khá»e Ä‘á»‹nh ká»³", desc: "Tá»•ng quÃ¡t, toÃ n diá»‡n", price: "Tá»« 1.500.000Ä‘", img: "/images/pages/timmach-1.jpeg" },
        { name: "KhÃ¡m sá»©c khá»e cÃ´ng ty", desc: "Kiá»ƒm tra sá»©c khá»i nhÃ¢n viÃªn", price: "Tá»« 500.000Ä‘/ngÆ°á»i", img: "/images/pages/khamtongquat-1.jpeg" },
        { name: "KhÃ¡m sá»©c khá»e tá»•ng quÃ¡t cÃ¡ nhÃ¢n", desc: "GÃ³i cÆ¡ báº£n, nÃ¢ng cao", price: "Tá»« 800.000Ä‘", img: "/images/pages/vanchuyen-1.jpeg" },
        { name: "KhÃ¡m xuáº¥t kháº©u lao Ä‘á»™ng", desc: "Giáº¥y khÃ¡m sá»©c khá»e chuáº©n", price: "Tá»« 300.000Ä‘", img: "/images/pages/bhyt-1.jpeg" }
      ]
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Dá»‹ch vá»¥ y táº¿</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Äa dáº¡ng dá»‹ch vá»¥ chÄƒm sÃ³c sá»©c khá»e cháº¥t lÆ°á»£ng cao
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={100} className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/thong-tin-thau"
              className="px-4 py-2 bg-brand-green text-white rounded-full text-sm font-semibold hover:bg-brand-green/90 transition-colors"
            >
              ThÃ´ng tin Ä‘áº¥u tháº§u
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
                      <div>
                        <h3 className="font-display font-bold text-[17px] text-green-dark mb-2 group-hover:text-brand-green transition-colors duration-200">{item.name}</h3>
                        <p className="text-[13px] text-ink/75 leading-relaxed mb-4">{item.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-green-800/5">
                        <span className="text-brand-green font-semibold text-sm">{item.price}</span>
                        <button className="px-3 py-1.5 bg-mint text-green-dark text-xs font-semibold rounded-full hover:bg-brand-green hover:text-white transition-colors">
                          Äáº·t lá»‹ch
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