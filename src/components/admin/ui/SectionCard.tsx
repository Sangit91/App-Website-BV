import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Eye, EyeOff, Settings } from "lucide-react";
import { Button } from "../../ui";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  badge?: string;
  badgeColor?: "green" | "blue" | "amber" | "rose" | "purple";
  actions?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

const badgeColors = {
  green: "bg-brand-green/10 text-brand-green border-brand-green/20",
  blue: "bg-brand-green/10 text-brand-green border-brand-green/20",
  amber: "bg-peach/10 text-peach border-peach/20",
  rose: "bg-red-50 text-red-600 border-red-200",
  purple: "bg-green-dark/5 text-green-dark border-green-dark/20"
};

export default function SectionCard({
  title,
  description,
  icon,
  enabled = true,
  onEnabledChange,
  badge,
  badgeColor = "green",
  actions,
  children,
  defaultExpanded = true
}: SectionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border overflow-hidden transition-all ${
        enabled ? "border-green-800/10 shadow-sm" : "border-gray-200 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between p-5 border-b border-green-800/5 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-green-dark">{title}</h3>
              {badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColors[badgeColor]}`}>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-ink/60 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onEnabledChange && (
            <button
              onClick={() => onEnabledChange(!enabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                enabled
                  ? "bg-brand-green/10 text-brand-green hover:bg-brand-green/20"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {enabled ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>{enabled ? "Hiển thị" : "Ẩn"}</span>
            </button>
          )}

          {actions && (
            <div className="flex items-center gap-1">
              {actions}
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={!enabled ? "pointer-events-none select-none" : ""}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}