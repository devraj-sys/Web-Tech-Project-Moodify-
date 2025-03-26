require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

// Get Spotify API Token
const getSpotifyToken = async () => {
  const response = await axios.post(
    SPOTIFY_AUTH_URL,
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
};

// Fetch Playlists by Mood
app.get("/api/playlists/:mood", async (req, res) => {
  const { mood } = req.params;
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(
      `${SPOTIFY_API_URL}/search?q=${mood}&type=playlist&limit=5`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(response.data.playlists.items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching playlists" });
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
