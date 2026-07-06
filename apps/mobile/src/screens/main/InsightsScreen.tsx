import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { Card } from '../../components/Card';
import { TopTabBar } from '../../navigation/CustomTabBar';
import { mockInsights } from '../../utils/mockData';

interface InsightsScreenProps {
  navigation: any;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  navigation,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
    return unsubscribe;
  }, [navigation]);

  const getInsightColor = (type: string): string => {
    switch (type) {
      case 'correlation':
        return Colors.accent;
      case 'anomaly':
        return Colors.warning;
      case 'prediction':
        return '#8b5cf6';
      case 'recommendation':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const getInsightIcon = (type: string): string => {
    switch (type) {
      case 'correlation':
        return '📈';
      case 'anomaly':
        return '⚠️';
      case 'prediction':
        return '🔮';
      case 'recommendation':
        return '💡';
      default:
        return '📊';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopTabBar navigation={navigation} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>AI Insights</Text>
        <Text style={styles.subtitle}>
          Machine-generated intelligence from citizen data
        </Text>

        <View style={styles.list}>
          {mockInsights.map(insight => (
            <Card key={insight.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getInsightColor(insight.type) + '15' },
                  ]}
                >
                  <Text style={styles.icon}>
                    {getInsightIcon(insight.type)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getInsightColor(insight.type) + '15' },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: getInsightColor(insight.type) },
                    ]}
                  >
                    {insight.type}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{insight.title}</Text>
              <Text style={styles.cardDescription}>{insight.description}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>Confidence</Text>
                  <View style={styles.confidenceBar}>
                    <View
                      style={[
                        styles.confidenceFill,
                        {
                          width: `${insight.confidence * 100}%`,
                          backgroundColor: getInsightColor(insight.type),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.confidenceValue}>
                    {Math.round(insight.confidence * 100)}%
                  </Text>
                </View>
                <View style={styles.relatedContainer}>
                  <Text style={styles.relatedLabel}>Related:</Text>
                  {insight.relatedProjects.map((pid: string) => (
                    <View key={pid} style={styles.relatedTag}>
                      <Text style={styles.relatedText}>{pid}</Text>
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
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  list: {
    gap: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  typeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    gap: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  confidenceLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    width: 70,
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.slate[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceValue: {
    width: 36,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    textAlign: 'right',
  },
  relatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  relatedLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  relatedTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.slate[100],
    borderRadius: BorderRadius.sm,
  },
  relatedText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
});
