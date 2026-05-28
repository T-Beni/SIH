import "./Help.css";

export default function Help() {
  return (
    <main className="help-page">
      <div className="help-card">
        <h1>Help</h1>
        <p>Ai nevoie de ajutor? Aici găsești informații utile despre platformă.</p>

        <div className="help-grid">
          <div>
            <h3>Încărcare facturi</h3>
            <p>Poți încărca facturi în format imagine sau PDF.</p>
          </div>

          <div>
            <h3>Plată facturi</h3>
            <p>După extragerea datelor, poți confirma plata facturii.</p>
          </div>

          <div>
            <h3>AI Chat</h3>
            <p>Poți întreba AI-ul detalii despre facturile tale.</p>
          </div>

          <div>
            <h3>Contact suport</h3>
            <p>Email: support@smartinvoicehub.ro</p>
          </div>
        </div>
      </div>
    </main>
  );
}