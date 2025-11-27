export async function api(token) {
  try {
    const response = await fetch('http://localhost:8080/playlists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    alert("Erro ao buscar :", error.message);
    return null;
  }
}
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
export function decodeJWT(token) {
    const [header, payload, signature] = token.split('.');

    function base64UrlDecode(str) {
        // Ajusta para Base64 tradicional
        str = str.replace(/-/g, '+').replace(/_/g, '/');

        // Preenche com '=' se faltar
        const pad = str.length % 4;
        if (pad) {
            str += '='.repeat(4 - pad);
        }
        return atob(str);
    }

    try {
        const headerJSON = JSON.parse(base64UrlDecode(header));
        const payloadJSON = JSON.parse(base64UrlDecode(payload));

        return {
            header: headerJSON,
            payload: payloadJSON,
            signature: signature
        };
    } catch (err) {
        console.error("Token inválido", err);
        return null;
    }
}
