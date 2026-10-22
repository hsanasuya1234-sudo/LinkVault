import { useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [clicks, setClicks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function shortenUrl(e) {
    e.preventDefault();
    setError("");
    setCopied(false);

    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Please enter a valid HTTP or HTTPS URL.");
      }
    } catch {
      setError("Please enter a valid URL starting with https://");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortUrl(data.shortUrl);
      setShortCode(data.shortCode);
      setClicks(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshAnalytics() {
    if (!shortCode) return;

    try {
      const response = await fetch(`${API}/api/stats/${shortCode}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");

      const data = await response.json();
      setClicks(data.totalClicks);
      setError("");
    } catch {
      setError("Could not refresh analytics.");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed. Please select and copy the link.");
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">↗</span>
          Link<span>Vault</span>
        </div>

        <div className="nav-right">
          <span className="status-dot"></span>
          System Online
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="badge">
            ✦ SMART LINK MANAGEMENT PLATFORM
          </div>

          <h1>
            Short links.
            <br />
            <span>Big possibilities.</span>
          </h1>

          <p className="subtitle">
            Transform long, complicated URLs into powerful short links.
            Track engagement and manage your links effortlessly.
          </p>

          <form className="url-box" onSubmit={shortenUrl}>
            <div className="input-wrapper">
              <span>🔗</span>
              <input
                type="url"
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Shorten Link →"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          <p className="helper">
            No account required. Simple, fast and free.
          </p>
        </section>

        {shortUrl && (
          <section className="result-card">
            <div className="result-header">
              <span className="success-tag">✓ LINK CREATED</span>
              <span className="live-tag">● ACTIVE</span>
            </div>

            <h2>Your shortened link</h2>

            <div className="short-link-box">
              <a href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl}
              </a>

              <button onClick={copyLink}>
                {copied ? "✓ Copied" : "Copy Link"}
              </button>
            </div>

            <div className="analytics-header">
              <h3>Link Analytics</h3>
              <button className="refresh-btn" onClick={refreshAnalytics}>
                ↻ Refresh Stats
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">TOTAL CLICKS</span>
                <strong>{clicks}</strong>
                <span className="stat-desc">Recorded visits</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">LINK STATUS</span>
                <strong className="active-text">Active</strong>
                <span className="stat-desc">Ready to share</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">SHORT CODE</span>
                <strong className="code-text">{shortCode}</strong>
                <span className="stat-desc">Unique identifier</span>
              </div>
            </div>
          </section>
        )}

        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>
              Generate clean, shareable links in seconds.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Click Analytics</h3>
            <p>
              Monitor your link performance with real-time statistics.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Unique Links</h3>
            <p>
              Every shortened URL receives its own unique identifier.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <span>↗ LinkVault</span>
        <p>Built for simpler sharing.</p>
        <p>© {new Date().getFullYear()} LinkVault</p>
      </footer>
    </div>
  );
}

export default App;