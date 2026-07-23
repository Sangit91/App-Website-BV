import React, { createContext, useContext, useState, useEffect } from "react";
import { Specialty, Doctor, NewsItem } from "../types";
import { SPECIALTIES, DOCTORS, NEWS } from "../data";

export type Role = "Super Admin" | "Receptionist" | "Doctor" | "Department Admin";

export interface ActiveUser {
  role: Role;
  name: string;
  department?: string;
}

export interface Booking {
  id: string;
  patientName: string;
  phone: string;
  specialty: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  status: "Chờ xác nhận" | "Đã xác nhận" | "Đã hủy";
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  cccd: string;
  phone: string;
  visitCount: number;
}

export interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  monday: "Ca Sáng" | "Ca Chiều" | "Nghỉ";
  tuesday: "Ca Sáng" | "Ca Chiều" | "Nghỉ";
  wednesday: "Ca Sáng" | "Ca Chiều" | "Nghỉ";
  thursday: "Ca Sáng" | "Ca Chiều" | "Nghỉ";
  friday: "Ca Sáng" | "Ca Chiều" | "Nghỉ";
  saturday: "Ca Sáng" | "Ca Chiều" | "Nghỉ";
  sunday: "Ca Sáng" | "Ca Chiều" | "Nghỉ";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
}

interface HospitalContextType {
  doctors: Doctor[];
  specialties: Specialty[];
  news: NewsItem[];
  bookings: Booking[];
  patients: Patient[];
  schedules: DoctorSchedule[];
  logs: AuditLog[];
  activeUser: ActiveUser | null;
  
  // Auth actions
  login: (role: Role, name: string, department?: string) => void;
  logout: () => void;

  // Doctors CRUD
  addDoctor: (doctor: Omit<Doctor, "id">) => void;
  updateDoctor: (doctor: Doctor) => void;
  deleteDoctor: (id: string) => void;

  // Specialties CRUD
  addSpecialty: (specialty: Omit<Specialty, "id">) => void;
  updateSpecialty: (specialty: Specialty) => void;
  deleteSpecialty: (id: string) => void;

  // News CRUD
  addNews: (newsItem: Omit<NewsItem, "id">) => void;
  updateNews: (newsItem: NewsItem) => void;
  deleteNews: (id: string) => void;

  // Bookings management
  addBooking: (booking: Omit<Booking, "id" | "status" | "createdAt">) => Booking;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  updateBookingDetails: (booking: Booking) => void;

  // Schedule management
  updateScheduleShift: (doctorId: string, day: keyof Omit<DoctorSchedule, "doctorId" | "doctorName">, shift: "Ca Sáng" | "Ca Chiều" | "Nghỉ") => void;

  // Log action
  addLog: (action: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  // 1. Core lists initialized from localStorage or defaults
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);

