import { api } from "@/trpc/react";

export const useFilterPorts = (keyword: string) => {
  const {
    data: ports,
    isLoading: loading,
    isError,
  } = api.port.list.useQuery({ keyword }, { staleTime: 1000 * 60 * 10 });
  const items = ports ?? [];
  return { items, loading, isError };
};

export const useGetPort = (id: string) => {
  const { data: port, isLoading: loading } = api.port.get.useQuery(
    { id },
    { staleTime: 1000 * 60 * 10 },
  );
  return { item: port ? { label: port.label, value: id } : null, loading };
};
