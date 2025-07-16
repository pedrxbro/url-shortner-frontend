import { useState, useEffect } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  async function handleShorten() {
    setLoading(true);
    setError(null);
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:8080/shorten-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: longUrl }),
      });

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const text = await response.text();
      setShortUrl(text);
    } catch (err) {
      setError("Falha ao encurtar URL: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(shortUrl);
    alert("URL copiada para a área de transferência!");
  }

  return (
    <section className="section">
      <div className="container">
        <div
          className="box"
          style={{ maxWidth: "500px", margin: "auto" }}
        >
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
            <h1 className="title">🔗 Encurtador de URL</h1>

            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="check"></span>
            </label>
          </div>

          <div className="field">
            <div className="control">
              <input
                type="text"
                placeholder="Digite a URL longa"
                className="input"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button
                onClick={handleShorten}
                disabled={loading || !longUrl}
                className={`button encurtar-btn is-fullwidth ${
                  loading ? "is-loading" : ""
                }`}
              >
                Encurtar
              </button>
            </div>
          </div>

          {error && (
            <div className="notification is-danger is-light">{error}</div>
          )}

          {shortUrl && (
            <div className="short-url mt-4">
              <p className="has-text-centered">
                URL Encurtada:{" "}
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>
              </p>

              <div className="is-flex is-justify-content-center mt-2">
                <button
                  onClick={handleCopy}
                  className="button is-small is-info mr-2"
                >
                  📋 Copiar
                </button>

                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button is-small is-link"
                >
                  🔗 Abrir
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
