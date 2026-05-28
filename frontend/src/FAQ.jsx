import "./Help.css";

export default function FAQ() {
  return (
    <main className="help-page">
      <div className="help-card">
        <h1>FAQ</h1>
        <p>Întrebări frecvente despre Smart Invoice Hub.</p>

        <div className="faq-list">
          <div>
            <h3>Ce tipuri de fișiere pot încărca?</h3>
            <p>Poți încărca imagini și fișiere PDF.</p>
          </div>

          <div>
            <h3>Pot plăti factura automat?</h3>
            <p>Da, după verificarea datelor extrase, poți confirma plata.</p>
          </div>

          <div>
            <h3>Datele mele sunt în siguranță?</h3>
            <p>Da, platforma este gândită pentru protejarea datelor personale și financiare.</p>
          </div>

          <div>
            <h3>Pot vedea istoricul facturilor?</h3>
            <p>Da, în pagina „Istoric facturi”.</p>
          </div>
        </div>
      </div>
    </main>
  );
}