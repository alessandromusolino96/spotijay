const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Importa la connessione a MongoDB
require("./db");

// Importa il modello Session
const Session = require("./models/Session");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Funzione per generare un codice sessione univoco (6 caratteri)
function generateSessionId(length = 6) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

io.on("connection", (socket) => {
  console.log("Client connesso: " + socket.id);

  // Creazione della sessione da parte del DJ
  socket.on("startSession", async (callback) => {
    try {
      const sessionId = generateSessionId();
      const newSession = new Session({
        sessionId,
        tracks: [],
        sessionActive: true,
      });
      await newSession.save();
      socket.join(sessionId);
      console.log(`Sessione ${sessionId} avviata da ${socket.id}`);
      callback(sessionId);
    } catch (err) {
      console.error("Errore in startSession:", err);
      callback(null);
    }
  });

  // Unione di un client a una sessione
  socket.on("joinSession", async (sessionId, callback) => {
    try {
      const session = await Session.findOne({ sessionId, sessionActive: true });
      if (session) {
        socket.join(sessionId);
        console.log(`Socket ${socket.id} si è unito alla sessione ${sessionId}`);
        socket.emit("tracksUpdate", session.tracks);
        callback({ success: true });
      } else {
        callback({ success: false, error: "Sessione non trovata o terminata" });
      }
    } catch (err) {
      console.error("Errore in joinSession:", err);
      callback({ success: false, error: "Errore lato server" });
    }
  });

  // Gestione dei voti
  socket.on("vote", async ({ sessionId, trackId }) => {
    try {
      const session = await Session.findOne({ sessionId, sessionActive: true });
      if (session) {
        session.tracks = session.tracks.map((track) => (track.trackId === trackId ? { ...track.toObject(), votes: track.votes + 1 } : track));
        session.tracks.sort((a, b) => b.votes - a.votes);
        await session.save();
        io.to(sessionId).emit("tracksUpdate", session.tracks);
      }
    } catch (err) {
      console.error("Errore in vote:", err);
    }
  });

  // Aggiunta di una traccia
  socket.on("addTrack", async ({ sessionId, newTrack }) => {
    try {
      const session = await Session.findOne({ sessionId, sessionActive: true });
      if (session) {
        newTrack.trackId = Date.now().toString();
        newTrack.votes = 0;
        session.tracks.push(newTrack);
        session.tracks.sort((a, b) => b.votes - a.votes);
        await session.save();
        io.to(sessionId).emit("tracksUpdate", session.tracks);
      }
    } catch (err) {
      console.error("Errore in addTrack:", err);
    }
  });

  // Rimozione di una traccia
  socket.on("deleteTrack", async ({ sessionId, trackId }) => {
    console.log(sessionId);
    console.log(trackId);
    try {
      const session = await Session.findOne({ sessionId, sessionActive: true });
      console.log(session);
      if (session) {
        session.tracks = session.tracks.filter((track) => track.trackId !== trackId);
        session.tracks.sort((a, b) => b.votes - a.votes);
        await session.save();
        io.to(sessionId).emit("tracksUpdate", session.tracks);
      }
    } catch (err) {
      console.error("Errore in deleteTrack:", err);
    }
  });

  // Mark a track as played (rimuove la traccia)
  socket.on("markTrackPlayed", async ({ sessionId, trackId }, callback) => {
    try {
      const session = await Session.findOne({ sessionId, sessionActive: true });
      if (session) {
        session.tracks = session.tracks.filter((track) => track.trackId !== trackId);
        await session.save();
        io.to(sessionId).emit("tracksUpdate", session.tracks);
        if (callback) callback({ success: true });
      } else {
        if (callback) callback({ success: false, error: "Sessione non trovata" });
      }
    } catch (err) {
      console.error("Errore in markTrackPlayed:", err);
      if (callback) callback({ success: false, error: "Errore lato server" });
    }
  });

  // Chiusura della sessione
  socket.on("endSession", async (sessionId, callback) => {
    try {
      const session = await Session.findOne({ sessionId, sessionActive: true });
      if (session) {
        session.sessionActive = false;
        await session.save();
        io.to(sessionId).emit("sessionEnded");
        console.log(`Sessione ${sessionId} terminata da ${socket.id}`);
        callback({ success: true });
      } else {
        callback({ success: false, error: "Sessione non trovata" });
      }
    } catch (err) {
      console.error("Errore in endSession:", err);
      callback({ success: false, error: "Errore lato server" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnesso: " + socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
