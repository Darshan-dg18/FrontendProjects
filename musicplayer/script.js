// DOM Elements
const albumArt = document.querySelector('.album-art');
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const shuffleBtn = document.querySelector('.shuffle-btn');
const repeatBtn = document.querySelector('.repeat-btn');
const progressBar = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-bar');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const volumeBar = document.querySelector('.volume-bar');
const volumeSlider = document.querySelector('.volume-slider');
const playlistItems = document.querySelectorAll('.playlist-item');

// Music data
const songs = [
    {
        title: 'Summer Vibes',
        artist: 'Electronic Dreams',
        duration: '3:45',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80'
    },
    {
        title: 'Ocean Waves',
        artist: 'Chill Beats',
        duration: '4:20',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80'
    },
    {
        title: 'Mountain High',
        artist: 'Nature Sounds',
        duration: '3:55',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80'
    }
];

let isPlaying = false;
let currentSong = 0;
let isShuffled = false;
let isRepeating = false;

// Create audio element
const audio = new Audio();
audio.volume = 0.7;

// Functions
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    albumArt.classList.add('playing');
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    albumArt.classList.remove('playing');
    audio.pause();
}

function prevSong() {
    currentSong--;
    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }
    loadSong(currentSong);
    if (isPlaying) {
        playSong();
    }
}

function nextSong() {
    currentSong++;
    if (currentSong > songs.length - 1) {
        currentSong = 0;
    }
    loadSong(currentSong);
    if (isPlaying) {
        playSong();
    }
}

function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    document.querySelector('.track-name').textContent = song.title;
    document.querySelector('.artist-name').textContent = song.artist;
    document.querySelector('.album-art img').src = song.cover;
    
    // Update playlist active state
    document.querySelector('.playlist-item.active')?.classList.remove('active');
    playlistItems[index].classList.add('active');

    // Update total time once audio is loaded
    audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        totalTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Update time stamps
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active');
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.classList.toggle('active');
}

function setVolume(e) {
    const width = volumeSlider.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    audio.volume = volume;
    volumeBar.style.width = `${volume * 100}%`;
}

// Add 3D tilt effect
document.querySelector('.music-player').addEventListener('mousemove', (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    const tiltX = (y - 0.5) * 10;
    const tiltY = (x - 0.5) * -10;
    
    e.target.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

document.querySelector('.music-player').addEventListener('mouseleave', (e) => {
    e.target.style.transform = 'rotateX(5deg) rotateY(0deg)';
});

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('click', setVolume);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => {
    if (isRepeating) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentSong = index;
        loadSong(currentSong);
        playSong();
    });
});

// Add error handling for audio
audio.addEventListener('error', (e) => {
    console.error('Error loading audio:', e);
    alert('Error loading audio. Please try another song.');
});

// Initialize first song
loadSong(currentSong);
