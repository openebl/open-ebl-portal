"use client";

import Paginator from "@/app/_components/common/paginator";
import { useRouter } from "next/navigation";

const PaginatorSection = ({
  total,
  currentPage,
  filter,
}: {
  total: number;
  currentPage: number;
  filter: string | null | undefined;
}) => {
  const router = useRouter();
  return (
    <Paginator
      total={total}
      perPage={10}
      currentPage={currentPage}
      onPageChanged={(page) =>
        router.push(`/ebls?page=${page}&filter=${filter}`, { scroll: true })
      }
    />
  );
};

export default PaginatorSection;
