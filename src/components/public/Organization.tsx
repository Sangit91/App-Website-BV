import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, ShieldCheck, Landmark, GitFork, X, PhoneCall, Info, Layers, ChevronDown } from "lucide-react";

interface Member {
  name: string;
  title: string;
  role: string;
  image: string;
  quote: string;
  email: string;
}

interface DeptNode {
  id: string;
  name: string;
  leader: string;
  phone: string;
  staffCount: number;
  description: string;
  details?: string;
}

interface Division {
  id: string;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  bgLight: string;
  textColor: string;
  departments: DeptNode[];
}

const iconMap: Record<string, React.ReactNode> = {
  Landmark: <Landmark size={18} />,
  Users: <Users size={18} />,
  Layers: <Layers size={18} />
};

export default function Organization() {
  const [selectedDept, setSelectedDept] = useState<DeptNode | null>(null);
  const [activeDivision, setActiveDivision] = useState<string>("clinical");
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const [divisions, setDivisions] = useState<Record<string, Division>>({});
  const [loading, setLoading] = useState(true);
  const INITIAL_DISPLAY = 6;

  useEffect(() => {
    fetch("/api/organization")
      .then(res => res.json())
      .then(data => {
        setDivisions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch organization:", err);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (division: string) => {
    setIsExpanded(prev => ({ ...prev, [division]: !prev[division] }));
  };

  const directors: Member[] = [
    {
      name: "PGS. TS. BS. Tráº§n VÄƒn TrÃ¬nh",
      title: "Tháº§y thuá»‘c NhÃ¢n dÃ¢n - GiÃ¡m Ä‘á»‘c Bá»‡nh viá»‡n",
      role: "Chá»‰ Ä‘áº¡o chung, phá»¥ trÃ¡ch Chiáº¿n lÆ°á»£c phÃ¡t triá»ƒn, NhÃ¢n sá»± cáº¥p cao vÃ  Há»£p tÃ¡c quá»‘c táº¿.",
      image: "/images/components/org-1.jpeg",
      quote: "Äáº·t y Ä‘á»©c vÃ  sá»± hÃ i lÃ²ng cá»§a bá»‡nh nhÃ¢n lÃ m kim chá»‰ nam cho má»i hoáº¡t Ä‘á»™ng Ä‘iá»u trá»‹.",
      email: "tranvantrinh.director@mnpb.gov.vn"
    },
    {
      name: "BSCKII. Nguyá»…n Thá»‹ Minh Tuyáº¿t",
      title: "Tháº§y thuá»‘c Æ¯u tÃº - PhÃ³ GiÃ¡m Ä‘á»‘c LÃ¢m sÃ ng",
      role: "Phá»¥ trÃ¡ch chuyÃªn mÃ´n Ä‘iá»u trá»‹, Äá»™i ngÅ© Y bÃ¡c sÄ©, Há»™i Ä‘á»“ng Khoa há»c vÃ  Kiá»ƒm soÃ¡t nhiá»…m khuáº©n.",
      image: "/images/components/org-2.jpeg",
      quote: "Cháº¥t lÆ°á»£ng lÃ¢m sÃ ng quyáº¿t Ä‘á»‹nh sá»± sá»‘ng cÃ²n vÃ  uy tÃ­n cá»§a má»™t cÆ¡ sá»Ÿ y táº¿.",
      email: "minhtuyet.clinical@mnpb.gov.vn"
    },
    {
      name: "ThS. BS. LÃª Phan Quá»‘c Báº£o",
      title: "PhÃ³ GiÃ¡m Ä‘á»‘c Káº¿ hoáº¡ch - HÃ nh chÃ­nh & Váº­t tÆ°",
      role: "Phá»¥ trÃ¡ch cÆ¡ sá»Ÿ váº­t cháº¥t, Trang thiáº¿t bá»‹ y táº¿ hiá»‡n Ä‘áº¡i, CÃ´ng nghá»‡ thÃ´ng tin vÃ  CÃ´ng tÃ¡c xÃ£ há»™i.",
      image: "/images/components/org-3.jpeg",
      quote: "Háº¡ táº§ng hiá»‡n Ä‘áº¡i, quy trÃ¬nh tinh gá»n lÃ  bá»‡ Ä‘á»¡ vá»¯ng cháº¯c cho cÃ¡c y bÃ¡c sÄ© cá»©u ngÆ°á»i.",
      email: "quocbao.admin@mnpb.gov.vn"
    }
];

  return (
    <section id="gioi-thieu" className="py-20 bg-cream-white border-b border-green-800/10 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-mint/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-peach/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-[1180px] mx-auto px-4 text-center">
        {/* Header Title */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-[#EAF7EE] text-[#164B36] font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#2FA968]/20 mb-4">
            <Landmark size={13} className="text-[#2FA968]" /> Uy TÃ­n & TrÃ¡ch Nhiá»‡m
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-green-dark tracking-tight mb-4">
            CÆ¡ Cáº¥u Tá»• Chá»©c & Ban GiÃ¡m Äá»‘c
          </h2>
          <p className="font-sans text-ink text-sm md:text-base leading-relaxed">
            Há»‡ thá»‘ng quáº£n lÃ½ lÃ¢m sÃ ng hiá»‡n Ä‘áº¡i, chuyÃªn nghiá»‡p cÃ¹ng tinh tháº§n táº­n hiáº¿n háº¿t mÃ¬nh vÃ¬ Ä‘á»“ng bÃ o miá»n nÃºi phÃ­a Báº¯c Quáº£ng Nam. ChÃºng tÃ´i cam káº¿t mang láº¡i quy trÃ¬nh chÄƒm sÃ³c khÃ©p kÃ­n, y Ä‘á»©c sÃ¡ng ngá»i.
          </p>
        </div>

        {/* SECTION 1: BAN GIÃM Äá»C */}
        <div className="mb-24">
          <div className="flex items-center justify-center gap-2 mb-10">
            <span className="w-8 h-px bg-[#2FA968]"></span>
            <h3 className="font-display font-bold text-xl md:text-2xl text-green-dark">Ban GiÃ¡m Äá»‘c Bá»‡nh Viá»‡n</h3>
            <span className="w-8 h-px bg-[#2FA968]"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {directors.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-green-800/[0.04] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left h-full"
              >
                {/* Photo container */}
                <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90"></div>
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="text-[#FFA265] text-xs font-bold font-sans uppercase tracking-wider mb-1">
                      {member.title.split(" - ")[0]}
                    </p>
                    <h4 className="font-display font-bold text-lg text-white leading-snug">
                      {member.name}
                    </h4>
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded bg-[#EAF7EE] text-[#164B36] font-sans font-bold text-[11px] mb-3">
                      {member.title.split(" - ")[1] || "Ban GiÃ¡m Äá»‘c"}
                    </span>
                    <p className="font-sans text-ink text-[13px] leading-relaxed mb-4">
                      {member.role}
                    </p>
                  </div>
                  
                  {/* Quote bubble & Contact */}
                  <div className="pt-4 border-t border-green-800/10">
                    <p className="font-sans italic text-[12.5px] text-[#164B36] mb-3 leading-relaxed relative pl-4 border-l-2 border-[#2FA968]">
                      "{member.quote}"
                    </p>
                    <p className="font-mono text-[11px] text-gray-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-peach"></span>
                      {member.email}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 2: SÆ  Äá»’ Tá»” CHá»¨C (INTERACTIVE TREE DIAGRAM) */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-8 h-px bg-[#2FA968]"></span>
            <h3 className="font-display font-bold text-xl md:text-2xl text-green-dark">SÆ¡ Ä‘á»“ tá»• chá»©c Bá»‡nh viá»‡n</h3>
            <span className="w-8 h-px bg-[#2FA968]"></span>
          </div>
          <p className="font-sans text-gray-600 text-[13.5px] max-w-2xl mx-auto mb-10">
            Há»‡ thá»‘ng tá»• chá»©c gá»“m 3 khá»‘i: HÃ nh chÃ­nh (9 phÃ²ng/ban), LÃ¢m sÃ ng (21 khoa) vÃ  Cáº­n lÃ¢m sÃ ng (6 khoa). Click chá»n khá»‘i Ä‘á»ƒ xem chi tiáº¿t cÃ¡c Ä‘Æ¡n vá»‹ vÃ  liÃªn há»‡ ná»™i bá»™.
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-10 h-10 border-4 border-[#2FA968] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-ink/60 font-sans text-sm">Äang táº£i dá»¯ liá»‡u tá»• chá»©c...</span>
            </div>
          ) : Object.keys(divisions).length === 0 ? (
            <div className="text-center py-16 text-ink/40">
              <p>KhÃ´ng cÃ³ dá»¯ liá»‡u tá»• chá»©c</p>
            </div>
          ) : (
          <>
          {/* Division Select Buttons (Warm Green theme) */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {Object.entries(divisions).map(([key, value]) => {
              const isActive = activeDivision === key;
              const div = value as Division;
              return (
                <button
                  key={key}
                  onClick={() => setActiveDivision(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-[13.5px] font-bold cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? "bg-green-dark text-[#EAF7EE] shadow-md border-transparent scale-105"
                      : "bg-white text-ink border-green-800/10 hover:border-[#2FA968] hover:bg-[#EAF7EE]"
                  }`}
                >
                  <span className={`${isActive ? "text-[#FFA265]" : "text-[#2FA968]"}`}>
                    {iconMap[div.icon] || <Users size={18} />}
                  </span>
                  <span>{div.name}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Org Tree Grid */}
          <div className="relative bg-white border border-green-800/10 rounded-[28px] p-6 md:p-10 shadow-sm max-w-[1000px] mx-auto overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#EAF7EE] text-[#164B36] font-mono text-[10px] font-bold py-1 px-3.5 rounded-bl-xl border-l border-b border-green-800/10 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#2FA968] rounded-full animate-ping"></span>
              CÆ¡ cáº¥u Ä‘á»™ng 2026
            </div>

            {/* Tree root (GiÃ¡m Äá»‘c & Ban giÃ¡m Ä‘á»‘c) */}
            <div className="flex flex-col items-center mb-10">
              <div className="bg-gradient-to-r from-green-dark to-[#1f5b43] text-white py-3.5 px-8 rounded-2xl shadow-md border border-[#2FA968]/30 inline-flex flex-col items-center max-w-[280px]">
                <span className="font-sans text-[11px] text-[#FFA265] uppercase font-bold tracking-wider mb-0.5">BÃ¡o cÃ¡o tá»‘i cao</span>
                <span className="font-display font-bold text-sm text-center">Ban GiÃ¡m Äá»‘c Bá»‡nh Viá»‡n</span>
                <span className="font-sans text-[11px] text-gray-300 mt-1">SÃ¡t sao chuyÃªn mÃ´n - Uy tÃ­n cá»™ng Ä‘á»“ng</span>
              </div>
              
              {/* Connector lines */}
              <div className="w-0.5 h-8 bg-[#2FA968]/30 my-1"></div>
              <div className="w-[80%] md:w-[60%] h-px bg-[#2FA968]/30"></div>
            </div>

            {/* Dynamic Child Nodes depending on Active Division */}
            <div className="relative">
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {(isExpanded[activeDivision] 
                    ? divisions[activeDivision].departments 
                    : divisions[activeDivision].departments.slice(0, INITIAL_DISPLAY)
                  ).map((dept, index) => (
                    <motion.button
                      key={dept.id}
                      layout
                      onClick={() => setSelectedDept(dept)}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ 
                        duration: 0.35, 
                        delay: isExpanded[activeDivision] ? (index - INITIAL_DISPLAY) * 0.04 : index * 0.05,
                        layout: { duration: 0.4, ease: "easeOut" }
                      }}
                      className="group bg-[#FCFBF7] border border-green-800/10 hover:border-[#2FA968] rounded-2xl p-5 text-left hover:shadow-lg hover:shadow-[#2FA968]/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full cursor-pointer"
                    >
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-[#EAF7EE]/40 group-hover:bg-[#2FA968]/10 rounded-full transition-all duration-500 group-hover:scale-150 group-hover:right-[-20px] group-hover:bottom-[-20px]"></div>
                      
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`inline-block py-0.5 px-2 rounded-md font-sans font-bold text-[10px] text-white ${divisions[activeDivision].color}`}>
                            {divisions[activeDivision].name.split(" ")[1] || "Khá»‘i"}
                          </span>
                          <Info size={14} className="text-[#2FA968] opacity-40 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                        
                        <h4 className="font-display font-bold text-[14.5px] text-green-dark group-hover:text-[#2FA968] transition-colors leading-snug mb-2">
                          {dept.name}
                        </h4>
                        <p className="font-sans text-gray-500 text-[12.5px] line-clamp-2 leading-relaxed mb-4">
                          {dept.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-green-800/[0.06] flex justify-between items-center text-[12px] font-sans">
                        <span className="text-gray-600 font-medium">TrÆ°á»Ÿng khoa: <span className="text-[#164B36] font-bold">{dept.leader.replace("BSCKII. ", "").replace("BSCKI. ", "").replace("ThS. BS. ", "").replace("DS. CKI. ", "").replace("ThS. ", "")}</span></span>
                        <span className="text-gray-400 font-mono text-[11px] bg-white border border-gray-100 px-1.5 py-0.5 rounded">
                          {dept.staffCount} NS
                        </span>
                      </div>
                    </motion.button>
                  ))}
                  
                  {/* Show More / Show Less button */}
                  {divisions[activeDivision].departments.length > INITIAL_DISPLAY && (
                    <motion.button
                      layout
                      onClick={() => toggleExpand(activeDivision)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="col-span-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-[#EAF7EE] to-[#d5f2dd] hover:from-[#d5f2dd] hover:to-[#c8ebe0] border-2 border-[#2FA968]/30 hover:border-[#2FA968] text-brand-green hover:text-green-dark font-bold text-[13px] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <motion.span
                        animate={{ rotate: isExpanded[activeDivision] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                      <span className="transition-all duration-300">
                        {isExpanded[activeDivision] 
                          ? "Thu gá»n danh sÃ¡ch" 
                          : `Xem thÃªm ${divisions[activeDivision].departments.length - INITIAL_DISPLAY} khoa/phÃ²ng`
                        }
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Decorative corner element */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#EAF7EE]/20 to-transparent rounded-bl-[40px] -z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#FFA265]/10 to-transparent rounded-tr-[40px] -z-10 pointer-events-none"></div>
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      {/* DETAILED DEPARTMENT MODAL */}
      <AnimatePresence>
        {selectedDept && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-[#2FA968]/20 rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl text-left"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-dark to-[#123e2d] px-6 py-5 text-white flex justify-between items-center relative">
                <div>
                  <p className="text-[#FFA265] text-[11px] font-sans font-bold uppercase tracking-widest mb-1">
                    CÆ¡ cáº¥u tá»• chá»©c Bá»‡nh viá»‡n
                  </p>
                  <h3 className="font-display font-bold text-lg md:text-xl leading-tight">
                    {selectedDept.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDept(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 font-sans">
                {/* Description */}
                <div className="bg-[#EAF7EE] border-l-4 border-[#2FA968] p-4 rounded-r-xl">
                  <h4 className="font-display font-bold text-[13px] text-[#164B36] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Layers size={13} className="text-[#2FA968]" /> Chá»©c nÄƒng cá»‘t lÃµi
                  </h4>
                  <p className="text-ink text-[13.5px] leading-relaxed">
                    {selectedDept.description}
                  </p>
                </div>

                {/* Extended Details */}
                {selectedDept.details && (
                  <div className="space-y-1">
                    <h5 className="font-display font-bold text-[13px] text-green-dark">ThÃ´ng tin bá»• sung</h5>
                    <p className="text-gray-600 text-[13px] leading-relaxed">
                      {selectedDept.details}
                    </p>
                  </div>
                )}

                {/* Leadership & Personnel statistics */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-green-800/10 text-[13.5px]">
                  <div>
                    <span className="text-gray-400 block text-[11px] uppercase font-bold tracking-wider mb-0.5">LÃ£nh Ä‘áº¡o Ä‘Æ¡n vá»‹</span>
                    <span className="text-[#164B36] font-bold font-display">{selectedDept.leader}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px] uppercase font-bold tracking-wider mb-0.5">NhÃ¢n sá»± hiá»‡n táº¡i</span>
                    <span className="text-green-dark font-bold font-display">{selectedDept.staffCount} Y bÃ¡c sÄ© & Äiá»u dÆ°á»¡ng</span>
                  </div>
                </div>

                {/* Contact information */}
                <div className="bg-[#FCFBF7] border border-green-800/10 p-3.5 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EAF7EE] text-[#2FA968] flex items-center justify-center shrink-0">
                    <PhoneCall size={16} />
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">ÄÆ°á»ng dÃ¢y nÃ³ng khoa phÃ²ng</span>
                    <span className="text-green-dark font-mono font-bold text-[13px]">{selectedDept.phone}</span>
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={() => setSelectedDept(null)}
                  className="px-5 py-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold cursor-pointer transition-all duration-200"
                >
                  ÄÃ³ng láº¡i
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
