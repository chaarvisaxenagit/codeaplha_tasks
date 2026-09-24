// Music Player Variables
let currentSongIndex = 0;
let isPlaying = false;
let autoplay = false;

// Sample Rock/Metal Playlist
const playlist = [
    {
        title: "Midnight Metal",
        artist: "Iron Echo",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: 360,
        albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80"
    },
    {
        title: "Thunder Riot",
        artist: "Electric Storm",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: 320,
        albumArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&q=80"
    },
    {
        title: "Heavy Reverb",
        artist: "Acid Burn",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: 280,
        albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80"
    },
    {
        title: "Steel Vanguard",
        artist: "Chrome Riot",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        duration: 290,
        albumArt: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80"
    },
    {
        title: "Apocalypse Drive",
        artist: "Wasteland",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        duration: 340,
        albumArt: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=300&q=80"
    }
];

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumArt = document.getElementById('albumArt');
const albumArtContainer = document.getElementById('albumArtContainer');
const visualizer = document.getElementById('visualizer');
const currentTimeElement = document.getElementById('currentTime');
const durationElement = document.getElementById('duration');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const progressBar = document.getElementById('progressBar');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const playlistContainer = document.getElementById('playlistContainer');
const playlistToggle = document.getElementById('playlistToggle');
const playlistDiv = document.getElementById('playlist');
const autoplayToggle = document.getElementById('autoplayToggle');
const playerContainer = document.getElementById('playerContainer');

// Initialize Player
function initializePlayer() {
    loadPlaylist();
    loadSong(0);
    setupEventListeners();
}

// Load Playlist
function loadPlaylist() {
    playlistDiv.innerHTML = '';
    playlist.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = `playlist-item ${index === 0 ? 'active' : ''}`;
        playlistItem.innerHTML = `
            <div class="playlist-item-title">${song.title}</div>
            <div class="playlist-item-artist">${song.artist}</div>
        `;
        playlistItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(index);
            play();
        });
        playlistDiv.appendChild(playlistItem);
    });
}

// Load Song
function loadSong(index) {
    if (index < 0 || index >= playlist.length) return;

    currentSongIndex = index;
    const song = playlist[index];

    audioPlayer.src = song.url;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumArt.src = song.albumArt;

    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    progressFill.style.width = '0%';
    progressHandle.style.left = '0%';
    currentTimeElement.textContent = '0:00';
    durationElement.textContent = formatTime(song.duration);
}

// Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Play Song
function play() {
    audioPlayer.play().catch(error => {
        console.error('Play error:', error);
    });
    isPlaying = true;
    playIcon.textContent = '⏸';
    playBtn.classList.add('playing');
    
    albumArtContainer.classList.add('spinning');
    visualizer.classList.add('active');
}

// Pause Song
function pause() {
    audioPlayer.pause();
    isPlaying = false;
    playIcon.textContent = '▶';
    playBtn.classList.remove('playing');
    
    albumArtContainer.classList.remove('spinning');
    visualizer.classList.remove('active');
}

// Toggle Play/Pause
function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// Next Song
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    play();
}

// Previous Song
function previousSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1;
    }
    loadSong(currentSongIndex);
    play();
}

// Update Progress Bar
function updateProgress() {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = progressPercent + '%';
        progressHandle.style.left = progressPercent + '%';
        currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
    }
}

// Seek Song (Mouse / Touch support)
function seekSong(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX || (e.touches && e.touches[0].clientX);
    if (!clickX) return;
    const percent = (clickX - rect.left) / rect.width;
    if (percent >= 0 && percent <= 1 && audioPlayer.duration) {
        audioPlayer.currentTime = percent * audioPlayer.duration;
    }
}

// Update Volume
function updateVolume() {
    const volume = volumeSlider.value;
    audioPlayer.volume = volume / 100;
    volumeValue.textContent = volume + '%';
}

// Toggle Playlist
function togglePlaylist() {
    playlistContainer.classList.toggle('active');
}

// Handle Song End
function handleSongEnd() {
    if (autoplay) {
        nextSong();
    } else {
        pause();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    playBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', previousSong);

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationElement.textContent = formatTime(audioPlayer.duration);
    });
    
    progressBar.addEventListener('click', seekSong);
    progressBar.addEventListener('touchstart', seekSong);

    volumeSlider.addEventListener('input', updateVolume);
    audioPlayer.addEventListener('ended', handleSongEnd);
    playlistToggle.addEventListener('click', togglePlaylist);

    autoplayToggle.addEventListener('change', (e) => {
        autoplay = e.target.checked;
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === 'ArrowRight') {
            nextSong();
        } else if (e.code === 'ArrowLeft') {
            previousSong();
        }
    });
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', initializePlayer);

volumeSlider.value = 70;
audioPlayer.volume = 0.7;
volumeValue.textContent = '70%';