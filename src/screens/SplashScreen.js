import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import Pokeball from "../components/Pokeball";
import { palette } from "../theme/colors";

export default function SplashScreen({ navigation }) {
  const spin = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Pokeball size={110} />
      </Animated.View>
      <Animated.View style={{ opacity: fade }}>
        <Text style={styles.title}>PokeQuest</Text>
        <Text style={styles.subtitle}>Explora. Descubre. Colecciona.</Text>
      </Animated.View>
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
  title: {
    marginTop: 28,
    fontSize: 36,
    fontWeight: "800",
    color: palette.text,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: palette.textMuted,
    textAlign: "center",
  },
});
