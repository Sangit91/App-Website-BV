import React from "react";
import { MapPin, Mail, Clock, Phone } from "lucide-react";
import { useSiteContent } from "../../context/SiteContentContext";
import { DEFAULT_CONTACT } from "../../data/siteContact";

export default function Topbar() {
  const { getSection } = useSiteContent();
  const contact = getSection("contact", DEFAULT_CONTACT);

  return (
    <div id="hospital-topbar" className="bg-green-dark text-mint text-xs py-2 border-b border-green-800/30 hidden md:block">
      <div className="max-w-[1180px] mx-auto px-4 flex justify-between items-center">
        {/* Left Info */}
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors duration-200">
            <MapPin size={14} className="text-peach" />
            <span>{contact.address}</span>
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors duration-200">
            <Mail size={14} className="text-peach" />
            <span>{contact.email}</span>
          </span>
        </div>

        {/* Right Info */}
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-brand-green" />
            <span>{contact.workingHours}</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium text-peach">
            <span className="inline-block w-2 h-2 rounded-full bg-peach animate-pulse"></span>
            <span>{contact.emergencyHours}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
