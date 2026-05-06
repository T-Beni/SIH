import { useEffect, useRef, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Terms from "./Terms.jsx";
import Privacy from "./Privacy.jsx";
import PerlinBackground from "./PerlinBackground.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import Settings from "./Settings.jsx";
import AIChat from "./AIChat.jsx";
import Profile from "./Profile.jsx";
import InvoiceHistory from "./InvoiceHistory.jsx";
import InvoiceDetails from "./InvoiceDetails.jsx";

import "./App.css";

function MobileInstallGate() {
  return (
    <main className="mobile-gate">
      <div className="mobile-gate-card">
        <h1>Instalează aplicația</h1>

        <p>
          Pentru a continua pe mobil, instalează aplicația Smart Invoice Hub.
        </p>

        <div className="store-buttons">
          <a href="https://play.google.com/store" target="_blank">
            Google Play
          </a>

          <a href="https://www.apple.com/app-store/" target="_blank">
            App Store
          </a>
        </div>
      </div>
    </main>
  );
}

function Home() {
  const [needsLogin, setNeedsLogin] = useState(false);
  const fileInputRef = useRef(null);

  const openFileWindow = () => {
    fileInputRef.current.click();
  };

  return (
    <main className="hero">
      <div className="card">
        <div className="inner">
          {!needsLogin ? (
            <>
              <h1>
                Smart <span>Invoice Hub</span>
              </h1>

              <p>
                Încarcă o factură, iar noi extragem datele și o plătim automat.
                <br />
                Rapid, sigur și eficient.
              </p>

              <div className="upload-box">
                <div className="icon">🗎</div>
                <div>Încarcă poze cu facturi</div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  style={{ display: "none" }}
                />

                <button onClick={openFileWindow}>Începe</button>
              </div>
            </>
          ) : (
            <>
              <h1>Autentificare necesară</h1>

              <p>
                Pentru a încărca și procesa facturi, trebuie să te conectezi.
                <br />
                Contul tău protejează datele și plățile tale.
              </p>

              <div className="upload-box">
                <div className="icon">🔒︎</div>

                <Link to="/login">
                  <button>Conectează-te</button>
                </Link>

                <button
                  className="secondary-btn"
                  onClick={() => setNeedsLogin(false)}
                >
                  Înapoi
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="footer-links">
        <div className="footer-nav">
          <Link to="/privacy">Politica de confidențialitate</Link>
          <span>•</span>
          <Link to="/terms">Termeni și condiții</Link>
        </div>

        <p>
          © 2026 Smart Invoice Hub. Toate drepturile asupra platformei sunt
          rezervate.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (isMobile) {
    return (
      <div className={`page ${theme === "dark" ? "dark" : "light"}`}>
        <PerlinBackground
          color1={theme === "dark" ? "#0B1E2A" : "#ffffff"}
          color2={theme === "dark" ? "#00111A" : "#C7EEFF"}
          resolution={10}
          noiseScale={0.025}
          speed={0.008}
          contrast={5}
          softness={0.6}
          fps={60}
        />

        <MobileInstallGate />
      </div>
    );
  }

  return (
    <div className={`page ${theme === "dark" ? "dark" : "light"}`}>
      <PerlinBackground
        color1={theme === "dark" ? "#0B1E2A" : "#ffffff"}
        color2={theme === "dark" ? "#00111A" : "#C7EEFF"}
        resolution={10}
        noiseScale={0.025}
        speed={0.008}
        contrast={5}
        softness={0.6}
        fps={60}
      />

      <nav className="navbar">
        <Link to="/" className="a">Home</Link>
        <Link to="/" className="a">Upload & Plată</Link>
        <Link to="/history" className="a">Istoric facturi</Link>
        <Link to="/chat" className="a">AI Chat</Link>
        <Link to="/settings" className="a">Setări</Link>
        <Link to="/login" className="a">Login</Link>
        <Link to="/profile" className="avatar"></Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/settings"
          element={<Settings theme={theme} setTheme={setTheme} />}
        />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<InvoiceHistory />} />
        <Route path="/invoice/:id" element={<InvoiceDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}
