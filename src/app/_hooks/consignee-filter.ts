import { api } from "@/trpc/react";
import { platformsToDropdownOptionList } from "@/lib/utils";

export const useFilterConsignees = (keyword: string) => {
  const {
    data: consignees,
    isLoading: loading,
    isError,
  } = api.consignee.list.useQuery({ keyword }, { staleTime: 1000 * 60 * 10 });
  const items = platformsToDropdownOptionList(consignees);
  return { items, loading, isError };
};

export const useGetConsignee = (id: string) => {
  const { data: consignee, isLoading: loading } = api.consignee.get.useQuery(
    { id },
    { staleTime: 1000 * 60 * 10 },
  );
  return {
    item: consignee ? { label: consignee.name, value: id } : null,
    loading,
  };
};
