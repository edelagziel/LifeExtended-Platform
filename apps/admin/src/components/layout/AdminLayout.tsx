import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Footer from "../Footer/Footer";

export default function AdminLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AdminNavbar />
      <main style={{ flex: 1, padding: "24px" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
