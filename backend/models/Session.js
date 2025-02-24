const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  trackId: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const SessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  tracks: [TrackSchema],
  sessionActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", SessionSchema);
