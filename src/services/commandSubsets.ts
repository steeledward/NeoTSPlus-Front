/**
 * Command Subsets Service
 * API calls and local storage for managing command subsets
 */

import type { CommandSubset } from "@/types/commandSubset.types";

const STORAGE_KEY = "command_subsets";

/**
 * Get user's custom command subsets from localStorage
 */
export function getCustomSubsets(userId: string): CommandSubset[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading custom subsets from storage:", error);
    return [];
  }
}

/**
 * Save custom subsets to localStorage
 */
export function saveCustomSubsets(
  userId: string,
  subsets: CommandSubset[]
): void {
  try {
    localStorage.setItem(
      `${STORAGE_KEY}_${userId}`,
      JSON.stringify(subsets)
    );
  } catch (error) {
    console.error("Error saving custom subsets to storage:", error);
  }
}

/**
 * Create a new custom subset
 */
export function createCustomSubset(
  userId: string,
  subset: Omit<CommandSubset, "id" | "createdBy" | "createdAt">
): CommandSubset {
  const newSubset: CommandSubset = {
    ...subset,
    id: `custom_${Date.now()}`,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const existing = getCustomSubsets(userId);
  saveCustomSubsets(userId, [...existing, newSubset]);
  return newSubset;
}

/**
 * Update a custom subset
 */
export function updateCustomSubset(
  userId: string,
  subsetId: string,
  updates: Partial<CommandSubset>
): CommandSubset | null {
  const existing = getCustomSubsets(userId);
  const index = existing.findIndex((s) => s.id === subsetId);

  if (index === -1) {
    console.error(`Subset ${subsetId} not found`);
    return null;
  }

  const updated: CommandSubset = {
    ...existing[index],
    ...updates,
    updatedAt: new Date(),
  };

  existing[index] = updated;
  saveCustomSubsets(userId, existing);
  return updated;
}

/**
 * Delete a custom subset
 */
export function deleteCustomSubset(userId: string, subsetId: string): boolean {
  const existing = getCustomSubsets(userId);
  const filtered = existing.filter((s) => s.id !== subsetId);

  if (filtered.length === existing.length) {
    console.warn(`Subset ${subsetId} not found`);
    return false;
  }

  saveCustomSubsets(userId, filtered);
  return true;
}

/**
 * Future: Replace with API calls for backend persistence
 * Example for backend integration:
 *
 * export async function getCustomSubsetsFromAPI(userId: string): Promise<CommandSubset[]> {
 *   const response = await fetch(`/api/users/${userId}/command-subsets`);
 *   if (!response.ok) throw new Error("Failed to fetch subsets");
 *   return response.json();
 * }
 *
 * export async function saveCustomSubsetToAPI(userId: string, subset: CommandSubset): Promise<CommandSubset> {
 *   const response = await fetch(`/api/users/${userId}/command-subsets`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(subset),
 *   });
 *   if (!response.ok) throw new Error("Failed to save subset");
 *   return response.json();
 * }
 */
