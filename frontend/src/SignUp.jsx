import { Link } from "react-router-dom";
import "./Auth.css";

export default function SignUp() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Sign Up</h1>

        <form className="auth-form">
          <input type="text" placeholder="Nume complet" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Parolă" />
          <input type="password" placeholder="Confirmă parola" />

          <button type="button">Creează cont</button>
        </form>

        <span className="auth-switch">
          Ai deja cont? <Link to="/login" className="signUpLink"> Login</Link>
        </span>
      </div>
    </main>
  );
}