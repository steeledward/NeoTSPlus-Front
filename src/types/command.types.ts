import { z } from "zod";

export type CommandMethod = (...args: any[]) => Promise<any>;

export interface CommandDefinition {
  id: string;
  name: string;
  route: string;
  description?: string;
  method: "GET" | "POST" | "PUT" | "DELETE"
  params: Array<{
    id: string;
    name: string;
    type: string;
    optional: boolean;
    selectOptions?: Array<{ id: string; value: string }>;
    placeholder?: string;
  }>;
  schema?: z.ZodType<any>;
  api: CommandMethod;
}
