import "./Auth.css";

export default function Settings({ theme, setTheme }) {
  return (
    <main className="auth-page">
      <div className="auth-card settings-card">
        <h1>Setări</h1>
        <p>Personalizează experiența ta în Smart Invoice Hub.</p>

        <form className="auth-form">
          <label>
            Temă:&nbsp;
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <label>
            Nume afișat:&nbsp;
            <input type="text" placeholder="Ex: Cristi" />
          </label>

          <label>
            Email:&nbsp;
            <input type="email" placeholder="email@example.com" />
          </label>

          <button type="button">Salvează setările</button>
        </form>
      </div>
    </main>
  );
}