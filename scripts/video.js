const playerIframe = document.querySelector("iframe");
const videoForm = document.getElementById("video-form");
const videoInput = document.getElementById("video-url-input");
const videoTitleInput = document.getElementById("video-title-input");
const videoSelect = document.getElementById("video-select");
const volumeControl = document.getElementById("volume-control");

const DEFAULT_VIDEO = {
    id: "jfKfPfyJRdk",
    title: "LoFi Girl - Default"
};

let currentIndex = 0;
let playlist = [];
let player;
let defaultVolume = 10;
let currentVolume = defaultVolume;

function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (url.includes("youtube.com")) {
            return urlObj.searchParams.get("v");
        } else if (url.includes("youtu.be")) {
            return urlObj.pathname.slice(1);
        }
    } catch (e) {
        return null;
    }
}

function updateVideoPlayer(videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
    playerIframe.src = embedUrl;

    if (player && player.setVolume) {
        player.setVolume(currentVolume);
    }
}

function saveVideo(videoId, videoTitle) {
    const videos = loadVideos();
    const alreadyExists = videos.some((v) => v.id === videoId || DEFAULT_VIDEO.id === videoId);
    if (alreadyExists) return;

    videos.push({ id: videoId, title: videoTitle });
    localStorage.setItem("savedVideos", JSON.stringify(videos));
    loadVideos();
    videoSelect.value = videoId;
}

function loadVideos() {
    const savedVideos = JSON.parse(localStorage.getItem("savedVideos") || "[]");
    const allVideos = [DEFAULT_VIDEO, ...savedVideos];

    videoSelect.innerHTML = "";
    allVideos.forEach((video, index) => {
        const options = document.createElement("option");
        options.value = video.id;
        options.textContent = index === 0 ? `${video.title} (Padrão)` : video.title;
        videoSelect.appendChild(options);
    });

    playlist = allVideos;
    return savedVideos;
}

function removeSelectedVideo() {
    const selectedId = videoSelect.value;
    if (selectedId === DEFAULT_VIDEO.id) {
        alert("O vídeo padrão não pode ser removido.");
        return;
    }

    const videos = loadVideos().filter((video) => video.id !== selectedId);
    localStorage.setItem("savedVideos", JSON.stringify(videos));
    loadVideos();
    updateVideoPlayer(DEFAULT_VIDEO.id);
    videoSelect.value = DEFAULT_VIDEO.id;
    currentIndex = 0;
}

function playNextVideo(auto = false) {
    currentIndex++;
    if (currentIndex >= playlist.length) {
        currentIndex = 0;
    }
    const nextVideo = playlist[currentIndex];
    updateVideoPlayer(nextVideo.id);
    videoSelect.value = nextVideo.id;
    if (auto) console.log(`Auto-next para: ${nextVideo.title}`);
}

function playPreviousVideo() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevVideo = playlist[currentIndex];
    updateVideoPlayer(prevVideo.id);
    videoSelect.value = prevVideo.id;
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube-player", {
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    player.setVolume(currentVolume);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        player.setVolume(currentVolume);
    }

    if (event.data === YT.PlayerState.ENDED) {
        playNextVideo(true);
    }
}

function initYouTubeAPI() {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

videoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const videoId = extractVideoId(videoInput.value);
    const videoTitle = videoTitleInput.value.trim();
    if (videoId && videoTitle) {
        updateVideoPlayer(videoId);
        saveVideo(videoId, videoTitle);
        videoInput.value = "";
        videoTitleInput.value = "";
    } else {
        alert("Preencha uma URL válida do YouTube e um nome para o vídeo!");
    }
});

videoSelect.addEventListener("change", () => {
    const selectedId = videoSelect.value;
    currentIndex = playlist.findIndex(v => v.id === selectedId);
    updateVideoPlayer(selectedId);
});

volumeControl.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    if (player && player.setVolume) {
        player.setVolume(currentVolume);
    }
    localStorage.setItem("videoVolume", currentVolume);
});

document.addEventListener("DOMContentLoaded", () => {
    loadVideos();
    initYouTubeAPI();
    const savedVolume = localStorage.getItem("videoVolume");
    if (savedVolume !== null) {
        currentVolume = parseInt(savedVolume, 10);
        volumeControl.value = currentVolume;
    } else {
        currentVolume = defaultVolume;
        volumeControl.value = defaultVolume;
    }
});