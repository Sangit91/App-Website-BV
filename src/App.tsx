import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GioiThieuPage from "./pages/GioiThieuPage";
import ChuyenKhoaPage from "./pages/ChuyenKhoaPage";
import DichVuPage from "./pages/DichVuPage";
import ChoBenhNhanPage from "./pages/ChoBenhNhanPage";
import TinTucPage from "./pages/TinTucPage";
import SoDoToChucPage from "./pages/SoDoToChucPage";
import ThongTinThauPage from "./pages/ThongTinThauPage";
import LienHePage from "./pages/LienHePage";
import AdminPage from "./pages/AdminPage";
import ErrorBoundary from "./components/ui/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gioi-thieu" element={<GioiThieuPage />} />
          <Route path="/chuyen-khoa" element={<ChuyenKhoaPage />} />
          <Route path="/dich-vu" element={<DichVuPage />} />
          <Route path="/thong-tin-thau" element={<ThongTinThauPage />} />
          <Route path="/dich-vu/thong-tin-thau" element={<ThongTinThauPage />} />
          <Route path="/cho-benh-nhan" element={<ChoBenhNhanPage />} />
          <Route path="/tin-tuc" element={<TinTucPage />} />
          <Route path="/so-do-to-chuc" element={<SoDoToChucPage />} />
          <Route path="/lien-he" element={<LienHePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}