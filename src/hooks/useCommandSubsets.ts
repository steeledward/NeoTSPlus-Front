/**
 * useCommandSubsets Hook
 * React Query hook for managing command subsets state
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import type { CommandSubset } from "@/types/commandSubset.types";
import {
  getCustomSubsets,
  createCustomSubset,
  updateCustomSubset,
  deleteCustomSubset,
} from "@/services/commandSubsets";
import { getPredefinedSubsets } from "@/utils/commandSubsets";
import { useTranslation } from "react-i18next";

/**
 * Hook to fetch all available command subsets (predefined + custom)
 */
export function useAllCommandSubsets(userId: string | undefined) {
  const { t } = useTranslation();

  return useQuery({
    queryKey: ["commandSubsets", userId],
    queryFn: () => {
      if (!userId) return [];

      const predefined = getPredefinedSubsets(t);
      const custom = getCustomSubsets(userId);
      return [...predefined, ...custom];
    },
    enabled: !!userId,
  });
}

/**
 * Hook to fetch only custom command subsets
 */
export function useCustomCommandSubsets(userId: string | undefined) {
  return useQuery({
    queryKey: ["customCommandSubsets", userId],
    queryFn: () => {
      if (!userId) return [];
      return getCustomSubsets(userId);
    },
    enabled: !!userId,
  });
}

/**
 * Hook to create a new custom subset
 */
export function useCreateCommandSubset(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      subset: Omit<CommandSubset, "id" | "createdBy" | "createdAt">
    ) => {
      if (!userId) throw new Error("User ID is required");
      return Promise.resolve(createCustomSubset(userId, subset));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCommandSubsets", userId] });
      queryClient.invalidateQueries({ queryKey: ["commandSubsets", userId] });
    },
  });
}

/**
 * Hook to update a custom subset
 */
export function useUpdateCommandSubset(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subsetId,
      updates,
    }: {
      subsetId: string;
      updates: Partial<CommandSubset>;
    }) => {
      if (!userId) throw new Error("User ID is required");
      const result = updateCustomSubset(userId, subsetId, updates);
      if (!result) throw new Error("Subset not found");
      return Promise.resolve(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCommandSubsets", userId] });
      queryClient.invalidateQueries({ queryKey: ["commandSubsets", userId] });
    },
  });
}

/**
 * Hook to delete a custom subset
 */
export function useDeleteCommandSubset(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subsetId: string) => {
      if (!userId) throw new Error("User ID is required");
      const success = deleteCustomSubset(userId, subsetId);
      if (!success) throw new Error("Subset not found");
      return Promise.resolve(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCommandSubsets", userId] });
      queryClient.invalidateQueries({ queryKey: ["commandSubsets", userId] });
    },
  });
}

// Import needed for queryClient
import { useQueryClient } from "@tanstack/react-query";
