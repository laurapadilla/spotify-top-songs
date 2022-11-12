import { getRecentlyPlayed } from "../../lib/spotify";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (_, res) => {
  const response = await getRecentlyPlayed();
  const { items } = await response.json();

  const tracks = items.map((track) => ({
    artist: track.artists.map((artist) => artist.name).join(", "),
    songUrl: track.external_urls.spotify,
    title: track.name,
  }));

  return res.status(200).json({ artists, genres });
};
