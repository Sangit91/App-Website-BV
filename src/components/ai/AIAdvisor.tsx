import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, AlertCircle, Heart, User, ArrowRight, Loader2, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

interface AIAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export default function AIAdvisor({ isOpen, onClose, onOpenBooking }: AIAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "Xin chào! Tôi là **Bác sĩ Trợ lý Ảo** của Bệnh viện Đa khoa Khu vực Miền núi Phía Bắc Quảng Nam. 🌸\n\nTôi có thể hỗ trợ giải đáp các thắc mắc chung về bệnh học, tư vấn chế độ dinh dưỡng, cách phòng ngừa dịch bệnh vùng cao và hướng dẫn quy trình đăng ký khám tại bệnh viện.\n\n*Lưu ý: Tôi chỉ cung cấp thông tin mang tính chất tham khảo, không thay thế cho chẩn đoán chuyên môn trực tiếp của bác sĩ lâm sàng.* Bạn có câu hỏi nào hôm nay?",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const samplePrompts = [
    { title: "Phòng ngừa sốt xuất huyết", text: "Làm sao phòng ngừa bệnh sốt xuất huyết ở khu vực của chúng ta?" },
    { title: "Dấu hiệu bệnh tim mạch", text: "Những dấu hiệu cảnh báo bệnh tim mạch nguy hiểm là gì?" },
    { title: "Dinh dưỡng sau sinh", text: "Chế độ dinh dưỡng khoa học nhất cho sản phụ sau khi sinh em bé?" }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const newUserMsg: Message = {
      id: userMsgId,
      role: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Gather chat history for context (up to last 6 messages)
      const chatHistory = messages
        .filter(m => m.id !== "welcome")
        .slice(-6)
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const response = await fetch("/api/v1/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: chatHistory
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gặp lỗi kết nối");
      }

      const modelMsgId = `model-${Date.now()}`;
      const newModelMsg: Message = {
        id: modelMsgId,
        role: "model",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, newModelMsg]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Đường truyền kết nối AI bị gián đoạn.";
      const errorMsgId = `error-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          role: "model",
          text: "⚠️ Rất tiếc, đường truyền kết nối AI bị gián đoạn. Hãy thử lại hoặc nhấn vào liên kết Đặt lịch hẹn khám ngay dưới chân màn hình chat để đặt khám trực tiếp với bác sĩ nhé.",
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: "Xin chào! Tôi là **Bác sĩ Trợ lý Ảo** của Bệnh viện Đa khoa Khu vực Miền núi Phía Bắc Quảng Nam. 🌸\n\nTôi có thể hỗ trợ giải đáp các thắc mắc chung về bệnh học, tư vấn chế độ dinh dưỡng, cách phòng ngừa dịch bệnh vùng cao và hướng dẫn quy trình đăng ký khám tại bệnh viện.\n\n*Lưu ý: Tôi chỉ cung cấp thông tin mang tính chất tham khảo, không thay thế cho chẩn đoán chuyên môn trực tiếp của bác sĩ lâm sàng.* Bạn có câu hỏi nào hôm nay?",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  // Helper to format text with simple markdown-like double stars for bolding
  const formatMessageText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Bold handling
      let formattedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const italicRegex = /\*(.*?)\*/g;
      
      // Simple replace with span styled blocks
      const parts = [];
      let lastIndex = 0;
      let match;

      // Handle simple list styles
      const isBullet = line.trim().startsWith("-") || line.trim().startsWith("*");
      
      // Basic bold and italic text parsing for safe rendering
      return (
        <p key={`line-${idx}`} className={`leading-relaxed text-xs md:text-sm ${isBullet ? "pl-4 list-disc" : ""} mb-2`}>
          {line.split("**").map((chunk, cIdx) => {
            if (cIdx % 2 === 1) {
              return <strong key={cIdx} className="text-green-dark font-bold">{chunk}</strong>;
            }
            return chunk.split("*").map((subChunk, sIdx) => {
              if (sIdx % 2 === 1) {
                return <em key={sIdx} className="italic text-ink/90">{subChunk}</em>;
              }
              return subChunk;
            });
          })}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-green-dark/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Main Chat Panel (Radius Large - 28px) */}
      <div className="relative bg-cream-white w-full max-w-[550px] h-[580px] md:h-[640px] rounded-[28px] shadow-2xl overflow-hidden border border-brand-green/20 flex flex-col z-10 animate-scale-up">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-brand-green via-[#228e51] to-green-dark p-4 shrink-0 text-white flex justify-between items-center select-none">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-brand-green shadow-inner">
              <Sparkles size={18} className="fill-brand-green text-brand-green" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-display font-bold text-[16px] text-white">Bác Sĩ Trợ Lý Ảo (AI)</h3>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-peach animate-ping"></span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-peach absolute"></span>
              </div>
              <p className="text-[10px] text-mint/85">Cổng tư vấn trực tuyến Bệnh viện</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={handleResetChat}
              title="Làm mới cuộc hội thoại"
              className="p-1.5 rounded-full hover:bg-white/10 text-mint transition-colors cursor-pointer"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-mint transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Safety Disclaimer Warning line */}
        <div className="bg-peach/15 text-[11px] text-peach px-4 py-2 flex items-center gap-2 border-b border-peach/10 select-none text-left font-semibold">
          <AlertCircle size={14} className="shrink-0" />
          <span>Lưu ý: Tư vấn AI chỉ hỗ trợ định hướng bệnh lý sơ bộ. Không thay thế chẩn đoán lâm sàng!</span>
        </div>

        {/* Chat Window Areas (Scrollable) */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-cream-white flex flex-col">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                msg.role === "user" ? "self-end flex-row-reverse" : "self-start"
              }`}
            >
              {/* Avatar indicator */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                msg.role === "user" ? "bg-peach/20 text-peach" : "bg-mint text-brand-green"
              }`}>
                {msg.role === "user" ? <User size={14} /> : <Heart size={14} className="fill-brand-green" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1 text-left">
                <div className={`p-4 rounded-[20px] shadow-sm text-ink ${
                  msg.role === "user"
                    ? "bg-peach/15 border border-peach/20 rounded-tr-none"
                    : "bg-white border border-green-800/5 rounded-tl-none"
                }`}>
                  {formatMessageText(msg.text)}
                </div>
                <span className="text-[9px] text-ink/40 font-bold px-1.5 block">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5 max-w-[80%] self-start">
              <div className="w-8 h-8 rounded-xl bg-mint text-brand-green flex items-center justify-center shrink-0 animate-bounce">
                <Sparkles size={14} className="animate-pulse" />
              </div>
              <div className="bg-white border border-green-800/5 p-4 rounded-[20px] rounded-tl-none shadow-sm flex items-center space-x-2 text-xs text-ink/70">
                <Loader2 size={13} className="animate-spin text-brand-green" />
                <span>Bác sĩ ảo đang phân tích sức khỏe...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Prompts Tray (Only visible when chat has only welcome msg) */}
        {messages.length === 1 && (
          <div className="p-4 bg-white/50 border-t shrink-0 space-y-2 text-left select-none">
            <p className="text-[10px] uppercase tracking-wide text-brand-green font-bold flex items-center gap-1">
              <span>💡 Thử hỏi Bác sĩ ảo:</span>
            </p>
            <div className="grid grid-cols-1 gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={p.title}
                  onClick={() => handleSendMessage(p.text)}
                  className="w-full text-left bg-white hover:bg-mint border border-green-800/10 p-2.5 rounded-xl text-xs text-green-dark hover:text-brand-green font-semibold flex justify-between items-center cursor-pointer group transition-colors shadow-sm"
                >
                  <span>{p.title}</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-green" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Form */}
        <div className="p-4 bg-white border-t shrink-0">
          <form onSubmit={handleSubmitForm} className="flex gap-2">
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="Nhập câu hỏi sức khỏe hoặc mô tả triệu chứng của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-cream-white border border-green-800/20 focus:border-brand-green focus:outline-none rounded-xl px-4 py-2.5 text-xs md:text-sm text-ink font-sans font-semibold disabled:bg-mint/30"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-brand-green hover:bg-brand-green/90 disabled:bg-brand-green/50 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>

          {/* Booking Referral link */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-brand-green">
            <span>Bạn muốn khám chuyên khoa?</span>
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="text-peach hover:underline cursor-pointer"
            >
              Đặt lịch trực tiếp tại đây!
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
