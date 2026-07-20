import React, { useState, useEffect, useMemo } from "react";
import { X, Calendar, User, Phone, Clipboard, CheckCircle2, Search, ArrowLeft, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { Booking } from "../../types";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  prepopulatedDoctor?: string;
  prepopulatedSpecialtyId?: string;
}

export default function BookingForm({ isOpen, onClose, prepopulatedDoctor = "", prepopulatedSpecialtyId = "" }: BookingFormProps) {
  const { doctors, specialties, schedules, addBooking } = useHospital();

  // Tabs: 'create' or 'lookup'
  const [activeTab, setActiveTab] = useState<"create" | "lookup">("create");

  // Form State
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [validationError, setValidationError] = useState("");

  // Search Bookings State
  const [searchPhone, setSearchPhone] = useState("");
  const [searchResult, setSearchResult] = useState<Booking[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  // Sync prepopulated values
  useEffect(() => {
    if (isOpen) {
      if (prepopulatedSpecialtyId) {
        const found = specialties.find(s => s.id === prepopulatedSpecialtyId);
        if (found) setSpecialty(found.name);
      } else {
        setSpecialty("");
      }
      setDoctorName(prepopulatedDoctor);
      setSuccessBooking(null);
      setValidationError("");
      setActiveTab("create");
    }
  }, [isOpen, prepopulatedDoctor, prepopulatedSpecialtyId, specialties]);

  // Handle specialty change to pre-fill corresponding doctors if appropriate
  const handleSpecialtyChange = (selectedName: string) => {
    setSpecialty(selectedName);
    setDoctorName(""); // reset doctor selection when specialty changes
  };

  const filteredDoctors = doctors.filter(d => {
    if (!specialty) return true;
    return d.specialtyName === specialty;
  });

  // Helper to determine selected doctor's shift status on selected date
  const getDoctorShiftOnDate = () => {
    if (!doctorName || !date) return "Ca Sáng"; // Default to open if no doctor selected yet
    const selectedDoc = doctors.find(d => d.name === doctorName);
    if (!selectedDoc) return "Ca Sáng";
    
    const sched = schedules.find(s => s.doctorId === selectedDoc.id);
    if (!sched) return "Ca Sáng";

    // Parse date to day of week
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Ca Sáng";
    
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayNameEn = days[dateObj.getDay()];
    
    return sched[dayNameEn as keyof Omit<typeof sched, "doctorId" | "doctorName">] || "Nghỉ";
  };

  const doctorShift = getDoctorShiftOnDate();

  // Filter timeslots based on doctor's shift:
  const timeSlotOptions = useMemo(() => {
    const morningSlots = [
      { value: "07:00 - 08:00", label: "07:00 - 08:00 (Sáng)" },
      { value: "08:00 - 09:00", label: "08:00 - 09:00 (Sáng)" },
      { value: "09:00 - 10:00", label: "09:00 - 10:00 (Sáng)" },
      { value: "10:00 - 11:00", label: "10:00 - 11:00 (Sáng)" },
    ];
    const afternoonSlots = [
      { value: "13:30 - 14:30", label: "13:30 - 14:30 (Chiều)" },
      { value: "14:30 - 15:30", label: "14:30 - 15:30 (Chiều)" },
      { value: "15:30 - 16:30", label: "15:30 - 16:30 (Chiều)" },
    ];

    if (!doctorName || !date) {
      return [...morningSlots, ...afternoonSlots];
    }

    if (doctorShift === "Ca Sáng") {
      return morningSlots;
    } else if (doctorShift === "Ca Chiều") {
      return afternoonSlots;
    } else {
      return []; // Doctor is Off!
    }
  }, [doctorName, date, doctorShift]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!patientName.trim()) return setValidationError("Vui lòng nhập họ và tên người bệnh.");
    if (!phone.trim()) return setValidationError("Vui lòng nhập số điện thoại.");
    if (!specialty) return setValidationError("Vui lòng lựa chọn Chuyên khoa khám.");
    if (!date) return setValidationError("Vui lòng chọn ngày khám mong muốn.");
    if (!timeSlot) return setValidationError("Vui lòng chọn khung giờ khám.");

    // Validate Doctor's schedule Off state
    if (doctorName) {
      if (doctorShift === "Nghỉ") {
        return setValidationError(`Bác sĩ ${doctorName} có lịch nghỉ vào ngày này. Vui lòng chọn ngày khác hoặc chọn Bác sĩ khác.`);
      }
      
      // Validate that selected time slot belongs to doctor's active shift
      const isMorningSlot = ["07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00"].includes(timeSlot);
      if (doctorShift === "Ca Sáng" && !isMorningSlot) {
        return setValidationError(`Khung giờ đã chọn không khớp với ca trực Sáng của Bác sĩ ${doctorName}.`);
      }
      if (doctorShift === "Ca Chiều" && isMorningSlot) {
        return setValidationError(`Khung giờ đã chọn không khớp với ca trực Chiều của Bác sĩ ${doctorName}.`);
      }
    }

    setIsSubmitting(true);

    try {
      const data = addBooking({
        patientName,
        phone,
        specialty,
        doctorName: doctorName || "Bác sĩ do Bệnh viện phân công",
        date,
        timeSlot,
        symptoms
      });

      setSuccessBooking(data);
      
      // Clear inputs
      setPatientName("");
      setPhone("");
      setSymptoms("");
      setSpecialty("");
      setDoctorName("");
      setDate("");
      setTimeSlot("");
    } catch (err: unknown) {
      setValidationError(err instanceof Error ? err.message : "Không thể gửi dữ liệu lên máy chủ. Hãy thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;

    setIsSearching(true);
    setSearched(true);
    try {
      const response = await fetch(`/api/booking/search?phone=${encodeURIComponent(searchPhone.trim())}`);
      const data = await response.json();
      if (response.ok) {
        setSearchResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-green-dark/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Card (Radius Large - 28px) */}
      <div className="relative bg-cream-white w-full max-w-[620px] rounded-[28px] shadow-2xl overflow-hidden border border-brand-green/20 max-h-[92vh] flex flex-col z-10 animate-scale-up">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-brand-green to-green-dark p-6 text-white shrink-0 flex justify-between items-center relative">
          <div className="space-y-1 text-left">
            <span className="text-[10px] bg-peach px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Đặt Khám Điện Tử</span>
            <h2 className="font-display font-bold text-[20px] md:text-[22px] text-white">
              Cổng Đăng Ký Khám Bệnh Trực Tuyến
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/15 text-mint transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        {!successBooking && (
          <div className="flex border-b border-green-800/10 shrink-0 bg-white">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-3 text-center text-xs md:text-sm font-bold tracking-wide transition-all ${
                activeTab === "create"
                  ? "text-brand-green border-b-3 border-brand-green bg-mint/30"
                  : "text-ink/60 hover:text-brand-green hover:bg-mint/10"
              }`}
            >
              Đăng ký khám mới
            </button>
            <button
              onClick={() => setActiveTab("lookup")}
              className={`flex-1 py-3 text-center text-xs md:text-sm font-bold tracking-wide transition-all ${
                activeTab === "lookup"
                  ? "text-brand-green border-b-3 border-brand-green bg-mint/30"
                  : "text-ink/60 hover:text-brand-green hover:bg-mint/10"
              }`}
            >
              Tra cứu lịch hẹn đã đặt
            </button>
          </div>
        )}

        {/* Modal Body Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-left">
          
          {/* TAB 1: BOOKING CREATE */}
          {activeTab === "create" && !successBooking && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              
              {validationError && (
                <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-200">
                  ⚠️ {validationError}
                </div>
              )}

              <p className="text-xs text-ink/70 bg-mint/40 p-3 rounded-xl border border-brand-green/10 leading-relaxed font-semibold">
                🔔 Xin vui lòng điền chính xác thông tin để hồ sơ bệnh án được đồng bộ chính xác trên hệ thống quản lý khám công cộng của bệnh viện.
              </p>

              {/* Patient Name & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-green-dark">Họ & Tên Người Bệnh <span className="text-peach">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-white border border-green-800/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-xl py-2.5 px-4 pl-10 text-xs md:text-sm focus:outline-none text-ink font-sans font-medium"
                    />
                    <User className="absolute left-3.5 top-3 text-brand-green/70" size={16} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-green-dark">Số Điện Thoại Nhận SMS <span className="text-peach">*</span></label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0905123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-green-800/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-xl py-2.5 px-4 pl-10 text-xs md:text-sm focus:outline-none text-ink font-sans font-medium"
                    />
                    <Phone className="absolute left-3.5 top-3 text-brand-green/70" size={16} />
                  </div>
                </div>
              </div>

              {/* Specialty & Doctor Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-green-dark">Chuyên Khoa Đăng Ký <span className="text-peach">*</span></label>
                  <select
                    required
                    value={specialty}
                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                    className="w-full bg-white border border-green-800/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-xl py-2.5 px-3 text-xs md:text-sm focus:outline-none text-ink font-sans font-semibold"
                  >
                    <option value="">-- Chọn chuyên khoa --</option>
                    {specialties.map((spec) => (
                      <option key={spec.id} value={spec.name}>{spec.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-green-dark">Bác Sĩ Mong Muốn (Nếu có)</label>
                  <select
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full bg-white border border-green-800/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-xl py-2.5 px-3 text-xs md:text-sm focus:outline-none text-ink font-sans font-semibold"
                  >
                    <option value="">Bác sĩ do Bệnh viện sắp xếp</option>
                    {filteredDoctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>{doc.name} ({doc.specialtyName})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Date & Time Slot Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-green-dark">Ngày Đăng Ký Khám <span className="text-peach">*</span></label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-green-800/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-xl py-2.5 px-4 text-xs md:text-sm focus:outline-none text-ink font-sans font-semibold"
                  />
                  {doctorName && date && (
                    <div className="mt-1">
                      {doctorShift === "Nghỉ" ? (
                        <span className="text-[11px] font-bold text-peach flex items-center gap-1 bg-red-50 p-1.5 rounded-lg border border-red-200">
                          <AlertTriangle size={12} /> Bác sĩ nghỉ trực vào ngày này.
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-green-dark flex items-center gap-1 bg-mint p-1.5 rounded-lg border border-brand-green/30 animate-pulse">
                          ✓ Bác sĩ trực {doctorShift === "Ca Sáng" ? "Sáng (07h-11h)" : "Chiều (13h30-16h30)"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-green-dark">Khung Giờ Ưu Tiên <span className="text-peach">*</span></label>
                  <select
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    disabled={doctorName && date && doctorShift === "Nghỉ"}
                    className="w-full bg-white border border-green-800/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-xl py-2.5 px-3 text-xs md:text-sm focus:outline-none text-ink font-sans font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {doctorName && date && doctorShift === "Nghỉ"
                        ? "-- Bác sĩ nghỉ trực --"
                        : "-- Chọn khung giờ --"}
                    </option>
                    {timeSlotOptions.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Symptoms brief Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-green-dark">Mô tả triệu chứng / Nhu cầu thăm khám</label>
                <textarea
                  placeholder="Mô tả ngắn gọn các triệu chứng của bạn để bác sĩ tư vấn chuẩn bị hồ sơ..."
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full bg-white border border-green-800/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-xl py-2.5 px-4 text-xs md:text-sm focus:outline-none text-ink font-sans"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex justify-end space-x-3 border-t border-green-800/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-green-800/10 text-xs font-bold text-green-dark hover:bg-mint cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-sans text-xs font-bold py-2.5 px-6 rounded-full cursor-pointer shadow-md disabled:bg-brand-green/60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Đang xử lý đặt lịch...</span>
                    </>
                  ) : (
                    <span>Xác nhận đăng ký khám</span>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* SUCCESS TICKET SCREEN */}
          {successBooking && (
            <div className="space-y-6 text-center py-4 select-none animate-fade-in">
              <div className="w-16 h-16 bg-mint text-brand-green rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={36} className="fill-mint" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg md:text-xl text-green-dark">Đặt Lịch Hẹn Khám Thành Công!</h3>
                <p className="text-xs text-ink/70">Mã phiếu hẹn điện tử đã được tạo và lưu trữ trên hệ thống</p>
              </div>

              {/* TICKET CARD DISPLAY */}
              <div className="relative bg-white border-2 border-brand-green/20 rounded-2xl p-5 shadow-lg max-w-[420px] mx-auto text-left space-y-3.5 border-dashed overflow-hidden">
                <div className="absolute right-[-24px] top-12 w-24 h-10 bg-brand-green/10 text-brand-green border-2 border-brand-green/20 font-display font-bold text-xs uppercase flex items-center justify-center rotate-45">
                  Đã Duyệt
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-display font-bold text-xs text-brand-green uppercase">Phiếu khám bệnh điện tử</span>
                  <span className="font-mono font-bold text-sm text-peach">{successBooking.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-xs font-sans">
                  <div>
                    <span className="text-ink/60 text-[11px] block">Người bệnh:</span>
                    <strong className="text-green-dark">{successBooking.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-ink/60 text-[11px] block">Số điện thoại:</span>
                    <strong className="text-green-dark">{successBooking.phone}</strong>
                  </div>
                  <div>
                    <span className="text-ink/60 text-[11px] block">Chuyên khoa:</span>
                    <strong className="text-brand-green">{successBooking.specialty}</strong>
                  </div>
                  <div>
                    <span className="text-ink/60 text-[11px] block">Bác sĩ khám:</span>
                    <strong className="text-green-dark">{successBooking.doctorName}</strong>
                  </div>
                  <div>
                    <span className="text-ink/60 text-[11px] block">Ngày khám:</span>
                    <strong className="text-green-dark">{successBooking.date}</strong>
                  </div>
                  <div>
                    <span className="text-ink/60 text-[11px] block">Khung giờ:</span>
                    <strong className="text-peach">{successBooking.timeSlot}</strong>
                  </div>
                </div>

                <div className="bg-mint/40 p-2.5 rounded-xl text-[11px] text-ink/75 leading-relaxed">
                  ⚠️ <strong>Hướng dẫn:</strong> Quý khách vui lòng lưu ảnh màn hình phiếu này, đến bệnh viện trước giờ hẹn 15 phút, xuất trình cho quầy tiếp đón BHYT/Dịch vụ để được hướng dẫn vào phòng khám trực tiếp mà không cần bấm số chờ.
                </div>
              </div>

              <div className="pt-4 flex justify-center space-x-3 border-t">
                <button
                  onClick={() => setSuccessBooking(null)}
                  className="bg-brand-green text-white hover:bg-brand-green/90 font-sans text-xs font-bold py-2.5 px-6 rounded-full cursor-pointer shadow"
                >
                  Đặt thêm lịch hẹn khác
                </button>
                <button
                  onClick={onClose}
                  className="bg-white border border-green-800/10 text-green-dark font-sans text-xs font-bold py-2.5 px-6 rounded-full cursor-pointer hover:bg-mint"
                >
                  Hoàn tất đóng cửa sổ
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LOOKUP */}
          {activeTab === "lookup" && (
            <div className="space-y-6">
              
              <form onSubmit={handleLookupSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    placeholder="Nhập số điện thoại đăng ký đặt lịch..."
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="w-full bg-white border border-green-800/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-xl py-2.5 px-4 text-xs md:text-sm focus:outline-none text-ink font-sans font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-brand-green hover:bg-brand-green/90 text-white font-sans text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow flex items-center gap-1.5 shrink-0"
                >
                  {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                  <span>Tìm kiếm</span>
                </button>
              </form>

              {/* Lookup results list */}
              {searched && (
                <div className="space-y-4">
                  <h4 className="font-display font-semibold text-xs text-green-dark border-b pb-1">
                    Kết quả tìm kiếm ({searchResult.length} lượt hẹn)
                  </h4>
                  
                  {searchResult.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {searchResult.map((booking) => (
                        <div key={booking.id} className="bg-white border border-green-800/10 p-4 rounded-xl space-y-2 relative shadow-sm">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-brand-green">{booking.specialty}</span>
                            <span className="font-mono font-bold text-peach bg-peach/10 px-2 py-0.5 rounded-md">{booking.id}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] leading-tight">
                            <p className="text-ink/65">Người khám: <strong className="text-green-dark">{booking.patientName}</strong></p>
                            <p className="text-ink/65">Bác sĩ: <strong className="text-green-dark">{booking.doctorName || "Sắp xếp ngẫu nhiên"}</strong></p>
                            <p className="text-ink/65">Ngày khám: <strong className="text-green-dark">{booking.date}</strong></p>
                            <p className="text-ink/65">Khung giờ: <strong className="text-peach font-bold">{booking.timeSlot}</strong></p>
                          </div>
                          <p className="text-[10px] text-ink/50 italic border-t pt-1.5">Mô tả bệnh lý: {booking.symptoms}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-ink/50 text-xs italic">
                      Không tìm thấy lịch hẹn nào tương ứng với số điện thoại này trên hệ thống. Quý khách vui lòng chuyển sang tab Đăng ký để đặt lịch mới.
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
