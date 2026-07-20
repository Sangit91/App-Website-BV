import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation, X } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ isOpen, onClose }: MapModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cơ sở điều trị" size="lg">
      <div className="space-y-6">
        <div className="bg-mint/30 rounded-2xl p-4 border border-brand-green/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-brand-green/20 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <h4 className="font-display font-bold text-green-dark">Bệnh Viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam</h4>
              <p className="text-sm text-ink/70 mt-1">107 Quang Trung, Xã Đại Lộc, Thành Phố Đà Nẵng</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-green-800/5 h-[300px] overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8!2d108.2!3d16.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTY!5e0!3m2!1svi!2s!4v1"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bệnh viện Đa Khoa Khu Vực Miền Núi Phía Bắc Quảng Nam"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cream-white rounded-xl p-4 border border-green-800/5">
            <div className="flex items-center gap-2 text-sm text-ink/70 mb-1">
              <Phone size={14} className="text-brand-green" />
              <span className="font-semibold text-green-dark">Hotline</span>
            </div>
            <p className="text-lg font-bold text-green-dark">1900 xxxx</p>
          </div>
          <div className="bg-cream-white rounded-xl p-4 border border-green-800/5">
            <div className="flex items-center gap-2 text-sm text-ink/70 mb-1">
              <Clock size={14} className="text-brand-green" />
              <span className="font-semibold text-green-dark">Giờ làm việc</span>
            </div>
            <p className="text-sm font-medium text-green-dark">Thứ 2 - Thứ 6: 7:00 - 17:00</p>
            <p className="text-sm text-ink/60">Cấp cứu: 24/7</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
          <Button variant="secondary" onClick={onClose}>Đóng</Button>
          <Button onClick={() => window.open("https://maps.google.com", "_blank")}>
            <Navigation size={16} />
            <span>Mở Google Maps</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}