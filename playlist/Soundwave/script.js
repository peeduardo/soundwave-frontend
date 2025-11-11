/**
 * ===================================================
 * FUNÇÕES DE CARREGAMENTO DA PÁGINA
 * ===================================================
 */

/**
 * Função 1: Pega o ID da playlist da URL (ex: ?id=5)
 */
function getPlaylistIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        console.error("Nenhum ID de playlist encontrado na URL.");
        alert("Erro: Playlist não especificada.");
        window.location.href = "http://127.0.0.1:5500/home/index.html"; // Volta para a home
    }
    return id;
}

/**
 * Função 2: Busca os dados de UMA playlist específica no backend
 */
async function fetchPlaylistData(id) {
    try {
        const response = await fetch(`http://localhost:8080/playlists/${id}`);
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

    // Atualiza o cabeçalho (nome e capa)
    document.getElementById('playlist-name').textContent = playlist.nome;
    
    // (Lembre-se: sua playlist não tem capa, então usaremos um placeholder)
    document.getElementById('playlist-cover').src = "images/capa_funk.png"; // Placeholder
    
    // Pega o container da lista de músicas
    const trackContainer = document.getElementById('track-list-container');
    trackContainer.innerHTML = ''; // Limpa o container

    if (playlist.musicas && playlist.musicas.length > 0) {
        // Se TIVER músicas, cria a lista
        playlist.musicas.forEach(musica => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.innerHTML = `
                <div class="track-info">
                    <img src="${musica.caminho_imagem || 'images/capa_mpb.png'}" alt="Capa">
                    <div>
                        <p class="track-title">${musica.nome}</p>
                        <p class="track-artist">${musica.genero || 'Artista Desconhecido'}</p>
                    </div>
                </div>
                <span class="track-duration">${formatDuration(musica.duracaoSegundos)}</span>
                <i class="fas fa-heart track-like"></i>
            `;
            trackContainer.appendChild(trackItem);
        });
    } else {
        // Se NÃO tiver músicas, exibe a mensagem de "vazio"
        trackContainer.innerHTML = '<p class="empty-playlist-message">Nenhuma música foi adicionada a esta playlist ainda.</p>';
    }
}

/**
 * Função 4: Busca as playlists para a sidebar (igual à da Home)
 */
