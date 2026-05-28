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
import Help from "./Help.jsx";
import FAQ from "./FAQ.jsx";

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

function Home({ user }) {
  const [needsLogin, setNeedsLogin] = useState(false);
  const [uploadedInvoice, setUploadedInvoice] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="48px"
    viewBox="0 -960 960 960"
    width="48px"
    fill="#0078c2"
  >
    <path d="M255.38-120q-23.05 0-39.22-16.16Q200-152.33 200-175.38v-609.24q0-23.05 16.16-39.22Q232.33-840 255.38-840h301.16q11.67 0 22.18 4.62 10.51 4.61 18.51 11.84l146.31 146.31q7.23 8 11.84 18.51 4.62 10.51 4.62 22.18v255q0 6.58-4.46 10.98-4.46 4.41-11.11 4.41-6.66 0-10.93-4.41-4.27-4.4-4.27-10.98V-640H587.69q-11.96 0-19.82-7.87-7.87-7.86-7.87-19.82v-141.54H255.38q-9.23 0-16.92 7.69-7.69 7.69-7.69 16.92v609.24q0 9.23 7.69 16.92 7.69 7.69 16.92 7.69h363.08q6.58 0 10.98 4.46 4.41 4.46 4.41 11.11 0 6.66-4.41 10.93-4.4 4.27-10.98 4.27H255.38Zm480-122.38v119.61q0 6.58-4.45 10.98-4.46 4.41-11.12 4.41-6.66 0-10.93-4.41-4.26-4.4-4.26-10.98v-144.92q0-11.96 7.86-19.83 7.87-7.86 19.83-7.86h144.92q6.58 0 10.98 4.45 4.41 4.46 4.41 11.12 0 6.66-4.41 10.93-4.4 4.26-10.98 4.26H756.62L889-132.23q4.38 4.38 4.38 10.62 0 6.23-3.99 10.77-4.88 4.99-11.52 4.61-6.65-.39-11.1-4.77L735.38-242.38Zm-504.61 91.61v-658.46 658.46Z" />
  </svg>

  <div>Încarcă poze cu facturi</div>

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={async (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("invoice", file);

      setUploading(true);
      setUploadedInvoice(null);

      try {
        const response = await fetch("http://localhost:5000/api/invoices/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        setUploadedInvoice(data);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    }}
  />

  <button
    disabled={uploading}
    onClick={() => {
      if (!user) {
        setNeedsLogin(true);
        return;
      }

      fileInputRef.current.click();
    }}
  >
    {uploading ? "Se scanează..." : "Încarcă"}
  </button>

  {uploadedInvoice && (
    <div className="upload-success">
      <p>Factura scanată cu succes.</p>

      <Link to={`/invoice/${uploadedInvoice.id}`}>
        <button>Vezi detaliile facturii</button>
      </Link>
    </div>
  )}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48px"
                  viewBox="0 -960 960 960"
                  width="48px"
                  fill="#0078c2"
                >
                  <path d="M355.38-597.08h249.24v-86.37q0-52.86-36.35-89.32-36.35-36.46-88.27-36.46-51.92 0-88.27 36.46-36.35 36.46-36.35 89.32v86.37ZM255.38-120q-23 0-39.19-16.19Q200-152.38 200-175.38v-366.31q0-23 16.19-39.19 16.19-16.2 39.19-16.2h69.24v-86.07q0-66.45 45-111.65T480-840q65.38 0 110.38 45.2t45 111.65v86.07h69.24q23 0 39.19 16.2Q760-564.69 760-541.69v40.54q0 7.57-4.85 11.36-4.84 3.79-10.35 3.79t-10.54-3.85q-5.03-3.84-5.03-11.53v-40.31q0-10.77-6.92-17.69-6.93-6.93-17.69-6.93H255.38q-10.76 0-17.69 6.93-6.92 6.92-6.92 17.69v366.31q0 10.76 6.92 17.69 6.93 6.92 17.69 6.92h265.7q6.57 0 10.98 4.46 4.4 4.46 4.4 11.11 0 6.66-4.4 10.93-4.41 4.27-10.98 4.27h-265.7Zm-24.61-215.54V-150.77v-415.54V-335.54Zm533.9 57.32q18.41-18.45 18.41-44.81 0-26.35-18.42-44.59-18.42-18.23-44.74-18.23-26.73 0-44.82 18.41-18.1 18.4-18.1 44.69t18.05 44.63q18.05 18.35 44.63 18.35 26.59 0 44.99-18.45Zm13.79 129.8q27.08-14.73 45.08-40.2-24.46-14-50.14-21.73t-53.31-7.73q-27.63 0-53.86 7.73t-49.92 21.73q17.09 25.55 44.48 40.24 27.39 14.69 58.99 14.69t58.68-14.73Zm-169.54 4.27q-45.84-45.85-45.84-110.5t45.84-111q45.85-46.35 111-46.35 65.16 0 111 46.35 45.85 46.35 45.85 111t-45.85 110.5q-45.84 45.84-111 45.84-65.15 0-111-45.84Z" />
                </svg>

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
  const [user, setUser] = useState(null);
const [loadingUser, setLoadingUser] = useState(true);
const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
};

useEffect(() => {
  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingUser(false);
      return;
    }

    const response = await fetch("http://localhost:5000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data);
    } else {
      localStorage.removeItem("token");
    }

    setLoadingUser(false);
  };

  loadUser();
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
        <Link to="/" className="a">
          Home
        </Link>
        <Link to="/" className="a">
          Upload & Plată
        </Link>
        <Link to="/history" className="a">
          Istoric facturi
        </Link>
        <Link to="/chat" className="a">
          AI Chat
        </Link>
        <Link to="/settings" className="a">
          Setări
        </Link>
        <Link to="/help" className="a">
        Help
        </Link>
        <Link to="/faq" className="a">
        FAQ
        </Link>
        {user ? (
  <button className="logout-btn" onClick={logout}>
    Logout
  </button>
) : (
  <Link to="/login" className="a">
    Login
  </Link>
)}
<Link
  to="/profile"
  className="avatar"
  style={{
    backgroundImage: user?.avatar_url ? `url(${user.avatar_url})` : "none",
  }}
></Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
<Route path="/profile" element={<Profile user={user} />} />
<Route path="/login" element={<Login setUser={setUser} />} />
<Route path="/signup" element={<SignUp setUser={setUser} />} />
        <Route
          path="/settings"
          element={<Settings theme={theme} setTheme={setTheme} />}
        />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/history" element={<InvoiceHistory />} />
        <Route path="/invoice/:id" element={<InvoiceDetails />} />
        <Route path="/help" element={<Help />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </div>
  );
}
