import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

interface Field {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "image" | "number" | "date";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  title: string;
  fields: Field[];
  initialData?: Record<string, any>;
  size?: "sm" | "md" | "lg" | "xl";
  children?: ReactNode;
}

export default function EditModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  initialData = {},
  size = "md",
  children
}: EditModalProps) {
  const [form, setForm] = useState<Record<string, any>>(
    fields.reduce((acc, field) => {
      acc[field.name] = initialData[field.name] ?? "";
      return acc;
    }, {} as Record<string, any>)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !form[field.name]?.toString().trim()) {
        newErrors[field.name] = `${field.label} là bắt buộc`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(form);
    onClose();
  };

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-lg text-green-dark">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-xs font-bold text-green-dark mb-1.5">
                {field.label}
                {field.required && <span className="text-rose-500 ml-0.5">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={form[field.name] || ""}
                  onChange={e => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows || 4}
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl transition-all resize-none ${
                    errors[field.name]
                      ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                      : "border-green-800/10 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                  }`}
                />
              ) : field.type === "select" ? (
                <select
                  value={form[field.name] || ""}
                  onChange={e => handleChange(field.name, e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl transition-all ${
                    errors[field.name]
                      ? "border-rose-300 focus:border-rose-500"
                      : "border-green-800/10 focus:border-brand-green"
                  }`}
                >
                  <option value="">{field.placeholder || "Chọn..."}</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === "image" ? (
                <div className="space-y-2">
                  {form[field.name] && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-green-800/10">
                      <img
                        src={form[field.name]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={form[field.name] || ""}
                    onChange={e => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder || "URL hình ảnh"}
                    className={`w-full px-4 py-2.5 text-sm border rounded-xl transition-all ${
                      errors[field.name]
                        ? "border-rose-300 focus:border-rose-500"
                        : "border-green-800/10 focus:border-brand-green"
                    }`}
                  />
                  <p className="text-[10px] text-ink/50">Nhập URL hình ảnh hoặc dán từ trình duyệt</p>
                </div>
              ) : (
                <input
                  type={field.type || "text"}
                  value={form[field.name] || ""}
                  onChange={e => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl transition-all ${
                    errors[field.name]
                      ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                      : "border-green-800/10 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                  }`}
                />
              )}

              {errors[field.name] && (
                <p className="text-xs text-rose-500 mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {children}

          <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" size="md">
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}