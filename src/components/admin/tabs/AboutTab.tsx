import { Info, Users, Building2, Award, Handshake } from "lucide-react";
import { SectionCard, ItemCard, EditModal, ConfirmDialog } from "../ui";

export default function AboutTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Giới thiệu</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung trang Giới thiệu bệnh viện</p>
        </div>
      </div>

      <AboutSection />
      <LeadershipSection />
      <PartnersSection />
      <MilestonesSection />
    </div>
  );
}

function AboutSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Giới thiệu chung"
      description="Nội dung giới thiệu tổng quan về bệnh viện"
      icon={<Info size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="1 section"
      badgeColor="green"
      actions={
        <button className="p-1.5 rounded-lg bg-gray-100 hover:bg-brand-green/10 text-gray-500 hover:text-brand-green transition-colors cursor-pointer">
          <Settings size={14} />
        </button>
      }
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Nội dung giới thiệu chung...</p>
      </div>
    </SectionCard>
  );
}

function LeadershipSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Ban Lãnh đạo"
      description="Thông tin Giám đốc và các Phó Giám đốc"
      icon={<Users size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="3 người"
      badgeColor="blue"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách ban lãnh đạo...</p>
      </div>
    </SectionCard>
  );
}

function PartnersSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Đối tác"
      description="Logo và thông tin các đối tác của bệnh viện"
      icon={<Handshake size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="5 đối tác"
      badgeColor="amber"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách đối tác...</p>
      </div>
    </SectionCard>
  );
}

function MilestonesSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Cột mốc phát triển"
      description="Các cột mốc quan trọng trong lịch sử bệnh viện"
      icon={<Award size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="Timeline"
      badgeColor="purple"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách cột mốc...</p>
      </div>
    </SectionCard>
  );
}

import { useState } from "react";
import { Settings } from "lucide-react";