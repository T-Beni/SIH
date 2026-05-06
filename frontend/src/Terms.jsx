import "./Auth.css";

export default function Terms() {
  return (
    <main className="auth-page">
      <div className="auth-card text-card">
        <h1>Termeni și Condiții</h1>

        <p>
          Prin utilizarea platformei Smart Invoice Hub, ești de acord cu acești
          termeni și condiții.
        </p>

        <div className="legal-text">
          <h3>1. Utilizarea platformei</h3>
          <p>
            Platforma permite încărcarea facturilor, extragerea datelor și
            pregătirea plăților într-un mod automatizat.
          </p>

          <h3>2. Responsabilitatea utilizatorului</h3>
          <p>
            Utilizatorul este responsabil pentru corectitudinea documentelor
            încărcate și pentru verificarea datelor înainte de plată.
          </p>

          <h3>3. Limitarea răspunderii</h3>
          <p>
            Smart Invoice Hub nu este responsabil pentru erori cauzate de
            documente incomplete, ilizibile sau introduse greșit.
          </p>

          <h3>4. Modificări</h3>
          <p>
            Ne rezervăm dreptul de a modifica acești termeni atunci când este
            necesar.
          </p>
        </div>
      </div>
    </main>
  );
}