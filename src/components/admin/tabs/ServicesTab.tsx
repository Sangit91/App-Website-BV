import { useState } from "react";
import { Briefcase, List, DollarSign, FileText } from "lucide-react";
import { SectionCard, ItemCard, EditModal } from "../ui";

export default function ServicesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-green-dark">Quản lý Dịch vụ</h2>
          <p className="text-sm text-ink/60 mt-1">Cập nhật nội dung trang Dịch vụ bệnh viện</p>
        </div>
      </div>

      <ServiceCategoriesSection />
      <ServiceItemsSection />
    </div>
  );
}

function ServiceCategoriesSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Danh mục dịch vụ"
      description="Các loại dịch vụ của bệnh viện (Khám bệnh, Xét nghiệm, CĐHA...)"
      icon={<List size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="4 danh mục"
      badgeColor="green"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách danh mục dịch vụ...</p>
      </div>
    </SectionCard>
  );
}

function ServiceItemsSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <SectionCard
      title="Chi tiết dịch vụ"
      description="Các dịch vụ cụ thể trong từng danh mục"
      icon={<FileText size={20} />}
      enabled={enabled}
      onEnabledChange={setEnabled}
      badge="Nhiều items"
      badgeColor="blue"
    >
      <div className="p-5">
        <p className="text-sm text-ink/70">Danh sách chi tiết dịch vụ...</p>
      </div>
    </SectionCard>
  );
}