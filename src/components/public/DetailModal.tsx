import { motion, AnimatePresence } from "motion/react";
import { X, Check, type LucideIcon } from "lucide-react";

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
            className="w-full max-w-2xl bg-cream-white rounded-[28px] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]"
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

            <div className="overflow-y-auto p-6 md:p-10 flex-grow bg-cream-white">
              <div className="max-w-xl mx-auto space-y-6">
                {image && (
                  <div className="w-full h-56 rounded-2xl overflow-hidden">
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
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-green-dark leading-tight">{title}</h1>
                    <div className="w-16 h-1 bg-brand-green rounded-full mt-3" />
                  </div>
                )}
                {items && (
                  <ul className="space-y-3">
                    {items.map((it, i) => (
                      <li key={it} className="flex items-start gap-3 text-ink text-[15px]">
                        <Check size={16} className="text-brand-green mt-0.5 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {description && (
                  <p className="text-ink text-[15px] leading-relaxed">{description}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100 shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold cursor-pointer transition-all"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
