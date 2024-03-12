"use client";

import Paginator from "@/app/_components/common/paginator";
import type { EBlFilter } from "@/types/ebl";
import { useRouter } from "next/navigation";

const PaginatorSection = ({
  total,
  currentPage,
  filter,
}: {
  total: number;
  currentPage: number;
  filter: EBlFilter | null | undefined;
}) => {
  const router = useRouter();
  return (
    <Paginator
      total={total}
      perPage={10}
      currentPage={currentPage}
      onPageChanged={(page) =>
        router.push(`/ebls?page=${page ?? 1}&filter=${filter ?? 'action_needed'}`, { scroll: true })
      }
    />
  );
};

export default PaginatorSection;
