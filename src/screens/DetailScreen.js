import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPokemonDetail, getPokemonDescription } from "../api/pokeapi";
import { palette, colorForType } from "../theme/colors";
import TypeBadge from "../components/TypeBadge";
import { useFavorites } from "../context/FavoritesContext";

const STAT_LABELS = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "At. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidad",
};

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    Promise.all([getPokemonDetail(id), getPokemonDescription(id)])
      .then(([detail, desc]) => {
        setPokemon(detail);
        setDescription(desc);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !pokemon) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={palette.primary} size="large" />
      </View>
    );
  }

  const mainColor = colorForType(pokemon.types[0]);
  const fav = isFavorite(pokemon.id);

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.hero, { backgroundColor: mainColor }]}>
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleFavorite(pokemon.id)}
        >
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
        <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </View>

        {!!description && <Text style={styles.description}>{description}</Text>}

        <View style={styles.measureRow}>
          <View style={styles.measureBox}>
            <Text style={styles.measureLabel}>Altura</Text>
            <Text style={styles.measureValue}>{pokemon.height} m</Text>
          </View>
          <View style={styles.measureBox}>
            <Text style={styles.measureLabel}>Peso</Text>
            <Text style={styles.measureValue}>{pokemon.weight} kg</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.row}>
          {pokemon.abilities.map((a) => (
            <View key={a} style={styles.abilityChip}>
              <Text style={styles.abilityText}>{a.replace(/-/g, " ")}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Estadísticas</Text>
        {pokemon.stats.map((s) => (
          <View key={s.name} style={styles.statRow}>
            <Text style={styles.statLabel}>{STAT_LABELS[s.name] || s.name}</Text>
            <View style={styles.statBarBg}>
              <View
                style={[
                  styles.statBarFill,
                  {
                    width: `${Math.min(s.value, 150) / 1.5}%`,
                    backgroundColor: mainColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  center: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: { alignItems: "center", paddingTop: 24, paddingBottom: 10 },
  favButton: { position: "absolute", top: 16, right: 16, padding: 6 },
  id: { color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: "600" },
  name: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  image: { width: 200, height: 200 },
  body: { padding: 20 },
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  description: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  measureRow: { flexDirection: "row", marginBottom: 16 },
  measureBox: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    alignItems: "center",
  },
  measureLabel: { color: palette.textMuted, fontSize: 12 },
  measureValue: { color: palette.text, fontSize: 16, fontWeight: "700", marginTop: 4 },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 10,
  },
  abilityChip: {
    backgroundColor: palette.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  abilityText: { color: palette.text, fontSize: 13, textTransform: "capitalize" },
  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  statLabel: { color: palette.textMuted, fontSize: 12, width: 70 },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: palette.surfaceLight,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  statBarFill: { height: "100%", borderRadius: 4 },
  statValue: { color: palette.text, fontSize: 12, width: 30, textAlign: "right" },
});
