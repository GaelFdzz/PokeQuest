import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "../theme/colors";
import { useFavorites } from "../context/FavoritesContext";

export default function PokemonCard({ pokemon, onPress }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(pokemon.id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityLabel={`Ver ficha de ${pokemon.name}`}
    >
      <View style={styles.imageFrame}>
        <Image
          source={{ uri: pokemon.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.id}>
          REGISTRO  /  #{String(pokemon.id).padStart(3, "0")}
        </Text>
        <Text style={styles.name} numberOfLines={1}>
          {pokemon.name}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => toggleFavorite(pokemon.id)}
        style={styles.favButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={
          fav
            ? `Quitar ${pokemon.name} de favoritos`
            : `Agregar ${pokemon.name} a favoritos`
        }
      >
        <Ionicons
          name={fav ? "heart" : "heart-outline"}
          size={21}
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
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  imageFrame: {
    width: 72,
    height: 72,
    backgroundColor: palette.surfaceLight,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 64,
    height: 64,
  },
  info: {
    flex: 1,
    paddingHorizontal: 16,
  },
  id: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.9,
  },
  name: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "800",
    textTransform: "capitalize",
    letterSpacing: -0.6,
    marginTop: 5,
  },
  favButton: {
    padding: 10,
  },
});