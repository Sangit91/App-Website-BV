import React from "react";
import { MapPin, Mail, Clock, Phone } from "lucide-react";

export default function Topbar() {
  return (
    <div id="hospital-topbar" className="bg-green-dark text-mint text-xs py-2 border-b border-green-800/30 hidden md:block">
      <div className="max-w-[1180px] mx-auto px-4 flex justify-between items-center">
        {/* Left Info */}
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors duration-200">
            <MapPin size={14} className="text-peach" />
            <span>107 Quang Trung - xã Đại Lộc - thành phố Đà Nẵng</span>
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors duration-200">
            <Mail size={14} className="text-peach" />
            <span>bvdkbacquangnam@gmail.com</span>
          </span>
        </div>

        {/* Right Info */}
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-brand-green" />
            <span>Hành chính: 07:00 - 17:00 (Thứ 2 - Thứ 6)</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium text-peach">
            <span className="inline-block w-2 h-2 rounded-full bg-peach animate-pulse"></span>
            <span>Cấp cứu: 24/7</span>
          </span>
        </div>
      </div>
    </div>
  );
}
