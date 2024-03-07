import { api } from "@/trpc/react";
import { platformsToDropdownOptionList } from "@/lib/utils";

export const useFilterReleaseAgents = (keyword: string) => {
  const {
    data: releaseAgents,
    isLoading: loading,
    isError,
  } = api.releaseAgent.list.useQuery({ keyword }, { staleTime: 1000 * 60 * 10 });
  const items = platformsToDropdownOptionList(releaseAgents);
  return { items, loading, isError };
};

export const useGetReleaseAgent = (id: string) => {
  const { data: releaseAgent, isLoading: loading } = api.releaseAgent.get.useQuery(
    { id },
    { staleTime: 1000 * 60 * 10 },
  );
  return {
    item: releaseAgent ? { label: releaseAgent.name, value: id } : null,
    loading,
  };
};
