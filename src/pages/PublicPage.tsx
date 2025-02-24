import React, { useContext, useState } from "react";
import { TrackContext } from "../context/TrackContext";
import Header from "../components/Header";

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
        {!joined ? (
          <form onSubmit={handleJoin} className="mb-4 flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="Inserisci codice sessione" className="border p-2 flex-1" value={sessionInput} onChange={(e) => setSessionInput(e.target.value)} />
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Unisciti alla Sessione
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        ) : (
          <div className="mb-4">
            <p className="text-lg font-bold">{sessionActive ? "Sei unito alla sessione" : "La sessione è terminata"}</p>
          </div>
        )}
        {joined && sessionActive && (
          <>
            <h2 className="text-xl font-semibold mb-4">Vota la tua traccia preferita</h2>
            <ul>
              {tracks.map((track, index) => (
                <li key={track.id} className={`bg-white p-4 mb-2 rounded shadow-md flex justify-between items-center ${index === 0 ? "border-4 border-green-500" : ""}`}>
                  <span>
                    {track.title} - {track.artist}
                  </span>
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700" onClick={() => voteForTrack(track.id)}>
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
