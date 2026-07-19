import Layout from "../components/layout/Layout";
import ScrollAnimation from "../components/ui/ScrollAnimation";
import Organization from "../components/public/Organization";

export default function SoDoToChucPage() {
  const directors = [
    { name: "Gs.Ts. Nguyễn Văn A", role: "Giám đốc", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop" },
    { name: "Bs.Ts. Trần Thị B", role: "Phó Giám đốc", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop" },
    { name: "Bs.Ts. Lê Văn C", role: "Phó Giám đốc", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop" }
  ];

  const departments = [
    {
      name: "Khối Hành Chính",
      head: "Ths. Hoàng Văn D",
      staff: 9,
      img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop"
    },
    {
      name: "Khối Lâm Sàng",
      head: "Gs.Ts. Phạm Thị E",
      staff: 21,
      img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop"
    },
    {
      name: "Khối Cận Lâm Sàng",
      head: "Bs.Ts. Ngô Văn F",
      staff: 6,
      img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop"
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation className="text-center mb-8" animation="fade-up">
            <h1 className="text-4xl font-display font-bold text-green-dark mb-4">Sơ đồ tổ chức</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cơ cấu tổ chức và hệ thống các khoa phòng của Bệnh viện Đa khoa khu vực Miền Núi Phía Bắc Quảng Nam
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1580px] mx-auto px-4 xl:px-8 2xl:px-10">
          <ScrollAnimation animation="fade-up">
            <div className="bg-mint/30 rounded-2xl p-8 mb-12">
              <h2 className="font-display font-bold text-2xl text-green-dark mb-6 text-center">Ban Giám Đốc</h2>
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
            <h2 className="font-display font-bold text-2xl text-green-dark mb-6 text-center">Các Khối Chính</h2>
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
                          <span className="text-ink/75">Trưởng khối: <strong>{dept.head}</strong></span>
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