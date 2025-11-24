const BASE_URL = 'http://localhost:8080'

export async function registerUser(dados) {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        return response
    } catch (erro) {
        console.error('Erro na requisição de cadastro:', erro)
        return null
    }
}

export async function loginUser(dados) {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        return response
    } catch (erro) {
        console.error('Erro na requisição de login:', erro)
        return null
    }
}

export async function getPlaylists() {
    try {
        const response = await fetch(`${BASE_URL}/playlists`)
        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`)
        return await response.json()
    } catch (erro) {
        console.error('Erro ao buscar playlists:', erro)
        return []
    }
}
