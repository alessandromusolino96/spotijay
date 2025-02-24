import React, { useContext, useState } from "react";
import { TrackContext } from "../context/TrackContext";
import Header from "../components/Header";

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
        {!sessionCode ? (
          <button onClick={handleStartSession} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Avvia Sessione
          </button>
        ) : (
          <>
            <div className="p-4 bg-blue-200 rounded mb-4">
              <p className="text-lg font-bold">Sessione attiva: {sessionCode}</p>
            </div>
            <button onClick={handleEndSession} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
              Termina Sessione
            </button>
          </>
        )}

        {sessionCode && (
          <>
            <h2 className="text-xl font-semibold mb-4">Gestisci le tracce</h2>
            <form onSubmit={handleSubmit} className="mb-4 flex flex-col sm:flex-row gap-2">
              <input type="text" placeholder="Titolo" className="border p-2 flex-1" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input type="text" placeholder="Artista" className="border p-2 flex-1" value={artist} onChange={(e) => setArtist(e.target.value)} />
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Aggiungi Traccia
              </button>
            </form>
          </>
        )}

        <ul>
          {tracks.map((track, index) => (
            <li key={track.id} className={`bg-white p-4 mb-2 rounded shadow-md flex justify-between items-center ${index === 0 ? "border-4 border-green-500" : ""}`}>
              <span>
                {track.title} - {track.artist} | 🗳 {track.votes} voti
              </span>
              <div className="flex gap-2">
                <button className="bg-yellow-500 hover:bg-yello-700 text-white px-3 py-1 rounded" onClick={() => markTrackPlayed(track.id)}>
                  Mark as Played
                </button>
                <button className="ml-2 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={() => deleteTrack(track.id)}>
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
