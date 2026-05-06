import "./Auth.css";

export default function Privacy() {
  return (
    <main className="auth-page">
      <div className="auth-card text-card">
        <h1>Politica de Confidențialitate</h1>

        <p>
          Confidențialitatea datelor tale este importantă pentru Smart Invoice
          Hub.
        </p>

        <div className="legal-text">
          <h3>1. Date colectate</h3>
          <p>
            Putem colecta nume, email, date din facturi și informații necesare
            procesării plăților.
          </p>

          <h3>2. Utilizarea datelor</h3>
          <p>
            Datele sunt folosite pentru autentificare, procesarea facturilor și
            îmbunătățirea serviciilor oferite.
          </p>

          <h3>3. Securitate</h3>
          <p>
            Aplicăm măsuri tehnice pentru protejarea datelor încărcate în
            platformă.
          </p>

          <h3>4. Drepturile utilizatorului</h3>
          <p>
            Utilizatorul poate solicita accesarea, modificarea sau ștergerea
            datelor personale.
          </p>
        </div>
      </div>
    </main>
  );
}