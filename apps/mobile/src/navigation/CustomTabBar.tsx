import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme/index';
import type { MainTabParamList } from './types';

export const tabBarHeight = 52;

type Route = keyof MainTabParamList;

const icons: Record<Route, string> = {
  Home: '🏠',
  Themes: '🏷️',
  Submissions: '📋',
  Hotspots: '🔥',
  Rankings: '🏆',
  Insights: '💡',
  Profile: '👤',
};

const labels: Record<Route, string> = {
  Home: 'Home',
  Themes: 'Themes',
  Submissions: 'Submissions',
  Hotspots: 'Hotspots',
  Rankings: 'Rankings',
  Insights: 'Insights',
  Profile: 'Profile',
};

type TopTabBarProps = {
  navigation: BottomTabNavigationProp<MainTabParamList>;
};

export const TopTabBar: React.FC<TopTabBarProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const state = navigation.getState();
  const currentTab = state.routeNames[state.index ?? 0] as Route;

  return (
    <View style={[styles.container, { paddingLeft: insets.left, paddingRight: insets.right }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {(Object.keys(labels) as Route[]).map((route) => {
          const isFocused = currentTab === route;

          const onPress = () => {
            navigation.navigate(route);
          };

          return (
            <TouchableOpacity
              key={route}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.icon,
                  isFocused ? styles.iconFocused : styles.iconInactive,
                ]}
                numberOfLines={1}
              >
                {icons[route]}
              </Text>
              <Text
                style={[
                  styles.label,
                  isFocused ? styles.labelFocused : styles.labelInactive,
                ]}
                numberOfLines={1}
              >
                {labels[route]}
              </Text>
              {isFocused ? <View style={styles.indicator} /> : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    height: tabBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    columnGap: Spacing.xs,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: '100%',
    position: 'relative',
    gap: Spacing.xs / 2,
  },
  icon: {
    fontSize: 20,
    height: 22,
    lineHeight: 22,
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
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  labelFocused: {
    color: Colors.accent,
  },
  labelInactive: {
    color: Colors.textMuted,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: Colors.accent,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
