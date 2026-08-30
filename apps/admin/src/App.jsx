import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "./pages/Register/RegisterPage";
import Navbar from "./components/Navbar";
import ThemeBodyClass from "./components/ThemeBodyClass";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Footer from "./components/Footer/Footer";

import "./main.css";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ThemeBodyClass />

        <div className="app-shell">
          <Navbar />

          <main className="app-main">
            <Routes>
              {/* ברירת מחדל */}
              <Route path="/" element={<Navigate to="/register" replace />} />

              {/* ציבורי */}
              <Route path="/register" element={<RegisterPage />} />

              {/* מוגן */}
              <Route element={<ProtectedRoute />}>
                {/* כאן יבואו כל הדפים שצריכים Footer */}
                <Route path="/dashboard" element={<h1>Dashboard</h1>} />
                <Route path="/live" element={<h1>Live</h1>} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<h1>404 – Page not found</h1>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
