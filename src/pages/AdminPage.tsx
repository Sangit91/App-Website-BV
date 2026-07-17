import { useNavigate } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard";

export default function AdminPage() {
  const navigate = useNavigate();

  const handleCloseAdmin = () => {
    navigate("/");
  };

  return <AdminDashboard onClose={handleCloseAdmin} />;
}