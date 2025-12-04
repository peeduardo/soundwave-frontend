const ID_USUARIO_LOGADO = localStorage.getItem("id");
const token = localStorage.getItem("token");

let data;
document.addEventListener('DOMContentLoaded', function () {
    carregarFavoritos();
    carregarPlaylistsNaSidebar();
    configurarSidebar();
});

async function carregarFavoritos() {
    const trackContainer = document.getElementById('track-list-container');

    try {
        console.log("Busca iniciada...");
        const response = await fetch(
            `http://localhost:8080/favoritos/listar/${ID_USUARIO_LOGADO}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) throw new Error('Erro ao buscar favoritos');

        const listaFavoritos = await response.json();
        console.log("Dados recebidos do Java:", listaFavoritos);
        data = listaFavoritos;
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
            let imgSrc = 'images/capa_funk.png';

            if (imagemBanco) {
                if (imagemBanco.startsWith('http') || imagemBanco.startsWith('data:')) {
                    imgSrc = imagemBanco;
                }
                // Se for apenas o nome do arquivo (ex: 'capa.jpg'), adiciona o localhost
                else if (!imagemBanco.includes('/')) {
                    // Se não tem upload de imagem real ainda, pode comentar a linha abaixo e deixar usar a padrão
                    // imgSrc = `http://localhost:8080/${imagemBanco}`; 
                    imgSrc = 'images/capa_funk.png';
                }
                else {
                    imgSrc = imagemBanco;
                }
            }

            let nomeMusica = musica.nome || "Sem Nome";
            let nomeArtista = musica.artista || musica.genero || "Artista Desconhecido";
            let duracao = musica.duracaoSegundos || musica.duracao_segundos || 0;
            const imgSrc2 = musica.caminho_imagem ? `http://localhost:8080/${musica.caminho_imagem}` : 'images/capa_mpb.png';
            const arquivoHref = musica.caminho_arquivo ? `http://localhost:8080/${musica.caminho_arquivo}` : '#';
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';

            trackItem.innerHTML = `
                <div class="track-info"
                data-musica="${arquivoHref}"
                 data-imagem="${imgSrc2}"
                 data-id="${musica.idMusica}"
                 data-nome="${musica.nome}"
                 data-artista="${musica.artista}"
                 onclick="navegarMusica(this)">
                    <img src="http://localhost:8080/${musica.caminho_imagem}" alt="Capa" onerror="this.src='images/capa_mpb.png'">
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
    if (!confirm("Remover esta música dos favoritos?")) return;

    try {
        console.log("Tentando remover música ID:", idMusica);
        const url = `http://localhost:8080/favoritos/toggle?idUsuario=${ID_USUARIO_LOGADO}&idMusica=${idMusica}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

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
        const response = await fetch('http://localhost:8080/playlists', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const playlists = await response.json();
            playlistContainer.innerHTML = '';
            playlists.forEach(playlist => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="/playlist/Soundwave/index.html?id=${playlist.idPlaylist}" class="nav-item">
                        <img src="images/capa_funk.png" class="nav-icon"> 
                        <span class="nav-text">${playlist.nome}</span>
                    </a>`;
                playlistContainer.appendChild(li);
            });
        }
    } catch (error) { console.log("Erro sidebar (ignorar por enquanto)"); }
}
function navegarMusica(set) {

  const dados = {
    id: set.dataset.id,
    musica: set.dataset.musica,
    imagem: set.dataset.imagem,
    nome: set.dataset.nome,
    artista: set.dataset.artista
  }
//   console.log(data)
  const padronizada = padronizar(data);


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
  }))};

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