  useEffect(() => {
    // Load specialties, doctors, news from PostgreSQL API (source of truth)
    // Load bookings, patients, schedules, logs, activeUser from localStorage (still local-only)
    const init = async () => {
      // --- API data: specialties, doctors, news ---
      try {
        const [specRes, docRes, newsRes] = await Promise.all([
          fetch('/api/v1/specialties'),
          fetch('/api/v1/doctors'),
          fetch('/api/v1/news'),
        ]);

        if (specRes.ok) {
          const dbSpecs = await specRes.json();
          const mappedSpecs: Specialty[] = dbSpecs.map((s: any) => ({
            id: s.id,
            name: s.name,
            description: s.description || '',
            iconType: s.icon as Specialty['iconType'],
            detail: s.detail || '',
          }));
          setSpecialties(mappedSpecs);
          localStorage.setItem('hosp_specialties', JSON.stringify(mappedSpecs));
        }

        if (docRes.ok) {
          const dbDocs = await docRes.json();
          const mappedDocs: Doctor[] = dbDocs.map((d: any) => ({
            id: d.id,
            name: d.fullName,
            title: d.title,
            specialtyId: d.specialtyId || '',
            specialtyName: d.specialty?.name || '',
            image: d.image || '/images/doctors/doctor-placeholder.jpeg',
            experience: d.bio || '',
            schedule: '',
          }));
          setDoctors(mappedDocs);
          localStorage.setItem('hosp_doctors', JSON.stringify(mappedDocs));
        }

        if (newsRes.ok) {
          const dbNews = await newsRes.json();
          const mappedNews: NewsItem[] = dbNews.map((n: any) => ({
            id: n.id,
            title: n.title,
            summary: n.summary || '',
            tag: n.category as NewsItem['tag'],
            date: n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('vi-VN') : '',
            image: n.image || '/images/pages/hero-thongtin.jpeg',
            content: n.content,
            isTender: n.isTender || false,
            tenderNumber: n.tenderNumber,
            tenderStartDate: n.tenderStartDate || '',
            tenderEndDate: n.tenderEndDate || '',
            tenderDept: n.tenderDept,
            tenderMethod: n.tenderMethod,
            tenderEstimateValue: n.tenderEstimate,
            tenderReceivedLocation: n.tenderReceived,
            tenderContact: n.contactName,
            tenderContactPhone: n.contactPhone,
            tenderFile: n.tenderFile,
            tenderDownloadCount: n.downloadCount,
          }));
          setNews(mappedNews);
          localStorage.setItem('hosp_news', JSON.stringify(mappedNews));
        }
      } catch (err) {
        console.error('Error loading from API, falling back to localStorage:', err);
      }

      // --- localStorage-only data ---

      // Doctors (fallback)
      const localDoctors = localStorage.getItem('hosp_doctors');
      if (localDoctors) {
        const parsed = JSON.parse(localDoctors);
        if (parsed.length > 0) setDoctors(parsed);
      } else {
        localStorage.setItem('hosp_doctors', JSON.stringify(DOCTORS));
        setDoctors(DOCTORS);
      }

      // Specialties (fallback)
      const localSpecs = localStorage.getItem('hosp_specialties');
      if (localSpecs) {
        const parsed = JSON.parse(localSpecs);
        if (parsed.length > 0) setSpecialties(parsed);
      } else {
        localStorage.setItem('hosp_specialties', JSON.stringify(SPECIALTIES));
        setSpecialties(SPECIALTIES);
      }

      // News (fallback)
      const localNews = localStorage.getItem('hosp_news');
      if (localNews) {
        const parsed = JSON.parse(localNews);
        if (parsed.length > 0) setNews(parsed);
      } else {
        localStorage.setItem('hosp_news', JSON.stringify(NEWS));
        setNews(NEWS);
      }

      // Bookings
      const localBookings = localStorage.getItem('hosp_bookings');
      if (localBookings) {
        setBookings(JSON.parse(localBookings));
      } else {
        const defaultBookings: Booking[] = [
          {
            id: 'LH-987213',
            patientName: 'Nguyễn Văn An',
            phone: '0905123456',
            specialty: 'Khoa Tim Mạch',
            doctorName: 'BS. CKII. Nguyễn Minh Trí',
            date: '2026-07-20',
            timeSlot: '08:00 - 09:00',
            symptoms: 'Hay bị đau tức ngực trái khi gắng sức',
            status: 'Chờ xác nhận',
            createdAt: new Date().toISOString()
          },
          {
            id: 'LH-523145',
            patientName: 'Trần Thị Bình',
            phone: '0905111222',
            specialty: 'Khoa Sản Phụ Khoa',
            doctorName: 'ThS. BS. Nguyễn Thị Phương Mai',
            date: '2026-07-21',
            timeSlot: '09:30 - 10:30',
            symptoms: 'Khám thai định kỳ tuần thứ 24',
            status: 'Đã xác nhận',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'LH-812390',
            patientName: 'Phạm Văn Cường',
            phone: '0905888999',
            specialty: 'Khoa Nhi',
            doctorName: 'BS. CKI. Phan Thanh Hải',
            date: '2026-07-22',
            timeSlot: '14:00 - 15:00',
            symptoms: 'Cháu nhỏ sốt nhẹ kèm ho khan',
            status: 'Đã xác nhận',
            createdAt: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 'LH-222333',
            patientName: 'Lê Văn Dũng',
            phone: '0914222333',
            specialty: 'Khoa Ngoại Tổng Hợp',
            doctorName: 'BS. Lê Thị Thu Hồng',
            date: '2026-07-23',
            timeSlot: '15:30 - 16:30',
            symptoms: 'Tư vấn mổ nội soi sỏi mật',
            status: 'Đã hủy',
            createdAt: new Date(Date.now() - 10800000).toISOString()
          }
        ];
        localStorage.setItem('hosp_bookings', JSON.stringify(defaultBookings));
        setBookings(defaultBookings);
      }

      // Patients
      const localPatients = localStorage.getItem('hosp_patients');
      if (localPatients) {
        setPatients(JSON.parse(localPatients));
      } else {
        const defaultPatients: Patient[] = [
          { id: 'P-1', name: 'Cô Trương Thị Hoa', cccd: '049152003841', phone: '0905777888', visitCount: 5 },
          { id: 'P-2', name: 'Anh Nguyễn Văn Hoàng', cccd: '049092004512', phone: '0905666777', visitCount: 2 },
          { id: 'P-3', name: 'Chị Phan Thị Vy', cccd: '049182009123', phone: '0905555666', visitCount: 1 },
          { id: 'P-4', name: 'Nguyễn Văn An', cccd: '049093001234', phone: '0905123456', visitCount: 3 },
          { id: 'P-5', name: 'Trần Thị Bình', cccd: '049193005678', phone: '0905111222', visitCount: 4 },
          { id: 'P-6', name: 'Phạm Văn Cường', cccd: '049073009999', phone: '0905888999', visitCount: 6 }
        ];
        localStorage.setItem('hosp_patients', JSON.stringify(defaultPatients));
        setPatients(defaultPatients);
      }

      // Schedules
      const localSchedules = localStorage.getItem('hosp_schedules');
      if (localSchedules) {
        setSchedules(JSON.parse(localSchedules));
      } else {
        const defaultSchedules: DoctorSchedule[] = [
          {
            doctorId: 'dr-tri',
            doctorName: 'BS. CKII. Nguyễn Minh Trí',
            monday: 'Ca Sáng',
            tuesday: 'Ca Sáng',
            wednesday: 'Ca Sáng',
            thursday: 'Ca Sáng',
            friday: 'Ca Sáng',
            saturday: 'Nghỉ',
            sunday: 'Nghỉ'
          },
          {
            doctorId: 'dr-mai',
            doctorName: 'ThS. BS. Nguyễn Thị Phương Mai',
            monday: 'Ca Chiều',
            tuesday: 'Ca Chiều',
            wednesday: 'Ca Chiều',
            thursday: 'Ca Chiều',
            friday: 'Nghỉ',
            saturday: 'Nghỉ',
            sunday: 'Nghỉ'
          },
          {
            doctorId: 'dr-hai',
            doctorName: 'BS. CKI. Phan Thanh Hải',
            monday: 'Nghỉ',
            tuesday: 'Ca Sáng',
            wednesday: 'Ca Sáng',
            thursday: 'Ca Sáng',
            friday: 'Ca Sáng',
            saturday: 'Nghỉ',
            sunday: 'Nghỉ'
          },
          {
            doctorId: 'dr-hong',
            doctorName: 'BS. Lê Thị Thu Hồng',
            monday: 'Ca Chiều',
            tuesday: 'Ca Chiều',
            wednesday: 'Ca Chiều',
            thursday: 'Nghỉ',
            friday: 'Nghỉ',
            saturday: 'Nghỉ',
            sunday: 'Nghỉ'
          }
        ];
        localStorage.setItem('hosp_schedules', JSON.stringify(defaultSchedules));
        setSchedules(defaultSchedules);
      }

      // Logs
      const localLogs = localStorage.getItem('hosp_logs');
      if (localLogs) {
        setLogs(JSON.parse(localLogs));
      } else {
        const defaultLogs: AuditLog[] = [
          {
            id: 'L-1',
            timestamp: '16/07/2026 09:15',
            user: 'Lễ tân Hoa',
            action: 'Xác nhận Lịch hẹn #LH-987213'
          },
          {
            id: 'L-2',
            timestamp: '16/07/2026 10:30',
            user: 'Super Admin',
            action: 'Cập nhật lịch trực BS. Nguyễn Minh Trí'
          }
        ];
        localStorage.setItem('hosp_logs', JSON.stringify(defaultLogs));
        setLogs(defaultLogs);
      }

      // Active User / Session
      const localUser = localStorage.getItem('hosp_active_user');
      if (localUser) {
        setActiveUser(JSON.parse(localUser));
      }
    };

    init();
  }, []);

