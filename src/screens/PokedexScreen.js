import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getPokemonList,
  getPokemonByType,
} from "../api/api.js";
import { palette } from "../theme/colors";
import PokemonCard from "../components/PokemonCard";
import { useFavorites } from "../context/FavoritesContext";

export default function PokedexScreen({ route, navigation }) {
  const { typeFilter, favoritesOnly } = route.params || {};

  const [all, setAll] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const { favorites } = useFavorites();

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
    setError(null);
    setAll([]);

    const request = typeFilter
      ? getPokemonByType(typeFilter)
      : getPokemonList(151);

    Promise.resolve(request)
      .then((result) => {
        if (active) setAll(result);
      })
      .catch(() => {
        if (active) {
          setError(
            "No pudimos abrir el archivo. Inténtalo de nuevo."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [typeFilter, reloadKey]);

  const filtered = useMemo(() => {
    let list = all;

    if (favoritesOnly) {
      list = list.filter((p) =>
        favorites.includes(String(p.id))
      );
    }

    if (query.trim()) {
      list = list.filter((p) =>
        p.name
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      );
    }

    return list;
  }, [all, query, favoritesOnly, favorites]);

  const title = favoritesOnly
    ? "Mis favoritos"
    : typeFilter
      ? `Tipo ${typeFilter}`
      : "La Pokédex";

  return (
    <View style={styles.container}>
      <FlatList
        data={loading || error ? [] : filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>
              POKEQUEST  /  {favoritesOnly
                ? "COLECCIÓN"
                : typeFilter
                  ? "TIPOS"
                  : "ARCHIVO 001"}
            </Text>

            <Text style={styles.title}>
              {title}
              <Text style={styles.dot}>.</Text>
            </Text>

            <Text style={styles.subtitle}>
              {favoritesOnly
                ? "Los que decidiste llevar contigo."
                : typeFilter
                  ? "Una familia, muchas formas de sorprenderte."
                  : "Los primeros 151, a tu propio ritmo."}
            </Text>

            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={20}
                color={palette.textMuted}
              />

              <TextInput
                placeholder="Busca un Pokémon"
                placeholderTextColor={palette.textMuted}
                value={query}
                onChangeText={setQuery}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                accessibilityLabel="Buscar Pokémon por nombre"
              />

              {!!query && (
                <TouchableOpacity
                  onPress={() => setQuery("")}
                  accessibilityRole="button"
                  accessibilityLabel="Borrar búsqueda"
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={palette.textMuted}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.listHeading}>
              <Text style={styles.listLabel}>REGISTROS</Text>

              {!loading && !error && (
                <Text style={styles.count}>
                  {String(filtered.length).padStart(2, "0")} ENCONTRADOS
                </Text>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              color={palette.primary}
              style={styles.feedback}
            />
          ) : error ? (
            <View style={styles.feedback}>
              <Text style={styles.feedbackTitle}>
                Archivo no disponible
              </Text>
              <Text style={styles.feedbackCopy}>
                {error}
              </Text>

              <TouchableOpacity
                style={styles.retry}
                onPress={() =>
                  setReloadKey((value) => value + 1)
                }
                accessibilityRole="button"
              >
                <Text style={styles.retryText}>
                  Reintentar  ↗
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.feedback}>
              <Text style={styles.feedbackTitle}>
                {favoritesOnly && !query
                  ? "Tu colección comienza aquí."
                  : "Sin resultados por ahora."}
              </Text>

              <Text style={styles.feedbackCopy}>
                {favoritesOnly && !query
                  ? "Toca el corazón de cualquier Pokémon para guardarlo."
                  : "Prueba con otro nombre."}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() =>
              navigation.navigate("Detail", {
                id: item.id,
                name: item.name,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 34,
    flexGrow: 1,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: palette.text,
    fontSize: 39,
    fontWeight: "800",
    letterSpacing: -2,
    marginTop: 13,
    textTransform: "capitalize",
  },
  dot: {
    color: palette.primary,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 14,
    marginTop: 7,
    lineHeight: 21,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 26,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 54,
  },
  searchInput: {
    flex: 1,
    color: palette.text,
    marginLeft: 10,
    fontSize: 15,
    paddingVertical: 0,
  },
  listHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 31,
    marginBottom: 4,
  },
  listLabel: {
    color: palette.text,
    fontWeight: "800",
    letterSpacing: 1.7,
    fontSize: 11,
  },
  count: {
    color: palette.textMuted,
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 10,
  },
  feedback: {
    marginTop: 48,
    alignItems: "center",
  },
  feedbackTitle: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
  },
  feedbackCopy: {
    color: palette.textMuted,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },
  retry: {
    marginTop: 16,
    padding: 12,
  },
  retryText: {
    color: palette.primary,
    fontWeight: "800",
  },
});