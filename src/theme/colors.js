
export const palette = {
  background: "#ffffff",
  surface: "#FFFFFF",
  surfaceLight: "#ECEAE3",
  primary: "#D74736",
  accent: "#E8B94F",
  text: "#202723",
  textMuted: "#737A74",
  border: "#DEDCD4",
};

export const typeColors = {
  normal: "#8D907E",
  fire: "#DB714A",
  water: "#5386AD",
  electric: "#C89B32",
  grass: "#5D9569",
  ice: "#6AA5A7",
  fighting: "#B85B4A",
  poison: "#906B9C",
  ground: "#A8875C",
  flying: "#8295BD",
  psychic: "#C76D89",
  bug: "#819554",
  rock: "#91816B",
  ghost: "#706D9B",
  dragon: "#7164A7",
  dark: "#65645F",
  steel: "#788B91",
  fairy: "#BC819D",
};

export function colorForType(type) {
  return typeColors[type] || palette.primary;
}