  // Helper helper to write to storage and state
  const saveDoctors = (list: Doctor[]) => {
    localStorage.setItem("hosp_doctors", JSON.stringify(list));
    setDoctors(list);
  };

  const saveSpecialties = (list: Specialty[]) => {
    localStorage.setItem("hosp_specialties", JSON.stringify(list));
    setSpecialties(list);
  };

  const saveNews = (list: NewsItem[]) => {
    localStorage.setItem("hosp_news", JSON.stringify(list));
    setNews(list);
  };

  const saveBookings = (list: Booking[]) => {
    localStorage.setItem("hosp_bookings", JSON.stringify(list));
    setBookings(list);
  };

  const savePatients = (list: Patient[]) => {
    localStorage.setItem("hosp_patients", JSON.stringify(list));
    setPatients(list);
  };

  const saveSchedules = (list: DoctorSchedule[]) => {
    localStorage.setItem("hosp_schedules", JSON.stringify(list));
    setSchedules(list);
  };

  const saveLogs = (list: AuditLog[]) => {
    localStorage.setItem("hosp_logs", JSON.stringify(list));
    setLogs(list);
  };

  // Auth actions
  const login = (role: Role, name: string, department?: string) => {
    const user = { role, name, department };
    localStorage.setItem("hosp_active_user", JSON.stringify(user));
    setActiveUser(user);
    const detail = department ? `với vai trò ${role} - ${department}` : `với vai trò ${role}`;
    addLogInternal(`Đăng nhập hệ thống ${detail}`, name);
  };

