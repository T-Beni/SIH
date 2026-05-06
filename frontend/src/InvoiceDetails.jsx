import { Link, useParams } from "react-router-dom";
import "./Invoice.css";

export default function InvoiceDetails() {
  const { id } = useParams();

  return (
    <main className="invoice-page">
      <div className="invoice-card invoice-template">
        <div className="invoice-header">
          <div>
            <h1>Factura {id}</h1>
            <p>Șablon pagină individuală factură</p>
          </div>

          <span className="invoice-status">Procesată</span>
        </div>

        <div className="invoice-grid">
          <div>
            <span>Furnizor</span>
            <strong>Smart Energy SRL</strong>
          </div>

          <div>
            <span>Client</span>
            <strong>Cristi B.</strong>
          </div>

          <div>
            <span>Data emiterii</span>
            <strong>06.05.2026</strong>
          </div>

          <div>
            <span>Scadență</span>
            <strong>15.05.2026</strong>
          </div>

          <div>
            <span>Total</span>
            <strong>349,99 RON</strong>
          </div>

          <div>
            <span>Status plată</span>
            <strong>Plătită</strong>
          </div>
        </div>

        <div className="invoice-section">
          <h3>Date extrase automat</h3>

          <table>
            <thead>
              <tr>
                <th>Descriere</th>
                <th>Cantitate</th>
                <th>Preț</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Servicii energie electrică</td>
                <td>1</td>
                <td>349,99 RON</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="invoice-actions">
          <button>Plătește factura</button>
          <Link to="/history">
            <button className="secondary-btn">Înapoi la istoric</button>
          </Link>
        </div>
      </div>
    </main>
  );
}