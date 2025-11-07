// ===============================================
// --- MENU ---
// ===============================================
import { api } from "../api.js";

// const data = await api();

// console.log(data);

document.addEventListener("DOMContentLoaded", async function () {
  const data = await api(); // busca as playlists
  const container = document.getElementById("playlist-grid");

  if (!data || data.length === 0) {
    container.innerHTML = "<p>Nenhuma playlist encontrada.</p>";
    return;
  }

  // Mapeia cada playlist em HTML
  container.innerHTML = data
    .map(
      (playlist) => `
         <a href="http://127.0.0.1:5500/playlist/Soundwave/index.html?id=${playlist.idPlaylist}">
          <div class="card playlist-card">
              <img src="images/capa_funk.png" alt="Capa da Playlist">
              <div class="card-info">
                  <h3>${playlist.nome}</h3>
                  <p>Usuário: ${playlist.idUsuario}</p>
                  <p>${playlist.musicas.length} músicas</p>
              </div>
          </div>
      `
    )
    .join("");

  const sidebar = document.getElementById("sidebar");
  const toggleMenuButton = document.getElementById("toggle-menu");

  toggleMenuButton.addEventListener("click", function (event) {
    event.preventDefault();
    sidebar.classList.toggle("open");
  });

  // ===============================================
  // --- PLAYER DE MÚSICA ---
  // ===============================================

  const playPauseButton = document.querySelector(".control-icon.play-pause");
  const playerHeartIcon = document.querySelector(".player-heart-icon");

  if (playPauseButton) {
    playPauseButton.addEventListener("click", function () {
      if (this.src.includes("images/musica_pausar.png")) {
        this.src = "images/musica_despausar.png";
        this.alt = "Tocar";
      } else {
        this.src = "images/musica_pausar.png";
        this.alt = "Pausar";
      }
    });
  }

  if (playerHeartIcon) {
    playerHeartIcon.addEventListener("click", function () {
      if (this.src.includes("images/musica_favoritar.png")) {
        this.src = "images/musica_favoritar2.png";
        this.alt = "Favoritar";
      } else {
        this.src = "images/musica_favoritar.png";
        this.alt = "Desfavoritar";
      }
    });
  }
});
