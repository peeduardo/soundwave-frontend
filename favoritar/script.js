const ID_USUARIO_LOGADO = 1;

document.addEventListener('DOMContentLoaded', function () {
    carregarFavoritos();
    carregarPlaylistsNaSidebar();
    configurarSidebar();
});

async function carregarFavoritos() {
    const trackContainer = document.getElementById('track-list-container');
    
    try {
        console.log("Busca iniciada..."); 
        const response = await fetch(`http://localhost:8080/favoritos/listar/${ID_USUARIO_LOGADO}`);
        
        if (!response.ok) throw new Error('Erro ao buscar favoritos');
        
        const listaFavoritos = await response.json();
        console.log("Dados recebidos do Java:", listaFavoritos); 

        trackContainer.innerHTML = '';

        if (listaFavoritos.length === 0) {
            trackContainer.innerHTML = '<p class="empty-playlist-message">Você ainda não curtiu nenhuma música.</p>';
            return;
        }

        // Renderiza cada música
        listaFavoritos.forEach(favorito => {
            const musica = favorito.musica; 
            
            // usa a imagem do banco se existir, ou a padrão local se não existir)
            // Prioridade: caminhoImagem do banco > imagem do banco > padrão local
            let imagemBanco = musica.caminhoImagem || musica.caminho_imagem || musica.imagem;
            
            // Define a imagem padrão(mudar para imagem padrao))
            let imgSrc = 'images/capa_mpb.png';

            if (imagemBanco) {
                if (imagemBanco.startsWith('http') || imagemBanco.startsWith('data:')) {
                    imgSrc = imagemBanco;
                } 
                // Se for apenas o nome do arquivo (ex: 'capa.jpg'), adiciona o localhost
                else if (!imagemBanco.includes('/')) {
                     // Se não tem upload de imagem real ainda, pode comentar a linha abaixo e deixar usar a padrão
                     // imgSrc = `http://localhost:8080/${imagemBanco}`; 
                     imgSrc = 'images/capa_mpb.png'; 
                }
                else {
                    imgSrc = imagemBanco;
                }
            }
            
            let nomeMusica = musica.nome || "Sem Nome";
            let nomeArtista = musica.artista || musica.genero || "Artista Desconhecido";
            let duracao = musica.duracaoSegundos || musica.duracao_segundos || 0;

            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            
            trackItem.innerHTML = `
                <div class="track-info">
                    <img src="${imgSrc}" alt="Capa" onerror="this.src='images/capa_mpb.png'">
                    <div>
                        <span class="track-title" style="color: white; font-weight: 600;">${nomeMusica}</span>
                        <p class="track-artist">${nomeArtista}</p>
                    </div>
                </div>
                <span class="track-duration">${formatDuration(duracao)}</span>
                
                <i class="fas fa-heart track-like liked" 
                   style="color: #8A054C; cursor: pointer;" 
                   onclick="removerFavorito(${musica.idMusica || musica.id}, this)"
                   title="Remover dos favoritos"></i>
            `;
            
            trackContainer.appendChild(trackItem);
        });

    } catch (error) {
        console.error("Erro CRÍTICO:", error);
        trackContainer.innerHTML = '<p style="color:white; padding:20px;">Erro ao carregar. Abra o Console (F12) para ver os detalhes.</p>';
    }
}

async function removerFavorito(idMusica, elementoIcone) {
    if(!confirm("Remover esta música dos favoritos?")) return;

    try {
        console.log("Tentando remover música ID:", idMusica);
        const url = `http://localhost:8080/favoritos/toggle?idUsuario=${ID_USUARIO_LOGADO}&idMusica=${idMusica}`;
        const response = await fetch(url, { method: 'POST' });
        
        if (response.ok) {
            const linhaMusica = elementoIcone.closest('.track-item');
            linhaMusica.style.opacity = '0';
            setTimeout(() => linhaMusica.remove(), 300);
        } else {
            alert("Erro ao remover.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
}

function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

async function carregarPlaylistsNaSidebar() {
    const playlistContainer = document.getElementById('sidebar-playlists');
    if (!playlistContainer) return;
    try {
        const response = await fetch('http://localhost:8080/playlists');
        if (response.ok) {
            const playlists = await response.json();
            playlistContainer.innerHTML = '';
            playlists.forEach(playlist => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="/playlist/Soundwave/index.html?id=${playlist.idPlaylist}" class="nav-item">
                        <img src="images/capa_rock.png" class="nav-icon"> 
                        <span class="nav-text">${playlist.nome}</span>
                    </a>`;
                playlistContainer.appendChild(li);
            });
        }
    } catch (error) { console.log("Erro sidebar (ignorar por enquanto)"); }
}

function configurarSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleMenuButton = document.getElementById('toggle-menu');
    if (toggleMenuButton && sidebar) {
        toggleMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.classList.toggle('open');
        });
    }
}