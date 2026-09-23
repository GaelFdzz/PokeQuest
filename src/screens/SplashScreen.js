import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import Pokeball from "../components/Pokeball";
import { palette } from "../theme/colors";

export default function SplashScreen({ navigation }) {
  const lift = useRef(new Animated.Value(14)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => navigation.replace("Home"), 1800);
    return () => clearTimeout(timer);
  }, [navigation, fade, lift]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={palette.background} />

      <Animated.View
        style={[
          styles.centerpiece,
          {
            opacity: fade,
            transform: [{ translateY: lift }],
          },
        ]}
      >
        <View style={styles.emblem}>
          <Pokeball size={76} />
        </View>

        <Text style={styles.kicker}>UNA AVENTURA POR DESCUBRIR</Text>

        <Text style={styles.title}>
          pokequest<Text style={styles.dot}>.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Tu mundo Pokémon, a un toque.
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          EXPLORA  ·  DESCUBRE  ·  COLECCIONA
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center",
  },
  centerpiece: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emblem: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  kicker: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2.1,
    color: palette.primary,
  },
  title: {
    marginTop: 8,
    fontSize: 40,
    fontWeight: "800",
    color: palette.text,
    letterSpacing: -2.2,
  },
  dot: {
    color: palette.primary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: palette.textMuted,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 44,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: palette.textMuted,
  },
  footerNumber: {
    fontSize: 10,
    fontWeight: "800",
    color: palette.primary,
  },
});