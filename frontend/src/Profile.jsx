import "./Profile.css";

export default function Profile() {
  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-avatar">C</div>

          <div>
            <h1>Cristi B.</h1>
            <p>cristi@example.com</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Informații cont</h3>

          <div className="profile-info">
            <div>
              <span>Plan</span>
              <strong>Premium</strong>
            </div>

            <div>
              <span>Facturi procesate</span>
              <strong>124</strong>
            </div>

            <div>
              <span>Ultima activitate</span>
              <strong>Astăzi</strong>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Acțiuni rapide</h3>

          <div className="profile-actions">
            <button>Editează profilul</button>
            <button className="secondary-btn">Logout</button>
          </div>
        </div>
      </div>
    </main>
  );
}