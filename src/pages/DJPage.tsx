// react
import React, { useContext, useState } from "react";

// context
import { TrackContext } from "../context/TrackContext";

// components
import Header from "../components/Header";

// Pagina per il DJ
const DJPage: React.FC = () => {
  const { tracks, addTrack, deleteTrack, startSession, endSession, markTrackPlayed } = useContext(TrackContext)!;
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [sessionCode, setSessionCode] = useState("");

  const handleStartSession = () => {
    startSession((newSessionId) => {
      setSessionCode(newSessionId);
    });
  };

  const handleEndSession = () => {
    endSession((success, error) => {
      if (success) {
        setSessionCode("");
      } else {
        console.error(error);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && artist.trim()) {
      addTrack(title, artist);
      setTitle("");
      setArtist("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Header title="🎧 Area DJ" />
      <div className="mt-4">
        {/* Se la sessione non è attiva, mostra il bottone per avviarla */}
        {!sessionCode ? (
          <button onClick={handleStartSession} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
            Avvia Sessione
          </button>
        ) : (
          <>
            <div className="p-4 bg-blue-200 rounded mb-4">
              <p className="text-lg font-bold text-center">Sessione attiva: {sessionCode}</p>
            </div>
            <button onClick={handleEndSession} className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded mb-4">
              Termina Sessione
            </button>
          </>
        )}

        {/* Se la sessione è attiva, mostra il form per aggiungere tracce */}
        {sessionCode && (
          <>
            <h2 className="text-xl font-semibold mb-4">Gestisci le tracce</h2>
            <form onSubmit={handleSubmit} className="mb-4 flex flex-col sm:flex-row gap-2">
              <input type="text" placeholder="Titolo" className="border p-2 rounded w-full sm:w-auto" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input type="text" placeholder="Artista" className="border p-2 rounded w-full sm:w-auto" value={artist} onChange={(e) => setArtist(e.target.value)} />
              <button type="submit" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
                Aggiungi Traccia
              </button>
            </form>
          </>
        )}

        {/* Lista delle tracce */}
        <ul className="space-y-2">
          {tracks.map((track, index) => (
            <li key={track.trackId} className={`bg-white p-4 rounded shadow-md flex flex-col sm:flex-row justify-between items-center ${index === 0 ? "border-4 border-green-500" : ""}`}>
              <span className="mb-2 sm:mb-0">
                {track.title} - {track.artist} | 🗳 {track.votes} voti
              </span>
              <div className="flex gap-2">
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded" onClick={() => markTrackPlayed(track.trackId)}>
                  Mark as Played
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={() => deleteTrack(track.trackId)}>
                  Rimuovi
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DJPage;
