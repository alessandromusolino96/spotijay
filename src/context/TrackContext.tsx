import React, { createContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { Track } from "../types";

type TrackContextType = {
  tracks: Track[];
  voteForTrack: (trackId: string) => void;
  addTrack: (title: string, artist: string) => void;
  deleteTrack: (trackId: string) => void;
  startSession: (callback: (sessionId: string) => void) => void;
  joinSession: (sessionId: string, callback: (success: boolean, error?: string) => void) => void;
  endSession: (callback: (success: boolean, error?: string) => void) => void;
  markTrackPlayed: (trackId: string) => void;
  sessionActive: boolean;
};

export const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [sessionActive, setSessionActive] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.on("tracksUpdate", (updatedTracks: Track[]) => {
      setTracks(updatedTracks);
    });

    // Gestione dell'evento sessionEnded per notificare i client
    newSocket.on("sessionEnded", () => {
      setSessionId("");
      setTracks([]);
      setSessionActive(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const voteForTrack = (trackId: string) => {
    if (socket && sessionId) {
      socket.emit("vote", { sessionId, trackId });
    }
  };

  const addTrack = (title: string, artist: string) => {
    if (socket && sessionId) {
      const newTrack = { id: Date.now().toString(), title, artist, votes: 0 };
      socket.emit("addTrack", { sessionId, newTrack });
    }
  };

  const deleteTrack = (trackId: string) => {
    console.log(trackId);
    if (socket && sessionId) {
      socket.emit("deleteTrack", { sessionId, trackId });
    }
  };

  const startSession = (callback: (sessionId: string) => void) => {
    if (socket) {
      socket.emit("startSession", (newSessionId: string) => {
        setSessionId(newSessionId);
        setSessionActive(true);
        callback(newSessionId);
      });
    }
  };

  const joinSession = (joinId: string, callback: (success: boolean, error?: string) => void) => {
    if (socket) {
      socket.emit("joinSession", joinId, (response: { success: boolean; error?: string }) => {
        if (response.success) {
          setSessionId(joinId);
          setSessionActive(true);
          callback(true);
        } else {
          callback(false, response.error);
        }
      });
    }
  };

  const endSession = (callback: (success: boolean, error?: string) => void) => {
    if (socket && sessionId) {
      socket.emit("endSession", sessionId, (response: { success: boolean; error?: string }) => {
        if (response.success) {
          setSessionId("");
          setTracks([]);
          setSessionActive(false);
          callback(true);
        } else {
          callback(false, response.error);
        }
      });
    }
  };

  const markTrackPlayed = (trackId: string) => {
    if (socket && sessionId) {
      socket.emit("markTrackPlayed", { sessionId, trackId });
    }
  };

  return <TrackContext.Provider value={{ tracks, voteForTrack, addTrack, deleteTrack, startSession, joinSession, endSession, markTrackPlayed, sessionActive }}>{children}</TrackContext.Provider>;
};
