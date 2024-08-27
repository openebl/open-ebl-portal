"use client";

import EllipsisIcon from "@/app/_icons/ellipsis-icon.svg";
import LeftArrowIcon from "@/app/_icons/left-arrow-icon.svg";
import RightArrowIcon from "@/app/_icons/right-arrow-icon.svg";
import { cn } from "@/lib/utils";

const PagePrev = ({ currentPage, onClick }: { currentPage: number; onClick: (page: number) => void }) => {
  const isActive = currentPage > 1;
  return (
    <div
      className={cn(
        "mr-5 flex select-none",
        isActive ? "cursor-pointer text-secondary1" : "cursor-not-allowed text-border-dark",
      )}
      onClick={() => isActive && onClick(currentPage - 1)}
    >
      <LeftArrowIcon />
      <div className="my-auto self-center text-center text-xs font-semibold leading-5">Prev</div>
    </div>
  );
};

const PageNext = ({
  totalPages,
  currentPage,
  onClick,
}: {
  totalPages: number;
  currentPage: number;
  onClick: (page: number) => void;
}) => {
  const isActive = currentPage < totalPages;
  return (
    <div
      className={cn(
        "ml-5 flex select-none",
        isActive ? "cursor-pointer text-secondary1" : "cursor-not-allowed text-border-dark",
      )}
      onClick={() => isActive && onClick(currentPage + 1)}
    >
      <div className="my-auto self-center text-center text-xs font-semibold leading-5">Next</div>
      <RightArrowIcon />
    </div>
  );
};

const PageNumber = ({
  page,
  currentPage,
  onClick,
}: {
  page: number;
  currentPage: number;
  onClick: (page: number) => void;
}) => {
  const classNames =
    page === currentPage ? "bg-main text-white" : "border border-solid border-border-dark text-border-dark";

  return (
    <span
      className={cn(
        "flex h-[1.375rem] cursor-pointer select-none items-center justify-center rounded px-3 text-xs font-medium",
        classNames,
      )}
      onClick={() => onClick(page)}
    >
      {page}
    </span>
  );
};

const PageItem = ({
  page,
  totalPages,
  currentPage,
  onClick,
}: {
  page: number | string;
  totalPages: number;
  currentPage: number;
  onClick: (page: number) => void;
}) => {
  if (page === "previous") {
    return <PagePrev currentPage={currentPage} onClick={onClick} />;
  }
  if (page === "next") {
    return <PageNext totalPages={totalPages} currentPage={currentPage} onClick={onClick} />;
  }
  if (page === "start-ellipsis" || page === "end-ellipsis") {
    return <EllipsisIcon className="h-4 w-4 cursor-default text-border-dark" />;
  }
  if (typeof page === "number") {
    return <PageNumber page={page} currentPage={currentPage} onClick={onClick} />;
  }
  return null;
};

const pagenationItems = ({ totalPages, currentPage }: { totalPages: number; currentPage: number }) => {
  const boundaryCount = 1;
  const siblingCount = 1;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      currentPage - siblingCount,
      // Lower boundary when page is high
      totalPages - boundaryCount - siblingCount * 2 - 1,
    ),
    // Greater than startPages
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      currentPage + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2,
    ),
    // Less than endPages
    endPages.length > 0 ? (endPages[0] ?? 0) - 2 : totalPages - 1,
  );

  // Basic list of items to render
  // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
  return [
    // ...(showFirstButton ? ['first'] : []),
    "previous",
    ...startPages,

    // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsStart > boundaryCount + 2
      ? ["start-ellipsis"]
      : boundaryCount + 1 < totalPages - boundaryCount
        ? [boundaryCount + 1]
        : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsEnd < totalPages - boundaryCount - 1
      ? ["end-ellipsis"]
      : totalPages - boundaryCount > boundaryCount
        ? [totalPages - boundaryCount]
        : []),

    ...endPages,
    "next",
    // ...(showLastButton ? ['last'] : []),
  ];
};

const Paginator = ({
  total,
  perPage,
  currentPage,
  onPageChanged,
}: {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChanged: (page: number) => void;
}) => {
  if (total <= perPage) return null;

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="border-bolder-light flex items-center justify-center rounded-[58px] border border-solid bg-white px-5 py-[11px] shadow-xl">
      <div className="my-auto grow self-center whitespace-nowrap text-xs font-semibold leading-5 text-main">
        {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, total)} of {total} entries
      </div>
      <div className="mx-5 flex items-center justify-start gap-1.5">
        {pagenationItems({ totalPages, currentPage }).map((page) => (
          <PageItem key={page} page={page} totalPages={totalPages} currentPage={currentPage} onClick={onPageChanged} />
        ))}
      </div>
    </div>
  );
};

export default Paginator;
