"use client";

import LeftArrowIcon from "@/app/icons/left-arrow-icon";
import RightArrowIcon from "@/app/icons/right-arrow-icon";
import { cn } from "@/lib/utils";

const PagePrev = ({
  currentPage,
  onClick,
}: {
  currentPage: number;
  onClick: (page: number) => void;
}) => {
  const isActive = currentPage > 1;
  return (
    <div
      className={cn(
        "flex select-none text-border-dark",
        isActive ? "cursor-pointer" : "cursor-not-allowed",
      )}
      onClick={() => isActive && onClick(currentPage - 1)}
    >
      <LeftArrowIcon />
      <div className="my-auto self-center text-center text-xs font-semibold leading-5">
        Prev
      </div>
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
        "flex select-none text-border-dark",
        isActive ? "cursor-pointer" : "cursor-not-allowed",
      )}
      onClick={() => isActive && onClick(currentPage + 1)}
    >
      <div className="my-auto self-center text-center text-xs font-semibold leading-5">
        Next
      </div>
      <RightArrowIcon />
    </div>
  );
};

const PageItem = ({
  page,
  currentPage,
  onClick,
}: {
  page: number;
  currentPage: number;
  onClick: (page: number) => void;
}) => {
  const classNames =
    page === currentPage
      ? "bg-main text-white"
      : "border border-solid border-border-dark text-border-dark";

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

const Paginator = ({
  total,
  totalPages,
  currentPage,
  onPageChanged,
}: {
  total: number;
  totalPages: number;
  currentPage: number;
  onPageChanged: (page: number) => void;
}) => {
  if (totalPages === 0) return null;

  return (
    <div className="border-bolder-light flex items-center justify-center rounded-[58px] border border-solid bg-white px-5 py-[11px] shadow-xl">
      <div className="my-auto grow self-center whitespace-nowrap text-xs font-semibold leading-5 text-main mr-5">
        {total} to {totalPages} of {total} entries
      </div>
      <PagePrev currentPage={currentPage} onClick={onPageChanged} />
      <div className="mx-5 flex items-center justify-start gap-1.5">
        {[1, 2, 3, 4, 5].map((page) => (
          <PageItem
            key={page}
            page={page}
            currentPage={currentPage}
            onClick={onPageChanged}
          />
        ))}
      </div>
      <PageNext totalPages={totalPages} currentPage={currentPage} onClick={onPageChanged} />
    </div>
  );
};

export default Paginator;
