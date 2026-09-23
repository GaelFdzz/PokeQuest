import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTypes } from "../api/api";
import { palette, colorForType } from "../theme/colors";
import Pokeball from "../components/Pokeball";

export default function HomeScreen({ navigation }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTypes()
      .then(setTypes)
      .catch(() => setError("No se pudieron cargar los tipos."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={palette.background}
      />

      <FlatList
        data={types}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.topbar}>
              <View style={styles.brand}>
                <Pokeball size={29} />

                <Text style={styles.brandName}>
                  pokequest<Text style={styles.brandDot}>.</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.favButton}
                onPress={() =>
                  navigation.navigate("Pokedex", {
                    favoritesOnly: true,
                  })
                }
                accessibilityRole="button"
                accessibilityLabel="Ver mis Pokémon favoritos"
              >
                <Ionicons
                  name="heart-outline"
                  size={22}
                  color={palette.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.intro}>
              <Text style={styles.eyebrow}>
                TU GUÍA DE BOLSILLO
              </Text>

              <Text style={styles.title}>
                Un mundo por
                <Text style={styles.titleAccent}> descubrir.</Text>
              </Text>

              <Text style={styles.introCopy}>
                Explora, conoce y guarda los Pokémon que se queden
                contigo.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.feature}
              activeOpacity={0.88}
              onPress={() => navigation.navigate("Pokedex", {})}
              accessibilityRole="button"
              accessibilityLabel="Explorar la Pokédex completa"
            >
              <View style={styles.featureCopy}>
                <Text style={styles.featureKicker}>
                  EMPIEZA AQUÍ   ·   #001—151
                </Text>

                <Text style={styles.featureTitle}>
                  La Pokédex
                </Text>

                <Text style={styles.featureSubtitle}>
                  Cada hallazgo comienza con una mirada.
                </Text>

                <View style={styles.featureLink}>
                  <Text style={styles.featureLinkText}>
                    Explorar ahora
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={17}
                    color={palette.surface}
                  />
                </View>
              </View>

              <View
                style={styles.featureArt}
                pointerEvents="none"
              >
                <Pokeball size={148} color="#F7D9C7" />
              </View>
            </TouchableOpacity>

            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.eyebrow}>
                  OTRA FORMA DE EXPLORAR
                </Text>
                <Text style={styles.sectionTitle}>
                  Sigue tu instinto.
                </Text>
              </View>

              <Text style={styles.sectionCount}>
                {String(types.length).padStart(2, "0")} TIPOS
              </Text>
            </View>

            {loading && (
              <ActivityIndicator
                color={palette.primary}
                style={styles.feedback}
              />
            )}

            {error && (
              <Text style={styles.feedbackText}>{error}</Text>
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.typeCard}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("Pokedex", {
                typeFilter: item,
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Explorar Pokémon de tipo ${item}`}
          >
            <View
              style={[
                styles.typeMarker,
                { backgroundColor: colorForType(item) },
              ]}
            />

            <Text style={styles.typeIndex}>
              {String(index + 1).padStart(2, "0")}
            </Text>

            <Text
              style={styles.typeName}
              numberOfLines={1}
            >
              {item}
            </Text>

            <Ionicons
              name="arrow-up-outline"
              size={17}
              color={palette.textMuted}
              style={styles.typeArrow}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: 40,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 36,
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 38,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  brandName: {
    fontSize: 20,
    letterSpacing: -1.2,
    fontWeight: "800",
    color: palette.text,
  },
  brandDot: {
    color: palette.primary,
  },
  favButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  intro: {
    paddingBottom: 26,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
  },
  title: {
    color: palette.text,
    fontSize: 43,
    lineHeight: 49,
    fontWeight: "800",
    letterSpacing: -2.5,
    marginTop: 12,
    maxWidth: 320,
  },
  titleAccent: {
    color: palette.primary,
  },
  introCopy: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 310,
    marginTop: 13,
  },
  feature: {
    backgroundColor: palette.text,
    minHeight: 215,
    borderRadius: 18,
    padding: 23,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  featureCopy: {
    zIndex: 1,
    maxWidth: "78%",
  },
  featureKicker: {
    color: palette.accent,
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "800",
  },
  featureTitle: {
    color: palette.surface,
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -1,
    marginTop: 17,
  },
  featureSubtitle: {
    color: "#B6BDB8",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    maxWidth: 195,
  },
  featureLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 23,
  },
  featureLinkText: {
    color: palette.surface,
    fontSize: 13,
    fontWeight: "700",
  },
  featureArt: {
    position: "absolute",
    right: -38,
    bottom: -29,
    opacity: 0.18,
    transform: [{ rotate: "-23deg" }],
  },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 38,
    marginBottom: 17,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -1,
    marginTop: 6,
  },
  sectionCount: {
    color: palette.textMuted,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "700",
    marginBottom: 4,
  },
  feedback: {
    marginVertical: 24,
  },
  feedbackText: {
    color: palette.primary,
    paddingVertical: 22,
  },
  columns: {
    justifyContent: "space-between",
  },
  typeCard: {
    width: "48.3%",
    height: 110,
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
    marginBottom: 11,
  },
  typeMarker: {
    width: 19,
    height: 4,
    borderRadius: 2,
  },
  typeIndex: {
    color: palette.textMuted,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 13,
  },
  typeName: {
    color: palette.text,
    textTransform: "capitalize",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 2,
    marginRight: 20,
  },
  typeArrow: {
    position: "absolute",
    right: 14,
    bottom: 14,
    transform: [{ rotate: "45deg" }],
  },
});