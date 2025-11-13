import { api } from "../api.js";

/**
 * Função 1: Carrega as playlists do banco e exibe na grade da Home
 */
async function carregarPlaylistsDaHome() {
  const container = document.getElementById("playlist-grid");
  if (!container) return; // Se não achar o container, para.

<<<<<<< Updated upstream
  if (!data || data.length === 0) {
    container.innerHTML = "<p>Nenhuma playlist encontrada.</p>";
    return;
  }
=======
  try {
    const data = await api();  // busca as playlists (GET)
    console.log(data)
    if (!data || data.length === 0) {
      // Se não houver playlists, exibe a mensagem no lugar certo
      container.innerHTML = "<p>Nenhuma playlist encontrada. Clique no '+' para criar uma!</p>";
      return;
    }
>>>>>>> Stashed changes

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
                      <p>${playlist.musicas ? playlist.musicas.length : 0} músicas</p>
                  </div>
              </div>
          </div>
      `
    )
    .join("");

<<<<<<< Updated upstream
=======
/**
 * Função 2: Envia a nova playlist para o backend (POST)
 */
async function criarPlaylistNoBackend(nome) {
  const modal = document.getElementById("modal-criar-playlist");
  const inputNomePlaylist = document.getElementById("nome-playlist");

  // O seu backend espera um PlaylistDTO
  const playlistDTO = {
    nome: nome,
    idMusicas: [], // Lista vazia de músicas
    idUsuario: 2   // <-- IMPORTANTE: Verifique se existe um usuário com ID 1 no seu banco!
  };

  try {
    const response = await fetch('http://localhost:8080/playlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistDTO)
    });

    if (response.ok) {
      const playlistCriada = await response.json();
      alert('Playlist "' + playlistCriada.nome + '" criada com sucesso!');
      
      // Limpa o input e fecha o modal
      inputNomePlaylist.value = '';
      modal.style.display = 'none';
      
      // ATUALIZA A TELA!
      carregarPlaylistsDaHome(); // Recarrega a grade da home

    } else {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

  } catch (error) {
    console.error("Erro ao criar playlist:", error);
    alert("Falha ao criar a playlist. Verifique o console.");
  }
}


/**
 * Função 3: Quando a página carregar, ligar todos os botões
 */
document.addEventListener("DOMContentLoaded", function () {
  
  // 1. Carrega as playlists do banco na grade
  carregarPlaylistsDaHome();

  // 2. Lógica do Menu Sidebar
>>>>>>> Stashed changes
  const sidebar = document.getElementById("sidebar");
  const toggleMenuButton = document.getElementById("toggle-menu");

  if(toggleMenuButton) {
    toggleMenuButton.addEventListener("click", function (event) {
      event.preventDefault();
      sidebar.classList.toggle("open");
    });
  }

  // 3. Lógica do Player (deixei como estava)
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

  // 4. Lógica do MODAL (NOVO!)
  const fabButton = document.getElementById('btn-abrir-modal-playlist');
  const modal = document.getElementById('modal-criar-playlist');
  const btnCancelar = document.getElementById('btn-cancelar');
  const formCriarPlaylist = document.getElementById('form-criar-playlist');

  // Abre o modal quando clicar no '+'
  if (fabButton) {
    fabButton.addEventListener('click', function(event) {
        event.preventDefault();
        modal.style.display = 'flex';
    });
  }

  // Fecha o modal ao clicar em "Cancelar"
  if (btnCancelar) {
    btnCancelar.addEventListener('click', function() {
        modal.style.display = 'none';
    });
  }

  // Fecha o modal se clicar fora dele
  if (modal) {
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
  }

  // Envia o formulário para o Backend
  if (formCriarPlaylist) {
    formCriarPlaylist.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const inputNomePlaylist = document.getElementById('nome-playlist');
        const nomePlaylist = inputNomePlaylist.value;
        
        if (nomePlaylist) {
            criarPlaylistNoBackend(nomePlaylist);
        }
    });
  }
});