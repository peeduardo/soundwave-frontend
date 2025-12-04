/**
 * playlist-page.js
 * Versão limpa e consolidada das funções da página de playlist.
 */
const token = localStorage.getItem("token");
console.log(token);
const id = localStorage.getItem("id")
/* ===================================================
   FUNÇÕES DE CARREGAMENTO DA PÁGINA
   =================================================== */

/**
 * Função 1: Pega o ID da playlist da URL (ex: ?id=5)
 */
function getPlaylistIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    console.error("Nenhum ID de playlist encontrado na URL.");
    alert("Erro: Playlist não especificada.");
    window.location.href = "http://127.0.0.1:5500/home/index.html";
  }
  return id;
}

/**
 * Função 2: Busca os dados de UMA playlist específica no backend
 */
async function fetchPlaylistData(id) {
  try {
    const response = await fetch(`http://localhost:8080/playlists/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: Falha ao buscar dados da playlist.`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados da playlist:", error);
    alert(error.message);
    return null;
  }
}

/**
 * Função 3: Atualiza o HTML da página com os dados da playlist
 */
function renderPlaylistData(playlist) {
  if (!playlist) return;
  const nameEl = document.getElementById('playlist-name');
  const coverEl = document.getElementById('playlist-cover');
  const trackContainer = document.getElementById('track-list-container');

  if (nameEl) nameEl.textContent = playlist.nome || 'Nome não disponível';
  if (coverEl) coverEl.src = playlist.caminho_capa ? `http://localhost:8080/${playlist.caminho_capa}` : 'images/capa_funk.png';
  if (!trackContainer) return;

  trackContainer.innerHTML = '';

  if (playlist.musicas && playlist.musicas.length > 0) {
    playlist.musicas.forEach(musica => {
      const trackItem = document.createElement('div');
      trackItem.className = 'track-item';
      const imgSrc = musica.caminho_imagem ? `http://localhost:8080/${musica.caminho_imagem}` : 'images/capa_mpb.png';
      const arquivoHref = musica.caminho_arquivo ? `http://localhost:8080/${musica.caminho_arquivo}` : '#';

      trackItem.innerHTML = `
        <div class="track-info">
          <img src="${imgSrc}" alt="Capa">
          <div>
            <a href="${arquivoHref}" target="_blank" class="track-title">${musica.nome || 'Título'}</a>
            <p class="track-artist">${musica.genero || 'Artista Desconhecido'}</p>
          </div>
        </div>
        <span class="track-duration">${formatDuration(musica.duracaoSegundos)}</span>
        <i class="fas fa-heart track-like" title="Curtir"></i>
      `;
      trackContainer.appendChild(trackItem);
    });
  } else {
    trackContainer.innerHTML = '<p class="empty-playlist-message">Nenhuma música foi adicionada a esta playlist ainda.</p>';
  }
}

<<<<<<< Updated upstream
=======
async function salvarFavorito(musica) {
  const dados = {
    idMusica: musica,
    idUsuario: 2
  }
  console.log(dados)
  try {
    const response = await fetch(`http://localhost:8080/favoritos/toggle?idUsuario=${id}&idMusica=${musica}`, {

      method: 'POST',
      headers: { 'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
       },
      // body: JSON.stringify(dados)
    });
    console.log(await response.json())
    if (!response.ok) throw new Error('Falha ao favoritar');

    alert("Músicas favoritada com sucesso!");
  } catch (error) {
    console.error("Erro ao favoritar músicas:", error);
    alert("Houve um erro ao favoritar as músicas. Tente novamente.");
  }
}

>>>>>>> Stashed changes
/**
 * Função 4: Busca as playlists para a sidebar (igual à da Home)
 */
async function carregarPlaylistsNaSidebar() {
  const playlistContainer = document.getElementById('sidebar-playlists');
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
          <img src="images/capa_mpb.png" alt="${playlist.nome}" class="nav-icon playlist-cover">
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
 * Função 5: Carrega os dados iniciais da página (assíncrona)
 */
async function carregarDadosDaPagina() {
  const playlistId = getPlaylistIdFromUrl();
  if (playlistId) {
    window.currentPlaylistId = playlistId;
    const playlistData = await fetchPlaylistData(playlistId);
    renderPlaylistData(playlistData);
  }
}

/* ===================================================
   FUNÇÕES DO MODAL "ADICIONAR MÚSICAS"
   =================================================== */

/**
 * Função 6: Abre o modal e busca todas as músicas
 */
async function abrirModalParaAdicionarMusica() {
  const modal = document.getElementById('modal-add-musica');
  const listaContainer = document.getElementById('modal-lista-de-musicas');
  if (!modal || !listaContainer) return;

  listaContainer.innerHTML = '<p>Carregando músicas...</p>';
  modal.style.display = 'flex';

  try {
    const response = await fetch('http://localhost:8080/musicas', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    //   const response = await fetch('http://localhost:8080/musicas');
    if (!response.ok) throw new Error('Falha ao buscar músicas');
    const musicas = await response.json();

    if (!musicas || musicas.length === 0) {
      listaContainer.innerHTML = '<p>Nenhuma música cadastrada no sistema.</p>';
      return;
    }

    listaContainer.innerHTML = '';
    musicas.forEach(musica => {
      const item = document.createElement('label');
      item.className = 'modal-track-item';
      item.setAttribute('data-title', (musica.nome || '').toLowerCase());

      item.innerHTML = `
        <input type="checkbox" class="musica-checkbox" value="${musica.idMusica}">
        <img src="${musica.caminho_imagem ? `http://localhost:8080/${musica.caminho_imagem}` : 'images/capa_mpb.png'}" alt="Capa">
        <div class="modal-track-info">
          <p class="track-title">${musica.nome}</p>
          <p class="track-artist">${musica.genero || 'Desconhecido'}</p>
        </div>
      `;
      listaContainer.appendChild(item);
    });

  } catch (error) {
    console.error("Erro ao carregar músicas no modal:", error);
    listaContainer.innerHTML = '<p style="color: #ff8a8a;">Erro ao carregar músicas.</p>';
  }
}

/**
 * Função 7: Pega os IDs selecionados e salva
 */
async function salvarMusicasNaPlaylist() {
  const modal = document.getElementById('modal-add-musica');
  const idDaPlaylist = window.currentPlaylistId;
  if (!idDaPlaylist) {
    alert('Playlist não encontrada. Recarregue a página.');
    return;
  }

  const checkboxesMarcados = document.querySelectorAll('#modal-lista-de-musicas .musica-checkbox:checked');
  const idsDasMusicas = Array.from(checkboxesMarcados).map(cb => parseInt(cb.value)).filter(Boolean);

  if (idsDasMusicas.length === 0) {
    alert("Você não selecionou nenhuma música.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/playlists/atualizar/${idDaPlaylist}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
      body: JSON.stringify(idsDasMusicas)
    });
    if (!response.ok) throw new Error('Falha ao atualizar a playlist');

    alert("Músicas adicionadas com sucesso!");
    if (modal) modal.style.display = 'none';

    const playlistData = await fetchPlaylistData(idDaPlaylist);
    renderPlaylistData(playlistData);

  } catch (error) {
    console.error("Erro ao salvar músicas:", error);
    alert("Houve um erro ao salvar as músicas. Tente novamente.");
  }
}

/**
 * Função 8: Filtra as músicas no modal
 */
function filtrarMusicasNoModal(filtro) {
  const termo = (filtro || '').toLowerCase();
  const items = document.querySelectorAll('#modal-lista-de-musicas .modal-track-item');
  items.forEach(item => {
    const nomeMusica = item.getAttribute('data-title') || '';
    item.style.display = nomeMusica.includes(termo) ? 'flex' : 'none';
  });
}

/* ===================================================
   FUNÇÕES DO MENU DROPDOWN (EDITAR/EXCLUIR)
   =================================================== */

/**
 * Função 9: Edita o nome da playlist
 */
async function editarNomePlaylist(novoNome) {
  const idDaPlaylist = window.currentPlaylistId;
  const h2Nome = document.getElementById('playlist-name');
  if (!novoNome || (h2Nome && novoNome === h2Nome.textContent)) return;

  try {
    const response = await fetch(`http://localhost:8080/playlists/${idDaPlaylist}/editarNome`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
      body: JSON.stringify({ nome: novoNome })
    });
    if (!response.ok) throw new Error('Falha ao editar o nome.');

    alert('Nome atualizado com sucesso!');
    if (h2Nome) h2Nome.textContent = novoNome;
  } catch (error) {
    console.error("Erro ao editar nome:", error);
    alert(error.message);
  }
}

/**
 * Função 10: Exclui a playlist
 */
async function excluirPlaylist() {
  const idDaPlaylist = window.currentPlaylistId;
  const nomeDaPlaylist = document.getElementById('playlist-name')?.textContent || '';
  if (!confirm(`Tem certeza que deseja excluir a playlist "${nomeDaPlaylist}"?`)) return;

  try {
    const response = await fetch(`http://localhost:8080/playlists/${idDaPlaylist}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error('Falha ao excluir a playlist.');

    alert('Playlist excluída com sucesso.');
    window.location.href = "http://127.0.0.1:5500/home/index.html";
  } catch (error) {
    console.error("Erro ao excluir playlist:", error);
    alert(error.message);
  }
}

/**
 * Função 11: Abre o modal de edição do nome
 */
function abrirModalParaEditarNome() {
  const modal = document.getElementById('modal-editar-playlist');
  const inputNome = document.getElementById('nome-playlist-editar');
  const nomeAtual = document.getElementById('playlist-name')?.textContent || '';
  if (!modal || !inputNome) return;
  inputNome.value = nomeAtual;
  modal.classList.add('show');
}

/* ===================================================
   HELPERS
   =================================================== */

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

/* ===================================================
   INICIALIZAÇÃO: EVENTOS DO DOM
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // Carregamentos iniciais
  carregarDadosDaPagina();
  carregarPlaylistsNaSidebar();

  // Menu sidebar
  const sidebar = document.getElementById('sidebar');
  const toggleMenuButton = document.getElementById('toggle-menu');
  if (toggleMenuButton && sidebar) {
    toggleMenuButton.addEventListener('click', function (event) {
      event.preventDefault();
      sidebar.classList.toggle('open');
    });
  }

  // Player controls
  const playPauseButton = document.querySelector('.control-icon.play-pause');
  const playerHeartIcon = document.querySelector('.player-heart-icon');
  if (playPauseButton) {
    playPauseButton.addEventListener('click', function () {
      const img = this;
      if (img.src.includes('musica_pausar.png')) {
        img.src = 'images/musica_despausar.png';
        img.alt = 'Tocar';
      } else {
        img.src = 'images/musica_pausar.png';
        img.alt = 'Pausar';
      }
    });
  }
  if (playerHeartIcon) {
    playerHeartIcon.addEventListener('click', function () {
      const img = this;
      if (img.src.includes('musica_favoritar.png')) {
        img.src = 'images/musica_favoritar2.png';
        img.alt = 'Favoritar';
      } else {
        img.src = 'images/musica_favoritar.png';
        img.alt = 'Desfavoritar';
      }
    });
  }

  // Main play button
  const mainPlayButton = document.getElementById('main-play-button');
  if (mainPlayButton) {
    mainPlayButton.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (!img) return;
      if (img.src.includes('musica_pausar.png')) {
        img.src = 'images/musica_despausar.png';
        img.alt = 'Tocar';
      } else {
        img.src = 'images/musica_pausar.png';
        img.alt = 'Pausar';
      }
    });
  }

  // Dropdown (3 pontos)
  const btnMoreOptions = document.getElementById('btn-more-options');
  const dropdownMenu = document.getElementById('playlist-dropdown-menu');
  if (btnMoreOptions && dropdownMenu) {
    btnMoreOptions.addEventListener('click', function (event) {
      event.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
  }

  // Modal adicionar música
  const btnAbrirModalMusica = document.getElementById('btn-abrir-modal-musica');
  const modalMusica = document.getElementById('modal-add-musica');
  const btnCancelarMusica = document.getElementById('btn-cancelar-musica');
  const formAddMusica = document.getElementById('form-add-musica');
  const inputFiltro = document.getElementById('input-filtro-musica');

  if (btnAbrirModalMusica) {
    btnAbrirModalMusica.addEventListener('click', function (e) {
      e.preventDefault();
      abrirModalParaAdicionarMusica();
    });
  }
  if (btnCancelarMusica && modalMusica) {
    btnCancelarMusica.addEventListener('click', () => modalMusica.style.display = 'none');
    modalMusica.addEventListener('click', function (event) {
      if (event.target === modalMusica) modalMusica.style.display = 'none';
    });
  }
  if (formAddMusica) {
    formAddMusica.addEventListener('submit', function (event) {
      event.preventDefault();
      salvarMusicasNaPlaylist();
    });
  }
  if (inputFiltro) {
    inputFiltro.addEventListener('keyup', function () {
      filtrarMusicasNoModal(this.value);
    });
  }

  // Modal editar nome & excluir
  const btnEdit = document.getElementById('btn-edit-playlist');
  const btnDelete = document.getElementById('btn-delete-playlist');
  const modalEditar = document.getElementById('modal-editar-playlist');
  const formEditar = document.getElementById('form-editar-playlist');
  const btnCancelarEditar = document.getElementById('btn-cancelar-editar');

  if (btnEdit) {
    btnEdit.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      abrirModalParaEditarNome();
      if (dropdownMenu) dropdownMenu.classList.remove('show');
    });
  }
  if (btnDelete) {
    btnDelete.addEventListener('click', function (event) {
      event.preventDefault();
      excluirPlaylist();
      if (dropdownMenu) dropdownMenu.classList.remove('show');
    });
  }
  if (btnCancelarEditar && modalEditar) {
    btnCancelarEditar.addEventListener('click', () => modalEditar.classList.remove('show'));
  }
  if (formEditar) {
    formEditar.addEventListener('submit', function (event) {
      event.preventDefault();
      const inputNome = document.getElementById('nome-playlist-editar');
      if (inputNome) editarNomePlaylist(inputNome.value);
      if (modalEditar) modalEditar.classList.remove('show');
    });
  }

  // Fecha dropdown e modal-edit ao clicar fora
  window.addEventListener('click', function (event) {
    if (dropdownMenu && dropdownMenu.classList.contains('show') && !btnMoreOptions?.contains(event.target)) {
      dropdownMenu.classList.remove('show');
    }
    if (modalEditar && modalEditar.classList.contains('show') && !modalEditar.contains(event.target) && !btnEdit?.contains(event.target)) {
      modalEditar.classList.remove('show');
    }
  });
<<<<<<< Updated upstream
});
=======
});

function navegarMusica(set) {

  const dados = {
    id: set.dataset.id,
    musica: set.dataset.musica,
    imagem: set.dataset.imagem,
    nome: set.dataset.nome,
    artista: set.dataset.artista
  }
  const padronizada = padronizar(data.musicas);


  localStorage.setItem("ordem", JSON.stringify(padronizada))
  console.log(padronizada)
  localStorage.setItem("musica", JSON.stringify(dados))
  window.open("http://127.0.0.1:5500/player-fullscreen/index.html", "_blank")
}

function padronizar(musicas) {
  const baseUrl = "http://localhost:8080/";

  return musicas.map(m => ({
    ...m,
    imagem: baseUrl + m.caminho_imagem,
    musica: baseUrl + m.caminho_arquivo
  }));
  async function removerDaPlaylist(idPlaylist, idMusica) {
    if (!confirm("Deseja remover esta música da playlist?")) return;

    try {
      const resp = await fetch(`http://localhost:8080/playlists/${idPlaylist}/musicas/${idMusica}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!resp.ok) {
        throw new Error("Erro ao remover música da playlist");
      }

      alert("Música removida!");
      location.reload();

    } catch (err) {
      console.error(err);
      alert("Erro ao remover música.");
    }
  }

}
async function removerMusica(idPlaylist, idMusica) {
  const resp = await fetch(`http://localhost:8080/playlist/${idPlaylist}/musicas/${idMusica}`, {
    method: "DELETE",
    headers: { 'Authorization': `Bearer ${token}` }

  });

  if (resp.ok) {
    alert("Música removida!");
    carregarMusicas();
  } else {
    alert("Erro ao remover a música da playlist");
  }
}

>>>>>>> Stashed changes
