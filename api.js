export async function api() {
  try {
    const response = await fetch(`http://localhost:8080/playlists`);
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
