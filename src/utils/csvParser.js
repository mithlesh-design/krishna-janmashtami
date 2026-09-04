/**
 * Utility to parse CSV playlist data
 * Handles commas inside quotes, whitespace trimming, and header normalization.
 */

export const DEFAULT_TRACKS = [
  {
    id: 1,
    order: 1,
    title: "Pyaro Vrindavan",
    artist: "Indresh Upadhyay Ji & B Praak",
    videoId: "kNK7XYZcyBM",
    audioUrl: "https://www.youtube.com/watch?v=kNK7XYZcyBM",
    coverImage: "https://i.ytimg.com/vi/kNK7XYZcyBM/hqdefault.jpg",
    duration: "13:48"
  },
  {
    id: 2,
    order: 2,
    title: "Radha Gori Gori",
    artist: "Indresh Upadhyay Ji & B Praak",
    videoId: "xVU2UDaFOfE",
    audioUrl: "https://www.youtube.com/watch?v=xVU2UDaFOfE",
    coverImage: "https://i.ytimg.com/vi/xVU2UDaFOfE/hqdefault.jpg",
    duration: "05:55"
  },
  {
    id: 3,
    order: 3,
    title: "Mere Banke Bihari Laal",
    artist: "Madhavas Rock Band",
    videoId: "Cm0MZ5WfTzw",
    audioUrl: "https://www.youtube.com/watch?v=Cm0MZ5WfTzw",
    coverImage: "https://i.ytimg.com/vi/Cm0MZ5WfTzw/hqdefault.jpg",
    duration: "05:09"
  },
  {
    id: 4,
    order: 4,
    title: "Shri Krishna Govind Hare Murari",
    artist: "Jubin Nautiyal",
    videoId: "1qmPNot9NJs",
    audioUrl: "https://www.youtube.com/watch?v=1qmPNot9NJs",
    coverImage: "https://i.ytimg.com/vi/1qmPNot9NJs/hqdefault.jpg",
    duration: "02:35"
  },
  {
    id: 5,
    order: 5,
    title: "Tum Prem Ho (RadhaKrishn)",
    artist: "Mohit Lalwani & Bharat Kamal",
    videoId: "Feoea8FQTI0",
    audioUrl: "https://www.youtube.com/watch?v=Feoea8FQTI0",
    coverImage: "https://i.ytimg.com/vi/Feoea8FQTI0/hqdefault.jpg",
    duration: "05:03"
  },
  {
    id: 6,
    order: 6,
    title: "Radhika Dulari",
    artist: "Indresh Upadhyay Ji & B Praak",
    videoId: "0Wz4ROngCMI",
    audioUrl: "https://www.youtube.com/watch?v=0Wz4ROngCMI",
    coverImage: "https://i.ytimg.com/vi/0Wz4ROngCMI/hqdefault.jpg",
    duration: "06:44"
  }
];

export function parseCSVText(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    return DEFAULT_TRACKS;
  }

  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return DEFAULT_TRACKS;

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.trim().toLowerCase().replace(/[\s_-]+/g, ''));

  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = parseCSVLine(lines[i]);
    if (!rawCols || rawCols.length === 0) continue;

    const rowObj = {};
    headers.forEach((hdr, idx) => {
      rowObj[hdr] = (rawCols[idx] || '').trim();
    });

    const order = parseInt(rowObj.order || rowObj.id || i, 10);
    const title = rowObj.songtitle || rowObj.title || rowObj.song || `Track ${i}`;
    const artist = rowObj.artist || rowObj.singer || "Traditional";
    const videoId = rowObj.videoid || rowObj.youtubeid || rowObj.id || "";
    const audioUrl = rowObj.audiourl || rowObj.audio || rowObj.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : `/songs/achyutam.mp3`);
    const defaultCover = `/images/krishna-${((order - 1) % 6) + 1}.png`;
    const coverImage = rowObj.coverimage || rowObj.cover || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : defaultCover);
    const duration = rowObj.duration || rowObj.time || "04:00";

    results.push({
      id: order || i,
      order: order || i,
      title,
      artist,
      videoId,
      audioUrl,
      coverImage,
      duration
    });
  }

  return results.length > 0 ? results.sort((a, b) => a.order - b.order) : DEFAULT_TRACKS;
}

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

export async function loadPlaylistFromCSV(path = '/data/playlist.csv') {
  try {
    const response = await fetch(`${path}?t=${Date.now()}`);
    if (!response.ok) {
      console.warn(`Could not load CSV from ${path}, using default playlist.`);
      return DEFAULT_TRACKS;
    }
    const text = await response.text();
    return parseCSVText(text);
  } catch (error) {
    console.warn("Failed to fetch playlist CSV:", error);
    return DEFAULT_TRACKS;
  }
}
