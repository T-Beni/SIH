import "./AIChat.css";

export default function AIChat() {
  return (
    <main className="chat-page">
      <div className="chat-card">
        <h1>AI Chat</h1>

        <div className="chat-box">
          <div className="message user-message">
            Poți să-mi explici ce conține factura încărcată?
          </div>

          <div className="message ai-message">
            Sigur. Factura pare să conțină un total de 349,99 RON, termen de
            plată pe 15.05.2026 și furnizorul Smart Energy SRL.
          </div>
        </div>

        <div className="chat-input">
          <input type="text" placeholder="Scrie un mesaj..." />
          <button>Trimite</button>
        </div>
      </div>
    </main>
  );
}