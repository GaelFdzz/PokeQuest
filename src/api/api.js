const BASE_URL = "https://pokeapi.co/api/v2";


function extractIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

async function safeFetch(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al consultar ${url}`);
  }
  return res.json();
}

export async function getPokemonList(limit = 151, offset = 0) {
  const data = await safeFetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  return data.results.map((p) => {
    const id = extractIdFromUrl(p.url);
    return { id, name: p.name, image: spriteUrl(id) };
  });
}


export async function getTypes() {
  const data = await safeFetch(`${BASE_URL}/type`);
  return data.results
    .map((t) => t.name)
    .filter((t) => t !== "unknown" && t !== "shadow");
}

export async function getPokemonByType(type) {
  const data = await safeFetch(`${BASE_URL}/type/${type}`);
  return data.pokemon.map(({ pokemon }) => {
    const id = extractIdFromUrl(pokemon.url);
    return { id, name: pokemon.name, image: spriteUrl(id) };
  });
}


export async function getPokemonDetail(idOrName) {
  const data = await safeFetch(`${BASE_URL}/pokemon/${idOrName}`);
  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites?.other?.["official-artwork"]?.front_default ||
      spriteUrl(data.id),
    height: data.height / 10, 
    weight: data.weight / 10, 
    types: data.types.map((t) => t.type.name),
    abilities: data.abilities.map((a) => a.ability.name),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
  };
}

export async function getPokemonDescription(idOrName) {
  const data = await safeFetch(`${BASE_URL}/pokemon-species/${idOrName}`);
  const entry =
    data.flavor_text_entries.find((e) => e.language.name === "es") ||
    data.flavor_text_entries.find((e) => e.language.name === "en");
  if (!entry) return "";
  return entry.flavor_text.replace(/\f|\n/g, " ");
}
