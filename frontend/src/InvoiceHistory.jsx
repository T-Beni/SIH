import { Link } from "react-router-dom";
import "./Invoice.css";

export default function InvoiceHistory() {
  const invoices = [
    {
      id: "INV-001",
      supplier: "Smart Energy SRL",
      date: "06.05.2026",
      total: "349,99 RON",
      status: "Plătită",
    },
    {
      id: "INV-002",
      supplier: "Orange România",
      date: "03.05.2026",
      total: "89,50 RON",
      status: "În așteptare",
    },
    {
      id: "INV-003",
      supplier: "Electrica Furnizare",
      date: "28.04.2026",
      total: "221,30 RON",
      status: "Procesată",
    },
  ];

  return (
    <main className="invoice-page">
      <div className="invoice-card">
        <h1>Istoric facturi</h1>
        <p>Vezi facturile încărcate și statusul lor.</p>

        <div className="invoice-list">
          {invoices.map((invoice) => (
            <Link
              to={`/invoice/${invoice.id}`}
              className="invoice-row"
              key={invoice.id}
            >
              <div>
                <strong>{invoice.supplier}</strong>
                <span>{invoice.id}</span>
              </div>

              <div>{invoice.date}</div>
              <div>{invoice.total}</div>
              <div className="invoice-status">{invoice.status}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}