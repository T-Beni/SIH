import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Auth.css";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuthSuccess = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
    navigate("/");
  };

  const validateLogin = () => {
    if (!email.trim() || !password.trim()) {
      return "Completează toate câmpurile.";
    }

    if (email.length < 5) {
      return "Emailul este prea scurt.";
    }

    if (!email.includes("@") || !email.includes(".")) {
      return "Adresa de email este invalidă.";
    }

    return "";
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Bine ai revenit!</h1>

        {error && <div className="auth-error">{error}</div>}

        <form
          className="auth-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");

            const validationError = validateLogin();

            if (validationError) {
              setError(validationError);
              return;
            }

            const response = await fetch("http://localhost:5000/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
              setError("Emailul sau parola este greșită.");
              return;
            }

            handleAuthSuccess(data);
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p>sau</p>

        <div className="google-auth-wrapper">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const response = await fetch("http://localhost:5000/api/auth/google", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  credential: credentialResponse.credential,
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                setError("Autentificarea cu Google a eșuat.");
                return;
              }

              handleAuthSuccess(data);
            }}
            onError={() => {
              setError("Autentificarea cu Google a eșuat.");
            }}
          />
        </div>

        <span className="auth-switch">
          Nu ai cont?{" "}
          <Link to="/signup" className="signUpLink">
            Sign Up
          </Link>
        </span>
      </div>
    </main>
  );
}