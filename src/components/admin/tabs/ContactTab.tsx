import { useState } from "react";
import { Phone, MapPin, Mail, Link2 } from "lucide-react";
import { SectionCard } from "../ui";

export default function ContactTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Liên hệ / Footer</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật thông tin liên hệ và Footer</p>
        </div>
      </div>

      <ContactInfoSection />
      <FooterLinksSection />
      <MapSection />
    </div>
  );
}

function ContactInfoSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Thông tin liên hệ"
      description="Địa chỉ, số điện thoại, email"
      icon={<Phone size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="Cơ bản"
      badgeColor="green"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Thông tin liên hệ bệnh viện...</p>
      </div>
    </SectionCard>
  );
}

function FooterLinksSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Liên kết Footer"
      description="Các liên kết nhanh trong Footer"
      icon={<Link2 size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="Links"
      badgeColor="blue"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách liên kết Footer...</p>
      </div>
    </SectionCard>
  );
}

function MapSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Bản đồ"
      description="Google Maps embed"
      icon={<MapPin size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="Map"
      badgeColor="amber"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Google Maps iframe...</p>
      </div>
    </SectionCard>
  );
}