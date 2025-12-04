const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', function () {
    // Localiza o formulário pelo ID
    const formCadastro = document.getElementById('form-cadastro-musica');

    const inputImagem = document.getElementById('imagem');
    const labelImagem = document.querySelector('label[for="imagem"]');
    const inputMp3 = document.getElementById('arquivoMp3');
    const labelMp3 = document.querySelector('label[for="arquivoMp3"]');

    const fileElements = [
        { input: inputImagem, label: labelImagem, defaultText: 'Imagem' },
        { input: inputMp3, label: labelMp3, defaultText: 'Arquivo MP3' }
    ];

    /**
     *  atualizar o label quando um arquivo é selecionado.
     * @param {HTMLInputElement} inputElement - O input type="file".
     * @param {HTMLLabelElement} labelElement - O label associado.
     * @param {string} defaultText - O texto original do label.
     */
    function updateFileLabel(inputElement, labelElement, defaultText) {
        if (inputElement.files && inputElement.files.length > 0) {
            const fileName = inputElement.files[0].name;
            const maxChars = 30;

            const displayFileName = fileName.length > maxChars
                ? fileName.substring(0, maxChars - 3) + '...'
                : fileName;

            labelElement.classList.add('file-selected');
            labelElement.textContent = displayFileName;
        } else {
            labelElement.classList.remove('file-selected');
            labelElement.textContent = defaultText;
        }
    }

    fileElements.forEach(item => {
        item.input.addEventListener('change', () => {
            updateFileLabel(item.input, item.label, item.defaultText);
        });
    });

    function resetFileLabels() {
        fileElements.forEach(item => {
            updateFileLabel(item.input, item.label, item.defaultText);
        });
    }

    if (formCadastro) {
        formCadastro.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(this);
            // formData.append("idAlbum: ", 2);

            // const backendUrl = '';

            fetch(`http://localhost:8080/musicas/upload`, {
                method: 'POST',
                // headers: {
                //     'Authorization': `Bearer ${token}`
                // },
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(`Erro no servidor: Status ${response.status}`);
                })
                .then(data => {
                    alert('Música cadastrada com sucesso!');
                    formCadastro.reset();

                    resetFileLabels();

                    // Redireciona para a Home
                    window.location.href = '/home/index.html';
                })
                .catch(error => {
                    console.error('Erro de envio:', error);
                    alert('Houve um erro no cadastro. Verifique o console do navegador e o log do Spring Boot.');
                });
        });
    } else {
        console.error("Erro: Formulário com ID 'form-cadastro-musica' não encontrado.");
    }

    if (formCadastro) {
        formCadastro.addEventListener('reset', resetFileLabels);
    }

    resetFileLabels();
});