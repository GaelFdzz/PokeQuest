import React from "react";
import { View, StyleSheet } from "react-native";
import { palette } from "../theme/colors";

export default function Pokeball({ size = 80, color = palette.primary }) {
  const line = Math.max(2, size * 0.055);
  const buttonSize = size * 0.31;

  return (
    <View
      style={[
        styles.ball,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: line,
          borderColor: color,
        },
      ]}
    >
      <View
        style={[
          styles.topHalf,
          { height: size / 2, backgroundColor: color },
        ]}
      />
      <View
        style={[
          styles.band,
          {
            top: size / 2 - line / 2,
            height: line,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            borderWidth: line,
            borderColor: color,
            top: size / 2 - buttonSize / 2 - line,
            left: size / 2 - buttonSize / 2 - line,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ball: {
    backgroundColor: palette.background,
    overflow: "hidden",
  },
  topHalf: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  button: {
    position: "absolute",
    backgroundColor: palette.background,
  },
});