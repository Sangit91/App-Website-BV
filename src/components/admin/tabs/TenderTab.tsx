import { useState } from "react";
import { FileText, Download, Calendar, DollarSign } from "lucide-react";
import { SectionCard } from "../ui";

export default function TenderTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Thông tin thầu</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật thông tin đấu thầu và mua sắm công</p>
        </div>
      </div>

      <TenderNoticesSection />
      <DepartmentsSection />
    </div>
  );
}

function TenderNoticesSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Thông báo thầu"
      description="Danh sách các thông báo mời thầu"
      icon={<FileText size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="Thông báo"
      badgeColor="green"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách thông báo thầu...</p>
      </div>
    </SectionCard>
  );
}

function DepartmentsSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Phòng ban tham gia"
      description="Các phòng ban liên quan đến công tác đấu thầu"
      icon={<Calendar size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="Phòng ban"
      badgeColor="blue"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách phòng ban...</p>
      </div>
    </SectionCard>
  );
}