import { api, decodeJWT } from "../api.js";
const token = localStorage.getItem("token");
console.log(token);

const decode = decodeJWT(token);

console.log(decode.payload.sub);

localStorage.setItem("id", decode.payload.sub);

/**
 * Função 1: Carrega as playlists do banco e exibe na grade da Home
 */
async function carregarPlaylistsDaHome() {
  const container = document.getElementsByClassName("playlist-grid")[0];
  if (!container) return;

  try {
    const data = await api(token);
    console.log(data);

    if (!data || data.length === 0) {
      container.innerHTML = "<p>Nenhuma playlist encontrada. Clique no '+' para criar uma!</p>";
      return;
    }

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
          </a>
        `
      )
      .join("");

  } catch (error) {
    console.error("Erro ao carregar playlists:", error);
  }
}
async function carregarPlaylistsNaSidebar() {
  const playlistContainer = document.getElementById('sidebar-left-playlists');
  if (!playlistContainer) return;

  try {
    const response = await fetch('http://localhost:8080/playlists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Falha ao carregar playlists');
    const playlists = await response.json();

    playlistContainer.innerHTML = '';
    playlists.forEach(playlist => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="http://127.0.0.1:5500/playlist/Soundwave/index.html?id=${playlist.idPlaylist}" class="nav-item">
          <img src="images/capa_funk.png" alt="${playlist.nome}" class="nav-icon playlist-cover">
          <span class="nav-text">${playlist.nome}</span>
        </a>
      `;
      playlistContainer.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar playlists na sidebar:", error);
  }
}


/**
 * Função 2: Envia nova playlist ao backend (POST)
 */
async function criarPlaylistNoBackend(nome) {
  const modal = document.getElementById("modal-criar-playlist");
  const inputNomePlaylist = document.getElementById("nome-playlist");

  const playlistDTO = {
    nome: nome,
    idMusicas: [],
    idUsuario: decode.payload.sub
  };

  try {
    const response = await fetch('http://localhost:8080/playlists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistDTO)
    });

    if (response.ok) {
      const playlistCriada = await response.json();
      alert(`Playlist "${playlistCriada.nome}" criada com sucesso!`);

      inputNomePlaylist.value = '';
      modal.style.display = 'none';

      carregarPlaylistsDaHome();

    } else {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

  } catch (error) {
    console.error("Erro ao criar playlist:", error);
    alert("Falha ao criar a playlist. Verifique o console.");
  }
}



/**
 * Função 3: Inicialização da página
 */
document.addEventListener("DOMContentLoaded", function () {

  carregarPlaylistsDaHome();
  carregarPlaylistsNaSidebar();
  const sidebar = document.getElementById("sidebar");
  const toggleMenuButton = document.getElementById("toggle-menu");

  if (toggleMenuButton) {
    toggleMenuButton.addEventListener("click", function (event) {
      event.preventDefault();
      sidebar.classList.toggle("open");
    });
  }

  const playPauseButton = document.querySelector(".control-icon.play-pause");
  const playerHeartIcon = document.querySelector(".player-heart-icon");

  if (playPauseButton) {
    playPauseButton.addEventListener("click", function () {
      if (this.src.includes("musica_pausar.png")) {
        this.src = "images/musica_despausar.png";
      } else {
        this.src = "images/musica_pausar.png";
      }
    });
  }

  if (playerHeartIcon) {
    playerHeartIcon.addEventListener("click", function () {
      if (this.src.includes("musica_favoritar.png")) {
        this.src = "images/musica_favoritar2.png";
      } else {
        this.src = "images/musica_favoritar.png";
      }
    });
  }

  const fabButton = document.getElementById('btn-abrir-modal-playlist');
  const modal = document.getElementById('modal-criar-playlist');
  const btnCancelar = document.getElementById('btn-cancelar');
  const formCriarPlaylist = document.getElementById('form-criar-playlist');

  if (fabButton) {
    fabButton.addEventListener('click', function (event) {
      event.preventDefault();
      modal.style.display = 'flex';
    });
  }

  if (btnCancelar) {
    btnCancelar.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  }

  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  if (formCriarPlaylist) {
    formCriarPlaylist.addEventListener('submit', function (event) {
      event.preventDefault();
      const inputNomePlaylist = document.getElementById('nome-playlist');
      const nomePlaylist = inputNomePlaylist.value;

      if (nomePlaylist) {
        criarPlaylistNoBackend(nomePlaylist);
      }
    });
  }
});
const campoBusca = document.getElementById("search-bar");
const resultadoBusca = document.getElementById("resultadoBusca");

if (campoBusca) {
  campoBusca.addEventListener("input", async () => {
    const termo = campoBusca.value.trim();

    if (termo.length === 0) {
      resultadoBusca.innerHTML = "";
      return;
    }

    try {
      const resp = await fetch(`http://localhost:8080/musicas/buscar?termo=${termo}`);
      const data = await resp.json();

      if (data.status === "ok") {
        mostrarResultados(data.resultados);
      } else {
        mostrarNaoEncontrado(data.sugestoes);
      }

    } catch (erro) {
      console.error("Erro na busca:", erro);
    }
  });
}

// Função de exibir resultados encontrados
function mostrarResultados(lista) {
  console.log("Resultados encontrados:", lista);
  let imgSrc;
  let arquivoHref;

  resultadoBusca.innerHTML = lista
    .map(m => `
      
      <div class="resultado-item"
      data-musica="http://localhost:8080/${m.caminho_arquivo}"
                 data-imagem="http://localhost:8080/${m.caminho_imagem}"
                 data-id="${m.idMusica}"
                 data-nome="${m.nome}"
                 data-artista="${m.artista}"
                 onclick="navegarMusica(this)">
        <img src="http://localhost:8080/${m.caminho_imagem}" alt="Capa">
          <strong>${m.nome}</strong><br>
          <span>${m.artista ?? ""}</span>
      </div>
    `)
    .join("");
}

// Função quando não encontra nada
function mostrarNaoEncontrado(sugestoes) {
  resultadoBusca.innerHTML = `
    <p class="nao-encontrado">❌ Nenhuma música encontrada</p>
    <h4>Sugestões:</h4>
    ${sugestoes
      .map(m => `<div class="resultado-item"><strong>${m.nome}</strong></div>`)
      .join("")}
  `;
}
function navegarMusica(set) {
  const dados = {
    id: set.dataset.id,
    musica: set.dataset.musica,
    imagem: set.dataset.imagem,
    nome: set.dataset.nome,
    artista: set.dataset.artista
  };

  localStorage.setItem("musica", JSON.stringify(dados));
  window.open("http://127.0.0.1:5500/player-fullscreen/index.html", "_blank");
}

window.navegarMusica = navegarMusica; // 🔥 Torna global mesmo usando module
