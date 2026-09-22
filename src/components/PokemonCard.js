import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "../theme/colors";
import { useFavorites } from "../context/FavoritesContext";

export default function PokemonCard({ pokemon, onPress }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(pokemon.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => toggleFavorite(pokemon.id)}
        style={styles.favButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={fav ? "heart" : "heart-outline"}
          size={22}
          color={fav ? palette.primary : palette.textMuted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  image: { width: 60, height: 60, marginRight: 12 },
  info: { flex: 1 },
  id: { color: palette.textMuted, fontSize: 12 },
  name: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  favButton: { padding: 4 },
});
