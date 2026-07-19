import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, ExternalLink } from "lucide-react";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "video" | "auto";
}

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-video",
  auto: ""
};

export default function ImageUploader({
  value,
  onChange,
  label = "Hình ảnh",
  aspectRatio = "auto"
}: ImageUploaderProps) {
  const [preview, setPreview] = useState(value || "");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = (url: string) => {
    if (!url.trim()) return;
    setPreview(url);
    onChange(url);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setPreview(result);
            onChange(result);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-bold text-green-dark">
          {label}
        </label>
      )}

      {preview ? (
        <div className={`relative ${aspectClasses[aspectRatio]} max-w-sm rounded-xl overflow-hidden border border-green-800/10 group`}>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setPreview("");
                onChange("");
              }}
              className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white cursor-pointer"
            >
              <X size={18} />
            </button>
            <a
              href={preview}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white cursor-pointer"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const url = e.dataTransfer.getData("text/uri-list");
            if (url) handleUrlSubmit(url);
          }}
          onPaste={handlePaste}
          className={`max-w-sm border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-brand-green bg-brand-green/5"
              : "border-green-800/20 hover:border-brand-green/50 hover:bg-cream-white"
          }`}
        >
          <div className="w-14 h-14 bg-cream-white rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ImageIcon size={28} className="text-brand-green/60" />
          </div>
          <p className="text-sm text-ink/70 font-medium mb-1">Kéo thả hình ảnh vào đây</p>
          <p className="text-xs text-ink/50 mb-3">hoặc dán URL hình ảnh bên dưới</p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 text-xs border border-green-800/10 rounded-lg focus:border-brand-green focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUrlSubmit((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button
              onClick={() => {
                const input = inputRef.current?.previousElementSibling as HTMLInputElement;
                if (input?.value) handleUrlSubmit(input.value);
              }}
              className="px-4 py-2 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-brand-green/90 cursor-pointer"
            >
              <Upload size={14} />
            </button>
          </div>

          <p className="text-[10px] text-ink/40 mt-3">
            Hỗ trợ: JPG, PNG, GIF, WebP • Kéo thả hoặc Ctrl+V để dán
          </p>
        </div>
      )}
    </div>
  );
}