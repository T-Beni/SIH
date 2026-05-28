import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Invoice.css";

export default function InvoiceDetails() {
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const payInvoice = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    window.location.href = data.url;
  };
  
  const payInvoiceAutomatically = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/pay-saved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      invoiceId: invoice.id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(data.message);
    alert(data.message);
    return;
  }

  alert("Factura a fost plătită automat.");
  window.location.reload();
};

  useEffect(() => {
    const loadInvoice = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Trebuie să fii conectat pentru a vedea factura.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Factura nu a putut fi încărcată.");
          setLoading(false);
          return;
        }

        setInvoice(data);
      } catch {
        setError("Serverul nu este disponibil.");
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

  if (loading) {
    return (
      <main className="invoice-page">
        <div className="invoice-card">
          <h1>Se încarcă factura...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="invoice-page">
        <div className="invoice-card">
          <h1>Eroare</h1>
          <div className="auth-error">{error}</div>

          <Link to="/history">
            <button className="secondary-btn">Înapoi la istoric</button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="invoice-page">
      <div className="invoice-card invoice-template">
        <div className="invoice-header">
          <div>
            <h1>Factura {invoice.invoice_number || invoice.id}</h1>
            <p>Detalii factură încărcată</p>
          </div>

          <span className="invoice-status">
            {invoice.status || "uploaded"}
          </span>
        </div>

        <div className="invoice-grid">
          <div>
            <span>Furnizor</span>
            <strong>{invoice.supplier_name || "Necunoscut"}</strong>
          </div>

          <div>
            <span>Număr factură</span>
            <strong>{invoice.invoice_number || "-"}</strong>
          </div>

          <div>
            <span>Data emiterii</span>
            <strong>
              {invoice.issue_date
                ? new Date(invoice.issue_date).toLocaleDateString("ro-RO")
                : "-"}
            </strong>
          </div>

          <div>
            <span>Scadență</span>
            <strong>
              {invoice.due_date
                ? new Date(invoice.due_date).toLocaleDateString("ro-RO")
                : "-"}
            </strong>
          </div>

          <div>
            <span>Total</span>
            <strong>
              {invoice.total_amount
                ? `${invoice.total_amount} ${invoice.currency || "RON"}`
                : "-"}
            </strong>
          </div>

          <div>
            <span>Data încărcării</span>
            <strong>
              {invoice.created_at
                ? new Date(invoice.created_at).toLocaleDateString("ro-RO")
                : "-"}
            </strong>
          </div>
        </div>

        <div className="invoice-section">
          <h3>Text extras din factură</h3>

          <div className="invoice-extracted-text">
            {invoice.extracted_text || "Nu există text extras momentan."}
          </div>
        </div>

        {invoice.file_url && (
          <div className="invoice-section">
            <h3>Fișier original</h3>

            <a href={invoice.file_url} target="_blank" rel="noreferrer">
              Deschide fișierul facturii
            </a>
          </div>
        )}

<div className="invoice-actions">
  <button onClick={payInvoice}>Plătește cu Stripe</button>

  <button onClick={payInvoiceAutomatically}>
    Plătește automat
  </button>

  <Link to="/history">
    <button className="secondary-btn">Înapoi la istoric</button>
  </Link>
</div>
      </div>
    </main>
  );
}

const payInvoice = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      invoiceId: invoice.id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(data.message);
    return;
  }

  window.location.href = data.url;
};