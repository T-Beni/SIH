import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Invoice.css";

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Trebuie să fii conectat pentru a vedea istoricul facturilor.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Nu am putut încărca facturile.");
          setLoading(false);
          return;
        }

        setInvoices(data);
      } catch {
        setError("Serverul nu este disponibil.");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  return (
    <main className="invoice-page">
      <div className="invoice-card">
        <h1>Istoric facturi</h1>
        <p>Vezi facturile încărcate și statusul lor.</p>

        {loading && <p>Se încarcă facturile...</p>}

        {error && <div className="auth-error">{error}</div>}

        {!loading && !error && invoices.length === 0 && (
          <p>Nu ai nicio factură încărcată momentan.</p>
        )}

        {!loading && !error && invoices.length > 0 && (
          <div className="invoice-list">
            {invoices.map((invoice) => (
              <Link
                to={`/invoice/${invoice.id}`}
                className="invoice-row"
                key={invoice.id}
              >
                <div>
                  <strong>{invoice.supplier_name || "Furnizor necunoscut"}</strong>
                  <span>{invoice.invoice_number || invoice.id}</span>
                </div>

                <div>
                  {invoice.issue_date
                    ? new Date(invoice.issue_date).toLocaleDateString("ro-RO")
                    : "-"}
                </div>

                <div>
                  {invoice.total_amount
                    ? `${invoice.total_amount} ${invoice.currency || "RON"}`
                    : "-"}
                </div>

                <div className="invoice-status">
                  {invoice.status || "uploaded"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}