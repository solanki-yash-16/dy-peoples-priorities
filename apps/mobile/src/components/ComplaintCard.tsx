import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';
import { Card } from './Card';
import { Complaint, complaintApi } from '../api/complaint';
import { formatDistanceToNow } from 'date-fns';
import { Dropdown } from './Dropdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

interface ComplaintCardProps {
  complaint: Complaint;
  style?: any;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  style,
}) => {
  const { _id, description, location, status, createdAt, media } = complaint;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStatus: string) =>
      complaintApi.updateStatus(_id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      Toast.show({
        type: 'success',
        text1: 'Status Updated',
        text2: 'The complaint status was successfully changed.',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update status.',
      });
    },
  });

  let timeAgo = '';
  try {
    if (createdAt)
      timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  } catch (e) {
    timeAgo = '';
    console.error(e)
  }

  const getStatusColor = (status: string = '') => {
    switch (status.toLowerCase()) {
      case 'approve':
      case 'approved':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.slate[500];
    }
  };

  const statusColor = getStatusColor(status);

  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {description?.originalText || 'No description'}
          </Text>
        </View>
        <View style={styles.dropdownContainer}>
          <Dropdown
            label="Select Status:"
            data={[
              { label: 'Pending', value: 'PENDING' },
              { label: 'Approved', value: 'approve' },
              { label: 'Rejected', value: 'rejected' },
            ]}
            value={status}
            onChange={item => mutation.mutate(item.value)}
            placeholder={status || 'Status'}
            selectedTextColor={statusColor}
          />
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText} numberOfLines={1}>
          📍{' '}
          {location?.district
            ? `District: ${location.district}, State: ${location.state}`
            : location?.address || 'Location not specified'}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.dateText}>{timeAgo}</Text>

        <View style={styles.mediaContainer}>
          {media && media.length > 0 && (
            <Text style={styles.mediaText}>
              📎 {media.length} Attachment{media.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    lineHeight: 20,
  },
  dropdownContainer: {
    width: 140,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  metaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dateText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.accent,
    fontWeight: Typography.weights.medium,
  },
});
