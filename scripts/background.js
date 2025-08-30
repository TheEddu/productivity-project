
const backgroundForm = document.getElementById("background-form");
const backgroundInput = document.getElementById("background-url-input");
const backgroundNameInput = document.getElementById("background-name-input");
const backgroundSelect = document.getElementById("background-select");
const removeBackgroundButton = document.getElementById("remove-background-button");

const DEFAULT_BACKGROUND = {
    url: "https://image.lexica.art/full_webp/6956a17b-d577-4e07-9f25-beeee6829c58",
    name: "Padrão"
};


function loadBackgrounds() {
    const savedBackgrounds = JSON.parse(localStorage.getItem("savedBackgrounds") || "[]");
    const allBackgrounds = [DEFAULT_BACKGROUND, ...savedBackgrounds];

    backgroundSelect.innerHTML = "";
    allBackgrounds.forEach((background, index) => {
        const option = document.createElement("option");
        option.value = background.url;
        option.textContent = background.name;
        backgroundSelect.appendChild(option);
    });

    return allBackgrounds;
}


function updateBackground(url) {
    document.body.style.backgroundImage = `url('${url}')`;
    localStorage.setItem("currentBackground", url);
}


function saveBackground(url, name) {
    const backgrounds = JSON.parse(localStorage.getItem("savedBackgrounds") || "[]");
    const alreadyExists = backgrounds.some((bg) => bg.url === url || DEFAULT_BACKGROUND.url === url);

    if (!alreadyExists) {
        backgrounds.push({ url, name });
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


backgroundSelect.addEventListener("change", () => {
    const selectedBackground = backgroundSelect.value;
    updateBackground(selectedBackground);
});


backgroundForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const backgroundUrl = backgroundInput.value.trim();
    const backgroundName = backgroundNameInput.value.trim() || "Sem Nome";

    if (backgroundUrl) {
        saveBackground(backgroundUrl, backgroundName);
        updateBackground(backgroundUrl);
        backgroundInput.value = "";
        backgroundNameInput.value = "";
    } else {
        alert("Insira uma URL válida para a imagem de fundo!");
    }
});


removeBackgroundButton.addEventListener("click", removeSelectedBackground);


document.addEventListener("DOMContentLoaded", () => {
    const allBackgrounds = loadBackgrounds();
    const savedBackground = localStorage.getItem("currentBackground") || DEFAULT_BACKGROUND.url;
    updateBackground(savedBackground);
    backgroundSelect.value = savedBackground;
});