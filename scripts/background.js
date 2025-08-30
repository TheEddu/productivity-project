const backgroundForm = document.getElementById("background-form");
const backgroundInput = document.getElementById("background-url-input");
const backgroundNameInput = document.getElementById("background-name-input");
const backgroundTimeInput = document.getElementById("background-time-input");
const backgroundSelect = document.getElementById("background-select");
const removeBackgroundButton = document.getElementById("remove-background-button");

const DEFAULT_BACKGROUND = {
    url: "https://image.lexica.art/full_webp/6956a17b-d577-4e07-9f25-beeee6829c58",
    name: "Padrão",
    time: null
};

function loadBackgrounds() {
    const savedBackgrounds = JSON.parse(localStorage.getItem("savedBackgrounds") || "[]");
    const allBackgrounds = [DEFAULT_BACKGROUND, ...savedBackgrounds];

    backgroundSelect.innerHTML = "";
    allBackgrounds.forEach((background) => {
        const option = document.createElement("option");
        option.value = background.url;
        const timeLabel = background.time ? ` (${background.time})` : "";
        option.textContent = `${background.name}${timeLabel}`;
        backgroundSelect.appendChild(option);
    });

    return allBackgrounds;
}

function updateBackground(url) {
    document.body.style.backgroundImage = `url('${url}')`;
    localStorage.setItem("currentBackground", url);
}

function saveBackground(url, name, time) {
    const backgrounds = JSON.parse(localStorage.getItem("savedBackgrounds") || "[]");
    const alreadyExists = backgrounds.some((bg) => bg.url === url) || url === DEFAULT_BACKGROUND.url;

    if (!alreadyExists) {
        backgrounds.push({ url, name, time: time || null });
        localStorage.setItem("savedBackgrounds", JSON.stringify(backgrounds));
        loadBackgrounds();
        backgroundSelect.value = url;
    }
}

function removeSelectedBackground() {
    const selectedUrl = backgroundSelect.value;

    if (selectedUrl === DEFAULT_BACKGROUND.url) {
        alert("O fundo padrão não pode ser removido.");
        return;
    }

    const backgrounds = JSON.parse(localStorage.getItem("savedBackgrounds") || "[]");
    const updatedBackgrounds = backgrounds.filter((bg) => bg.url !== selectedUrl);

    localStorage.setItem("savedBackgrounds", JSON.stringify(updatedBackgrounds));
    loadBackgrounds();
    updateBackground(DEFAULT_BACKGROUND.url);
    backgroundSelect.value = DEFAULT_BACKGROUND.url;
}

function checkScheduledBackground() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const backgrounds = loadBackgrounds();

    let latestBackground = null;
    let latestMinutes = -1;

    backgrounds.forEach(bg => {
        if (bg.time) {
            const [h, m] = bg.time.split(":").map(Number);
            const bgMinutes = h * 60 + m;
            if (currentMinutes >= bgMinutes && bgMinutes > latestMinutes) {
                latestBackground = bg;
                latestMinutes = bgMinutes;
            }
        }
    });

    if (latestBackground) {
        updateBackground(latestBackground.url);
        backgroundSelect.value = latestBackground.url;
    } else {
        const savedBackground = localStorage.getItem("currentBackground") || DEFAULT_BACKGROUND.url;
        updateBackground(savedBackground);
        backgroundSelect.value = savedBackground;
    }
}

backgroundSelect.addEventListener("change", () => {
    const selectedBackground = backgroundSelect.value;
    updateBackground(selectedBackground);
});

backgroundForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const backgroundUrl = backgroundInput.value.trim();
    const backgroundName = backgroundNameInput.value.trim() || "Sem Nome";
    const backgroundTime = backgroundTimeInput.value.trim();


    if (!/^https:\/\//.test(backgroundUrl)) {
        alert("Por favor, use apenas URLs públicas com HTTPS para imagens.");
        return;
    }

    if (backgroundUrl) {
        saveBackground(backgroundUrl, backgroundName, backgroundTime);
        updateBackground(backgroundUrl);
        backgroundInput.value = "";
        backgroundNameInput.value = "";
        backgroundTimeInput.value = "";
    } else {
        alert("Insira uma URL válida para a imagem de fundo!");
    }
});

removeBackgroundButton.addEventListener("click", removeSelectedBackground);

document.addEventListener("DOMContentLoaded", () => {
    const savedBackground = localStorage.getItem("currentBackground") || DEFAULT_BACKGROUND.url;
    loadBackgrounds();
    updateBackground(savedBackground);
    backgroundSelect.value = savedBackground;

    checkScheduledBackground();
    setInterval(checkScheduledBackground, 60000);
});