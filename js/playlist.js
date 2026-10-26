const tracksDatabase = [
    { id: 1, title: "From Day One / Miss You Again", artist: "Friendly Thug 52 NGG", duration: 180, genre: "Hip-Hop", inPlaylist: false },
    { id: 2, title: "Гостиница Космос", artist: "Mnogoznaal", duration: 210, genre: "Rap", inPlaylist: false },
    { id: 3, title: "Спортивные очки", artist: "Буерак", duration: 205, genre: "Indie", inPlaylist: false },
    { id: 4, title: "zyokyo", artist: "umikaze", duration: 195, genre: "Rock", inPlaylist: false },
    { id: 5, title: "Лиза", artist: "Face", duration: 148, genre: "Rap", inPlaylist: false },
    { id: 6, title: "rent free", artist: "goodnight kisses", duration: 180, genre: "Shoegaze", inPlaylist: false },
    { id: 7, title: "Ветром Снегом Зноем", artist: "Хаски", duration: 251, genre: "Rap", inPlaylist: false },
    { id: 8, title: "Пятый день недели", artist: "Автоспорт", duration: 180, genre: "Shoegaze", inPlaylist: false },
    { id: 9, title: "Pogovorim", artist: "Roxxy", duration: 141, genre: "Hip-Hop", inPlaylist: false },
    { id: 10, title: "when you sleep", artist: "my bloody valentine", duration: 252, genre: "Indie", inPlaylist: false },
];

let searchQuery = "";
const MAX_PLAYLIST_DURATION = 900;

const catalogContainer = document.getElementById("catalog-container");
const searchInput = document.getElementById("search-input");
const searchMessage = document.getElementById("search-message");
const limitMessage = document.getElementById("limit-message");
const trackCountDisplay = document.getElementById("track-count");
const totalDurationDisplay = document.getElementById("total-duration");

function render() {
    catalogContainer.textContent = "";
    searchMessage.textContent = "";
    limitMessage.textContent = "";

    const filteredTracks = tracksDatabase.filter(track => {
        const query = searchQuery.toLowerCase();
        return track.title.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query);
    });

    if (filteredTracks.length === 0) {
        searchMessage.textContent = "No tracks found.";
        return;
    }

    let currentTotalSeconds = 0;
    let currentCount = 0;

    for (const track of tracksDatabase) {
        if (track.inPlaylist) {
            currentTotalSeconds += track.duration;
            currentCount ++;
        }
    }

    trackCountDisplay.textContent = currentCount;
    const minutes = Math.floor(currentTotalSeconds / 60);
    const seconds = currentTotalSeconds % 60;
    totalDurationDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    for (const track of filteredTracks) {
        const card = document.createElement("div");
        card.classList.add("track-card");

        if (track.inPlaylist) {
            card.classList.add("in-playlist");
        }

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("track-info");

        const titleEl = document.createElement("h4");
        titleEl.textContent = track.title;

        const detailsEl = document.createElement("p");
        const tMin = Math.floor(track.duration / 60);
        const tSec = track.duration % 60;
        detailsEl.textContent = `${track.artist} | ${track.genre} | ${tMin}:${tSec < 10 ? '0' : ''}${tSec}`;

        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(detailsEl);

        const actionBtn = document.createElement("button");
        actionBtn.classList.add("btn", "action-btn");
        actionBtn.dataset.id = track.id;

        if (track.inPlaylist) {
            actionBtn.textContent = "Remove";
            actionBtn.classList.add("remove-btn");
        } else {
            actionBtn.textContent = "Add";
        }

        card.appendChild(infoDiv);
        card.appendChild(actionBtn);
        catalogContainer.appendChild(card);
    }
}

catalogContainer.addEventListener("click", function(event) {
    const target = event.target;
    if (!target.classList.contains("action-btn")) return;

    const trackId = Number(target.dataset.id);
    const track = tracksDatabase.find(t => t.id === trackId);

    if (!track) return;

    if (!track.inPlaylist) {
        let currentTotalSeconds = 0;
        for (const t of tracksDatabase) {
            if (t.inPlaylist) currentTotalSeconds += t.duration;
        }

        if (currentTotalSeconds + track.duration > MAX_PLAYLIST_DURATION) {
            limitMessage.textContent = "Playlist cannot be longer than 15 minutes!";
            return;
        }

        track.inPlaylist = true;
    } else {
        track.inPlaylist = false;
    }

    render();
});

searchInput.addEventListener("input", function(event) {
    searchQuery = event.target.value;
    render();
});

render();