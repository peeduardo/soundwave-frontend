// página de Cadastro de Música
import { registerMusic } from "../api.js"; 

document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona o formulário de cadastro pela classe
    const form = document.querySelector('.form-cadastro'); 
    
    // Cria um elemento para mostrar o feedback
    const feedback = document.createElement('p');
    feedback.style.marginTop = '15px';
    form.appendChild(feedback);

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault(); // Impede o envio padrão

            // 1. Coleta todos os dados do formulário, incluindo ARQUIVOS, de forma correta (FormData)
            const formData = new FormData(form);

            feedback.textContent = 'Cadastrando música...';
            feedback.style.color = 'orange';

            try {
                // 2. Chama a função POST para enviar os dados para a API
                const result = await registerMusic(formData);
                
                // 3. Sucesso
                feedback.textContent = `✅ Música "${formData.get('musica')}" cadastrada com sucesso!`;
                feedback.style.color = 'green';
                form.reset(); 

            } catch (error) {
                // 4. Erro
                feedback.textContent = `❌ Falha no cadastro: ${error.message}`;
                feedback.style.color = 'red';
            }
        });
    }
});