import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTypes } from "../api/pokeapi";
import { palette, colorForType } from "../theme/colors";
import Pokeball from "../components/Pokeball";

export default function HomeScreen({ navigation }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTypes()
      .then(setTypes)
      .catch(() => setError("No se pudieron cargar las categorías."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pokeball size={40} />
        <Text style={styles.headerTitle}>PokeQuest</Text>
        <TouchableOpacity
          style={styles.favIconBtn}
          onPress={() => navigation.navigate("Pokedex", { favoritesOnly: true })}
        >
          <Ionicons name="heart" size={22} color={palette.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate("Pokedex", {})}
        activeOpacity={0.85}
      >
        <Text style={styles.mainButtonText}>Ver Pokédex completa</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Explora por tipo</Text>

      {loading && <ActivityIndicator color={palette.primary} style={{ marginTop: 20 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={types}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.typeCard, { backgroundColor: colorForType(item) }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Pokedex", { typeFilter: item })}
          >
            <Text style={styles.typeText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 10,
    flex: 1,
  },
  favIconBtn: { padding: 6 },
  mainButton: {
    marginHorizontal: 16,
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  error: { color: palette.primary, marginHorizontal: 16 },
  grid: { paddingHorizontal: 10, paddingBottom: 20 },
  typeCard: {
    flex: 1,
    margin: 6,
    borderRadius: 14,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  typeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    textTransform: "capitalize",
  },
});
