import { useState } from "react";

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          🔗 Encurtador de URL
        </h1>

        <input
          type="text"
          placeholder="Digite a URL longa"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />

        <button
          onClick={handleShorten}
          disabled={loading || !longUrl}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4 hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Encurtando..." : "Encurtar"}
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}

        {shortUrl && (
          <div className="mt-6 bg-blue-50 p-4 rounded text-center">
            <p className="text-gray-700">URL Encurtada:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline break-words"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
