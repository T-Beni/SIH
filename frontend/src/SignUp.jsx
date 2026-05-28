import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Auth.css";

export default function SignUp({ setUser }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuthSuccess = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
    navigate("/");
  };

  const validateSignUp = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      return "Completează toate câmpurile.";
    }

    if (email.length < 5) {
      return "Emailul este prea scurt.";
    }

    if (!email.includes("@") || !email.includes(".")) {
      return "Adresa de email este invalidă.";
    }

    if (password.length < 6) {
      return "Parola trebuie să aibă cel puțin 6 caractere.";
    }

    if (password !== confirmPassword) {
      return "Parolele nu coincid.";
    }

    return "";
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Hai să începem!</h1>

        {error && <div className="auth-error">{error}</div>}

        <form
          className="auth-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");

            const validationError = validateSignUp();

            if (validationError) {
              setError(validationError);
              return;
            }

            const response = await fetch("http://localhost:5000/api/auth/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
              setError(data.message || "Contul nu a putut fi creat.");
              return;
            }

            handleAuthSuccess(data);
          }}
        >
          <input
            type="text"
            placeholder="Nume complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <input
            type="password"
            placeholder="Confirmă parola"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Creează cont</button>
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
          Ai deja cont?{" "}
          <Link to="/login" className="signUpLink">
            Login
          </Link>
        </span>
      </div>
    </main>
  );
}