import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { Card } from "../../components/Card";
import { TopTabBar } from "../../navigation/CustomTabBar";
import { mockSubmissions, sentimentColors, categoryColors } from "../../utils/mockData";

type SubmissionsScreenProps = {
  navigation: any;
};

export const SubmissionsScreen: React.FC<SubmissionsScreenProps> = ({ navigation }) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
    return unsubscribe;
  }, [navigation]);

  const sourceLabels: Record<string, string> = {
    public_meeting: "Public Meeting",
    letter: "Letter",
    social_media: "Social Media",
    grievance_portal: "Grievance Portal",
    direct_representation: "Direct Representation",
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopTabBar navigation={navigation} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Submissions</Text>
        <Text style={styles.subtitle}>
          {mockSubmissions.length} citizen suggestions consolidated
        </Text>

        <View style={styles.filters}>
          {Object.entries(sourceLabels).map(([key, label]) => (
            <TouchableOpacity key={key} style={styles.filterChip}>
              <Text style={styles.filterText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.list}>
          {mockSubmissions.map((submission) => (
            <Card key={submission.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {submission.title}
                  </Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {submission.description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.sentimentBadge,
                    { backgroundColor: (sentimentColors[submission.sentiment] || Colors.slate[200]) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.sentimentText,
                      { color: sentimentColors[submission.sentiment] || Colors.textSecondary },
                    ]}
                  >
                    {submission.sentiment}
                  </Text>
                </View>
              </View>

              <View style={styles.cardMeta}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: (categoryColors[submission.category] || Colors.accent) + "15" },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: categoryColors[submission.category] || Colors.accent },
                    ]}
                  >
                    {submission.category}
                  </Text>
                </View>
                <Text style={styles.metaText}>{submission.region}</Text>
                <Text style={styles.metaText}>👍 {submission.upvotes}</Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.sourceText}>
                  Via {sourceLabels[submission.source] || submission.source}
                </Text>
                <Text style={styles.dateText}>{submission.submittedAt}</Text>
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
    marginBottom: Spacing.md,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  list: {
    gap: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sentimentBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  sentimentText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    textTransform: "capitalize",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    textTransform: "capitalize",
  },
  metaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sourceText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  dateText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
});
