import { api } from "@/trpc/react";

export const useFilterShippers = (keyword: string) => {
  const {
    data,
    isLoading: loading,
    isError,
  } = api.shipper.list.useQuery({ keyword }, { staleTime: 1000 * 60 * 10 });
  const items = data ? data.map((p) => ({ label: p.label, value: p.id })) : [];
  return { items, loading, isError };
};

export const useGetShipper = (id: string) => {
  const { data: shipper, isLoading: loading } = api.shipper.get.useQuery(
    { id },
    { staleTime: 1000 * 60 * 10 },
  );
  return {
    item: shipper ? { label: shipper.label, value: id } : null,
    loading,
  };
};
