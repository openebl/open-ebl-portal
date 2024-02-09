import { api } from "@/trpc/react";

export const useFilterConsignees = (keyword: string) => {
  const {
    data,
    isLoading: loading,
    isError,
  } = api.consignee.list.useQuery({ keyword }, { staleTime: 1000 * 60 * 10 });
  const items = data ? data.map((p) => ({ label: p.label, value: p.id })) : [];
  return { items, loading, isError };
};

export const useGetConsignee = (id: string) => {
  const { data: consignee, isLoading: loading } = api.consignee.get.useQuery(
    { id },
    { staleTime: 1000 * 60 * 10 },
  );
  return {
    item: consignee ? { label: consignee.label, value: id } : null,
    loading,
  };
};
