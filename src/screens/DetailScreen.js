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
import {
  getPokemonDetail,
  getPokemonDescription,
} from "../api/api.js";
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

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;

  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: palette.background,
      },
      headerShadowVisible: false,
      headerTintColor: palette.text,
    });
  }, [navigation]);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(false);
    setPokemon(null);

    Promise.all([
      getPokemonDetail(id),
      getPokemonDescription(id),
    ])
      .then(([detail, desc]) => {
        if (active) {
          setPokemon(detail);
          setDescription(desc);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          color={palette.primary}
          size="large"
        />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          No encontramos esta ficha.
        </Text>

        <TouchableOpacity
          onPress={() =>
            setReloadKey((value) => value + 1)
          }
          style={styles.retry}
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>
            Reintentar  ↗
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const mainColor = colorForType(pokemon.types?.[0]);
  const fav = isFavorite(pokemon.id);
  const number = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heading}>
        <View>
          <Text style={styles.eyebrow}>
            POKEQUEST  /  FICHA DE CAMPO
          </Text>

          <Text style={styles.number}>
            REGISTRO {number}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleFavorite(pokemon.id)}
          accessibilityRole="button"
          accessibilityLabel={
            fav
              ? `Quitar ${pokemon.name} de favoritos`
              : `Agregar ${pokemon.name} a favoritos`
          }
        >
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={23}
            color={
              fav ? palette.primary : palette.text
            }
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>
        {pokemon.name}
        <Text style={{ color: mainColor }}>.</Text>
      </Text>

      <View style={styles.types}>
        {(pokemon.types || []).map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </View>

      <View
        style={[
          styles.imageStage,
          { backgroundColor: `${mainColor}19` },
        ]}
      >
        <Text
          style={[
            styles.stageNumber,
            { color: `${mainColor}27` },
          ]}
        >
          {number}
        </Text>

        <Image
          source={{ uri: pokemon.image }}
          style={styles.image}
          resizeMode="contain"
        />

        <View
          style={[
            styles.stageAccent,
            { backgroundColor: mainColor },
          ]}
        />
      </View>

      {!!description && (
        <Text style={styles.description}>
          {description}
        </Text>
      )}

      <View style={styles.rule} />

      <Text style={styles.sectionKicker}>
        PERFIL
      </Text>
      <Text style={styles.sectionTitle}>
        Lo esencial
      </Text>

      <View style={styles.measureRow}>
        <View style={styles.measure}>
          <Text style={styles.measureLabel}>
            ALTURA
          </Text>
          <Text style={styles.measureValue}>
            {pokemon.height}{" "}
            <Text style={styles.measureUnit}>m</Text>
          </Text>
        </View>

        <View
          style={[
            styles.measure,
            styles.measureDivider,
          ]}
        >
          <Text style={styles.measureLabel}>
            PESO
          </Text>
          <Text style={styles.measureValue}>
            {pokemon.weight}{" "}
            <Text style={styles.measureUnit}>kg</Text>
          </Text>
        </View>
      </View>

      <Text style={styles.smallHeading}>
        HABILIDADES
      </Text>

      <View style={styles.abilities}>
        {(pokemon.abilities || []).map((ability) => (
          <View
            key={ability}
            style={styles.abilityChip}
          >
            <Text style={styles.abilityText}>
              {ability.replace(/-/g, " ")}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.rule} />

      <Text style={styles.sectionKicker}>
        DATOS
      </Text>
      <Text style={styles.sectionTitle}>
        Estadísticas
      </Text>

      {(pokemon.stats || []).map((stat) => (
        <View key={stat.name} style={styles.statRow}>
          <Text
            style={styles.statLabel}
            numberOfLines={1}
          >
            {STAT_LABELS[stat.name] || stat.name}
          </Text>

          <View style={styles.statBarBg}>
            <View
              style={[
                styles.statBarFill,
                {
                  width: `${Math.max(
                    0,
                    Math.min(
                      Number(stat.value) || 0,
                      150
                    )
                  ) / 1.5
                    }%`,
                  backgroundColor: mainColor,
                },
              ]}
            />
          </View>

          <Text style={styles.statValue}>
            {stat.value}
          </Text>
        </View>
      ))}

      <Text style={styles.footer}>
        POKEQUEST   ·   REGISTRO {number}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 42,
  },
  center: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorTitle: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "800",
  },
  retry: {
    marginTop: 16,
    padding: 12,
  },
  retryText: {
    color: palette.primary,
    fontWeight: "800",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 10,
    letterSpacing: 1.6,
    fontWeight: "800",
  },
  number: {
    color: palette.textMuted,
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: "700",
    marginTop: 10,
  },
  favButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: palette.text,
    fontSize: 45,
    fontWeight: "800",
    textTransform: "capitalize",
    letterSpacing: -2.5,
    marginTop: 15,
  },
  types: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 9,
    marginBottom: 15,
  },
  imageStage: {
    height: 268,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  stageNumber: {
    position: "absolute",
    top: 2,
    right: 13,
    fontSize: 101,
    fontWeight: "900",
    letterSpacing: -9,
  },
  image: {
    width: "80%",
    height: 242,
  },
  stageAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 5,
    width: 72,
  },
  description: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 25,
  },
  rule: {
    height: 1,
    backgroundColor: palette.border,
    marginTop: 31,
    marginBottom: 24,
  },
  sectionKicker: {
    color: palette.primary,
    fontSize: 10,
    letterSpacing: 1.7,
    fontWeight: "800",
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginTop: 7,
    marginBottom: 18,
  },
  measureRow: {
    flexDirection: "row",
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 18,
    marginBottom: 25,
  },
  measure: {
    flex: 1,
    paddingHorizontal: 20,
  },
  measureDivider: {
    borderLeftWidth: 1,
    borderLeftColor: palette.border,
  },
  measureLabel: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  measureValue: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 5,
  },
  measureUnit: {
    fontSize: 14,
    fontWeight: "600",
  },
  smallHeading: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 10,
  },
  abilities: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  abilityChip: {
    backgroundColor: palette.surfaceLight,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  abilityText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },
  statLabel: {
    color: palette.textMuted,
    fontSize: 12,
    width: 76,
    fontWeight: "600",
  },
  statBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: palette.surfaceLight,
    borderRadius: 3,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  statBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  statValue: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "800",
    width: 28,
    textAlign: "right",
  },
  footer: {
    color: palette.textMuted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 29,
  },
});