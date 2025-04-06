// Testing the pokemon grid layout

// TODO Find a better way to do this and link it w/ the actual data so that all the pokemon are displayed

// !DELETE LATER


function populatePokemonGrid(pokemonList) {
    const grid = document.querySelector('.pokemon-grid');

    // Clear existing content
    grid.innerHTML = '';

    // Add each Pokémon to the grid
    pokemonList.forEach(pokemon => {
      const card = document.createElement('div');
      card.className = 'pokemon-card';

      // Create card content
      const typeHTML = pokemon.types.map(type =>
        `<span class="type ${type.toLowerCase()}">${type}</span>`
      ).join('');

      card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-image">
      <div class="pokemon-info">
        <h3 class="pokemon-name">${pokemon.name}</h3>
        <p class="pokemon-number">#${pokemon.number.toString().padStart(3, '0')}</p>
        <div class="pokemon-types">
          ${typeHTML}
        </div>
      </div>
    `;

      grid.appendChild(card);
    });
  }

  const samplePokemon = [
    {
      name: 'Pikachu',
      number: 25,
      image: '',
      types: ['Electric']
    },
    {
      name: 'Bulbasaur',
      number: 1,
      image: '',
      types: ['Grass', 'Poison']
    },
    {
      name: 'Charmander',
      number: 4,
      image: '',
      types: ['Fire']
    }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    populatePokemonGrid(samplePokemon);
  });