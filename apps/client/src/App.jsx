import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home/Home.tsx";
import { ProfileForm } from "./components/form";
import ResearchFeed from "./components/Researchitem/ResearchFeed.jsx";
import RegisterPage from "./pages/Register/RegisterPage";
import LoginPage from "./pages/Login/LoginPage";
import ConfirmPage from "./pages/Confirm/ConfirmPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ThemeBodyClass from "./components/ThemeBodyClass";
import { UserProvider } from "./context/UserContext.tsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import SurveyPage from "./features/survey/SurveyPage";


import "./main.css";

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/register" || location.pathname === "/login" || location.pathname === "/confirm";

  return (
    <div className="app-shell">
      {!hideNavbar && <Navbar />}

      <main className="app-main">
        <Routes>
              {/* ברירת מחדל */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* ציבורי */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/confirm" element={<ConfirmPage />} />

              {/* מוגן */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
            <Route
                path="/survey"
                element={
                  <ProtectedRoute>
                    <SurveyPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/form"
                element={
                  <ProtectedRoute>
                    <ProfileForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/api"
                element={
                  <ProtectedRoute>
                    <ResearchFeed />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<h1>404 – Page not found</h1>} />
            </Routes>
          </main>

          <Footer />
        </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        {/* side-effect גלובלי: theme על ה-body */}
        <ThemeBodyClass />
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