  const logout = () => {
    const userName = activeUser ? activeUser.name : "Người dùng";
    const userRole = activeUser ? activeUser.role : "Admin";
    localStorage.removeItem("hosp_active_user");
    setActiveUser(null);
    addLogInternal(`Đăng xuất hệ thống`, `${userName} (${userRole})`);
  };

  // Logs
  const addLogInternal = (action: string, customUser?: string) => {
    const userDisplay = customUser || (activeUser ? `${activeUser.name} (${activeUser.role})` : "Khách vãng lai");
    const dateStr = new Date().toLocaleString("vi-VN", { hour12: false });
    const newLog: AuditLog = {
      id: `L-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: dateStr,
      user: userDisplay,
      action
    };
    const updated = [newLog, ...logs];
    saveLogs(updated);
  };

  const addLog = (action: string) => {
    addLogInternal(action);
  };

  // Doctors CRUD
  const addDoctor = (docInput: Omit<Doctor, "id">) => {
    const newId = `dr-${docInput.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.floor(Math.random() * 100)}`;
    const newDoc: Doctor = { ...docInput, id: newId };
    const updatedDocs = [...doctors, newDoc];
    saveDoctors(updatedDocs);

    // Call API to persist to PostgreSQL
    fetch("/api/v1/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: docInput.name,
        title: docInput.title,
        specialtyId: docInput.specialtyId,
        image: docInput.image,
        experienceYear: parseInt(docInput.experience) || null,
        bio: docInput.experience,
      }),
    }).catch(err => console.error("Error syncing doctor to API:", err));

    // Also auto-add doctor schedule
    const newSched: DoctorSchedule = {
      doctorId: newId,
      doctorName: newDoc.name,
      monday: "Ca Sáng",
      tuesday: "Ca Sáng",
      wednesday: "Ca Sáng",
      thursday: "Ca Sáng",
      friday: "Ca Sáng",
      saturday: "Nghỉ",
      sunday: "Nghỉ"
    };
    saveSchedules([...schedules, newSched]);

    addLog(`Thêm mới bác sĩ: ${newDoc.name}`);
  };

  const updateDoctor = (doc: Doctor) => {
    const updated = doctors.map(d => d.id === doc.id ? doc : d);
    saveDoctors(updated);

    // Also sync doctorName in schedules
    const updatedSched = schedules.map(s => s.doctorId === doc.id ? { ...s, doctorName: doc.name } : s);
    saveSchedules(updatedSched);

    addLog(`Cập nhật thông tin bác sĩ: ${doc.name}`);
  };

  const deleteDoctor = (id: string) => {
    const docToDelete = doctors.find(d => d.id === id);
    const updated = doctors.filter(d => d.id !== id);
    saveDoctors(updated);

    // Remove from schedules as well
    const updatedSched = schedules.filter(s => s.doctorId !== id);
    saveSchedules(updatedSched);

    if (docToDelete) {
      addLog(`Xóa bác sĩ: ${docToDelete.name}`);
    }
  };

  // Specialties CRUD
  const addSpecialty = (specInput: Omit<Specialty, "id">) => {
    const newId = specInput.name.toLowerCase().replace(/[^a-z0-9]/g, "-") + `-${Math.floor(Math.random() * 100)}`;
    const newSpec: Specialty = { ...specInput, id: newId };
    const updated = [...specialties, newSpec];
    saveSpecialties(updated);

    fetch("/api/v1/specialties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: specInput.name,
        description: specInput.description,
        icon: specInput.iconType,
        detail: specInput.detail,
      }),
    }).catch(err => console.error("Error syncing specialty to API:", err));

    addLog(`Thêm mới chuyên khoa: ${newSpec.name}`);
  };

  const updateSpecialty = (spec: Specialty) => {
    const updated = specialties.map(s => s.id === spec.id ? spec : s);
    saveSpecialties(updated);

    fetch(`/api/v1/specialties/${spec.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: spec.name,
        description: spec.description,
        icon: spec.iconType,
        detail: spec.detail,
      }),
    }).catch(err => console.error("Error syncing specialty update to API:", err));

    addLog(`Cập nhật chuyên khoa: ${spec.name}`);
  };

  const deleteSpecialty = (id: string) => {
    const specToDelete = specialties.find(s => s.id === id);
    const updated = specialties.filter(s => s.id !== id);
    saveSpecialties(updated);

    fetch(`/api/v1/specialties/${id}`, {
      method: "DELETE",
    }).catch(err => console.error("Error syncing specialty deletion to API:", err));

    if (specToDelete) {
      addLog(`Xóa chuyên khoa: ${specToDelete.name}`);
    }
  };

  // News CRUD
  const addNews = (newsInput: Omit<NewsItem, "id">) => {
    const newId = `news-${Date.now()}`;
    const newNews: NewsItem = { ...newsInput, id: newId };
    const updated = [newNews, ...news];
    saveNews(updated);

    fetch("/api/v1/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newsInput.title,
        summary: newsInput.summary,
        category: newsInput.tag,
        content: newsInput.content || "",
        image: newsInput.image,
        isTender: newsInput.isTender || false,
        tenderNumber: newsInput.tenderNumber,
        tenderStartDate: newsInput.tenderStartDate,
        tenderEndDate: newsInput.tenderEndDate,
        tenderMethod: newsInput.tenderMethod,
        tenderEstimate: newsInput.tenderEstimateValue,
        tenderReceived: newsInput.tenderReceivedLocation,
        contactName: newsInput.tenderContact,
        contactPhone: newsInput.tenderContactPhone,
        publishedAt: newsInput.date ? new Date(newsInput.date).toISOString() : new Date().toISOString(),
      }),
    }).catch(err => console.error("Error syncing news to API:", err));

    addLog(`Đăng tin tức mới: ${newNews.title}`);
  };

  const updateNews = (newsInput: NewsItem) => {
    const updated = news.map(n => n.id === newsInput.id ? newsInput : n);
    saveNews(updated);

    fetch(`/api/v1/news/${newsInput.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newsInput.title,
        summary: newsInput.summary,
        category: newsInput.tag,
        content: newsInput.content || "",
        image: newsInput.image,
        isTender: newsInput.isTender || false,
        tenderNumber: newsInput.tenderNumber,
        tenderStartDate: newsInput.tenderStartDate,
        tenderEndDate: newsInput.tenderEndDate,
        tenderMethod: newsInput.tenderMethod,
        tenderEstimate: newsInput.tenderEstimateValue,
        tenderReceived: newsInput.tenderReceivedLocation,
        contactName: newsInput.tenderContact,
        contactPhone: newsInput.tenderContactPhone,
        publishedAt: newsInput.date ? new Date(newsInput.date).toISOString() : new Date().toISOString(),
      }),
    }).catch(err => console.error("Error syncing news update to API:", err));

    addLog(`Cập nhật tin tức: ${newsInput.title}`);
  };

  const deleteNews = (id: string) => {
    const newsToDelete = news.find(n => n.id === id);
    const updated = news.filter(n => n.id !== id);
    saveNews(updated);

    fetch(`/api/v1/news/${id}`, {
      method: "DELETE",
    }).catch(err => console.error("Error syncing news deletion to API:", err));

    if (newsToDelete) {
      addLog(`Xóa tin tức: ${newsToDelete.title}`);
    }
  };

  // Bookings management
  const addBooking = (bInput: Omit<Booking, "id" | "status" | "createdAt">) => {
    const id = `LH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: Booking = {
      ...bInput,
      id,
      status: "Chờ xác nhận",
      createdAt: new Date().toISOString()
    };
    
    const updated = [newBooking, ...bookings];
    saveBookings(updated);

    // Also update/upsert patient list
    const existingPatient = patients.find(p => p.phone === bInput.phone || p.name.toLowerCase() === bInput.patientName.toLowerCase());
    if (existingPatient) {
      const updatedPatients = patients.map(p => p.id === existingPatient.id ? { ...p, visitCount: p.visitCount + 1 } : p);
      savePatients(updatedPatients);
    } else {
      const newPatient: Patient = {
        id: `P-${patients.length + 1}`,
        name: bInput.patientName,
        cccd: `04909${Math.floor(1000000 + Math.random() * 9000000)}`,
        phone: bInput.phone,
        visitCount: 1
      };
      savePatients([...patients, newPatient]);
    }

    // Call server API synchronously to keep in-memory server database in sync
    fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking)
    }).catch(err => console.log("Silent sync error with API backend:", err));

    addLogInternal(`Người bệnh ${newBooking.patientName} đăng ký lịch khám #${id}`, "Khách trực tuyến");
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    saveBookings(updated);
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      addLog(`Cập nhật trạng thái lịch hẹn #${id} thành: ${status}`);
    }
  };

  const updateBookingDetails = (updatedBooking: Booking) => {
    const updated = bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b);
    saveBookings(updated);
    addLog(`Cập nhật thông tin chi tiết lịch hẹn #${updatedBooking.id}`);
  };

  // Schedule management
  const updateScheduleShift = (doctorId: string, day: keyof Omit<DoctorSchedule, "doctorId" | "doctorName">, shift: "Ca Sáng" | "Ca Chiều" | "Nghỉ") => {
    const updated = schedules.map(s => {
      if (s.doctorId === doctorId) {
        return { ...s, [day]: shift };
      }
      return s;
    });
    saveSchedules(updated);
    const doctor = doctors.find(d => d.id === doctorId);
    const dayNamesVi: Record<string, string> = {
      monday: "Thứ Hai",
      tuesday: "Thứ Ba",
      wednesday: "Thứ Tư",
      thursday: "Thứ Năm",
      friday: "Thứ Sáu",
      saturday: "Thứ Bảy",
      sunday: "Chủ Nhật"
    };
    if (doctor) {
      addLog(`Cập nhật lịch trực của BS. ${doctor.name} ngày ${dayNamesVi[day]} thành: ${shift}`);
    }
  };

  return (
    <HospitalContext.Provider value={{
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
      addBooking,
      updateBookingStatus,
      updateBookingDetails,
      updateScheduleShift,
      addLog
    }}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
}
