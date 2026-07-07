import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { Card } from '../../components/Card';
import { TopTabBar } from '../../navigation/CustomTabBar';
import { mockRankings, categoryColors } from '../../utils/mockData';

interface RankingsScreenProps {
  navigation: any;
}

export const RankingsScreen: React.FC<RankingsScreenProps> = ({ navigation }) => {
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
        <Text style={styles.title}>Prioritized Works</Text>
        <Text style={styles.subtitle}>
          Ranked by demand, alignment & infrastructure gap
        </Text>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.accent }]}
            />
            <Text style={styles.legendText}>Demand</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.success }]}
            />
            <Text style={styles.legendText}>Alignment</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.warning }]}
            />
            <Text style={styles.legendText}>Gap</Text>
          </View>
        </View>

        <View style={styles.list}>
          {mockRankings.map((ranking, index) => (
            <Card key={ranking.id} style={styles.card}>
              <View style={styles.rankContainer}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectTitle} numberOfLines={2}>
                    {ranking.project}
                  </Text>
                  <Text style={styles.projectRegion}>{ranking.region}</Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreValue}>
                    {ranking.priorityScore.toFixed(1)}
                  </Text>
                  <Text style={styles.scoreLabel}>Score</Text>
                </View>
              </View>

              <View style={styles.metricsContainer}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Demand</Text>
                  <View style={styles.metricBar}>
                    <View
                      style={[
                        styles.metricFill,
                        {
                          width: `${ranking.demandScore}%`,
                          backgroundColor: Colors.accent,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.metricValue}>{ranking.demandScore}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Alignment</Text>
                  <View style={styles.metricBar}>
                    <View
                      style={[
                        styles.metricFill,
                        {
                          width: `${ranking.alignmentScore}%`,
                          backgroundColor: Colors.success,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.metricValue}>
                    {ranking.alignmentScore}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Gap</Text>
                  <View style={styles.metricBar}>
                    <View
                      style={[
                        styles.metricFill,
                        {
                          width: `${ranking.infrastructureGap}%`,
                          backgroundColor: Colors.warning,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.metricValue}>
                    {ranking.infrastructureGap}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View
                  style={[
                    styles.categoryBadge,
                    {
                      backgroundColor:
                        (categoryColors[ranking.category] || Colors.accent) +
                        '15',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          categoryColors[ranking.category] || Colors.accent,
                      },
                    ]}
                  >
                    {ranking.category}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        (statusColors[ranking.status] || Colors.slate[200]) +
                        '15',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          statusColors[ranking.status] || Colors.textSecondary,
                      },
                    ]}
                  >
                    {ranking.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              <View style={styles.budgetRow}>
                <View style={styles.budgetItem}>
                  <Text style={styles.budgetLabel}>Budget</Text>
                  <Text style={styles.budgetValue}>
                    ₹{(ranking.budgetEstimate / 100000).toFixed(1)}L
                  </Text>
                </View>
                <View style={styles.budgetItem}>
                  <Text style={styles.budgetLabel}>Beneficiaries</Text>
                  <Text style={styles.budgetValue}>
                    {ranking.beneficiaries.toLocaleString()}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const statusColors: Record<string, string> = {
  proposed: Colors.slate[500],
  approved: Colors.accent,
  in_progress: Colors.warning,
  completed: Colors.success,
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
    marginBottom: Spacing.md,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  list: {
    gap: Spacing.sm,
  },
  card: {
    // padding: Spacing.md,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  rankText: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  projectInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  projectTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  projectRegion: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.accent,
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  metricsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metricLabel: {
    width: 70,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  metricBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.slate[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricValue: {
    width: 28,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    textTransform: 'capitalize',
  },
  budgetRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  budgetItem: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  budgetValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
});
