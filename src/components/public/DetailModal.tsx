import { motion, AnimatePresence } from "motion/react";
import { X, Check, Phone, Calendar, type LucideIcon } from "lucide-react";
import { useSiteContent } from "../../context/SiteContentContext";
import { DEFAULT_CONTACT } from "../../data/siteContact";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerIcon: LucideIcon;
  headerLabel: string;
  title?: string;
  image?: string;
  items?: string[];
  description?: string;
}

export default function DetailModal({
  isOpen,
  onClose,
  headerIcon: HeaderIcon,
  headerLabel,
  title,
  image,
  items,
  description,
}: DetailModalProps) {
  const { getSection } = useSiteContent();
  const contact = getSection("contact", DEFAULT_CONTACT);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-cream-white rounded-[28px] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]"
          >
            <div className="bg-green-dark px-6 py-4 text-white flex justify-between items-center shrink-0 border-b border-brand-green/20">
              <div className="flex items-center gap-2">
                <HeaderIcon size={18} className="text-peach" />
                <span className="font-display font-bold text-sm tracking-wide text-gray-200">{headerLabel}</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Đóng"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-5 md:p-7 flex-grow bg-cream-white">
              <div className="max-w-xl mx-auto space-y-4">
                {image && (
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-green-800/5">
                    <img
                      src={image}
                      alt={title ?? ""}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                )}
                {title && (
                  <div>
                    <h1 className="font-display font-bold text-xl md:text-2xl text-green-dark leading-tight">{title}</h1>
                    <div className="w-16 h-1 bg-brand-green rounded-full mt-3" />
                  </div>
                )}
                {items && (
                  <ul className="space-y-3">
                    {items.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-ink text-sm md:text-[15px]">
                        <Check size={16} className="text-brand-green mt-0.5 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {description && (
                  <p className="text-ink text-sm md:text-[15px] leading-relaxed">{description}</p>
                )}

                <div className="bg-mint/40 border border-brand-green/10 rounded-xl p-4 flex items-start gap-2.5">
                  <Calendar size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <p className="text-sm text-green-dark font-medium leading-relaxed">
                    Để đặt lịch khám hoặc được tư vấn chi tiết, vui lòng liên hệ bệnh viện qua số hotline hoặc đến trực tiếp quầy tiếp nhận.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-end items-center gap-3 border-t border-gray-100 shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-green-800/20 text-green-dark text-xs font-bold hover:bg-green-800/5 transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <a
                href={`tel:${contact.hotline.replace(/\./g, "")}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green hover:bg-green-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Phone size={14} />
                Gọi Hotline: {contact.hotline}
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("bvdk:open-booking"))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green hover:bg-green-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Calendar size={14} />
                Đặt lịch khám
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}