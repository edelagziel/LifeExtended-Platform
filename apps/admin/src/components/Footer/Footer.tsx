import "./Footer.css";

function getCurrentYear() {
  return new Date().getFullYear();
}

export default function Footer() {
  const year = getCurrentYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo"></span>
          <span className="footer-text">LifeExtended</span>
        </div>
        
        <div className="footer-copyright">
          © {year} LifeExtended. All rights reserved.
        </div>

        <div className="footer-links">
          <a href="#privacy" className="footer-link">Privacy</a>
          <a href="#terms" className="footer-link">Terms</a>
          <a href="#contact" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
}
