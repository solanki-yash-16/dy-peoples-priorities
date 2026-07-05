import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors, Spacing, Typography } from '../theme/index';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const icons: Record<string, string> = {
            Home: '🏠',
            Themes: '🏷️',
            Submissions: '📋',
            Hotspots: '🔥',
            Rankings: '🏆',
            Insights: '💡',
            Profile: '👤',
          };

          const labels: Record<string, string> = {
            Home: 'Home',
            Themes: 'Themes',
            Submissions: 'Submissions',
            Hotspots: 'Hotspots',
            Rankings: 'Rankings',
            Insights: 'Insights',
            Profile: 'Profile',
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.icon,
                  isFocused ? styles.iconFocused : styles.iconInactive,
                ]}
              >
                {icons[route.name]}
              </Text>
              <Text
                style={[
                  styles.label,
                  isFocused ? styles.labelFocused : styles.labelInactive,
                ]}
                numberOfLines={1}
              >
                {labels[route.name]}
              </Text>
              {isFocused && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    paddingHorizontal: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 22,
    height: 24,
    lineHeight: 24,
  },
  iconFocused: {
    opacity: 1,
  },
  iconInactive: {
    opacity: 0.5,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    height: 14,
    lineHeight: 14,
  },
  labelFocused: {
    color: Colors.accent,
  },
  labelInactive: {
    color: Colors.textMuted,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: Colors.accent,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});
