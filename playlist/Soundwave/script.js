    // ===============================================
    // --- MENU ---
    // ===============================================
document.addEventListener('DOMContentLoaded', function() {
    
    const sidebar = document.getElementById('sidebar');
    const toggleMenuButton = document.getElementById('toggle-menu');

    toggleMenuButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        sidebar.classList.toggle('open');
    });

    
    // ===============================================
    // --- PLAYER DE MÚSICA ---
    // ===============================================

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

});