import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { GripVertical, Edit, Trash2, Eye } from "lucide-react";

interface ItemCardProps {
  key?: React.Key;
  title: string;
  description?: string;
  image?: string;
  icon?: ReactNode;
  imageAlt?: string;
  actions?: {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
  };
  draggable?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  index?: number;
}

export default function ItemCard({
  title,
  description,
  image,
  icon,
  imageAlt = "",
  actions,
  draggable = false,
  children,
  footer,
  index = 0
}: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white border border-green-800/5 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-green/20 transition-all duration-300"
    >
      <div className="flex">
        {draggable && (
          <div className="w-8 bg-gray-50 border-r border-green-800/5 flex flex-col items-center justify-center gap-1 py-3 shrink-0">
            <GripVertical size={14} className="text-gray-400 cursor-grab" />
          </div>
        )}

        {image && (
          <div className="relative w-28 h-28 shrink-0 overflow-hidden bg-gray-50">
            <img
              src={image}
              alt={imageAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {icon && !image && (
          <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
            <div className="text-brand-green/40">{icon}</div>
          </div>
        )}

        <div className="flex-grow p-4 min-w-0">
          <h4 className="font-display font-bold text-sm text-green-dark truncate">{title}</h4>
          {description && (
            <p className="text-xs text-ink/60 mt-1 line-clamp-2">{description}</p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>

        {actions && (
          <div className="flex flex-col border-l border-green-800/5 shrink-0">
            {actions.onView && (
              <button
                onClick={actions.onView}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                title="Xem"
              >
                <Eye size={16} />
              </button>
            )}
            {actions.onEdit && (
              <button
                onClick={actions.onEdit}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-brand-green hover:bg-brand-green/5 transition-colors cursor-pointer"
                title="Sửa"
              >
                <Edit size={16} />
              </button>
            )}
            {actions.onDelete && (
              <button
                onClick={actions.onDelete}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Xóa"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {footer && (
        <div className="px-4 py-3 bg-gray-50/50 border-t border-green-800/5">
          {footer}
        </div>
      )}
    </motion.div>
  );
}