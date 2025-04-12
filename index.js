// index.js
const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

// GET /get_audio?url=YOUTUBE_URL
app.get('/get_audio', async (req, res) => {
  const videoUrl = req.query.url;

  // Validate YouTube URL
  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid or missing YouTube URL' });
  }

  try {
    // Get video info
    const info = await ytdl.getInfo(videoUrl);

    // Get best audio format
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const bestAudio = audioFormats[0];

    if (!bestAudio) {
      return res.status(404).json({ error: 'No audio found' });
    }

    // Return audio stream URL and metadata
    res.json({
      title: info.videoDetails.title,
      audio_url: bestAudio.url,
      duration: info.videoDetails.lengthSeconds,
      author: info.videoDetails.author.name
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Use the port provided by Render or fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
