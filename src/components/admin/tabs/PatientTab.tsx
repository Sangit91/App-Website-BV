import { useState } from "react";
import { Heart, FileText, List, HelpCircle } from "lucide-react";
import { SectionCard } from "../ui";

export default function PatientTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Cho bệnh nhân</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung trang Hướng dẫn bệnh nhân</p>
        </div>
      </div>

      <ProcessSection />
      <WhatToBringSection />
      <GuidesSection />
    </div>
  );
}

function ProcessSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Quy trình khám bệnh"
      description="Các bước khám bệnh theo thứ tự"
      icon={<Heart size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="6 bước"
      badgeColor="green"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách các bước quy trình...</p>
      </div>
    </SectionCard>
  );
}

function WhatToBringSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Giấy tờ cần mang theo"
      description="Danh sách giấy tờ bệnh nhân cần chuẩn bị"
      icon={<FileText size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="Items"
      badgeColor="amber"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách giấy tờ cần mang...</p>
      </div>
    </SectionCard>
  );
}

function GuidesSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Hướng dẫn"
      description="Các bài hướng dẫn chi tiết cho bệnh nhân"
      icon={<List size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="Guides"
      badgeColor="blue"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách hướng dẫn...</p>
      </div>
    </SectionCard>
  );
}