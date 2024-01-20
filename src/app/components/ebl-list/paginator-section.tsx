"use client";

import Paginator from "@/app/components/common/paginator";

const PaginatorSection = () => {
  return <Paginator
    total={100}
    totalPages={10}
    currentPage={1}
    onPageChanged={(page) => console.log(page)}
  />;
};

export default PaginatorSection;
