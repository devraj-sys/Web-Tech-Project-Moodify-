import React, { useState } from "react";
import axios from "axios";
import "./Home.css";

const moods = ["Happy", "Sad", "Relaxed", "Energetic", "Romantic"];

const Home = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");

  const fetchPlaylists = async (mood) => {
    setSelectedMood(mood);
    try {
      const response = await axios.get(`http://localhost:5000/api/playlists/${mood}`);
      if (response.data && Array.isArray(response.data)) {
        setPlaylists(response.data);
      } else {
        setPlaylists([]);
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      setPlaylists([]);
    }
  };

  return (
    <div className="home-container">
      <h1>Choose Your Mood</h1>
      <div className="mood-buttons">
        {moods.map((mood) => (
          <button key={mood} onClick={() => fetchPlaylists(mood)}>
            {mood}
          </button>
        ))}
      </div>
      <div className="playlist-container">
        {playlists.length > 0 && (
          <>
            <h2>Playlists for {selectedMood}</h2>
            <ul>
              {playlists.map((playlist, index) => {
                if (!playlist || !playlist.id) {
                  console.warn("Invalid playlist data:", playlist);
                  return null; // Skip invalid items
                }

                return (
                  <li key={playlist.id || `playlist-${index}`}>
                    <a
                      href={playlist?.external_urls?.spotify || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {playlist?.name || "Unknown Playlist"}
                    </a>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

