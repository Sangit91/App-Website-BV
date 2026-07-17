import React, { useState } from "react";
import { Search, Calendar, UserCheck, Inbox, RefreshCw } from "lucide-react";
import { useHospital } from "../context/HospitalContext";
import { Doctor } from "../types";

interface DoctorsProps {
  onOpenBookingWithDoctor: (doctorName: string, specialtyId: string) => void;
}

export default function Doctors({ onOpenBookingWithDoctor }: DoctorsProps) {
  const { doctors } = useHospital();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = doctors.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.specialtyName.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q)
    );
  });

  const handleResetSearch = () => {
    setSearchQuery("");
  };

  return (
    <section id="bac-si" className="bg-cream-white py-16 md:py-20 border-b border-green-800/10">
      <div className="max-w-[1180px] mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center max-w-[680px] mx-auto mb-8">
          <p className="text-brand-green text-xs font-bold uppercase tracking-widest mb-2">Đội ngũ thầy thuốc</p>
          <h2 className="font-display font-bold text-[28px] md:text-[32px] text-green-dark">
            Đội Ngũ Bác Sĩ Ưu Tú & Tận Tâm
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto my-3 rounded-full"></div>
          <p className="text-ink/80 text-sm md:text-base">
            Gặp gỡ những bác sĩ chuyên môn cao, thầy thuốc ưu tú của chúng tôi, luôn túc trực hỗ trợ sức khỏe toàn diện cho nhân dân.
          </p>
        </div>

        {/* Real-time search/filter for Doctors */}
        <div className="max-w-[500px] mx-auto mb-12 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-mint rounded-full py-3 px-6 pr-12 text-sm text-ink focus:border-brand-green focus:outline-none transition-all shadow-inner font-sans"
            />
            <Search className="absolute right-5 top-3.5 text-brand-green" size={18} />
          </div>
          {searchQuery && (
            <p className="text-xs text-brand-green font-semibold mt-2 text-center">
              Đang lọc kết quả theo từ khóa &quot;{searchQuery}&quot; - Tìm thấy {filteredDoctors.length} kết quả
            </p>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDoctors.map((doc: Doctor) => (
              <div
                key={doc.id}
                className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
              >
                {/* Doctor Portrait Image */}
                <div className="relative h-[260px] overflow-hidden bg-mint/30 shrink-0">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Specialty Tag Overlay */}
                  <span className="absolute bottom-3 left-3 bg-green-dark text-mint text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {doc.specialtyName}
                  </span>
                </div>

                {/* Info Area */}
                <div className="p-5 flex-grow flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-[18px] md:text-[19px] text-green-dark leading-tight group-hover:text-brand-green transition-colors duration-200">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-bold text-peach uppercase tracking-wide">
                      {doc.title}
                    </p>
                    <p className="text-[13px] text-ink/75 leading-relaxed pt-1.5 border-t border-green-800/5">
                      {doc.experience}
                    </p>
                  </div>

                  {/* Schedule and Booking Button */}
                  <div className="space-y-3 pt-3 border-t border-green-800/5">
                    <div className="bg-mint/40 p-2.5 rounded-xl flex flex-col space-y-1">
                      <span className="text-[11px] font-bold text-green-dark">Lịch trực khám hành chính:</span>
                      <span className="text-[12px] font-medium text-ink/80">{doc.schedule}</span>
                    </div>

                    <button
                      onClick={() => onOpenBookingWithDoctor(doc.name, doc.specialtyId)}
                      className="w-full flex items-center justify-center gap-2 bg-brand-green text-white hover:bg-brand-green/90 font-sans text-xs font-bold py-2.5 rounded-full cursor-pointer transition-colors shadow-sm hover:shadow"
                    >
                      <Calendar size={13} />
                      <span>Đặt lịch hẹn khám</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Elegant & Compliant EMPTY STATE */
          <div className="bg-mint/40 border-2 border-dashed border-brand-green/20 p-10 md:p-14 rounded-[28px] max-w-[640px] mx-auto text-center space-y-4 animate-fade-in select-none">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-peach mx-auto shadow-md">
              <Inbox size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-green-dark">
                Đang lọc danh sách bác sĩ giỏi...
              </h3>
              <p className="text-sm text-ink/75 max-w-[460px] mx-auto leading-relaxed">
                Đội ngũ bác sĩ giỏi đang được cập nhật thêm hoặc từ khóa tìm kiếm chưa chính xác. Bấm vào nút bên dưới để xem danh sách đầy đủ.
              </p>
            </div>
            <button
              onClick={handleResetSearch}
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-sans text-xs font-bold py-2.5 px-5 rounded-full cursor-pointer transition-all shadow-md"
            >
              <RefreshCw size={13} />
              <span>Xem danh sách đầy đủ</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
