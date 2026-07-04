import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../theme";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "md" | "lg";
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: ViewStyle;
  inputStyle?: TextStyle;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  autoCorrect?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  variant = "default",
  size = "md",
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = "default",
  autoCapitalize = "sentences",
  style,
  inputStyle,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  autoCorrect = true,
}) => {
  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: error ? Colors.error : Colors.border,
      backgroundColor: disabled ? Colors.slate[100] : Colors.white,
      flexDirection: "row",
      alignItems: multiline ? "flex-start" : "center",
    };

    const sizeStyles: Record<string, ViewStyle> = {
      sm: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, minHeight: 40 },
      md: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, minHeight: 48 },
      lg: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, minHeight: 56 },
    };

    return { ...baseStyle, ...sizeStyles[size] };
  };

  const getInputTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontSize: Typography.sizes[size === "sm" ? "sm" : size === "lg" ? "lg" : "md"],
      color: disabled ? Colors.textMuted : Colors.text,
    };

    return baseStyle;
  };

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={getInputContainerStyle()}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          autoCorrect={autoCorrect}
          style={[getInputTextStyle(), inputStyle]}
          textAlignVertical={multiline ? "top" : "center"}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconContainer}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  rightIconContainer: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
});
