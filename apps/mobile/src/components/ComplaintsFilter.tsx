import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../theme';

interface ComplaintsFilterProps {
  district: string;
  setDistrict: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  onApply: (overrides?: { district?: string; status?: string; sort?: string }) => void;
}

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'approve' },
  { label: 'Rejected', value: 'rejected' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Oldest First', value: 'createdAt' },
];

export const ComplaintsFilter: React.FC<ComplaintsFilterProps> = ({
  district,
  setDistrict,
  status,
  setStatus,
  sort,
  setSort,
  onApply,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>District:</Text>
        <TextInput
          style={styles.input}
          placeholder="Filter by district..."
          placeholderTextColor="#000000"
          value={district}
          onChangeText={(val) => {
            setDistrict(val);
            if (val.trim() === '') {
              // Immediately apply when cleared
              onApply({ district: val });
            }
          }}
          onSubmitEditing={() => onApply({ district })}
          returnKeyType="search"
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.label}>Status:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          {STATUS_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, status === opt.value && styles.chipSelected]}
              onPress={() => {
                setStatus(opt.value);
                onApply({ status: opt.value });
              }}
            >
              <Text style={[styles.chipText, status === opt.value && styles.chipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.label}>Sort:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, sort === opt.value && styles.chipSelected]}
              onPress={() => {
                setSort(opt.value);
                onApply({ sort: opt.value });
              }}
            >
              <Text style={[styles.chipText, sort === opt.value && styles.chipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  row: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  filterSection: {
    marginBottom: Spacing.sm,
  },
  chipContainer: {
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  chipTextSelected: {
    color: Colors.white,
  },
});
