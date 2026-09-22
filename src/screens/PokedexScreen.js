import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPokemonList, getPokemonByType } from "../api/api.js";
import { palette } from "../theme/colors";
import PokemonCard from "../components/PokemonCard";
import { useFavorites } from "../context/FavoritesContext";

export default function PokedexScreen({ route, navigation }) {
  const { typeFilter, favoritesOnly } = route.params || {};
  const [all, setAll] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites } = useFavorites();

  useEffect(() => {
    navigation.setOptions({
      title: favoritesOnly
        ? "Favoritos"
        : typeFilter
        ? `Tipo: ${typeFilter}`
        : "Pokédex",
    });

    setLoading(true);
    setError(null);
    const request = typeFilter ? getPokemonByType(typeFilter) : getPokemonList(151);

    request
      .then(setAll)
      .catch(() => setError("No se pudo cargar la información desde la API."))
      .finally(() => setLoading(false));
  }, [typeFilter]);

  const filtered = useMemo(() => {
    let list = all;
    if (favoritesOnly) {
      list = list.filter((p) => favorites.includes(String(p.id)));
    }
    if (query.trim()) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase())
      );
    }
    return list;
  }, [all, query, favoritesOnly, favorites]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={palette.textMuted} />
        <TextInput
          placeholder="Buscar por nombre..."
          placeholderTextColor={palette.textMuted}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          autoCapitalize="none"
        />
      </View>

      {loading && <ActivityIndicator color={palette.primary} style={{ marginTop: 30 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && filtered.length === 0 && (
        <Text style={styles.empty}>
          {favoritesOnly ? "Aún no tienes favoritos." : "Sin resultados."}
        </Text>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() => navigation.navigate("Detail", { id: item.id, name: item.name })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, color: palette.text, marginLeft: 8, fontSize: 15 },
  error: { color: palette.primary, textAlign: "center", marginTop: 24 },
  empty: { color: palette.textMuted, textAlign: "center", marginTop: 24 },
});
