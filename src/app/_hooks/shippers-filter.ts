import { api } from "@/trpc/react";
import { platformsToDropdownOptionList } from "@/lib/utils";

export const useFilterShippers = (keyword: string) => {
  const {
    data: shippers,
    isLoading: loading,
    isError,
  } = api.shipper.list.useQuery({ keyword }, { staleTime: 1000 * 60 * 10 });
  const items = platformsToDropdownOptionList(shippers);
  return { items, loading, isError };
};

export const useGetShipper = (id: string) => {
  const { data: shipper, isLoading: loading } = api.shipper.get.useQuery(
    { id },
    { staleTime: 1000 * 60 * 10 },
  );
  return {
    item: shipper ? { label: shipper.name, value: id } : null,
    loading,
  };
};
