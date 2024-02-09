import { api } from "@/trpc/react";

export const useFilterPorts = (keyword: string) => {
  const {
    data,
    isLoading: loading,
    isError,
  } = api.port.list.useQuery({ keyword }, { staleTime: 1000 * 60 * 10 });
  const items = data ? data.map((p) => ({ label: p.label, value: p.id })) : [];
  return { items, loading, isError };
};

export const useGetPort = (id: string) => {
  const { data: port, isLoading: loading } = api.port.get.useQuery(
    { id },
    { staleTime: 1000 * 60 * 10 },
  );
  return { item: port ? { label: port.label, value: id } : null, loading };
};
