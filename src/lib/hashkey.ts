import { type QueryKey } from "@tanstack/react-query";
import SuperJSON from "superjson";

export function hashQueryKey(queryKey: QueryKey): string {
  return SuperJSON.stringify(queryKey);
}
