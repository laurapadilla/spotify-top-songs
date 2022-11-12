import { useEffect, useState } from "react";

export default function Button({ fetchUser }) {
  const [button, showButton] = useState(true);
  const SPOTIFY_REDIRECT_URI = `http://localhost:3000`;
  const scope = `user-top-read`;
  const AUTHORIZATION_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${scope}&show_dialog=true`;

  const login = () => {
    let popup = window.open(
      AUTHORIZATION_URL,
      "Login with Spotify",
      "width=800,height=600"
    );
    window.spotifyCallback = (payload) => {
      popup.close();

      fetch(
        `https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${payload}`,
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const { items } = data;
          showButton(false);
          const tracks = items.slice(0, 20).map((track) => ({
            album: track.album.name,
            albumImg: track.album.images[0],
            artist: track.artists.map((_artist) => _artist.name).join(", "),
            songUrl: track.external_urls.spotify,
            title: track.name,
          }));

          fetchUser({ tracks });
          console.log(tracks, "heyyy");
        });
    };
  };

  useEffect(() => {
    const token = window.location.hash.substr(1).split("&")[0].split("=")[1];
    if (token) {
      window.opener.spotifyCallback(token);
      console.log(token);
    }
  }, []);

  return <button onClick={login}>login with spotify!</button>;
}
