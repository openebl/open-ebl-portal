"use client";

import Paginator from "@/app/_components/common/paginator";
import { useRouter } from "next/navigation";

const PaginatorSection = ({
  total,
  currentPage,
}: {
  total: number;
  currentPage: number;
}) => {
  const router = useRouter();
  return (
    <Paginator
      total={total}
      perPage={10}
      currentPage={currentPage}
      onPageChanged={(page) =>
        router.push(`/ebls?page=${page}`, { scroll: true })
      }
    />
  );
};

export default PaginatorSection;
