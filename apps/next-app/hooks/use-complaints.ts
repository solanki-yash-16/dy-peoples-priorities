import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintService, GetComplaintsParams } from '../services/complaint.service';
import { toast } from 'sonner';

export const useComplaints = (params: GetComplaintsParams = {}) => {
  return useQuery({
    queryKey: ['complaints', params],
    queryFn: () => complaintService.getComplaints(params),
  });
};

export const useComplaintStats = () => {
  return useQuery({
    queryKey: ['complaint-stats'],
    queryFn: () => complaintService.getStats(),
  });
};

export const useHeatmap = () => {
  return useQuery({
    queryKey: ['heatmap'],
    queryFn: () => complaintService.getHeatmap(),
  });
};

export const useComplaintDetails = (id: string) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintService.getById(id),
    enabled: !!id,
  });
};

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      complaintService.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['complaint', id] });
      const previousComplaint = queryClient.getQueryData(['complaint', id]);
      
      queryClient.setQueryData(['complaint', id], (old: Record<string, unknown> | undefined) => {
        if (!old) return old;
        return { ...old, status };
      });

      return { previousComplaint };
    },
    onError: (error, variables, context) => {
      if (context?.previousComplaint) {
        queryClient.setQueryData(['complaint', variables.id], context.previousComplaint);
      }
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
    onSuccess: () => {
      toast.success('Status updated successfully');
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['complaint', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint-stats'] });
    },
  });
};
