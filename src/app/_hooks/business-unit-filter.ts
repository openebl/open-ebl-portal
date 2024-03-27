import { buListToDropdownOptionList } from "@/lib/utils";
import { api } from "@/trpc/react";

export const useFilterBusinessUnits = (keyword: string) => {
  const {
    data: buList,
    isLoading: loading,
    isError,
  } = api.buinfo.list.useQuery({ keyword }, { staleTime: 1000 * 60 * 10 });
  const items = buListToDropdownOptionList(buList);
  return { items, loading, isError };
};

export const useGetBusinessUnit = (id: string) => {
  const { data: name, isLoading: loading } = api.buinfo.legalBusinessName.useQuery(
    id ,
    { staleTime: 1000 * 60 * 10 },
  );
  return {
    item: name ? { label: name, value: id } : null,
    loading,
  };
};
