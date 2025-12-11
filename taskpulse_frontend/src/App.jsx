import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import DashboardView from "./pages/Dashboard";
import "./styles/globals.css";

export default function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardView /> : <Login />;
}
