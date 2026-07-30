import React, { useState } from "react";
import { Search, ClipboardList, Printer, AlertTriangle, CheckCircle, HelpCircle, Loader2, X } from "lucide-react";
import { TestResult } from "../../types";

interface TestLookupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TestLookup({ isOpen, onClose }: TestLookupProps) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [searched, setSearched] = useState(false);

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setResult(null);
    setSearched(true);

    if (!code.trim()) {
      setErrorMsg("Vui lòng nhập mã kết quả xét nghiệm.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/test-results/${encodeURIComponent(code.trim().toUpperCase())}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Mã kết quả không tồn tại.");
      }
      setResult(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Không thể tìm thấy kết quả. Vui lòng kiểm tra lại mã chính xác.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-green-dark/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Lookup Card Panel */}
      <div className="relative bg-cream-white w-full max-w-[680px] rounded-[28px] shadow-2xl overflow-hidden border border-brand-green/20 max-h-[92vh] flex flex-col z-10 animate-scale-up">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-brand-green to-green-dark p-6 text-white shrink-0 flex justify-between items-center select-none">
          <div className="space-y-1 text-left">
            <span className="text-[10px] bg-peach px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Tra Cứu Thông Tin</span>
            <h2 className="font-display font-bold text-[20px] md:text-[22px] text-white">
              Cổng Tra Cứu Kết Quả Xét Nghiệm
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/15 text-mint transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Container Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left flex-grow">
          
          {/* Helper Guidelines Box */}
          <div className="bg-mint/40 border border-brand-green/10 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-green-dark flex items-center gap-1.5">
              <ClipboardList size={15} className="text-brand-green" />
              <span>Hướng dẫn tra cứu nhanh:</span>
            </h4>
            <p className="text-xs text-ink/75 leading-relaxed">
              Vui lòng nhập chính xác <strong>Mã kết quả xét nghiệm</strong> in trên phiếu chỉ định/phiếu thu hẹn trả kết quả để xem các chỉ số.
            </p>
            <div className="flex gap-2 pt-1 flex-wrap text-[11px] font-semibold text-brand-green">
              <span>Mã demo để trải nghiệm:</span>
              <button onClick={() => setCode("KQ-123456")} className="underline hover:text-peach cursor-pointer">KQ-123456</button>
              <span>hoặc</span>
              <button onClick={() => setCode("KQ-888888")} className="underline hover:text-peach cursor-pointer">KQ-888888</button>
            </div>
          </div>

          {/* Form lookup input */}
          <form onSubmit={handleLookupSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập mã kết quả (ví dụ: KQ-123456)..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-white border border-green-800/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green rounded-xl py-2.5 px-4 text-xs md:text-sm focus:outline-none text-ink font-sans font-semibold uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-brand-green hover:bg-brand-green/90 text-white font-sans text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow flex items-center gap-2 shrink-0 disabled:bg-brand-green/50"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              <span>Truy vấn</span>
            </button>
          </form>

          {/* Display error if lookup failed */}
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold p-4 rounded-xl border border-red-200 animate-fade-in flex gap-2 items-center">
              <AlertTriangle size={16} className="shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* DISPLAY TEST RESULT DOCUMENT IF FOUND */}
          {result && (
            <div id="printable-clinic-report" className="bg-white border-2 border-green-800/10 rounded-2xl p-6 shadow-md space-y-5 animate-fade-in text-[13px] relative select-text">
              
              {/* Report Header */}
              <div className="border-b-2 border-brand-green/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-left space-y-0.5">
                  <h4 className="font-display font-bold text-sm text-green-dark uppercase">BVĐK KV MIỀN NÚI PHÍA BẮC QUẢNG NAM</h4>
                  <p className="text-[10px] text-ink/50 font-semibold uppercase">Khoa Xét nghiệm & Chẩn đoán hình ảnh</p>
                </div>
                <div className="bg-mint text-brand-green px-3.5 py-1 rounded-full font-mono text-xs font-bold self-start">
                  MÃ KQ: {result.code}
                </div>
              </div>

              {/* Patient Profile Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs leading-tight font-sans border-b pb-4">
                <div>
                  <span className="text-ink/50 text-[10px] uppercase block">Bệnh nhân:</span>
                  <strong className="text-green-dark text-sm">{result.patientName}</strong>
                </div>
                <div>
                  <span className="text-ink/50 text-[10px] uppercase block">Năm sinh:</span>
                  <strong className="text-green-dark">{result.birthYear}</strong>
                </div>
                <div>
                  <span className="text-ink/50 text-[10px] uppercase block">Giới tính:</span>
                  <strong className="text-green-dark">{result.gender}</strong>
                </div>
                <div>
                  <span className="text-ink/50 text-[10px] uppercase block">Ngày thực hiện:</span>
                  <strong className="text-green-dark">{result.date}</strong>
                </div>
                <div className="col-span-2 pt-2">
                  <span className="text-ink/50 text-[10px] uppercase block">Bác sĩ chỉ định:</span>
                  <strong className="text-green-dark">{result.doctorName}</strong>
                </div>
                <div className="col-span-2 pt-2">
                  <span className="text-ink/50 text-[10px] uppercase block">Chuyên khoa khám:</span>
                  <strong className="text-brand-green">{result.specialty}</strong>
                </div>
              </div>

              {/* Diagnoses Statement Summary */}
              <div className="bg-mint/30 p-3.5 rounded-xl border border-brand-green/15 text-left space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-brand-green font-bold block">Chẩn đoán sơ bộ của bác sĩ:</span>
                <p className="text-xs font-bold text-green-dark">{result.diagnose}</p>
              </div>

              {/* Indicators Table */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] uppercase tracking-wider text-green-dark font-bold block">Bảng chi tiết chỉ số xét nghiệm:</span>
                
                <div className="border border-green-800/10 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left border-collapse font-sans">
                    <thead>
                      <tr className="bg-mint text-green-dark border-b border-green-800/10 font-bold">
                        <th className="py-2.5 px-3">Tên xét nghiệm</th>
                        <th className="py-2.5 px-3">Kết quả</th>
                        <th className="py-2.5 px-3">Trị số bình thường</th>
                        <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-800/5 bg-white">
                      {result.indicators.map((ind, idx) => {
                        let statusColor = "bg-green-100 text-green-700";
                        let statusText = "Bình thường";
                        if (ind.status === "high") {
                          statusColor = "bg-red-100 text-red-600 font-bold";
                          statusText = "Tăng cao ↑";
                        } else if (ind.status === "low") {
                          statusColor = "bg-blue-100 text-blue-600 font-bold";
                          statusText = "Giảm thấp ↓";
                        }

                        return (
                          <tr key={ind.name} className="hover:bg-mint/10">
                            <td className="py-2.5 px-3 font-semibold text-ink">{ind.name}</td>
                            <td className={`py-2.5 px-3 ${ind.status !== "normal" ? "text-red-500 font-bold" : "text-ink font-semibold"}`}>{ind.value}</td>
                            <td className="py-2.5 px-3 text-ink/75">{ind.range}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${statusColor}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor Advises & Note Box */}
              <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-200/50 text-left space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-peach font-bold block">Lời khuyên điều trị từ bác sĩ chuyên khoa:</span>
                <p className="text-xs text-ink/85 leading-relaxed font-semibold italic">{result.notes}</p>
              </div>

              {/* Print Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5 shrink-0 select-none">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-white border border-green-800/20 text-green-dark hover:bg-mint font-sans text-xs font-bold py-2 px-4 rounded-full cursor-pointer transition-colors"
                >
                  <Printer size={13} />
                  <span>In báo cáo kết quả</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
