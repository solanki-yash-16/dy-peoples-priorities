import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../theme";
import { TopTabBar } from "../../navigation/CustomTabBar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { complaintApi, Complaint } from "../../api/complaint";
import { PaginatedList } from "../../components/PaginatedList";
import { ComplaintsFilter } from "../../components/ComplaintsFilter";
import { ComplaintCard } from "../../components/ComplaintCard";

type SubmissionsScreenProps = {
  navigation: any;
};

export const SubmissionsScreen: React.FC<SubmissionsScreenProps> = ({ navigation }) => {
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("-createdAt");

  // Keep track of applied filters so we only refetch when user taps apply or chip
  const [appliedFilters, setAppliedFilters] = useState({ district: "", status: "", sort: "-createdAt" });

  const handleApply = (overrides?: { district?: string; status?: string; sort?: string }) => {
    setAppliedFilters(_prev => ({
      district: overrides?.district !== undefined ? overrides.district : district,
      status: overrides?.status !== undefined ? overrides.status : status,
      sort: overrides?.sort !== undefined ? overrides.sort : sort,
    }));
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['complaints', appliedFilters],
    queryFn: async ({ pageParam = 1 }) => {
      return complaintApi.getComplaints({
        page: pageParam,
        limit: 10,
        district: appliedFilters.district || undefined,
        status: appliedFilters.status || undefined,
        sort: appliedFilters.sort || undefined,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });

  const complaints = data?.pages.flatMap(page => page.data) || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopTabBar navigation={navigation} />
      <View style={styles.header}>
        <Text style={styles.title}>Submissions</Text>
        <Text style={styles.subtitle}>
          Citizen suggestions consolidated
        </Text>
      </View>

      <ComplaintsFilter
        district={district}
        setDistrict={setDistrict}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
        onApply={handleApply}
      />

      <PaginatedList<Complaint>
        data={complaints}
        renderItem={({ item }) => <ComplaintCard complaint={item} />}
        keyExtractor={(item) => item._id}
        fetchNextPage={fetchNextPage}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        refetch={refetch}
        isRefetching={isRefetching}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
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
  listContent: {
    paddingHorizontal: Spacing.md,
  },
});
