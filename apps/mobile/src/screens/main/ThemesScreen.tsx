import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { Card } from '../../components/Card';
import { TopTabBar } from '../../navigation/CustomTabBar';
import { mockThemes } from '../../utils/mockData';

interface ThemesScreenProps {
  navigation: any;
}

export const ThemesScreen: React.FC<ThemesScreenProps> = ({ navigation }) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopTabBar navigation={navigation} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Recurring Themes</Text>
        <Text style={styles.subtitle}>
          AI-consolidated topics across all channels
        </Text>

        <View style={styles.list}>
          {mockThemes.map(theme => (
            <Card key={theme.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.cardTitle}>{theme.name}</Text>
                  <Text style={styles.cardCategory}>{theme.category}</Text>
                </View>
                <View
                  style={[
                    styles.trendBadge,
                    theme.trend === 'up'
                      ? { backgroundColor: Colors.error + '15' }
                      : theme.trend === 'down'
                      ? { backgroundColor: Colors.success + '15' }
                      : { backgroundColor: Colors.slate[200] },
                  ]}
                >
                  <Text
                    style={[
                      styles.trendText,
                      theme.trend === 'up'
                        ? { color: Colors.error }
                        : theme.trend === 'down'
                        ? { color: Colors.success }
                        : { color: Colors.textSecondary },
                    ]}
                  >
                    {theme.trend === 'up'
                      ? '↑ Rising'
                      : theme.trend === 'down'
                      ? '↓ Falling'
                      : '→ Stable'}
                  </Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{theme.frequency}</Text>
                  <Text style={styles.statLabel}>Mentions</Text>
                </View>
                <View style={styles.stat}>
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          theme.avgSentiment < 0
                            ? Colors.error
                            : Colors.success,
                      },
                    ]}
                  >
                    {theme.avgSentiment > 0 ? '+' : ''}
                    {theme.avgSentiment.toFixed(1)}
                  </Text>
                  <Text style={styles.statLabel}>Sentiment</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(theme.frequency * 2.5, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {theme.frequency} mentions across channels
                </Text>
              </View>

              <View style={styles.regionsContainer}>
                <Text style={styles.regionsLabel}>Affected Regions:</Text>
                <View style={styles.regionsList}>
                  {theme.regions.map((region: string) => (
                    <View key={region} style={styles.regionTag}>
                      <Text style={styles.regionText}>{region}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    padding: Spacing.md,
    // paddingTop: tabBarHeight + Spacing.md,
    paddingBottom: Spacing.tabBar,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  list: {
    gap: Spacing.sm,
  },
  card: {
    // padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardCategory: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  trendBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  trendText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.slate[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  regionsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  regionsLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  regionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  regionTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.slate[100],
    borderRadius: BorderRadius.sm,
  },
  regionText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
});
