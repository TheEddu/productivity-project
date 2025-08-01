const playerIframe = document.querySelector("iframe");
const videoForm = document.getElementById("video-form");
const videoInput = document.getElementById("video-url-input");
const videoTitleInput = document.getElementById("video-title-input");
const videoSelect = document.getElementById("video-select");

const DEFAULT_VIDEO = {
    id: "jfKfPfyJRdk",
    title: "LoFi Girl - Default"
};

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
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    playerIframe.src = embedUrl;
}

async function saveVideo(videoId, videoTitle) {
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

    const currentSelectedId = videoSelect.value;
    videoSelect.innerHTML = "";

    const allVideos = [DEFAULT_VIDEO, ...savedVideos];

    allVideos.forEach((video, index) => {
        const options = document.createElement("option");
        options.value = video.id;
        options.textContent = index === 0 ? `${video.title} (Padrão)` : video.title;
        videoSelect.appendChild(options);
    });

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
    updateVideoPlayer(selectedId);
});

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    loadVideos();
});

