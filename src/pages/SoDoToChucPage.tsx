import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import Organization from "../components/public/Organization";

export default function SoDoToChucPage() {
  const directors = [
    { name: "Gs.Ts. Nguyá»…n VÄƒn A", role: "GiÃ¡m Ä‘á»‘c", img: "/images/doctors/giamdoc-2.jpeg" },
    { name: "Bs.Ts. Tráº§n Thá»‹ B", role: "PhÃ³ GiÃ¡m Ä‘á»‘c", img: "/images/doctors/truongphong-2.jpeg" },
    { name: "Bs.Ts. LÃª VÄƒn C", role: "PhÃ³ GiÃ¡m Ä‘á»‘c", img: "/images/doctors/phogiamdoc-2.jpeg" }
  ];

  const departments = [
    {
      name: "Khá»‘i HÃ nh ChÃ­nh",
      head: "Ths. HoÃ ng VÄƒn D",
      staff: 9,
      img: "/images/pages/bhyt-1.jpeg"
    },
    {
      name: "Khá»‘i LÃ¢m SÃ ng",
      head: "Gs.Ts. Pháº¡m Thá»‹ E",
      staff: 21,
      img: "/images/pages/tainha-1.jpeg"
    },
    {
      name: "Khá»‘i Cáº­n LÃ¢m SÃ ng",
      head: "Bs.Ts. NgÃ´ VÄƒn F",
      staff: 6,
      img: "/images/pages/timmach-1.jpeg"
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">SÆ¡ Ä‘á»“ tá»• chá»©c</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              CÆ¡ cáº¥u tá»• chá»©c vÃ  há»‡ thá»‘ng cÃ¡c khoa phÃ²ng cá»§a Bá»‡nh viá»‡n Äa khoa khu vá»±c Miá»n NÃºi PhÃ­a Báº¯c Quáº£ng Nam
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up">
            <div className="bg-mint/30 rounded-2xl p-8 mb-12">
              <h2 className="font-display font-bold text-2xl text-green-dark mb-6 text-center">Ban GiÃ¡m Äá»‘c</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {directors.map((leader, idx) => (
                  <div key={leader.name}>
                    <ScrollAnimation animation="fade-up" delay={idx * 100}>
                      <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                        <img
                          src={leader.img}
                          alt={leader.name}
                          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-brand-green/20"
                        />
                        <h4 className="font-display font-bold text-lg text-green-dark">{leader.name}</h4>
                        <p className="text-sm text-gray-500">{leader.role}</p>
                      </div>
                    </ScrollAnimation>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up">
            <h2 className="font-display font-bold text-2xl text-green-dark mb-6 text-center">CÃ¡c Khá»‘i ChÃ­nh</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {departments.map((dept, idx) => (
                <div key={dept.name}>
                  <ScrollAnimation animation="fade-up" delay={idx * 100}>
                    <div className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={dept.img}
                          alt={dept.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-display font-bold text-lg text-green-dark mb-2 group-hover:text-brand-green transition-colors duration-200">{dept.name}</h3>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-ink/75">TrÆ°á»Ÿng khá»‘i: <strong>{dept.head}</strong></span>
                          <span className="bg-mint px-2 py-1 rounded-full text-brand-green font-semibold">{dept.staff} khoa</span>
                        </div>
                      </div>
                    </div>
                  </ScrollAnimation>
                </div>
              ))}
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up">
            <Organization />
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
}