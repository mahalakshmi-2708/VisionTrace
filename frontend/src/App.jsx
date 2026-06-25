import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Alerts from "./pages/Alerts.jsx";
import Analytics from "./pages/Analytics.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Upload from "./pages/Upload.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<Upload />} />
        <Route path="history" element={<History />} />
        <Route path="analytics/:sessionId?" element={<Analytics />} />
        <Route path="alerts/:sessionId?" element={<Alerts />} />
      </Route>
    </Routes>
  );
}
