// react
import React, { useContext, useState } from "react";

// context
import { TrackContext } from "../context/TrackContext";

// components
import Header from "../components/Header";

// Pagina per il pubblico
const PublicPage: React.FC = () => {
  const { tracks, voteForTrack, joinSession, sessionActive } = useContext(TrackContext)!;
  const [sessionInput, setSessionInput] = useState("");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionInput.trim()) {
      joinSession(sessionInput.trim(), (success, err) => {
        if (success) {
          setJoined(true);
          setError("");
        } else {
          setError(err || "Errore durante l'unione alla sessione");
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Header title="🎶 Area Pubblico" />
      <div className="mt-4">
        {/* Form per unirsi alla sessione se non ancora uniti */}
        {!joined ? (
          <form onSubmit={handleJoin} className="mb-4 flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="Inserisci codice sessione" className="border p-2 rounded w-full" value={sessionInput} onChange={(e) => setSessionInput(e.target.value)} />
            <button type="submit" className="w-full sm:w-auto bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded">
              Unisciti alla Sessione
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        ) : (
          <div className="mb-4">
            <p className="text-lg font-bold text-center">{sessionActive ? "Sei unito alla sessione" : "La sessione è terminata"}</p>
          </div>
        )}

        {/* Lista delle tracce e possibilità di voto se la sessione è attiva */}
        {joined && sessionActive && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Vota la tua traccia preferita</h2>
            <ul className="space-y-2">
              {tracks.map((track, index) => (
                <li key={track.trackId} className={`bg-white p-4 rounded shadow-md flex flex-col sm:flex-row justify-between items-center ${index === 0 ? "border-4 border-green-500" : ""}`}>
                  <span className="mb-2 sm:mb-0 text-center">
                    {track.title} - {track.artist} | 🗳 {track.votes} voti
                  </span>
                  <button className="w-full sm:w-auto bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded" onClick={() => voteForTrack(track.trackId)}>
                    Vota
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicPage;