async function carregarPlaylistsNaSidebar() {
    const playlistContainer = document.getElementById('sidebar-playlists');
    if (!playlistContainer) return;

    try {
        const response = await fetch('http://localhost:8080/playlists');
        const playlists = await response.json();

        playlistContainer.innerHTML = ''; // Limpa a lista
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
 * Função 5 (ASSÍNCRONA) - Para carregar os dados da página
 */
async function carregarDadosDaPagina() {
    const playlistId = getPlaylistIdFromUrl();
    if (playlistId) {
        // Salva o ID globalmente para o modal de adicionar música usar
        window.currentPlaylistId = playlistId; 
        
        const playlistData = await fetchPlaylistData(playlistId);
        renderPlaylistData(playlistData);
    }
}


/**
 * ===================================================
 * FUNÇÕES DO MODAL "ADICIONAR MÚSICAS"
 * ===================================================
 */

/**
 * Função 6: Abre o modal e busca todas as músicas
 */
async function abrirModalParaAdicionarMusica() {
    const modal = document.getElementById('modal-add-musica');
    const listaContainer = document.getElementById('modal-lista-de-musicas');
    listaContainer.innerHTML = '<p>Carregando músicas...</p>'; // Feedback
    modal.style.display = 'flex'; // Mostra o modal

    try {
        // 1. Busca TODAS as músicas no backend (GET /musicas)
        const response = await fetch('http://localhost:8080/musicas');
        if (!response.ok) throw new Error('Falha ao buscar músicas');
        const musicas = await response.json();

        if (musicas.length === 0) {
             listaContainer.innerHTML = '<p>Nenhuma música cadastrada no sistema.</p>';
             return;
        }

        // 2. Limpa o container
        listaContainer.innerHTML = '';
        
        // 3. Popula o modal com as músicas (usando checkbox)
        musicas.forEach(musica => {
            const item = document.createElement('label');
            item.className = 'modal-track-item';
            // Adiciona data-title para o filtro funcionar
            item.setAttribute('data-title', musica.nome.toLowerCase()); 
            
            item.innerHTML = `
                <input type="checkbox" class="musica-checkbox" value="${musica.idMusica}">
                <img src="${musica.caminho_imagem || 'images/capa_mpb.png'}" alt="Capa">
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
    
    // 1. Pega todos os checkboxes que estão MARCADOS
    const checkboxesMarcados = document.querySelectorAll('#modal-lista-de-musicas .musica-checkbox:checked');
    
    // 2. Extrai os IDs (values) deles e transforma em números
    const idsDasMusicas = Array.from(checkboxesMarcados).map(cb => parseInt(cb.value));

    if (idsDasMusicas.length === 0) {
        alert("Você não selecionou nenhuma música.");
        return;
    }

    try {
        // 3. Envia os IDs para o backend (PUT /playlists/atualizar/{id})
        const response = await fetch(`http://localhost:8080/playlists/atualizar/${idDaPlaylist}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(idsDasMusicas) // Envia o array de IDs
        });

        if (!response.ok) throw new Error('Falha ao atualizar a playlist');

        // 4. Sucesso!
        alert("Músicas adicionadas com sucesso!");
        modal.style.display = 'none'; // Fecha o modal

        // 5. ATUALIZA a página para mostrar as novas músicas
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
    const termo = filtro.toLowerCase();
    const items = document.querySelectorAll('#modal-lista-de-musicas .modal-track-item');
    
    items.forEach(item => {
        // Lê o nome da música do atributo 'data-title'
        const nomeMusica = item.getAttribute('data-title'); 
        if (nomeMusica.includes(termo)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * ===================================================
 * FUNÇÕES DO MENU DROPDOWN (EDITAR/EXCLUIR)
 * ===================================================
 */

/**
 * Função 9: Edita o nome da playlist (MODIFICADA)
 * (Agora ela só faz o fetch, não usa mais o prompt)
 */
async function editarNomePlaylist(novoNome) {
    const idDaPlaylist = window.currentPlaylistId;
    const h2Nome = document.getElementById('playlist-name');

    // 1. Verifica se o nome realmente mudou
    if (!novoNome || novoNome === h2Nome.textContent) {
        return; // Sai da função se não houver mudança
    }

    try {
        // 2. Manda a requisição PUT para o backend
        const response = await fetch(`http://localhost:8080/playlists/${idDaPlaylist}/editarNome`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: novoNome })
        });

        if (!response.ok) {
            throw new Error('Falha ao editar o nome.');
        }

        // 3. Sucesso!
        alert('Nome atualizado com sucesso!');
        h2Nome.textContent = novoNome; // Atualiza o nome na tela

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
    const nomeDaPlaylist = document.getElementById('playlist-name').textContent;

    // 1. Pede confirmação
    if (!confirm(`Tem certeza que deseja excluir a playlist "${nomeDaPlaylist}"?`)) {
        return; // Usuário cancelou
    }

    try {
        // 2. Manda a requisição DELETE
        const response = await fetch(`http://localhost:8080/playlists/${idDaPlaylist}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Falha ao excluir a playlist.');
        }

        // 3. Sucesso!
        alert('Playlist excluída com sucesso.');
        window.location.href = "http://127.0.0.1:5500/home/index.html"; // Manda de volta pra Home

    } catch (error) {
        console.error("Erro ao excluir playlist:", error);
        alert(error.message);
    }
}

/**
 * Função 11: Abre o modal de edição (NOVA)
 */
function abrirModalParaEditarNome() {
    const modal = document.getElementById('modal-editar-playlist');
    const inputNome = document.getElementById('nome-playlist-editar');
    const nomeAtual = document.getElementById('playlist-name').textContent;
    
    // 1. Preenche o input com o nome atual da playlist
    inputNome.value = nomeAtual;
    
    // 2. Mostra o modal (usando a classe 'show' do CSS)
    modal.classList.add('show');
}


/**
 * Função Helper: Formata segundos para MM:SS
 */
function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


/**
 * ===================================================
 * CÓDIGO QUE RODA QUANDO A PÁGINA TERMINA DE CARREGAR
 * ===================================================
 */
document.addEventListener('DOMContentLoaded', function() { 
    
    // --- Lógica assíncrona (carregar dados) ---
    carregarDadosDaPagina();
    carregarPlaylistsNaSidebar();

    // --- Lógica do Menu (Síncrona - Roda Imediatamente) ---
    const sidebar = document.getElementById('sidebar');
    const toggleMenuButton = document.getElementById('toggle-menu');
    if(toggleMenuButton) {
        toggleMenuButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            sidebar.classList.toggle('open');
        });
    }
    
    // --- Lógica do Player (Síncrona - Roda Imediatamente) ---
    const playPauseButton = document.querySelector('.control-icon.play-pause');
    const playerHeartIcon = document.querySelector('.player-heart-icon');
    if (playPauseButton) {
        playPauseButton.addEventListener('click', function() {
            if (this.src.includes('images/musica_pausar.png')) {
                this.src = 'images/musica_despausar.png';
                this.alt = 'Tocar'; 
            } else {
                this.src = 'images/musica_pausar.png';
                this.alt = 'Pausar'; 
            }
        });
    }
    if (playerHeartIcon) {
        playerHeartIcon.addEventListener('click', function() {
            if (this.src.includes('images/musica_favoritar.png')) {
                this.src = 'images/musica_favoritar2.png';
                this.alt = 'Favoritar'; 
            } else {
                this.src = 'images/musica_favoritar.png';
                this.alt = 'Desfavoritar'; 
            }
        });
    }

    // --- Lógica do Botão de Play Principal (Síncrona - Roda Imediatamente) ---
    const mainPlayButton = document.getElementById('main-play-button');
    if (mainPlayButton) {
        mainPlayButton.addEventListener('click', function() {
            const img = this.querySelector('img'); 
            if (img.src.includes('images/musica_pausar.png')) {
                img.src = 'images/musica_despausar.png';
                img.alt = 'Tocar'; 
            } else {
                img.src = 'images/musica_pausar.png';
                img.alt = 'Pausar'; 
            }
        });
    }

    // --- LÓGICA DO MENU DROPDOWN (3 PONTOS) ---
    const btnMoreOptions = document.getElementById('btn-more-options');
    const dropdownMenu = document.getElementById('playlist-dropdown-menu');
    
    if (btnMoreOptions) {
        btnMoreOptions.addEventListener('click', function(event) {
            event.stopPropagation(); 
            dropdownMenu.classList.toggle('show');
        });
    }

    // --- LÓGICA DO MODAL DE ADICIONAR MÚSICA ---
    const btnAbrirModalMusica = document.getElementById('btn-abrir-modal-musica');
    const modalMusica = document.getElementById('modal-add-musica');
    const btnCancelarMusica = document.getElementById('btn-cancelar-musica');
    const formAddMusica = document.getElementById('form-add-musica');
    const inputFiltro = document.getElementById('input-filtro-musica');
    if (btnAbrirModalMusica) {
        btnAbrirModalMusica.addEventListener('click', function(event) {
            event.preventDefault();
            abrirModalParaAdicionarMusica(); 
        });
    }
    if (btnCancelarMusica) {
        btnCancelarMusica.addEventListener('click', function() {
            modalMusica.style.display = 'none';
        });
    }
    if(modalMusica) {
        modalMusica.addEventListener('click', function(event) {
            if (event.target === modalMusica) {
                modalMusica.style.display = 'none';
            }
        });
    }
    if (formAddMusica) {
        formAddMusica.addEventListener('submit', function(event) {
            event.preventDefault();
            salvarMusicasNaPlaylist();
        });
    }
    if(inputFiltro) {
        inputFiltro.addEventListener('keyup', function() {
            filtrarMusicasNoModal(this.value);
        });
    }

    // ================================================
    // --- LÓGICA DO NOVO MODAL "EDITAR NOME" ---
    // ================================================
    const btnEdit = document.getElementById('btn-edit-playlist');
    const btnDelete = document.getElementById('btn-delete-playlist');
    const modalEditar = document.getElementById('modal-editar-playlist');
    const formEditar = document.getElementById('form-editar-playlist');
    const btnCancelarEditar = document.getElementById('btn-cancelar-editar');

    // Botão "Editar" (dos 3 pontos) abre o modal
    if (btnEdit) {
        btnEdit.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation(); // Impede o clique de fechar o menu
            abrirModalParaEditarNome(); // Chama a nova função
            dropdownMenu.classList.remove('show'); // Fecha o menu dropdown
        });
    }
    
    // Botão "Excluir" (dos 3 pontos) chama a função de excluir
    if (btnDelete) {
        btnDelete.addEventListener('click', function(event) {
            event.preventDefault();
            excluirPlaylist(); // Chama a nova função
            dropdownMenu.classList.remove('show'); // Fecha o menu dropdown
        });
    }

    // Botão "Cancelar" do modal de editar
    if (btnCancelarEditar) {
        btnCancelarEditar.addEventListener('click', function() {
            modalEditar.classList.remove('show');
        });
    }

    // Botão "Salvar" do modal de editar
    if (formEditar) {
        formEditar.addEventListener('submit', function(event) {
            event.preventDefault();
            const inputNome = document.getElementById('nome-playlist-editar');
            editarNomePlaylist(inputNome.value); // Chama a função com o novo nome
            modalEditar.classList.remove('show'); // Fecha o modal
        });
    }
    
    // Fecha o dropdown E o modal de editar se clicar em qualquer outro lugar
    window.addEventListener('click', function(event) {
        // Fecha o dropdown
        if (dropdownMenu && dropdownMenu.classList.contains('show') && !btnMoreOptions.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }

        // Fecha o modal de editar
        if (modalEditar && modalEditar.classList.contains('show') && !modalEditar.contains(event.target) && !btnEdit.contains(event.target)) {
            modalEditar.classList.remove('show');
        }
    });
});