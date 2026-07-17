import React, { useState, useMemo } from "react";
import { useHospital, Role, Booking, Patient, DoctorSchedule } from "../../context/HospitalContext";
import { Specialty, Doctor, NewsItem } from "../../types";
import { DEPARTMENTS } from "../../data";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Calendar, FileText, CalendarRange, BookOpen, Layers, Newspaper, ClipboardList, 
  ArrowLeft, LogOut, Check, X, Edit, Trash2, Plus, Search, FileDown, Printer, ShieldAlert,
  Sliders, User, Lock, ChevronRight, CheckCircle, AlertTriangle, RefreshCw, Upload, Paperclip
} from "lucide-react";

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const {
    doctors,
    specialties,
    news,
    bookings,
    patients,
    schedules,
    logs,
    activeUser,
    login,
    logout,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addSpecialty,
    updateSpecialty,
    deleteSpecialty,
    addNews,
    updateNews,
    deleteNews,
    updateBookingStatus,
    updateBookingDetails,
    updateScheduleShift,
    addLog
  } = useHospital();

  // Authentication internal state
  const [loginRole, setLoginRole] = useState<Role>("Super Admin");
  const [loginDepartment, setLoginDepartment] = useState<string>("PHÒNG CNTT");
  const [loginName, setLoginName] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation internal state (default to "overview")
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Search queries
  const [patientSearch, setPatientSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");

  // CRUD modal states
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);

  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const [isBookingEditModalOpen, setIsBookingEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Form states for Doctors
  const [docName, setDocName] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docSpecialtyId, setDocSpecialtyId] = useState("");
  const [docImage, setDocImage] = useState("");
  const [docExperience, setDocExperience] = useState("");
  const [docSchedule, setDocSchedule] = useState("");

  // Form states for Specialties
  const [specName, setSpecName] = useState("");
  const [specDesc, setSpecDesc] = useState("");
  const [specIconType, setSpecIconType] = useState<Specialty["iconType"]>("general");
  const [specDetail, setSpecDetail] = useState("");

  // Form states for News
  const [newsTitleState, setNewsTitleState] = useState("");
  const [newsSummary, setNewsSummary] = useState("");
  const [newsTag, setNewsTag] = useState<NewsItem["tag"]>("Tin y học");
  const [newsImage, setNewsImage] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsIsTender, setNewsIsTender] = useState(false);
  const [newsTenderStartDate, setNewsTenderStartDate] = useState("");
  const [newsTenderEndDate, setNewsTenderEndDate] = useState("");
  const [newsTenderFile, setNewsTenderFile] = useState<NewsItem["tenderFile"] | null>(null);
  const [newsTenderDept, setNewsTenderDept] = useState<string>("PHÒNG CNTT");
  const [isFileDragging, setIsFileDragging] = useState(false);

  const handleTenderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      
      const fileType = file.type;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewsTenderFile({
          name: file.name,
          size: sizeStr,
          url: reader.result as string,
          fileType: fileType
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTenderFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      
      const fileType = file.type;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewsTenderFile({
          name: file.name,
          size: sizeStr,
          url: reader.result as string,
          fileType: fileType
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Form states for Bookings Edit
  const [bPatientName, setBPatientName] = useState("");
  const [bPhone, setBPhone] = useState("");
  const [bSpecialty, setBSpecialty] = useState("");
  const [bDoctorName, setBDoctorName] = useState("");
  const [bDate, setBDate] = useState("");
  const [bTimeSlot, setBTimeSlot] = useState("");
  const [bSymptoms, setBSymptoms] = useState("");

  // Custom active doctor for Doctor Role view
  const [selectedDoctorForDoctorRole, setSelectedDoctorForDoctorRole] = useState<string>("");

  // Print PDF Simulated Modal
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // Excel simulation state
  const [excelExportedMessage, setExcelExportedMessage] = useState("");

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) {
      setLoginError("Vui lòng nhập tên người dùng để làm việc");
      return;
    }
    setLoginError("");
    
    if (loginRole === "Department Admin") {
      login(loginRole, loginName.trim(), loginDepartment);
      setActiveTab("news");
    } else {
      login(loginRole, loginName.trim());
      // Auto-redirect Doctor to their shift planner, others to overview
      if (loginRole === "Doctor") {
        setActiveTab("shifts");
        // Pick first doctor as default if possible
        if (doctors.length > 0) {
          setSelectedDoctorForDoctorRole(doctors[0].id);
        }
      } else {
        setActiveTab("overview");
      }
    }
  };

  // RBAC Helper functions
  const hasAccess = (tab: string) => {
    if (!activeUser) return false;
    if (activeUser.role === "Super Admin") return true;
    
    if (activeUser.role === "Receptionist") {
      // restricted to Lịch hẹn, Quản lý Bệnh nhân, and Tổng quan.
      return ["overview", "bookings", "patients", "logs"].includes(tab);
    }
    
    if (activeUser.role === "Doctor") {
      // restricted to personal schedule and patient list under Lịch trực Bác sĩ (shifts)
      return ["shifts"].includes(tab);
    }

    if (activeUser.role === "Department Admin") {
      // restricted to news & tenders
      return ["news"].includes(tab);
    }
    return false;
  };

  const isRoleDisabled = (actionType: "crud_doctors_specialties" | "crud_news") => {
    if (!activeUser) return true;
    if (activeUser.role === "Super Admin") return false;
    if (activeUser.role === "Department Admin" && actionType === "crud_news") return false;
    return true; // Receptionist and Doctor cannot edit doctors, specialties, news
  };

  // Get Today's day name in English to match our DoctorSchedule
  const todayDayNameEn = useMemo(() => {
    const day = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[day];
  }, []);

  // Compute Metrics
  const metrics = useMemo(() => {
    const totalBookingsCount = bookings.length;
    const activePatientsCount = patients.length;
    
    // Count doctors on duty today (meaning schedule state is not 'Nghỉ' for today)
    const doctorsOnDutyCount = schedules.filter(s => {
      const shift = s[todayDayNameEn as keyof Omit<DoctorSchedule, "doctorId" | "doctorName">];
      return shift && shift !== "Nghỉ";
    }).length;

    // Count pending confirmations
    const pendingConfirmations = bookings.filter(b => b.status === "Chờ xác nhận").length;

    return {
      totalBookingsCount,
      activePatientsCount,
      doctorsOnDutyCount,
      pendingConfirmations
    };
  }, [bookings, patients, schedules, todayDayNameEn]);

  // Filter lists based on search
  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.cccd.includes(patientSearch) ||
      p.phone.includes(patientSearch)
    );
  }, [patients, patientSearch]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => 
      b.patientName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.phone.includes(bookingSearch) ||
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.specialty.toLowerCase().includes(bookingSearch.toLowerCase())
    );
  }, [bookings, bookingSearch]);

  const displayedNews = useMemo(() => {
    if (!activeUser) return [];
    if (activeUser.role === "Super Admin") return news;
    if (activeUser.role === "Department Admin") {
      return news.filter(n => n.isTender && n.tenderDept === activeUser.department);
    }
    return news;
  }, [news, activeUser]);

  // Handle Export Excel Simulation
  const triggerExcelExport = () => {
    setExcelExportedMessage("Danh sách đã được xuất thành tệp Excel thành công! (Simulated download)");
    addLog(`Xuất danh sách đăng ký lịch hẹn ra file Excel (.xlsx)`);
    setTimeout(() => {
      setExcelExportedMessage("");
    }, 5000);
  };

  // Open Doctor Modal (Add/Edit)
  const handleOpenDoctorModal = (doc: Doctor | null = null) => {
    if (isRoleDisabled("crud_doctors_specialties")) return;
    if (doc) {
      setEditingDoctor(doc);
      setDocName(doc.name);
      setDocTitle(doc.title);
      setDocSpecialtyId(doc.specialtyId);
      setDocImage(doc.image);
      setDocExperience(doc.experience);
      setDocSchedule(doc.schedule);
    } else {
      setEditingDoctor(null);
      setDocName("");
      setDocTitle("BS. CKI.");
      setDocSpecialtyId(specialties[0]?.id || "");
      setDocImage("");
      setDocExperience("");
      setDocSchedule("Thứ Hai - Thứ Sáu (08:00 - 17:00)");
    }
    setIsDoctorModalOpen(true);
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docTitle.trim() || !docSpecialtyId) {
      alert("Vui lòng điền đầy đủ Tên bác sĩ, Học vị và Chuyên khoa");
      return;
    }

    const selectedSpec = specialties.find(s => s.id === docSpecialtyId);
    const specNameString = selectedSpec ? selectedSpec.name : "Ngoại khoa";

    // Placeholders
    const finalImage = docImage.trim() || "https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400";

    if (editingDoctor) {
      updateDoctor({
        ...editingDoctor,
        name: docName,
        title: docTitle,
        specialtyId: docSpecialtyId,
        specialtyName: specNameString,
        image: finalImage,
        experience: docExperience || "Bác sĩ có nhiều năm kinh nghiệm thăm khám tận tình chu đáo.",
        schedule: docSchedule
      });
    } else {
      addDoctor({
        name: docName,
        title: docTitle,
        specialtyId: docSpecialtyId,
        specialtyName: specNameString,
        image: finalImage,
        experience: docExperience || "Bác sĩ có nhiều năm kinh nghiệm thăm khám tận tình chu đáo.",
        schedule: docSchedule
      });
    }
    setIsDoctorModalOpen(false);
  };

  // Open Specialty Modal (Add/Edit)
  const handleOpenSpecialtyModal = (spec: Specialty | null = null) => {
    if (isRoleDisabled("crud_doctors_specialties")) return;
    if (spec) {
      setEditingSpecialty(spec);
      setSpecName(spec.name);
      setSpecDesc(spec.description);
      setSpecIconType(spec.iconType);
      setSpecDetail(spec.detail);
    } else {
      setEditingSpecialty(null);
      setSpecName("");
      setSpecDesc("");
      setSpecIconType("general");
      setSpecDetail("");
    }
    setIsSpecialtyModalOpen(true);
  };

  const handleSpecialtySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specName.trim() || !specDesc.trim()) {
      alert("Vui lòng điền đầy đủ Tên chuyên khoa và Mô tả tóm tắt");
      return;
    }

    if (editingSpecialty) {
      updateSpecialty({
        ...editingSpecialty,
        name: specName,
        description: specDesc,
        iconType: specIconType,
        detail: specDetail || `Dịch vụ khám bệnh chuyên khoa của ${specName} đảm bảo tận tâm, hiệu quả cao.`
      });
    } else {
      addSpecialty({
        name: specName,
        description: specDesc,
        iconType: specIconType,
        detail: specDetail || `Dịch vụ khám bệnh chuyên khoa của ${specName} đảm bảo tận tâm, hiệu quả cao.`
      });
    }
    setIsSpecialtyModalOpen(false);
  };

  // Open News Modal (Add/Edit)
  const handleOpenNewsModal = (item: NewsItem | null = null) => {
    if (isRoleDisabled("crud_news")) return;
    if (item) {
      setEditingNews(item);
      setNewsTitleState(item.title);
      setNewsSummary(item.summary);
      setNewsTag(item.tag);
      setNewsImage(item.image);
      setNewsContent(item.content || "");
      setNewsIsTender(item.isTender || false);
      setNewsTenderStartDate(item.tenderStartDate || "");
      setNewsTenderEndDate(item.tenderEndDate || "");
      setNewsTenderFile(item.tenderFile || null);
      setNewsTenderDept(item.tenderDept || "PHÒNG CNTT");
    } else {
      setEditingNews(null);
      setNewsTitleState("");
      setNewsSummary("");
      setNewsTag("Tin y học");
      setNewsImage("");
      setNewsContent("");
      setNewsIsTender(activeUser?.role === "Department Admin"); // Auto true if department admin
      setNewsTenderStartDate("");
      setNewsTenderEndDate("");
      setNewsTenderFile(null);
      setNewsTenderDept(activeUser?.role === "Department Admin" ? (activeUser.department || "PHÒNG CNTT") : "PHÒNG CNTT");
    }
    setIsNewsModalOpen(true);
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleState.trim() || !newsSummary.trim()) {
      alert("Vui lòng nhập Tiêu đề và Tóm tắt tin tức");
      return;
    }

    const finalImage = newsImage.trim() || "https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=500";
    const todayStr = new Date().toLocaleDateString("vi-VN");
    
    // For department admins, we always force their department
    const finalDept = activeUser?.role === "Department Admin" ? activeUser.department : newsTenderDept;

    if (editingNews) {
      updateNews({
        ...editingNews,
        title: newsTitleState,
        summary: newsSummary,
        tag: newsTag,
        image: finalImage,
        date: todayStr,
        content: newsContent,
        isTender: newsIsTender,
        tenderStartDate: newsIsTender ? (newsTenderStartDate || undefined) : undefined,
        tenderEndDate: newsIsTender ? (newsTenderEndDate || undefined) : undefined,
        tenderFile: newsIsTender ? (newsTenderFile || undefined) : undefined,
        tenderDept: newsIsTender ? finalDept : undefined
      });
    } else {
      addNews({
        title: newsTitleState,
        summary: newsSummary,
        tag: newsTag,
        image: finalImage,
        date: todayStr,
        content: newsContent,
        isTender: newsIsTender,
        tenderStartDate: newsIsTender ? (newsTenderStartDate || undefined) : undefined,
        tenderEndDate: newsIsTender ? (newsTenderEndDate || undefined) : undefined,
        tenderFile: newsIsTender ? (newsTenderFile || undefined) : undefined,
        tenderDept: newsIsTender ? finalDept : undefined
      });
    }
    setIsNewsModalOpen(false);
  };

  // Open Booking Edit Modal
  const handleOpenBookingEditModal = (booking: Booking) => {
    setEditingBooking(booking);
    setBPatientName(booking.patientName);
    setBPhone(booking.phone);
    setBSpecialty(booking.specialty);
    setBDoctorName(booking.doctorName || "");
    setBDate(booking.date);
    setBTimeSlot(booking.timeSlot);
    setBSymptoms(booking.symptoms);
    setIsBookingEditModalOpen(true);
  };

  const handleBookingEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    if (!bPatientName.trim() || !bPhone.trim() || !bSpecialty || !bDate || !bTimeSlot) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    updateBookingDetails({
      ...editingBooking,
      patientName: bPatientName,
      phone: bPhone,
      specialty: bBSpecialtyFromId(bSpecialty),
      doctorName: bDoctorName || undefined,
      date: bDate,
      timeSlot: bTimeSlot,
      symptoms: bSymptoms
    });
    setIsBookingEditModalOpen(false);
  };

  // helper to map specialty id back to name
  const bBSpecialtyFromId = (idOrName: string) => {
    const found = specialties.find(s => s.id === idOrName || s.name === idOrName);
    return found ? found.name : idOrName;
  };

  // Logged-in view routing
  if (!activeUser) {
    // -------------------------------------------------------------
    // RENDER LOGIN SCREEN (RBAC ACCESS CONTROL GATEWAY)
    // -------------------------------------------------------------
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-cream-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-green-800/10"
        >
          {/* Logo banner background */}
          <div className="bg-gradient-to-br from-[#164B36] to-[#2FA968] p-8 text-center text-white relative">
            <div className="absolute top-4 left-4">
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
                title="Quay lại Trang chủ"
              >
                <ArrowLeft size={18} />
              </button>
            </div>
            
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/20">
              <ShieldAlert className="text-white w-8 h-8 animate-pulse" />
            </div>
            <h1 className="font-display font-bold text-xl uppercase tracking-wider">Cổng Quản Trị Lâm Sàng</h1>
            <p className="text-xs text-mint/80 mt-1">BVĐK KV Miền Núi Phía Bắc Quảng Nam</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-8 space-y-5">
            {loginError && (
              <div className="bg-peach/10 text-peach-dark text-xs p-3 rounded-xl flex items-center gap-2 border border-peach/20">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Role Selection Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                Vai trò truy cập
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["Super Admin", "Receptionist", "Doctor", "Department Admin"] as Role[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setLoginRole(role)}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs font-semibold cursor-pointer ${
                      loginRole === role 
                        ? "bg-[#EAF7EE] text-[#164B36] border-[#2FA968] ring-2 ring-[#2FA968]/30" 
                        : "bg-white text-ink/70 border-ink/10 hover:bg-cream-white"
                    }`}
                  >
                    {role === "Super Admin" ? "Admin Tổng" : role === "Receptionist" ? "Lễ Tân" : role === "Doctor" ? "Bác Sĩ" : "Phòng Ban Thầu"}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Picker for Department Admin */}
            {loginRole === "Department Admin" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5 overflow-hidden"
              >
                <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                  Chọn phòng ban / Khối đấu thầu
                </label>
                <select
                  value={loginDepartment}
                  onChange={(e) => setLoginDepartment(e.target.value)}
                  className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl text-xs font-semibold text-green-dark focus:outline-none focus:ring-2 focus:ring-[#2FA968]"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </motion.div>
            )}

            {/* Text Input name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-green-dark uppercase tracking-wide">
                Tên quản trị viên / Bác sĩ trực
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2FA968]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Lễ tân Hoa, BS. Trí..."
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream-white border border-green-800/10 rounded-xl text-sm text-green-dark focus:outline-none focus:ring-2 focus:ring-[#2FA968]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#2FA968] hover:bg-[#258a53] text-white font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Xác nhận danh tính</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="text-center pt-3 border-t border-ink/5">
              <button 
                type="button"
                onClick={onClose}
                className="text-xs text-brand-green font-medium hover:underline cursor-pointer"
              >
                Trở lại Cổng thông tin cho Bệnh nhân
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Active role variables
  const isSuperAdmin = activeUser.role === "Super Admin";
  const isReceptionist = activeUser.role === "Receptionist";
  const isDoctorRole = activeUser.role === "Doctor";

  return (
    <div className="fixed inset-0 z-50 bg-[#FCFBF7] flex flex-col md:flex-row font-sans text-green-dark overflow-hidden">
      
      {/* -------------------------------------------------------------
          LEFT SIDEBAR (Solid Green Dark #164B36 background, text white)
          ------------------------------------------------------------- */}
      <aside className="w-full md:w-[260px] bg-[#164B36] flex flex-col border-r border-[#2FA968]/20 shrink-0">
        
        {/* Sidebar Header Brand block */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-brand-green w-5 h-5 shrink-0" />
              <h2 className="font-display font-bold text-sm tracking-wide text-[#EAF7EE] uppercase">Lâm Sàng Portal</h2>
            </div>
            <p className="text-[10px] text-mint/60 mt-1 font-medium italic">BVĐK Miền Núi Quảng Nam</p>
          </div>
          
          <button 
            onClick={logout}
            className="md:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Sidebar Logged user profile badge */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#0f3a29] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2FA968] flex items-center justify-center text-white font-bold text-xs">
            {activeUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{activeUser.name}</p>
            <span className="inline-block text-[9px] font-bold bg-[#FFA265]/20 text-[#FFA265] border border-[#FFA265]/30 px-1.5 py-0.5 rounded-md mt-0.5 uppercase">
              {activeUser.role === "Super Admin" 
                ? "Admin Tối Cao" 
                : activeUser.role === "Receptionist" 
                ? "Lễ Tân Phòng Khám" 
                : activeUser.role === "Doctor"
                ? "Bác Sĩ Trực"
                : `${activeUser.department}`}
            </span>
          </div>
        </div>

        {/* Sidebar Menu navigation */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {/* Section title */}
          <p className="text-[10px] font-bold text-mint/40 px-3 uppercase tracking-wider mb-2">Chức năng quản trị</p>

          {/* Overview */}
          {hasAccess("overview") && (
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "overview" 
                  ? "bg-[#2FA968] text-white shadow-md" 
                  : "text-mint/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Sliders size={16} />
              <span>Tổng quan nghiệp vụ</span>
            </button>
          )}

          {/* Bookings */}
          {hasAccess("bookings") && (
            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "bookings" 
                  ? "bg-[#2FA968] text-white shadow-md" 
                  : "text-mint/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar size={16} />
                <span>Lịch hẹn khám bệnh</span>
              </div>
              {metrics.pendingConfirmations > 0 && (
                <span className="w-5 h-5 bg-[#FFA265] text-green-dark rounded-full text-[10px] font-extrabold flex items-center justify-center">
                  {metrics.pendingConfirmations}
                </span>
              )}
            </button>
          )}

          {/* Patients Directory */}
          {hasAccess("patients") && (
            <button
              onClick={() => setActiveTab("patients")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "patients" 
                  ? "bg-[#2FA968] text-white shadow-md" 
                  : "text-mint/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users size={16} />
              <span>Quản lý Bệnh nhân</span>
            </button>
          )}

          {/* Doctor Schedules */}
          {hasAccess("shifts") && (
            <button
              onClick={() => setActiveTab("shifts")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "shifts" 
                  ? "bg-[#2FA968] text-white shadow-md" 
                  : "text-mint/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <CalendarRange size={16} />
              <span>Lịch trực Bác sĩ</span>
            </button>
          )}

          {/* Specialties CRUD */}
          {hasAccess("specialties") && (
            <button
              onClick={() => setActiveTab("specialties")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "specialties" 
                  ? "bg-[#2FA968] text-white shadow-md" 
                  : "text-mint/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Layers size={16} />
              <span>Quản lý Chuyên khoa</span>
            </button>
          )}

          {/* Doctors CRUD */}
          {hasAccess("doctors") && (
            <button
              onClick={() => setActiveTab("doctors")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "doctors" 
                  ? "bg-[#2FA968] text-white shadow-md" 
                  : "text-mint/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users size={16} />
              <span>Quản lý Bác sĩ</span>
            </button>
          )}

          {/* News CRUD */}
          {hasAccess("news") && (
            <button
              onClick={() => setActiveTab("news")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "news" 
                  ? "bg-[#2FA968] text-white shadow-md" 
                  : "text-mint/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Newspaper size={16} />
              <span>{activeUser.role === "Department Admin" ? "Đăng tin Đấu thầu" : "Quản lý Tin tức"}</span>
            </button>
          )}

          {/* Audit Logs */}
          {hasAccess("logs") && (
            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "logs" 
                  ? "bg-[#2FA968] text-white shadow-md" 
                  : "text-mint/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <ClipboardList size={16} />
              <span>Nhật ký hoạt động</span>
            </button>
          )}
        </nav>

        {/* Sidebar Footer Zone */}
        <div className="p-4 border-t border-white/5 bg-[#0e3023] space-y-2 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-peach hover:bg-white/5 transition-all text-left cursor-pointer"
          >
            <LogOut size={16} />
            <span>Đăng xuất tài khoản</span>
          </button>

          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-mint hover:bg-[#2FA968]/20 transition-all text-left cursor-pointer border border-[#2FA968]/20 bg-white/5"
          >
            <ArrowLeft size={16} />
            <span>Quay lại Trang chủ</span>
          </button>
        </div>
      </aside>

      {/* -------------------------------------------------------------
          RIGHT CONTENT AREA (Flexible, scrollable, with p-8 padding)
          ------------------------------------------------------------- */}
      <main className="flex-grow flex flex-col bg-[#FCFBF7] overflow-y-auto">
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Header block with Page Name and Active State info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-green-800/10 pb-5 gap-4">
            <div>
              <p className="text-xs font-extrabold text-brand-green uppercase tracking-widest">Hệ thống đồng bộ trực tuyến</p>
              <h1 className="font-display font-bold text-2xl text-green-dark">
                {activeTab === "overview" && "Báo Cáo Hoạt Động Lâm Sàng"}
                {activeTab === "bookings" && "Danh Sách Đăng Ký Lịch Khám"}
                {activeTab === "patients" && "Hồ Sơ & Danh Sách Bệnh Nhân"}
                {activeTab === "shifts" && "Bảng Phân Ca & Trực Tuần"}
                {activeTab === "specialties" && "Cơ cấu Chuyên khoa Lâm sàng"}
                {activeTab === "doctors" && "Cơ sở dữ liệu Bác sĩ Trực thuộc"}
                {activeTab === "news" && "Nội dung Tin Tức & Y học Thường Thức"}
                {activeTab === "logs" && "Nhật Ký Ghi Chép Bảo Mật (Audit Logs)"}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] bg-[#EAF7EE] text-[#164B36] border border-[#2FA968]/25 font-bold py-1.5 px-3.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 bg-[#2FA968] rounded-full animate-ping"></span>
              <span>HỆ THỐNG LIVE SYNC SẴN SÀNG</span>
            </div>
          </div>

          {/* -------------------------------------------------------------
              TAB 1: OVERVIEW SCREEN (Metrics & Recent Bookings)
              ------------------------------------------------------------- */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Metric Cards (4 columns), Styled in white with medical shadow, 20px corners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metrics 1: Total Bookings */}
                <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] border border-green-800/5 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                  <div>
                    <span className="text-[10px] font-extrabold text-ink/50 uppercase tracking-wider block">Tổng số lượt đăng ký</span>
                    <h3 className="font-display font-extrabold text-3xl mt-1 text-green-dark">{metrics.totalBookingsCount}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2FA968] mt-3">
                    <CheckCircle size={14} />
                    <span>+12.4% tuần này</span>
                  </div>
                </div>

                {/* Metrics 2: Registered Patients */}
                <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] border border-green-800/5 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                  <div>
                    <span className="text-[10px] font-extrabold text-ink/50 uppercase tracking-wider block">Bệnh nhân lưu hồ sơ</span>
                    <h3 className="font-display font-extrabold text-3xl mt-1 text-green-dark">{metrics.activePatientsCount}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-green mt-3 font-semibold">
                    <span>Đồng bộ thẻ BHYT tự động</span>
                  </div>
                </div>

                {/* Metrics 3: Doctors on Duty */}
                <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] border border-green-800/5 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                  <div>
                    <span className="text-[10px] font-extrabold text-ink/50 uppercase tracking-wider block">Bác sĩ lên ca hôm nay</span>
                    <h3 className="font-display font-extrabold text-3xl mt-1 text-green-dark">{metrics.doctorsOnDutyCount}</h3>
                  </div>
                  <div className="text-[11px] font-medium text-[#164B36] bg-[#EAF7EE] px-2.5 py-1 rounded-lg self-start mt-3">
                    Hoạt động 24/7 chuyên nghiệp
                  </div>
                </div>

                {/* Metrics 4: Pending confirmations (Peach tag highlighted #FFA265) */}
                <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] border-2 border-[#FFA265] relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#FFA265] uppercase tracking-wider block">Đang chờ phê duyệt gấp</span>
                    <h3 className="font-display font-extrabold text-3xl mt-1 text-green-dark">{metrics.pendingConfirmations}</h3>
                  </div>
                  <div className="text-[10px] font-bold text-peach-dark flex items-center gap-1 mt-3">
                    <AlertTriangle size={12} />
                    <span>Lễ tân cần kiểm tra sổ sách</span>
                  </div>
                </div>

              </div>

              {/* Recent Bookings Table (Top 5 latest) */}
              <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] p-6 border border-green-800/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-green-dark">Lịch Đăng Ký Đã Ghi Nhận Gần Đây</h3>
                  <button 
                    onClick={() => setActiveTab("bookings")}
                    className="text-xs text-brand-green hover:underline font-bold"
                  >
                    Xem tất cả lịch hẹn ({bookings.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase tracking-wider bg-cream-white">
                        <th className="p-3">Mã Code</th>
                        <th className="p-3">Họ Tên Bệnh Nhân</th>
                        <th className="p-3">Số Điện Thoại</th>
                        <th className="p-3">Chuyên Khoa</th>
                        <th className="p-3">Ngày Hẹn</th>
                        <th className="p-3">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-cream-white transition-colors">
                          <td className="p-3 font-mono font-bold text-green-dark">{b.id}</td>
                          <td className="p-3 font-semibold">{b.patientName}</td>
                          <td className="p-3">{b.phone}</td>
                          <td className="p-3">
                            <span className="bg-green-dark/5 text-green-dark py-0.5 px-2 rounded-md font-medium text-[11px]">
                              {b.specialty}
                            </span>
                          </td>
                          <td className="p-3 font-semibold">{b.date} ({b.timeSlot})</td>
                          <td className="p-3">
                            {b.status === "Chờ xác nhận" && (
                              <span className="bg-[#FFA265]/10 text-peach-dark font-extrabold px-2 py-1 rounded-full text-[10px]">
                                {b.status}
                              </span>
                            )}
                            {b.status === "Đã xác nhận" && (
                              <span className="bg-[#EAF7EE] text-[#2FA968] font-extrabold px-2 py-1 rounded-full text-[10px]">
                                {b.status}
                              </span>
                            )}
                            {b.status === "Đã hủy" && (
                              <span className="bg-red-50 text-red-500 font-extrabold px-2 py-1 rounded-full text-[10px]">
                                {b.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center p-6 text-ink/40">Chưa có lượt đăng ký nào ghi nhận trên hệ thống</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 2: BOOKINGS MANAGEMENT SCREEN
              ------------------------------------------------------------- */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              
              {/* Controls Header with Export & Simulated PDF print */}
              <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] border border-green-800/5 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search query input */}
                <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    type="text"
                    placeholder="Tìm mã lịch, tên, điện thoại..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-cream-white border border-green-800/10 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#2FA968] text-green-dark"
                  />
                </div>

                {/* Simulated Action buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={triggerExcelExport}
                    className="flex items-center gap-2 bg-[#EAF7EE] hover:bg-[#d6f2dd] text-[#164B36] font-bold text-xs px-4 py-2.5 rounded-xl border border-[#2FA968]/30 cursor-pointer shadow-sm"
                  >
                    <FileDown size={14} />
                    <span>Xuất danh sách (Excel)</span>
                  </button>

                  <button
                    onClick={() => setIsPrintPreviewOpen(true)}
                    className="flex items-center gap-2 bg-[#2FA968] hover:bg-[#258a53] text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm"
                  >
                    <Printer size={14} />
                    <span>In phiếu khám ngày (Print PDF)</span>
                  </button>
                </div>

              </div>

              {/* Alert message simulated */}
              {excelExportedMessage && (
                <div className="bg-[#EAF7EE] text-[#164B36] text-xs font-bold p-4 rounded-xl flex items-center gap-2 border border-[#2FA968]/30">
                  <CheckCircle size={16} />
                  <span>{excelExportedMessage}</span>
                </div>
              )}

              {/* Main Bookings Data Table */}
              <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] p-6 border border-green-800/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                        <th className="p-3">Mã LH</th>
                        <th className="p-3">Họ Tên Người Bệnh</th>
                        <th className="p-3">Điện Thoại</th>
                        <th className="p-3">Chuyên Khoa / Bác Sĩ</th>
                        <th className="p-3">Ngày & Ca Khám</th>
                        <th className="p-3">Triệu chứng lâm sàng</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3 text-right">Thao Tác Duyệt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-cream-white transition-colors">
                          <td className="p-3 font-mono font-bold text-[#164B36]">{b.id}</td>
                          <td className="p-3 font-bold">{b.patientName}</td>
                          <td className="p-3 font-semibold">{b.phone}</td>
                          <td className="p-3 space-y-0.5">
                            <span className="block font-bold text-brand-green">{b.specialty}</span>
                            <span className="block text-[10px] text-ink/75 italic">{b.doctorName || "Khám bác sĩ khoa"}</span>
                          </td>
                          <td className="p-3">
                            <span className="block font-semibold">{b.date}</span>
                            <span className="block text-[10px] text-ink/60">{b.timeSlot}</span>
                          </td>
                          <td className="p-3 max-w-[200px] truncate" title={b.symptoms}>{b.symptoms}</td>
                          <td className="p-3">
                            {b.status === "Chờ xác nhận" && (
                              <span className="bg-[#FFA265]/10 text-peach-dark font-extrabold px-2.5 py-1 rounded-full text-[10px] border border-[#FFA265]/20">
                                {b.status}
                              </span>
                            )}
                            {b.status === "Đã xác nhận" && (
                              <span className="bg-[#EAF7EE] text-[#2FA968] font-extrabold px-2.5 py-1 rounded-full text-[10px] border border-[#2FA968]/20">
                                {b.status}
                              </span>
                            )}
                            {b.status === "Đã hủy" && (
                              <span className="bg-red-50 text-red-500 font-extrabold px-2.5 py-1 rounded-full text-[10px] border border-red-500/10">
                                {b.status}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Approve Button */}
                              {b.status !== "Đã xác nhận" && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, "Đã xác nhận")}
                                  className="p-1.5 bg-[#EAF7EE] hover:bg-[#d5f2dd] text-[#2FA968] rounded-lg transition-all cursor-pointer"
                                  title="Phê duyệt xác nhận"
                                >
                                  <Check size={14} />
                                </button>
                              )}
                              
                              {/* Cancel Button */}
                              {b.status !== "Đã hủy" && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, "Đã hủy")}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all cursor-pointer"
                                  title="Hủy lịch hẹn"
                                >
                                  <X size={14} />
                                </button>
                              )}

                              {/* Modify details button */}
                              <button
                                onClick={() => handleOpenBookingEditModal(b)}
                                className="p-1.5 bg-cream-white hover:bg-green-800/10 text-green-dark border border-green-800/10 rounded-lg transition-all cursor-pointer"
                                title="Sửa đổi thông tin"
                              >
                                <Edit size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center p-8 text-ink/40 font-medium">
                            Không tìm thấy lịch hẹn nào tương thích với bộ lọc
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 3: PATIENT DIRECTORY
              ------------------------------------------------------------- */}
          {activeTab === "patients" && (
            <div className="space-y-6">
              
              {/* Quick Search controls */}
              <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] border border-green-800/5">
                <div className="relative w-full max-w-md">
                  {/* Search input styled as a Radius Pill 999px */}
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    type="text"
                    placeholder="Tra cứu CCCD/BHYT, Số điện thoại hoặc tên bệnh nhân..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-cream-white border border-green-800/10 rounded-[999px] text-xs focus:outline-none focus:ring-2 focus:ring-[#2FA968] text-green-dark font-medium"
                  />
                </div>
              </div>

              {/* Patient list directory table */}
              <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] p-6 border border-green-800/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                        <th className="p-3">Mã BN</th>
                        <th className="p-3">Họ và Tên Bệnh Nhân</th>
                        <th className="p-3">Số CCCD / Thẻ BHYT</th>
                        <th className="p-3">Số Điện Thoại Liên Hệ</th>
                        <th className="p-3">Lịch Sử Thăm Khám (Số Lần)</th>
                        <th className="p-3">Bảo hiểm chi trả</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {filteredPatients.map((p) => (
                        <tr key={p.id} className="hover:bg-cream-white transition-colors">
                          <td className="p-3 font-mono font-bold text-brand-green">{p.id}</td>
                          <td className="p-3 font-bold text-green-dark">{p.name}</td>
                          <td className="p-3 font-mono text-ink/75 font-semibold">{p.cccd}</td>
                          <td className="p-3 font-semibold">{p.phone}</td>
                          <td className="p-3">
                            <span className="inline-block bg-[#EAF7EE] text-[#164B36] font-bold py-0.5 px-3 rounded-full text-[11px] border border-[#2FA968]/20">
                              {p.visitCount} lần khám
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] bg-green-dark/5 text-green-dark py-0.5 px-2 rounded-md font-semibold">
                              Có thẻ BHYT (80%)
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredPatients.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center p-8 text-ink/40 font-medium">
                            Không tìm thấy hồ sơ bệnh án hoặc bệnh nhân khớp với từ khóa
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 4: DOCTOR SHIFTS & PLANNING (Shift Matrix Grid)
              ------------------------------------------------------------- */}
          {activeTab === "shifts" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] border border-green-800/5">
                <h3 className="font-display font-bold text-base text-green-dark">Ma Trận Lịch Trực Tuần Tra Lâm Sàng</h3>
                <p className="text-xs text-ink/70 mt-1">
                  Cập nhật phân ca trực của bác sĩ giúp bệnh nhân dễ dàng tra cứu tại trang chủ. Bất kỳ sự thay đổi ca nào đều được tự động đồng bộ hóa thời gian thực sang giao diện đăng ký đặt khám.
                </p>

                {/* Doctor Role Filter (RBAC detail) */}
                {isDoctorRole && (
                  <div className="bg-[#EAF7EE] p-3.5 rounded-xl border border-[#2FA968]/30 mt-4 text-xs font-semibold">
                    <span>Bạn đang đăng nhập với vai trò Bác Sĩ Trực. Bạn có thể thay đổi lịch phân ca trực cá nhân bên dưới.</span>
                  </div>
                )}
              </div>

              {/* Shift Matrix Grid */}
              <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] p-6 border border-green-800/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/5 text-ink/60 font-bold bg-cream-white">
                        <th className="p-4 text-left">Họ Tên Bác Sĩ</th>
                        <th className="p-3">Thứ Hai (Mon)</th>
                        <th className="p-3">Thứ Ba (Tue)</th>
                        <th className="p-3">Thứ Tư (Wed)</th>
                        <th className="p-3">Thứ Năm (Thu)</th>
                        <th className="p-3">Thứ Sáu (Fri)</th>
                        <th className="p-3">Thứ Bảy (Sat)</th>
                        <th className="p-3">Chủ Nhật (Sun)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {schedules.map((s) => {
                        // If Doctor Role, and doesn't match loginName, do not allow editing (visual lock)
                        const isEditableByCurrentUser = isSuperAdmin || isReceptionist || (isDoctorRole && activeUser.name.toLowerCase().includes(s.doctorName.toLowerCase()));

                        return (
                          <tr key={s.doctorId} className="hover:bg-cream-white transition-colors">
                            <td className="p-4 text-left font-extrabold text-[#164B36] whitespace-nowrap">
                              <span className="block">{s.doctorName}</span>
                              {!isEditableByCurrentUser && (
                                <span className="inline-flex items-center gap-1 text-[9px] text-ink/40 font-normal mt-0.5">
                                  <Lock size={8} /> Chỉ xem (Locked)
                                </span>
                              )}
                            </td>

                            {/* Shift Cells */}
                            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((dayKey) => {
                              const cellValue = s[dayKey as keyof Omit<DoctorSchedule, "doctorId" | "doctorName">];
                              
                              return (
                                <td key={dayKey} className="p-3">
                                  {isEditableByCurrentUser ? (
                                    <select
                                      value={cellValue}
                                      onChange={(e) => updateScheduleShift(s.doctorId, dayKey as any, e.target.value as any)}
                                      className={`p-1.5 rounded-lg text-[11px] font-bold w-24 text-center cursor-pointer border ${
                                        cellValue === "Ca Sáng" 
                                          ? "bg-[#EAF7EE] text-[#164B36] border-[#2FA968]/30" 
                                          : cellValue === "Ca Chiều" 
                                          ? "bg-[#FFA265]/10 text-peach-dark border-[#FFA265]/30" 
                                          : "bg-red-50 text-red-500 border-red-500/10"
                                      }`}
                                    >
                                      <option value="Ca Sáng">Ca Sáng</option>
                                      <option value="Ca Chiều">Ca Chiều</option>
                                      <option value="Nghỉ">Nghỉ (Off)</option>
                                    </select>
                                  ) : (
                                    <span className={`inline-block py-1.5 w-24 text-center rounded-lg text-[10px] font-bold ${
                                      cellValue === "Ca Sáng" 
                                        ? "bg-green-dark/5 text-green-dark" 
                                        : cellValue === "Ca Chiều" 
                                        ? "bg-peach/10 text-peach-dark" 
                                        : "bg-red-50 text-red-500"
                                    }`}>
                                      {cellValue === "Nghỉ" ? "Nghỉ (Off)" : cellValue}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 5: SPECIALTIES CRUD
              ------------------------------------------------------------- */}
          {activeTab === "specialties" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-green-dark">Danh Sách Chuyên Khoa Lâm Sàng</h3>
                <button
                  onClick={() => handleOpenSpecialtyModal()}
                  disabled={isRoleDisabled("crud_doctors_specialties")}
                  className={`flex items-center gap-1.5 font-display text-xs font-bold text-white px-4 py-2.5 rounded-xl cursor-pointer shadow transition-all ${
                    isRoleDisabled("crud_doctors_specialties") 
                      ? "bg-ink/20 text-ink/40 cursor-not-allowed" 
                      : "bg-[#2FA968] hover:bg-[#258a53]"
                  }`}
                >
                  <Plus size={14} />
                  <span>Thêm Chuyên Khoa Mới</span>
                </button>
              </div>

              {isRoleDisabled("crud_doctors_specialties") && (
                <div className="bg-peach/10 text-peach-dark p-3 rounded-xl text-xs flex items-center gap-2 border border-peach/20 font-semibold">
                  <ShieldAlert size={14} />
                  <span>Quyền hạn vai trò của bạn ({activeUser.role}) bị hạn chế thêm/sửa đổi chuyên khoa.</span>
                </div>
              )}

              <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] p-6 border border-green-800/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                        <th className="p-3">Mã Code</th>
                        <th className="p-3">Tên Chuyên Khoa</th>
                        <th className="p-3">Mô Tả Tóm Tắt</th>
                        <th className="p-3">Mô tả chi tiết kỹ thuật</th>
                        <th className="p-3 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {specialties.map((s) => (
                        <tr key={s.id} className="hover:bg-cream-white transition-colors">
                          <td className="p-3 font-mono font-bold text-green-dark">{s.id}</td>
                          <td className="p-3 font-extrabold text-[#164B36]">{s.name}</td>
                          <td className="p-3 max-w-[200px] truncate">{s.description}</td>
                          <td className="p-3 max-w-[300px] truncate">{s.detail}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenSpecialtyModal(s)}
                                disabled={isRoleDisabled("crud_doctors_specialties")}
                                className={`p-1.5 bg-[#EAF7EE] text-[#2FA968] rounded-lg transition-all ${
                                  isRoleDisabled("crud_doctors_specialties") ? "opacity-30 cursor-not-allowed" : "hover:bg-[#d5f2dd] cursor-pointer"
                                }`}
                                title="Chỉnh sửa"
                              >
                                <Edit size={14} />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Bạn có chắc chắn muốn xóa chuyên khoa ${s.name}?`)) {
                                    deleteSpecialty(s.id);
                                  }
                                }}
                                disabled={isRoleDisabled("crud_doctors_specialties")}
                                className={`p-1.5 bg-red-50 text-red-500 rounded-lg transition-all ${
                                  isRoleDisabled("crud_doctors_specialties") ? "opacity-30 cursor-not-allowed" : "hover:bg-red-100 cursor-pointer"
                                }`}
                                title="Xóa bỏ"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 6: DOCTORS CRUD
              ------------------------------------------------------------- */}
          {activeTab === "doctors" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-green-dark">Cơ sở dữ liệu Bác Sĩ Điều Trị</h3>
                <button
                  onClick={() => handleOpenDoctorModal()}
                  disabled={isRoleDisabled("crud_doctors_specialties")}
                  className={`flex items-center gap-1.5 font-display text-xs font-bold text-white px-4 py-2.5 rounded-xl cursor-pointer shadow transition-all ${
                    isRoleDisabled("crud_doctors_specialties") 
                      ? "bg-ink/20 text-ink/40 cursor-not-allowed" 
                      : "bg-[#2FA968] hover:bg-[#258a53]"
                  }`}
                >
                  <Plus size={14} />
                  <span>Thêm Bác Sĩ Mới</span>
                </button>
              </div>

              {isRoleDisabled("crud_doctors_specialties") && (
                <div className="bg-peach/10 text-peach-dark p-3 rounded-xl text-xs flex items-center gap-2 border border-peach/20 font-semibold">
                  <ShieldAlert size={14} />
                  <span>Quyền hạn vai trò của bạn ({activeUser.role}) bị hạn chế thêm/sửa đổi thông tin Bác sĩ.</span>
                </div>
              )}

              <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] p-6 border border-green-800/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                        <th className="p-3">Ảnh</th>
                        <th className="p-3">Họ Tên & Học Hàm</th>
                        <th className="p-3">Khoa Phụ Trách</th>
                        <th className="p-3">Kinh nghiệm lâm sàng</th>
                        <th className="p-3">Khung giờ trực tiêu chuẩn</th>
                        <th className="p-3 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {doctors.map((d) => (
                        <tr key={d.id} className="hover:bg-cream-white transition-colors">
                          <td className="p-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-green/20">
                              <img src={d.image} alt={d.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="block font-bold text-[#164B36]">{d.name}</span>
                            <span className="block text-[10px] text-[#FFA265] font-semibold">{d.title}</span>
                          </td>
                          <td className="p-3 font-semibold text-brand-green">{d.specialtyName}</td>
                          <td className="p-3 max-w-[200px] truncate text-ink/75" title={d.experience}>{d.experience}</td>
                          <td className="p-3 font-mono text-[11px] font-medium">{d.schedule}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenDoctorModal(d)}
                                disabled={isRoleDisabled("crud_doctors_specialties")}
                                className={`p-1.5 bg-[#EAF7EE] text-[#2FA968] rounded-lg transition-all ${
                                  isRoleDisabled("crud_doctors_specialties") ? "opacity-30 cursor-not-allowed" : "hover:bg-[#d5f2dd] cursor-pointer"
                                }`}
                                title="Chỉnh sửa"
                              >
                                <Edit size={14} />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Bạn có chắc chắn muốn xóa bác sĩ ${d.name}?`)) {
                                    deleteDoctor(d.id);
                                  }
                                }}
                                disabled={isRoleDisabled("crud_doctors_specialties")}
                                className={`p-1.5 bg-red-50 text-red-500 rounded-lg transition-all ${
                                  isRoleDisabled("crud_doctors_specialties") ? "opacity-30 cursor-not-allowed" : "hover:bg-red-100 cursor-pointer"
                                }`}
                                title="Xóa bỏ"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 7: NEWS CRUD
              ------------------------------------------------------------- */}
          {activeTab === "news" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-green-dark">Hồ Sơ Bản Tin Thường Thức</h3>
                <button
                  onClick={() => handleOpenNewsModal()}
                  disabled={isRoleDisabled("crud_news")}
                  className={`flex items-center gap-1.5 font-display text-xs font-bold text-white px-4 py-2.5 rounded-xl cursor-pointer shadow transition-all ${
                    isRoleDisabled("crud_news") 
                      ? "bg-ink/20 text-ink/40 cursor-not-allowed" 
                      : "bg-[#2FA968] hover:bg-[#258a53]"
                  }`}
                >
                  <Plus size={14} />
                  <span>Tạo Tin Tức Mới</span>
                </button>
              </div>

              {isRoleDisabled("crud_news") && (
                <div className="bg-peach/10 text-peach-dark p-3 rounded-xl text-xs flex items-center gap-2 border border-peach/20 font-semibold">
                  <ShieldAlert size={14} />
                  <span>Quyền hạn vai trò của bạn ({activeUser.role}) bị hạn chế đăng tải hay chỉnh sửa tin tức.</span>
                </div>
              )}

              <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] p-6 border border-green-800/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                        <th className="p-3">Hình Ảnh</th>
                        <th className="p-3">Nhãn Tag / Khối thầu</th>
                        <th className="p-3">Tiêu Đề Tin Tức</th>
                        <th className="p-3">Tóm tắt nội dung</th>
                        <th className="p-3">Ngày xuất bản</th>
                        <th className="p-3 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {displayedNews.map((n) => (
                        <tr key={n.id} className="hover:bg-cream-white transition-colors">
                          <td className="p-3">
                            <div className="w-14 h-10 rounded-lg overflow-hidden border border-brand-green/20">
                              <img src={n.image} alt={n.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="bg-green-dark/5 text-green-dark py-0.5 px-2 rounded-md font-extrabold text-[10px] block w-fit mb-1">
                              {n.tag}
                            </span>
                            {n.isTender && n.tenderDept && (
                              <span className="bg-[#FFA265]/10 text-peach-dark py-0.5 px-2 rounded-md font-extrabold text-[9px] block w-fit">
                                {n.tenderDept}
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-extrabold text-[#164B36] max-w-[200px] truncate" title={n.title}>{n.title}</td>
                          <td className="p-3 max-w-[250px] truncate text-ink/70">{n.summary}</td>
                          <td className="p-3 font-semibold text-ink/60">{n.date}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenNewsModal(n)}
                                disabled={isRoleDisabled("crud_news")}
                                className={`p-1.5 bg-[#EAF7EE] text-[#2FA968] rounded-lg transition-all ${
                                  isRoleDisabled("crud_news") ? "opacity-30 cursor-not-allowed" : "hover:bg-[#d5f2dd] cursor-pointer"
                                }`}
                                title="Chỉnh sửa"
                              >
                                <Edit size={14} />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Bạn có chắc chắn muốn xóa bài viết ${n.title}?`)) {
                                    deleteNews(n.id);
                                  }
                                }}
                                disabled={isRoleDisabled("crud_news")}
                                className={`p-1.5 bg-red-50 text-red-500 rounded-lg transition-all ${
                                  isRoleDisabled("crud_news") ? "opacity-30 cursor-not-allowed" : "hover:bg-red-100 cursor-pointer"
                                }`}
                                title="Xóa bỏ"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 8: SYSTEM ACTIVITY & AUDIT LOGS
              ------------------------------------------------------------- */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] border border-green-800/5">
                <h3 className="font-display font-bold text-base text-green-dark">Lịch Sử Kiểm Toán An Toàn Y Khoa</h3>
                <p className="text-xs text-ink/75 mt-1">
                  Đây là nhật ký giao dịch chỉ đọc để ghi nhận toàn bộ các thao tác nghiệp vụ, hành vi phê duyệt lịch khám bệnh, cấu hình chuyên môn, phân công lịch trực nhằm tuân thủ quy chuẩn quản lý dữ liệu an toàn.
                </p>
              </div>

              {/* Audit logs timeline table */}
              <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(22,75,54,0.06)] p-6 border border-green-800/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-ink/5 text-ink/60 font-semibold uppercase bg-cream-white">
                        <th className="p-3">Thời Gian Hệ Thống</th>
                        <th className="p-3">Quản Trị Viên Phụ Trách</th>
                        <th className="p-3 text-brand-green">Hành Động Đã Thực Thi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5 text-ink/90">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-cream-white transition-colors">
                          <td className="p-3 text-ink/50 whitespace-nowrap">{log.timestamp}</td>
                          <td className="p-3 font-semibold text-green-dark whitespace-nowrap">{log.user}</td>
                          <td className="p-3 font-medium text-[11px] text-[#164B36]">{log.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* -------------------------------------------------------------
          MODAL 1: DOCTOR CRUD OVERLAY (Scale-up + Fade opacity)
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {isDoctorModalOpen && (
          <div className="fixed inset-0 z-55 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl border border-green-800/10"
            >
              <div className="bg-[#164B36] p-5 text-white flex justify-between items-center">
                <h3 className="font-display font-bold text-base">
                  {editingDoctor ? "Cập Nhật Hồ Sơ Bác Sĩ" : "Thêm Mới Thầy Thuốc"}
                </h3>
                <button onClick={() => setIsDoctorModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleDoctorSubmit} className="p-6 space-y-4 text-xs font-medium text-green-dark font-sans">
                {/* Form fields use Be Vietnam Pro with clean focus-visible styling */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Tên Bác Sĩ</label>
                    <input 
                      type="text" 
                      required
                      value={docName} 
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="e.g. Nguyễn Minh Trí" 
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Học hàm học vị</label>
                    <input 
                      type="text" 
                      required
                      value={docTitle} 
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g. Thầy thuốc Ưu tú / BS. CKI" 
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Chuyên Khoa Phụ Trách</label>
                  <select
                    value={docSpecialtyId}
                    onChange={(e) => setDocSpecialtyId(e.target.value)}
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                  >
                    {specialties.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Ảnh đại diện (Unsplash / Pexels URL)</label>
                  <input 
                    type="text" 
                    value={docImage} 
                    onChange={(e) => setDocImage(e.target.value)}
                    placeholder="Bỏ trống để tự động điền ảnh y học tiêu chuẩn..." 
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Kinh nghiệm chuyên môn</label>
                  <textarea 
                    value={docExperience} 
                    onChange={(e) => setDocExperience(e.target.value)}
                    rows={2}
                    placeholder="Bản tóm tắt quá trình công tác học tập lâm sàng..." 
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Thời gian trực định kỳ</label>
                  <input 
                    type="text" 
                    required
                    value={docSchedule} 
                    onChange={(e) => setDocSchedule(e.target.value)}
                    placeholder="e.g. Thứ Hai - Thứ Sáu (08:00 - 11:30)" 
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-ink/5">
                  <button 
                    type="button" 
                    onClick={() => setIsDoctorModalOpen(false)}
                    className="px-4 py-2 bg-cream-white border border-ink/10 rounded-xl cursor-pointer hover:bg-ink/5"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[#2FA968] hover:bg-[#258a53] text-white font-bold rounded-xl cursor-pointer"
                  >
                    {editingDoctor ? "Cập Nhật" : "Tạo mới"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          MODAL 2: SPECIALTY CRUD OVERLAY
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {isSpecialtyModalOpen && (
          <div className="fixed inset-0 z-55 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl border border-green-800/10"
            >
              <div className="bg-[#164B36] p-5 text-white flex justify-between items-center">
                <h3 className="font-display font-bold text-base">
                  {editingSpecialty ? "Cập Nhật Chuyên Khoa" : "Thêm Chuyên Khoa Mới"}
                </h3>
                <button onClick={() => setIsSpecialtyModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSpecialtySubmit} className="p-6 space-y-4 text-xs font-medium text-green-dark">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Tên chuyên khoa</label>
                  <input 
                    type="text" 
                    required
                    value={specName} 
                    onChange={(e) => setSpecName(e.target.value)}
                    placeholder="e.g. Khoa Xét Nghiệm" 
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Mô tả tóm tắt ngắn</label>
                    <input 
                      type="text" 
                      required
                      value={specDesc} 
                      onChange={(e) => setSpecDesc(e.target.value)}
                      placeholder="e.g. Thực hiện xét nghiệm máu tự động..." 
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Loại icon thẩm mỹ</label>
                    <select
                      value={specIconType}
                      onChange={(e) => setSpecIconType(e.target.value as any)}
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                    >
                      <option value="cardiology">Tim Mạch</option>
                      <option value="obstetrics">Sản Phụ Khoa</option>
                      <option value="pediatrics">Nhi Khoa</option>
                      <option value="emergency">Cấp Cứu</option>
                      <option value="general">Ngoại khoa tổng hợp</option>
                      <option value="diagnostics">Xét nghiệm / CĐHA</option>
                      <option value="ent">Tai Mũi Họng</option>
                      <option value="odontology">Răng Hàm Mặt</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Mô tả trang thiết bị kỹ thuật chi tiết</label>
                  <textarea 
                    value={specDetail} 
                    onChange={(e) => setSpecDetail(e.target.value)}
                    rows={3}
                    placeholder="e.g. Chuyên khoa được trang bị dàn chụp CT đa lớp cắt, máy xét nghiệm huyết học tự động Siemens tiên tiến nhất giúp..." 
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-ink/5">
                  <button 
                    type="button" 
                    onClick={() => setIsSpecialtyModalOpen(false)}
                    className="px-4 py-2 bg-cream-white border border-ink/10 rounded-xl cursor-pointer hover:bg-ink/5"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[#2FA968] hover:bg-[#258a53] text-white font-bold rounded-xl cursor-pointer"
                  >
                    {editingSpecialty ? "Cập Nhật" : "Tạo mới"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          MODAL 3: NEWS CRUD OVERLAY
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {isNewsModalOpen && (
          <div className="fixed inset-0 z-55 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl border border-green-800/10"
            >
              <div className="bg-[#164B36] p-5 text-white flex justify-between items-center">
                <h3 className="font-display font-bold text-base">
                  {editingNews ? "Cập Nhật Bài Đăng Tin Tức" : "Tạo Bản Tin Y Khoa Mới"}
                </h3>
                <button onClick={() => setIsNewsModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleNewsSubmit} className="p-6 space-y-4 text-xs font-medium text-green-dark">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Tiêu đề tin tức</label>
                    <input 
                      type="text" 
                      required
                      value={newsTitleState} 
                      onChange={(e) => setNewsTitleState(e.target.value)}
                      placeholder="Thông báo lịch nghỉ lễ / Đổi mới trang thiết bị..." 
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Thẻ Tag</label>
                    <select
                      value={newsTag}
                      onChange={(e) => setNewsTag(e.target.value as any)}
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                    >
                      <option value="Tin y học">Tin y học</option>
                      <option value="Thông báo">Thông báo</option>
                      <option value="Sự kiện">Sự kiện</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Tóm tắt ngắn (Summary)</label>
                  <textarea 
                    value={newsSummary} 
                    onChange={(e) => setNewsSummary(e.target.value)}
                    rows={2}
                    required
                    placeholder="Bản tóm tắt xuất hiện tại trang chủ cho bà con tiện theo dõi..." 
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Ảnh minh họa (Unsplash / Pexels URL)</label>
                  <input 
                    type="text" 
                    value={newsImage} 
                    onChange={(e) => setNewsImage(e.target.value)}
                    placeholder="Dán link ảnh y tế..." 
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968]"
                  />
                </div>

                {/* Cấu hình Đấu Thầu / Mua Sắm Y Tế */}
                <div className="bg-[#EAF7EE]/40 p-4 rounded-xl border border-[#2FA968]/20 space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="newsIsTender"
                      checked={newsIsTender}
                      onChange={(e) => {
                        setNewsIsTender(e.target.checked);
                        if (e.target.checked) {
                          setNewsTag("Thông báo"); // Set tag to "Thông báo" by default for tenders
                          if (!newsTenderStartDate) setNewsTenderStartDate("08:00:00 ngày 15/07/2026");
                          if (!newsTenderEndDate) setNewsTenderEndDate("17:00:00 ngày 25/07/2026");
                        }
                      }}
                      className="rounded border-[#2FA968]/30 text-[#2FA968] focus:ring-[#2FA968] cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="newsIsTender" className="text-xs font-bold text-green-dark cursor-pointer select-none">
                      Đây là thông tin Đấu thầu / Mua sắm trang thiết bị y khoa
                    </label>
                  </div>

                  {newsIsTender && (
                    <div className="space-y-3 pt-2 border-t border-[#2FA968]/10">
                      {/* Department Selection */}
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-green-dark/70">Khối / Phòng ban quản lý thầu</label>
                        {activeUser?.role === "Department Admin" ? (
                          <div className="p-2.5 bg-green-dark/5 text-[#164B36] font-bold rounded-lg text-xs border border-green-800/10">
                            {activeUser.department} (Tự động áp dụng theo tài khoản của bạn)
                          </div>
                        ) : (
                          <select
                            value={newsTenderDept}
                            onChange={(e) => setNewsTenderDept(e.target.value)}
                            className="w-full p-2 bg-white border border-green-800/10 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968] text-xs font-semibold text-green-dark"
                          >
                            {DEPARTMENTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-green-dark/70">Thời điểm mở thầu</label>
                          <input 
                            type="text" 
                            value={newsTenderStartDate} 
                            onChange={(e) => setNewsTenderStartDate(e.target.value)}
                            placeholder="Ví dụ: 08:00:00 ngày 15/07/2026" 
                            className="w-full p-2 bg-white border border-green-800/10 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold tracking-wider text-green-dark/70">Thời điểm khóa thầu</label>
                          <input 
                            type="text" 
                            value={newsTenderEndDate} 
                            onChange={(e) => setNewsTenderEndDate(e.target.value)}
                            placeholder="Ví dụ: 17:00:00 ngày 25/07/2026" 
                            className="w-full p-2 bg-white border border-green-800/10 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968] text-xs"
                          />
                        </div>
                      </div>

                      {/* Drag & Drop high-fidelity File Upload component */}
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-green-dark/70">Tài liệu thầu đính kèm (PDF, PNG)</label>
                        
                        {!newsTenderFile ? (
                          <div 
                            onDragOver={(e) => { e.preventDefault(); setIsFileDragging(true); }}
                            onDragLeave={() => setIsFileDragging(false)}
                            onDrop={handleTenderFileDrop}
                            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                              isFileDragging 
                                ? "border-[#2FA968] bg-[#EAF7EE]" 
                                : "border-green-800/20 bg-white hover:border-[#2FA968]/50"
                            }`}
                          >
                            <input 
                              type="file" 
                              id="tenderFileInput"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={handleTenderFileChange}
                              className="hidden"
                            />
                            <label htmlFor="tenderFileInput" className="cursor-pointer space-y-1 block">
                              <Upload className="mx-auto w-6 h-6 text-[#2FA968]" />
                              <p className="text-xs font-bold text-green-dark">Kéo thả tài liệu thầu hoặc nhấp để chọn tệp</p>
                              <p className="text-[10px] text-gray-500">Chấp nhận định dạng .pdf, .png, .jpg (Tối đa 10MB)</p>
                            </label>
                          </div>
                        ) : (
                          <div className="bg-white border border-green-800/10 rounded-xl p-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Paperclip className="text-[#2FA968] shrink-0" size={16} />
                              <div className="truncate">
                                <p className="text-xs font-bold text-[#164B36] truncate max-w-[220px]" title={newsTenderFile.name}>{newsTenderFile.name}</p>
                                <p className="text-[10px] text-gray-500">{newsTenderFile.size}</p>
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setNewsTenderFile(null)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa tệp đính kèm"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Nội dung chi tiết bài viết (Sử dụng 2 lần xuống dòng để xuống đoạn)</label>
                  <textarea 
                    value={newsContent} 
                    onChange={(e) => setNewsContent(e.target.value)}
                    rows={6}
                    placeholder="Nhập nội dung chi tiết bài đăng..." 
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2FA968] font-sans text-xs leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-ink/5">
                  <button 
                    type="button" 
                    onClick={() => setIsNewsModalOpen(false)}
                    className="px-4 py-2 bg-cream-white border border-ink/10 rounded-xl cursor-pointer hover:bg-ink/5"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[#2FA968] hover:bg-[#258a53] text-white font-bold rounded-xl cursor-pointer"
                  >
                    {editingNews ? "Cập Nhật" : "Xuất Bản"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          MODAL 4: BOOKING DETAILS MODIFY OVERLAY
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {isBookingEditModalOpen && (
          <div className="fixed inset-0 z-55 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl border border-green-800/10"
            >
              <div className="bg-[#164B36] p-5 text-white flex justify-between items-center">
                <h3 className="font-display font-bold text-base">Cập Nhật Thông Tin Lịch Khám</h3>
                <button onClick={() => setIsBookingEditModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleBookingEditSubmit} className="p-6 space-y-4 text-xs font-medium text-green-dark">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Tên Người Bệnh</label>
                    <input 
                      type="text" 
                      required
                      value={bPatientName} 
                      onChange={(e) => setBPatientName(e.target.value)}
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2FA968]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Số Điện Thoại</label>
                    <input 
                      type="text" 
                      required
                      value={bPhone} 
                      onChange={(e) => setBPhone(e.target.value)}
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2FA968]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Chuyên Khoa Đăng Ký</label>
                    <select
                      value={bSpecialty}
                      onChange={(e) => setBSpecialty(e.target.value)}
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2FA968]"
                    >
                      {specialties.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Bác Sĩ Chỉ Định (Tùy chọn)</label>
                    <select
                      value={bDoctorName}
                      onChange={(e) => setBDoctorName(e.target.value)}
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2FA968]"
                    >
                      <option value="">Khám bác sĩ khoa</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Ngày Khám Hẹn</label>
                    <input 
                      type="date" 
                      required
                      value={bDate} 
                      onChange={(e) => setBDate(e.target.value)}
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2FA968]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold tracking-wider">Ca giờ hẹn</label>
                    <input 
                      type="text" 
                      required
                      value={bTimeSlot} 
                      onChange={(e) => setBTimeSlot(e.target.value)}
                      placeholder="e.g. 08:30 - 09:30"
                      className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2FA968]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider">Triệu chứng lâm sàng ghi nhận</label>
                  <textarea 
                    value={bSymptoms} 
                    onChange={(e) => setBSymptoms(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 bg-cream-white border border-green-800/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2FA968]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-ink/5">
                  <button 
                    type="button" 
                    onClick={() => setIsBookingEditModalOpen(false)}
                    className="px-4 py-2 bg-cream-white border border-ink/10 rounded-xl cursor-pointer hover:bg-ink/5"
                  >
                    Quay lại
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[#2FA968] hover:bg-[#258a53] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Cập Nhật Lịch Hẹn
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------
          PRINT PREVIEW MODAL DIALOG (Optimized clean list layout)
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {isPrintPreviewOpen && (
          <div className="fixed inset-0 z-55 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-green-800/10 text-green-dark"
            >
              {/* Toolbar */}
              <div className="bg-[#164B36] p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Printer size={16} />
                  <span className="font-display font-bold text-xs uppercase tracking-wider">Xem trước bản in (Print PDF Mode)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      alert("Simulated PDF print launched on browser. Printing...");
                      setIsPrintPreviewOpen(false);
                      addLog("In danh sách lịch trực / đăng ký hôm nay");
                    }}
                    className="bg-[#2FA968] hover:bg-[#258a53] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    Bắt đầu in
                  </button>
                  <button 
                    onClick={() => setIsPrintPreviewOpen(false)}
                    className="text-white/80 hover:text-white cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Clean styled Print Page Layout */}
              <div className="p-8 space-y-6 bg-white overflow-y-auto max-h-[500px]" id="printable-zone">
                {/* Clinic Receptionist header */}
                <div className="flex justify-between items-start border-b-2 border-green-800 pb-4">
                  <div>
                    <h4 className="font-bold text-xs uppercase text-green-dark leading-tight">SỞ Y TẾ TỈNH QUẢNG NAM</h4>
                    <h3 className="font-bold text-sm uppercase text-[#164B36] tracking-wide leading-tight mt-0.5">BVĐK KHU VỰC MIỀN NÚI PHÍA BẮC QUẢNG NAM</h3>
                    <p className="text-[9px] text-ink/65 mt-1 font-mono">Địa chỉ: Huyện Đại Lộc, Tỉnh Quảng Nam | Điện thoại: 02353.747.432</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-ink/65">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="text-[9px] font-bold text-ink/50 mt-0.5">Độc lập - Tự do - Hạnh phúc</p>
                    <span className="inline-block border border-green-800/20 px-2 py-0.5 text-[9px] font-mono mt-2 rounded">
                      Ngày in: {new Date().toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h2 className="font-display font-bold text-lg text-green-dark uppercase tracking-wide">Danh Sách Bệnh Nhân Đăng Ký Khám Trong Ngày</h2>
                  <p className="text-[11px] text-ink/70 italic">Phục vụ công tác đón tiếp, sàng lọc phân luồng bệnh nhân của lễ tân phòng khám</p>
                </div>

                <table className="w-full text-left text-[10px] border-collapse border border-ink/10">
                  <thead>
                    <tr className="bg-green-dark/5 text-green-dark font-extrabold uppercase border-b border-ink/10">
                      <th className="p-2 border-r border-ink/10">Mã Số</th>
                      <th className="p-2 border-r border-ink/10">Họ và Tên</th>
                      <th className="p-2 border-r border-ink/10">Số điện thoại</th>
                      <th className="p-2 border-r border-ink/10">Khoa / Phòng Khám</th>
                      <th className="p-2 border-r border-ink/10">Bác Sĩ Trực</th>
                      <th className="p-2 border-r border-ink/10">Ca Khám</th>
                      <th className="p-2">Tình Trạng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="p-2 border-r border-ink/10 font-mono font-bold">{b.id}</td>
                        <td className="p-2 border-r border-ink/10 font-bold">{b.patientName}</td>
                        <td className="p-2 border-r border-ink/10">{b.phone}</td>
                        <td className="p-2 border-r border-ink/10 font-semibold text-brand-green">{b.specialty}</td>
                        <td className="p-2 border-r border-ink/10 italic">{b.doctorName || "Khám bác sĩ khoa"}</td>
                        <td className="p-2 border-r border-ink/10 font-bold">{b.date} ({b.timeSlot})</td>
                        <td className="p-2 font-bold">{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer of report */}
                <div className="grid grid-cols-2 pt-12 text-[10px] text-center">
                  <div>
                    <p className="font-bold">Lập biểu báo cáo</p>
                    <p className="text-[9px] text-ink/40 mt-1">(Ký, ghi rõ họ tên)</p>
                    <p className="mt-14 font-semibold text-green-dark">{activeUser.name}</p>
                  </div>
                  <div>
                    <p className="font-bold">Xác nhận trực ban Bệnh viện</p>
                    <p className="text-[9px] text-ink/40 mt-1">(Ký, đóng dấu tròn y tế)</p>
                    <p className="mt-14 font-semibold text-green-dark">ThS. BS. Tô Mười</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
