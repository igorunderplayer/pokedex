const API_POKEMONS = "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0";
const API_IMAGENS = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

let apiPaginaProximo = "";
let apiPaginaAnterior = "";

let pokemons = [];

const loading = document.createElement("div");
loading.classList.add("loader");


document.addEventListener("DOMContentLoaded", () => {
    const btnProximo = document.getElementById("btnProximo");
    const btnAnterior = document.getElementById("btnAnterior");
    const caixaPokemons = document.getElementById("caixaPokemons");

    buscarPokemons(API_POKEMONS);

    btnProximo.addEventListener("click", () => {
        if (apiPaginaProximo) buscarPokemons(apiPaginaProximo);
    });

    btnAnterior.addEventListener("click", () => {
        if (apiPaginaAnterior) buscarPokemons(apiPaginaAnterior);
    });

    function buscarPokemons(url) {
        pokemons = [];
        caixaPokemons.innerHTML = "";
        caixaPokemons.append(loading);

        fetch(url, { headers: { "Accept": "*" } })
            .then(res => res.json())
            .then(data => {
                apiPaginaAnterior = data.previous
                apiPaginaProximo = data.next
                pokemons = data.results

                caixaPokemons.innerHTML = "";
                pokemons.forEach(pokemon => {
                    // Extrai apenas o ID do pokemon para obter sprite do pokemon (remove link da api original e remove o / no final)
                    const urlImagemPokemon = API_IMAGENS + pokemon.url.split("pokemon")[1].slice(0, -1) + ".png"

                    const containerPokemon = document.createElement("div");
                    const imagemPokemon = document.createElement("img");
                    const nomePokemon = document.createElement("span");

                    containerPokemon.classList.add("pokemon");

                    nomePokemon.textContent = pokemon.name;

                    imagemPokemon.width = 96
                    imagemPokemon.height = 96
                    imagemPokemon.src = urlImagemPokemon

                    containerPokemon.append(nomePokemon);
                    containerPokemon.append(imagemPokemon);
                    caixaPokemons.append(containerPokemon);

                    btnProximo.disabled = !apiPaginaProximo
                    btnAnterior.disabled = !apiPaginaAnterior

                });
            });
    }
})
