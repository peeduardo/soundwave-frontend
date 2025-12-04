document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("lista-musicas");

    function carregarMusicas() {
        fetch("http://localhost:8080/musicas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(musicas => {
                lista.innerHTML = "";

                musicas.forEach(m => {
                    const div = document.createElement("div");
                    div.classList.add("musica-item");

                    div.innerHTML = `
                        <p>${m.nome}</p>
                        <button class="delete-btn" data-id="${m.idMusica}">Excluir</button>
                    `;

                    lista.appendChild(div);
                });

                document.querySelectorAll(".delete-btn").forEach(btn => {
                    btn.addEventListener("click", () => deletar(btn.dataset.id));
                });
            })
            .catch(err => console.error("Erro ao carregar músicas:", err));
    }

    function deletar(id) {
        fetch(`http://localhost:8080/musicas/delete/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao excluir");
                carregarMusicas();
            })
            .catch(err => console.error(err));
    }

    carregarMusicas();
});
