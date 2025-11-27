import { loginUser } from '../../api.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dados = {
            email: form.email.value,
            password: form.password.value
        };

        const resposta = await loginUser(dados);

        if (!resposta) {
            alert('Falha na conexão com o servidor.');
            return;
        }

        if (resposta.ok) {
            const resultado = await resposta.json();

            // Salva o token JWT no localStorage
            localStorage.setItem('token', resultado.token);

            alert(`Login realizado com sucesso! Bem-vindo, ${resultado.name}`);
            window.location.href = '../../home/index.html';
        } else {
            alert('Credenciais inválidas. Verifique e tente novamente.');
        }
    });

    const funcaoSenha = document.getElementById('funcaoSenha');
    const senha = document.getElementById('senha');

    funcaoSenha.addEventListener('click', () => {
        const tipo = senha.getAttribute('type') === 'password' ? 'text' : 'password';
        senha.setAttribute('type', tipo);
        funcaoSenha.classList.toggle('fa-eye');
        funcaoSenha.classList.toggle('fa-eye-slash');
    });
});