import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../constants";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.shadow.color,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default Card;
