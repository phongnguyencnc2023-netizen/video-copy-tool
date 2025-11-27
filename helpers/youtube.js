const { YoutubeTranscript } = require('youtube-transcript');

async function getTranscript(urlOrId, language='vi'){
  try{
    const idMatch = urlOrId.match(/[?&]v=([A-Za-z0-9_-]{11})/) || urlOrId.match(/([A-Za-z0-9_-]{11})$/);
    const videoId = idMatch ? idMatch[1] : urlOrId;
    const res = await YoutubeTranscript.fetchTranscript(videoId, { lang: language });
    return res.map(r=>r.text).join(' ');
  }catch(e){
    try{
      const res = await YoutubeTranscript.fetchTranscript(urlOrId, { lang: 'en' });
      return res.map(r=>r.text).join(' ');
    }catch(err){
      throw new Error('Cannot fetch transcript: '+err.message);
    }
  }
}

module.exports = { getTranscript };
