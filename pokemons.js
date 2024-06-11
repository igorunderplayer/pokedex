const POKE_QUANTIDADE = 20

const API_POKEMONS = `https://pokeapi.co/api/v2/pokemon/?limit=${POKE_QUANTIDADE}&offset=0`;
const API_IMAGENS = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

let apiPaginaProximo = "";
let apiPaginaAnterior = "";

let pokemons = [];


// Elemento de carregamento "loading"
const loading = document.createElement("div");
loading.classList.add("loader");


document.addEventListener("DOMContentLoaded", () => {
    const btnProximo = document.getElementById("btnProximo");
    const btnAnterior = document.getElementById("btnAnterior");
    const caixaPokemons = document.getElementById("caixaPokemons");
    const modalContainer = document.getElementById("modalContainer");

    buscarPokemons(API_POKEMONS);

    btnProximo.addEventListener("click", () => {
        if (apiPaginaProximo) buscarPokemons(apiPaginaProximo);
    });

    btnAnterior.addEventListener("click", () => {
        if (apiPaginaAnterior) buscarPokemons(apiPaginaAnterior);
    });

    document.addEventListener("click", (event) => {
        if (event.target == modalContainer || event.target.id == "fecharModal") {
            modalContainer.style.display = "none";
        }
    });

    function buscarPokemons(url) {
        pokemons = [];
        caixaPokemons.innerHTML = "";
        caixaPokemons.append(loading);

        fetch(url, { headers: { "Accept": "application/json" } })
            .then(res => res.json())
            .then(data => {
                apiPaginaAnterior = data.previous ?? "";
                apiPaginaProximo = data.next ?? "";
                pokemons = data.results ?? "";

                caixaPokemons.innerHTML = "";

                // Desabilita os botoes que não tiver um url disponível
                btnProximo.disabled = !apiPaginaProximo;
                btnAnterior.disabled = !apiPaginaAnterior;

                pokemons.forEach(pokemon => {
                    // Extrai apenas o ID do pokemon para obter sprite do pokemon (remove link da api original e remove o / no final)
                    const pokemonId = pokemon.url.split("pokemon")[1].slice(0, -1);
                    const urlImagemPokemon = API_IMAGENS + pokemonId + ".png";

                    const containerPokemon = document.createElement("div");
                    const imagemPokemon = document.createElement("img");
                    const nomePokemon = document.createElement("span");

                    containerPokemon.classList.add("pokemon");

                    nomePokemon.textContent = pokemon.name;

                    imagemPokemon.width = 96;
                    imagemPokemon.height = 96;
                    imagemPokemon.src = urlImagemPokemon;

                    containerPokemon.append(nomePokemon);
                    containerPokemon.append(imagemPokemon);
                    caixaPokemons.append(containerPokemon);

                    containerPokemon.addEventListener('click', () => {
                        modalContainer.style.display = "flex";
                        const elementoNomePokemon = document.getElementById("modalPokemonNome");
                        const elementoImagemPokemon = document.getElementById("modalPokemonImagem");
                        const elementoPokemonStats = document.getElementById("pokemonStats");

                        elementoPokemonStats.innerHTML = "";
                        elementoNomePokemon.innerText = pokemon.name;
                        elementoImagemPokemon.src = urlImagemPokemon;

                        fetch(pokemon.url, { headers: { "Accept": "application/json" } })
                            .then(res => res.json())
                            .then(dadosPokemon => {
                                dadosPokemon.stats.forEach(stat => {
                                    const spanStatus = document.createElement('span');
                                    spanStatus.innerText = `${stat.stat.name}: ${stat.base_stat}`;

                                    elementoPokemonStats.append(spanStatus);
                                })
                            })
                    })
                });
            });
    }
});
