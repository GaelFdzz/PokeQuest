import React from "react";
import { View, StyleSheet } from "react-native";

// Logo propio: una pokébola construida 100% con estilos, sin assets externos.
export default function Pokeball({ size = 80 }) {
  const s = size;
  return (
    <View style={[styles.ball, { width: s, height: s, borderRadius: s / 2 }]}>
      <View style={[styles.topHalf, { height: s / 2, borderRadius: s / 2 }]} />
      <View style={[styles.band, { height: s * 0.14 }]} />
      <View
        style={[
          styles.button,
          {
            width: s * 0.32,
            height: s * 0.32,
            borderRadius: (s * 0.32) / 2,
            top: s / 2 - (s * 0.32) / 2,
            left: s / 2 - (s * 0.32) / 2,
          },
        ]}
      >
        <View
          style={[
            styles.buttonInner,
            {
              width: s * 0.16,
              height: s * 0.16,
              borderRadius: (s * 0.16) / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ball: {
    backgroundColor: "#F5F5F5",
    borderWidth: 3,
    borderColor: "#1E1E2E",
    overflow: "hidden",
  },
  topHalf: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#E3350D",
  },
  band: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    marginTop: -3,
    backgroundColor: "#1E1E2E",
  },
  button: {
    position: "absolute",
    backgroundColor: "#F5F5F5",
    borderWidth: 3,
    borderColor: "#1E1E2E",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonInner: {
    backgroundColor: "#DADADA",
  },
});
