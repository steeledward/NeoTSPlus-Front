/**
 * Command Subset Types
 * Defines interfaces for grouping commands into logical categories
 */

export interface CommandSubset {
  id: string;
  name: string;
  description?: string;
  commandIds: string[];
  createdBy?: string; // User ID who created this subset
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommandSubsetCategory {
  id: string;
  label: string;
  description?: string;
  subsets: CommandSubset[];
}
