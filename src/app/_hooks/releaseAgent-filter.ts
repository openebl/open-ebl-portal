import { api } from "@/trpc/react";

export const useFilterReleaseAgents = (keyword: string) => {
  const {
    data,
    isLoading: loading,
    isError,
  } = api.releaseAgent.list.useQuery({ keyword }, { staleTime: 1000 * 60 * 10 });
  const items = data ? data.map((p) => ({ label: p.label, value: p.id })) : [];
  return { items, loading, isError };
};

export const useGetReleaseAgent = (id: string) => {
  const { data: releaseAgent, isLoading: loading } = api.releaseAgent.get.useQuery(
    { id },
    { staleTime: 1000 * 60 * 10 },
  );
  return {
    item: releaseAgent ? { label: releaseAgent.label, value: id } : null,
    loading,
  };
};
