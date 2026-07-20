import React, { ReactNode, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle, ChevronDown, Image, Type, AlignLeft, Hash, Calendar } from "lucide-react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

interface Field {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "image" | "number" | "date";
  placeholder?: string;
  description?: string;
  hint?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  suggestions?: string[];
  rows?: number;
  prefix?: string;
  suffix?: string;
  icon?: "text" | "image" | "link" | "number" | "date" | "list" | "info";
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

const iconMap = {
  text: Type,
  image: Image,
  link: Hash,
  number: Hash,
  date: Calendar,
  list: AlignLeft,
  info: HelpCircle
};

const fieldTypeIcons = {
  text: Type,
  textarea: AlignLeft,
  select: ChevronDown,
  image: Image,
  number: Hash,
  date: Calendar
};

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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleChange = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    setSuggestionIndex(-1);
  };

  const handleSuggestionClick = (fieldName: string, suggestion: string) => {
    handleChange(fieldName, suggestion);
    setFocusedField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: Field, suggestions?: string[]) => {
    if (!suggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSuggestionIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && suggestionIndex >= 0) {
      e.preventDefault();
      handleChange(field.name, suggestions[suggestionIndex]);
      setFocusedField(null);
    } else if (e.key === "Escape") {
      setFocusedField(null);
    }
  };

  useEffect(() => {
    if (suggestionIndex >= 0 && suggestionRefs.current[suggestionIndex]) {
      suggestionRefs.current[suggestionIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [suggestionIndex]);

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
  };

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  const getFieldIcon = (field: Field) => {
    const Icon = field.icon ? iconMap[field.icon] : (field.type ? fieldTypeIcons[field.type] : Type);
    return Icon;
  };

  const getPlaceholder = (field: Field) => {
    if (field.placeholder) return field.placeholder;
    const placeholders: Record<string, string> = {
      text: `Nhập ${field.label.toLowerCase()}`,
      textarea: `Mô tả chi tiết về ${field.label.toLowerCase()}`,
      image: "Dán URL hình ảnh (VD: /images/...)",
      number: "0",
      date: "YYYY-MM-DD"
    };
    return placeholders[field.type || "text"] || `Nhập ${field.label.toLowerCase()}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <div className="overflow-hidden">
        <div className="bg-gradient-to-r from-brand-green/5 to-emerald-5 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green/20 to-emerald-10 flex items-center justify-center">
                <HelpCircle size={20} className="text-brand-green" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-green-dark">{title}</h3>
                <p className="text-xs text-ink/50 mt-0.5">
                  {title.includes("Thêm") ? "Điền thông tin bên dưới" : "Cập nhật thông tin chính xác"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-green-800/10 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {fields.map((field, fieldIndex) => {
            const FieldIcon = getFieldIcon(field);
            const hasSuggestions = field.suggestions && field.suggestions.length > 0;
            const showSuggestions = focusedField === field.name && hasSuggestions;
            const currentSuggestions = showSuggestions ? field.suggestions || [] : [];

            return (
              <div key={field.name} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    errors[field.name] ? "bg-rose-50" : "bg-brand-green/5"
                  }`}>
                    <FieldIcon size={14} className={errors[field.name] ? "text-rose-500" : "text-brand-green"} />
                  </div>
                  <label className="text-xs font-bold text-green-dark">
                    {field.label}
                    {field.required && <span className="text-rose-500 ml-0.5">*</span>}
                  </label>
                  {field.description && (
                    <span className="text-[10px] text-ink/40 italic">({field.description})</span>
                  )}
                </div>

                <div className="relative">
                  {field.type === "textarea" ? (
                    <textarea
                      value={form[field.name] || ""}
                      onChange={e => handleChange(field.name, e.target.value)}
                      placeholder={getPlaceholder(field)}
                      rows={field.rows || 4}
                      className={`w-full px-4 py-3 text-sm border rounded-xl transition-all resize-none ${
                        errors[field.name]
                          ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/30"
                          : "border-green-800/10 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                      }`}
                    />
                  ) : field.type === "select" ? (
                    <div className="relative">
                      <select
                        value={form[field.name] || ""}
                        onChange={e => handleChange(field.name, e.target.value)}
                        className={`w-full px-4 py-3 text-sm border rounded-xl transition-all appearance-none cursor-pointer ${
                          errors[field.name]
                            ? "border-rose-300 focus:border-rose-500"
                            : "border-green-800/10 focus:border-brand-green"
                        } ${!form[field.name] ? "text-ink/40" : ""}`}
                      >
                        <option value="">{field.placeholder || "Chọn một giá trị..."}</option>
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  ) : field.type === "image" ? (
                    <div className="space-y-3">
                      {form[field.name] && (
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-brand-green/20 group">
                          <img
                            src={form[field.name]}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Xem trước</span>
                          </div>
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          value={form[field.name] || ""}
                          onChange={e => handleChange(field.name, e.target.value)}
                          placeholder={getPlaceholder(field)}
                          className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl transition-all ${
                            errors[field.name]
                              ? "border-rose-300 focus:border-rose-500"
                              : "border-green-800/10 focus:border-brand-green"
                          }`}
                        />
                        <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                        <HelpCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-blue-600/80 leading-relaxed">
                          Sử dụng ảnh local trong thư mục <code className="bg-blue-100 px-1 py-0.5 rounded">/images/...</code> hoặc dán URL từ trình duyệt
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {field.prefix && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink/40 bg-gray-50 px-2 py-1 rounded">
                          {field.prefix}
                        </span>
                      )}
                      <input
                        type={field.type || "text"}
                        value={form[field.name] || ""}
                        onChange={e => handleChange(field.name, e.target.value)}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                        onKeyDown={e => handleKeyDown(e, field, field.suggestions)}
                        placeholder={getPlaceholder(field)}
                        className={`w-full ${field.prefix ? "pl-14" : "pl-4"} ${field.suffix ? "pr-14" : "pr-4"} py-3 text-sm border rounded-xl transition-all ${
                          errors[field.name]
                            ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                            : "border-green-800/10 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                        }`}
                      />
                      {field.suffix && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink/40">
                          {field.suffix}
                        </span>
                      )}
                    </div>
                  )}

                  {errors[field.name] && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <HelpCircle size={12} className="text-rose-500" />
                      <p className="text-xs text-rose-500">{errors[field.name]}</p>
                    </div>
                  )}

                  {!errors[field.name] && field.hint && (
                    <p className="text-[11px] text-ink/40 mt-1.5">{field.hint}</p>
                  )}

                  {showSuggestions && currentSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-green-800/10 rounded-xl shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-green-800/5 bg-gray-50/50">
                        <p className="text-[10px] font-semibold text-ink/50 uppercase tracking-wider">
                          Gợi ý
                        </p>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {currentSuggestions.map((suggestion, idx) => (
                          <button
                            key={suggestion}
                            ref={el => suggestionRefs.current[idx] = el}
                            type="button"
                            onClick={() => handleSuggestionClick(field.name, suggestion)}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                              idx === suggestionIndex
                                ? "bg-brand-green/10 text-brand-green"
                                : "text-ink hover:bg-gray-50"
                            }`}
                          >
                            <span className="w-5 h-5 rounded bg-brand-green/10 flex items-center justify-center text-[10px] font-bold text-brand-green">
                              {idx + 1}
                            </span>
                            <span className="truncate">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {children && <div className="pt-2">{children}</div>}

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