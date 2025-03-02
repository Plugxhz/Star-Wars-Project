document.addEventListener("DOMContentLoaded", async () => {
    const characterContainer = document.getElementById("character-container");
    const planetContainer = document.getElementById("planet-container");
    const movieContainer = document.getElementById("movie-container");
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close");
    let allCharacters = [];
    let allPlanets = [];
    let allMovies = [];

    document.addEventListener("click", (event) => {
        if (event.target.tagName === "IMG") {
            modal.style.display = "flex";
            modalImage.src = event.target.src;
        }
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fechar modal ao clicar fora da imagem
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    
    const characterImages = {
        "Luke Skywalker": "./imagens/pessoas/Luke Skywalker.png",
        "C-3PO": "./imagens/pessoas/C-3PO.png",
        "R2-D2": "./imagens/pessoas/R2-D2.png",
        "Darth Vader": "./imagens/pessoas/Darth Vader.png",
        "Leia Organa": "./imagens/pessoas/Leia Organa.png",
        "Owen Lars": "./imagens/pessoas/Uncle Owen.png",
        "Beru Whitesun lars": "./imagens/pessoas/Uncle Owen.png",
        "R5-D4": "./imagens/pessoas/R5-D4.png",
        "Biggs Darklighter": "./imagens/pessoas/Biggs Darklighter.png",
        "Obi-Wan Kenobi": "./imagens/pessoas/Obi-Wan Kenobi.png"
    };

    const planetImages = {
        "Tatooine": "./imagens/planetas/Tatooine.png",
        "Alderaan": "./imagens/planetas/Alderaan.png",
        "Yavin IV": "./imagens/planetas/Yavin IV.png",
        "Hoth": "./imagens/planetas/Hoth.png",
        "Dagobah": "./imagens/planetas/Dagobah.png",
        "Bespin": "./imagens/planetas/Bespin.png",
        "Endor": "./imagens/planetas/Endor.png",
        "Naboo": "./imagens/planetas/Naboo.png",
        "Coruscant": "./imagens/planetas/Coruscant.png",
        "Kamino": "./imagens/planetas/Kamino.png"
    };

    const movieImages = {
        "A New Hope": "./imagens/filmes/A New Hope.png",
        "The Empire Strikes Back": "./imagens/filmes/The Empire Strikes Back.png",
        "Return of the Jedi": "./imagens/filmes/Return of the Jedi.png",
        "The Phantom Menace": "./imagens/filmes/The Phantom Menace.png",
        "Attack of the Clones": "./imagens/filmes/Attack of the Clones.png",
        "Revenge of the Sith": "./imagens/filmes/Revenge of the Sith.png",
        "The Force Awakens": "./imagens/filmes/The Force Awakens.png",
        "The Last Jedi": "./imagens/filmes/The Last Jedi.png",
        "The Rise of Skywalker": "./imagens/filmes/The Rise of Skywalker.png"
    };

    async function fetchCharacters() {
        try {
            const response = await fetch("https://swapi.dev/api/people/?page=1");
            const data = await response.json();
            allCharacters = data.results.slice(0, 10);
            await fetchMoviesForCharacters();
            renderCharacters(allCharacters);
        } catch (error) {
            console.error("Erro ao carregar personagens:", error);
        }
    }

    async function fetchMoviesForCharacters() {
        const movieCache = {};
        for (let character of allCharacters) {
            character.movies = [];
            for (let filmURL of character.films) {
                if (!movieCache[filmURL]) {
                    try {
                        const response = await fetch(filmURL);
                        const filmData = await response.json();
                        movieCache[filmURL] = filmData.title;
                    } catch (error) {
                        console.error("Erro ao carregar filme:", error);
                        movieCache[filmURL] = "Desconhecido";
                    }
                }
                character.movies.push(movieCache[filmURL]);
            }
        }
    }

    function renderCharacters(characters) {
        characterContainer.innerHTML = "";
        characters.forEach((person) => {
            const card = document.createElement("div");
            card.className = "card";
            const imgSrc = characterImages[person.name] || "./images/default.jpg";
            card.innerHTML = `
                <img src="${imgSrc}" alt="${person.name}">
                <p><strong>${person.name}</strong></p>
                <div class="details hidden">
                    <p><strong>Altura:</strong> ${person.height} cm</p>
                    <p><strong>Peso:</strong> ${person.mass} kg</p>
                    <p><strong>Gênero:</strong> ${person.gender}</p>
                    <p><strong>Filmes:</strong> ${person.movies.join(", ")}</p>
                </div>
            `;
            card.addEventListener("click", () => {
                const details = card.querySelector(".details");
                details.classList.toggle("hidden");
            });
            characterContainer.appendChild(card);
        });
    }

    window.filterCharacters = (gender) => {
        let filteredCharacters = gender === "all" ? allCharacters :
            allCharacters.filter(char => char.gender.toLowerCase() === gender.toLowerCase());
        renderCharacters(filteredCharacters);
    };

    async function fetchPlanets() {
        try {
            const response = await fetch("https://swapi.dev/api/planets/");
            const data = await response.json();
            allPlanets = data.results;
            allPlanets.sort((a, b) => b.residents.length - a.residents.length);
            renderPlanets(allPlanets);
        } catch (error) {
            console.error("Erro ao carregar planetas:", error);
        }
    }

    function renderPlanets(planets) {
        planetContainer.innerHTML = "";
        planets.forEach((planet) => {
            const imgSrc = planetImages[planet.name] || "./images/planets/default.jpg";
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${imgSrc}" alt="${planet.name}">
                <p><strong>${planet.name}</strong></p>
                <div class="details hidden">
                    <p><strong>População:</strong> ${planet.population}</p>
                    <p><strong>Clima:</strong> ${planet.climate}</p>
                    <p><strong>Terreno:</strong> ${planet.terrain}</p>
                    <p><strong>Residentes:</strong> ${planet.residents.length}</p>
                </div>
            `;
            card.addEventListener("click", () => {
                const details = card.querySelector(".details");
                details.classList.toggle("hidden");
            });
            planetContainer.appendChild(card);
        });
    }

    const movieList = [
        { title: "A New Hope", release: 1977, chronological: 4 },
        { title: "The Empire Strikes Back", release: 1980, chronological: 5 },
        { title: "Return of the Jedi", release: 1983, chronological: 6 },
        { title: "The Phantom Menace", release: 1999, chronological: 1 },
        { title: "Attack of the Clones", release: 2002, chronological: 2 },
        { title: "Revenge of the Sith", release: 2005, chronological: 3 },
        { title: "The Force Awakens", release: 2015, chronological: 7 },
        { title: "The Last Jedi", release: 2017, chronological: 8 },
        { title: "The Rise of Skywalker", release: 2019, chronological: 9 }
    ];

    function renderMovies(movies) {
        movieContainer.innerHTML = "";
        movies.forEach(movie => {
            const card = document.createElement("div");
            card.className = "card";
            const imgSrc = movieImages[movie.title] || "./images/default.jpg";
            card.innerHTML = `
                <img src="${imgSrc}" alt="${movie.title}">
                <p><strong>${movie.title}</strong></p>
                <p><strong>Ano de Lançamento:</strong> ${movie.release}</p>
                <p><strong>Ordem Cronológica:</strong> Episódio ${movie.chronological}</p>
            `;
            movieContainer.appendChild(card);
        });
    }

    window.filterMovies = (type) => {
        let sortedMovies = [...movieList];
        if (type === "release") {
            sortedMovies.sort((a, b) => a.release - b.release);
        } else if (type === "chronological") {
            sortedMovies.sort((a, b) => a.chronological - b.chronological);
        }
        renderMovies(sortedMovies);
    };

    fetchCharacters();
    fetchPlanets();
    renderMovies(movieList);
});