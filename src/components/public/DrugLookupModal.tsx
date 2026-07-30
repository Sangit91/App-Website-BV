import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Pill, Search, AlertCircle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface DrugLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DrugResult {
  name: string;
  activeIngredient: string;
  dosage: string;
  price: string;
  covered: boolean;
  note?: string;
}

const MOCK_RESULTS: DrugResult[] = [
  { name: "Aspirin 100mg", activeIngredient: "Acid acetylsalicylic", dosage: "Viên", price: "500đ/viên", covered: true },
  { name: "Atorvastatin 20mg", activeIngredient: "Atorvastatin", dosage: "Viên", price: "2,500đ/viên", covered: true },
  { name: "Metformin 500mg", activeIngredient: "Metformin HCl", dosage: "Viên", price: "800đ/viên", covered: true, note: "Cần xét nghiệm đường huyết trước khi kê" },
  { name: "Amlodipin 5mg", activeIngredient: "Amlodipine", dosage: "Viên", price: "1,200đ/viên", covered: true },
  { name: "Omeprazole 20mg", activeIngredient: "Omeprazole", dosage: "Viên", price: "1,500đ/viên", covered: true },
];

export default function DrugLookupModal({ isOpen, onClose }: DrugLookupModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<DrugResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const filtered = MOCK_RESULTS.filter(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
    setIsSearching(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tra cứu thuốc BHYT" size="lg">
      <div className="space-y-6">
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-ink/70">
            <span className="font-semibold text-blue-600">Lưu ý:</span> Danh mục thuốc BHYT được cập nhật theo quy định của Bộ Y tế. Giá thuốc có thể thay đổi theo thời gian.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên thuốc hoặc hoạt chất..."
              className="w-full pl-11 pr-4 py-3 bg-cream-white border border-green-800/10 rounded-xl text-sm text-green-dark placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? "Đang tìm..." : "Tra cứu"}
          </Button>
        </form>

        {hasSearched && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink/60">
              {results.length} kết quả cho "{searchTerm}"
            </p>

            {results.length === 0 ? (
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 text-center">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-ink/70">Không tìm thấy thuốc phù hợp</p>
              </div>
            ) : (
              results.map((drug, idx) => (
                <motion.div
                  key={drug.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-4 border border-green-800/5 hover:border-brand-green/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-display font-bold text-green-dark">{drug.name}</h4>
                        {drug.covered && (
                          <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green text-[10px] font-bold rounded-full">
                            BHYT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink/60 mb-2">{drug.activeIngredient}</p>
                      <div className="flex items-center gap-4 text-xs text-ink/70">
                        <span>Quy cách: {drug.dosage}</span>
                        <span className="font-semibold text-green-dark">{drug.price}</span>
                      </div>
                      {drug.note && (
                        <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded-lg">
                          {drug.note}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-8 text-ink/50">
            <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nhập tên thuốc để tra cứu danh mục BHYT</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-green-800/5">
          <Button variant="secondary" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </Modal>
  );
}