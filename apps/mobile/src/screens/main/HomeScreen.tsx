import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import {
  mockRankings,
  mockThemes,
} from '../../utils/mockData';
import { Card } from '../../components/Card';
import { TopTabBar } from '../../navigation/CustomTabBar';
import { categoryColors } from '../../utils/mockData';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { complaintApi } from '../../api/complaint';
import { ComplaintCard } from '../../components/ComplaintCard';
const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color?: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  color = Colors.accent,
}: StatCardProps) => (
  <Card
    style={[styles.statCard, { borderLeftWidth: 4, borderLeftColor: color }]}
  >
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </Card>
);

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  
  const { data: recentComplaintsData, isLoading: isLoadingComplaints } = useQuery({
    queryKey: ['complaints', 'recent'],
    queryFn: () => complaintApi.getComplaints({ page: 1, limit: 3, sort: '-createdAt' }),
  });
  
  const { data: heatmapData, isLoading: isLoadingHeatmap } = useQuery({
    queryKey: ['heatmap'],
    queryFn: () => complaintApi.getHeatmap(),
  });
  
  const recentSubmissions = (recentComplaintsData?.data || []).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const hotspotsCount = heatmapData?.data?.length || 0;
  const topRankings = mockRankings.slice(0, 2);

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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.title}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'U'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Submissions"
              value={recentComplaintsData?.data.length.toString() ?? ""}
              subtitle="Data collection" //
              color={Colors.accent}
            />
            <StatCard
              title="Themes"
              value={mockThemes.length.toString()}
              subtitle="Recurring demands"
              color={Colors.success}
            />
            <StatCard
              title="Hotspots"
              value={isLoadingHeatmap ? '...' : hotspotsCount.toString()}
              subtitle="High urgency areas"
              color={Colors.warning}
            />
            <StatCard
              title="Ranked"
              value={mockRankings.length.toString()}
              subtitle="Awaiting approval"
              color={Colors.error}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Priority Projects</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Rankings')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {topRankings.map(ranking => (
            <Card key={ranking.id} style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <View style={styles.projectTitleContainer}>
                  <Text style={styles.projectTitle} numberOfLines={2}>
                    {ranking.project}
                  </Text>
                  <View
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor:
                          categoryColors[ranking.category] + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: categoryColors[ranking.category] },
                      ]}
                    >
                      {ranking.category}
                    </Text>
                  </View>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreValue}>
                    {ranking.priorityScore.toFixed(1)}
                  </Text>
                  <Text style={styles.scoreLabel}>Priority</Text>
                </View>
              </View>
              <View style={styles.projectMeta}>
                <Text style={styles.projectMetaText}>{ranking.region}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        (statusColors[ranking.status] || Colors.slate[200]) +
                        '20',
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
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Submissions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Submissions')}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {isLoadingComplaints ? (
            <Text style={styles.greeting}>Loading recent submissions...</Text>
          ) : recentSubmissions.length > 0 ? (
            recentSubmissions.map(submission => (
              <ComplaintCard key={submission._id} complaint={submission} />
            ))
          ) : (
            <Text style={styles.greeting}>No submissions yet.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickGrid}>
            {[
              {
                title: 'Themes',
                icon: '🏷️',
                screen: 'Themes',
                color: Colors.accent,
              },
            ].map(item => (
              <TouchableOpacity
                key={item.screen}
                style={[styles.quickCard, { borderLeftColor: item.color }]}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickIcon}>{item.icon}</Text>
                <Text style={styles.quickTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FloatingActionButton
          onPress={() => navigation.navigate('CreateSubmission')}
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: 10,
  },
  seeAll: {
    fontSize: Typography.sizes.sm,
    color: Colors.accent,
    fontWeight: Typography.weights.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    // padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statTitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  projectCard: {
    marginBottom: Spacing.sm,
    // padding: Spacing.md,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  projectTitleContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  projectTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    textTransform: 'capitalize',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.accent,
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectMetaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
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
  submissionCard: {
    marginBottom: Spacing.sm,
    // padding: Spacing.md,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  submissionTitle: {
    flex: 1,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  sentimentBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  sentimentText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    textTransform: 'capitalize',
  },
  submissionDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  submissionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submissionMetaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: 10
  },
  quickCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: Colors.border,
  },
  quickIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  quickTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    textAlign: 'center',
  },
});
