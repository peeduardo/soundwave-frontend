document.addEventListener('DOMContentLoaded', function() {
    // Localiza o formulário pelo ID
    const formCadastro = document.getElementById('form-cadastro-musica');

    if (formCadastro) {
        formCadastro.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const formData = new FormData(this);

            const backendUrl = 'http://localhost:8080/musicas/upload';

            fetch(backendUrl, {
                method: 'POST',
                body: formData 
            })
            .then(response => {
                if (response.ok) { 
                    return response.json();
                }
                throw new Error(`Erro no servidor: Status ${response.status}`);
            })
            .then(data => {
                alert('Música cadastrada com sucesso! Redirecionando...');
                formCadastro.reset(); 
                
                // Redireciona para a Home (ajuste o caminho se necessário)
                window.location.href = '/soundwave-frontend/home/index.html';            })
            .catch(error => {
                console.error('Erro de envio:', error);
                alert('Houve um erro no cadastro. Verifique o console do navegador e o log do Spring Boot.');
            });
        });
    } else {
        console.error("Erro: Formulário com ID 'form-cadastro-musica' não encontrado.");
    }
});