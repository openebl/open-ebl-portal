"use client";

import Paginator from "@/app/components/common/paginator";
import { useState } from "react";

const PaginatorSection = () => {
  const [page, setPage] = useState(1);
  return <Paginator
    total={92}
    perPage={10}
    currentPage={page}
    onPageChanged={(page) => setPage(page)}
  />;
};

export default PaginatorSection;
