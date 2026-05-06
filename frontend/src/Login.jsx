import { Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Bine ai revenit</h1>

        <form className="auth-form">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Parolă" />

          <button type="button">Login</button>
        </form>

        <span className="auth-switch">
          Nu ai cont? <Link to="/signup" className="signUpLink"> Sign Up</Link>
        </span>
      </div>
    </main>
  );
}