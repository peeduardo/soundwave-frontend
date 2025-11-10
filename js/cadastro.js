import { registerUser } from './api.js'

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro')
    const fotoInput = document.getElementById('foto')
    const preview = document.getElementById('preview')

    fotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (file) {
            preview.src = URL.createObjectURL(file)
            preview.style.display = 'block'
        } else {
            preview.style.display = 'none'
        }
    })

    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        const dados = {
            name: form.name.value,
            cpf: form.cpf.value,
            email: form.email.value,
            password: form.password.value
        }

        const resposta = await registerUser(dados)
        if (!resposta) {
            alert('Falha na conexão com o servidor.')
            return
        }

        if (resposta.ok) {
            const resultado = await resposta.json()
            alert(`Usuário cadastrado com sucesso! Bem-vindo, ${resultado.name}`)
            window.location.href = '../login/index.html'
        } else {
            alert('Erro ao cadastrar. Verifique os dados e tente novamente.')
        }
    })

    const funcaoSenha = document.getElementById('funcaoSenha')
    const senha = document.getElementById('senha')

    funcaoSenha.addEventListener('click', () => {
        const tipo = senha.getAttribute('type') === 'password' ? 'text' : 'password'
        senha.setAttribute('type', tipo)
        funcaoSenha.classList.toggle('fa-eye')
        funcaoSenha.classList.toggle('fa-eye-slash')
    })
})
