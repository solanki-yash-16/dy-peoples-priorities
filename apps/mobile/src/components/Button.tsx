import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: Spacing.sm,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
      md: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm },
      lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? Colors.slate[300] : Colors.accent,
      },
      secondary: {
        backgroundColor: disabled ? Colors.slate[200] : Colors.slate[100],
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: disabled ? Colors.slate[300] : Colors.accent,
      },
      ghost: {
        backgroundColor: "transparent",
      },
    };

    return { ...baseStyle, ...sizeStyles[size], ...variantStyles[variant] };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: Typography.sizes[size === "sm" ? "sm" : size === "lg" ? "lg" : "md"],
      fontWeight: Typography.weights.semibold,
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: Colors.white },
      secondary: { color: Colors.text },
      outline: { color: disabled ? Colors.slate[400] : Colors.accent },
      ghost: { color: Colors.accent },
    };

    return { ...baseStyle, ...variantTextStyles[variant] };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? Colors.white : Colors.accent}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
