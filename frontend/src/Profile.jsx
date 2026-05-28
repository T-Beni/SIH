import "./Profile.css";

export default function Profile({ user }) {
  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-card">
          <h1>Nu ești conectat</h1>
          <p>Conectează-te pentru a vedea profilul.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-top">
          <div
            className="profile-avatar"
            style={{
              backgroundImage: user.avatar_url ? `url(${user.avatar_url})` : "none",
            }}
          >
            {!user.avatar_url && user.name?.[0]}
          </div>

          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>
      </div>
    </main>
  );
}