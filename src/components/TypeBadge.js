import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colorForType } from "../theme/colors";

export default function TypeBadge({ type }) {
  return (
    <View style={[styles.badge, { backgroundColor: colorForType(type) }]}>
      <Text style={styles.text}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
