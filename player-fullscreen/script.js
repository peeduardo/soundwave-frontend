document.addEventListener("DOMContentLoaded", () => {


    const container = document.querySelector(".content");
    const background = document.querySelector(".player-container");
    const dados = JSON.parse(localStorage.getItem("musica"));
    const ordem = JSON.parse(localStorage.getItem("ordem"));
    console.log(ordem);
    console.log(dados);


    background.insertAdjacentHTML("afterbegin", `
        <div class="background">
            <img src="${dados.imagem}">
        </div>
    `);
    

  
    container.innerHTML = `
        <div class="song-header">
            <img src="${dados.imagem}" alt="Capa do Álbum" class="album-cover">
            <div class="song-info">
                <h1>${dados.nome}</h1>
                <p>${dados.artista}</p>
            </div>
        </div>

        <div class="progress-container">
            <span class="time current-time">0:00</span>
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
            <span class="time duration">0:00</span>

            <button id="heart" class="heart-btn" onclick="toggleHeart()">♡</button>
        </div>

        <div class="player-buttons">
            <button onclick="voltar()">
                <img src="/player-fullscreen/img/musica_voltar.png" alt="Voltar">
            </button>

            <button class="play" onclick="togglePlay()">
                <img id="playPauseIcon" src="/player-fullscreen/img/musica_despausar.png" alt="Play/Pause">
            </button>

            <button onclick="avancar()">
                <img src="/player-fullscreen/img/musica_avancar.png" alt="Avançar">
            </button>
        </div>

        <audio id="audio-player" src="${dados.musica}"></audio>
    `;


    const audio = document.querySelector("#audio-player");
    const currentTimeEl = document.querySelector(".current-time");
    const durationEl = document.querySelector(".duration");
    const progressEl = document.querySelector(".progress");

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    }

    if (audio) {
        audio.onloadedmetadata = () => {
            durationEl.textContent = formatTime(audio.duration);
            
        };
    
        audio.ontimeupdate = () => {
            currentTimeEl.textContent = formatTime(audio.currentTime);
            const percent = (audio.currentTime / audio.duration) * 100;
            progressEl.style.width = percent + "%";
        };
    }     

});

function togglePlay() {
    const audio = document.querySelector("#audio-player");
    const icon = document.querySelector("#playPauseIcon");

    if (audio.paused) {
        audio.play();
        icon.src = "/player-fullscreen/img/musica_pause.png";
    } else {
        audio.pause();
        icon.src = "/player-fullscreen/img/musica_despausar.png";
    }
}
function avancar() {
    const ordem = JSON.parse(localStorage.getItem("ordem"));
    const dados = JSON.parse(localStorage.getItem("musica"));

    let index = ordem.findIndex(m => Number(m.idMusica) === Number(dados.idMusica));

    if (index === -1) index = 0;

    index = (index + 1) % ordem.length;

    const proxima = ordem[index];
    localStorage.setItem("musica", JSON.stringify(proxima));

    trocarMusica(proxima);
}


function voltar() {
    const audio = document.getElementById("audio-player");

    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        audio.play();
        return;
    }

    const ordem = JSON.parse(localStorage.getItem("ordem"));
    const dados = JSON.parse(localStorage.getItem("musica"));

    let index = ordem.findIndex(m => Number(m.idMusica) === Number(dados.idMusica));

    if (index === -1) index = 0; 

    index = (index - 1 + ordem.length) % ordem.length;

    const anterior = ordem[index];
    localStorage.setItem("musica", JSON.stringify(anterior));

    trocarMusica(anterior);
}

function trocarMusica(m) {
    document.querySelector(".album-cover").src = m.imagem;
    document.querySelector(".song-header h1").textContent = m.nome;
    document.querySelector(".song-header p").textContent = m.artista;
    document.querySelector(".background img").src = m.imagem;
    document.querySelector("#playPauseIcon").src = "/player-fullscreen/img/musica_pause.png";
    const audio = document.querySelector("#audio-player");
    audio.src = m.musica;
    audio.currentTime = 0;
    audio.play();
}
