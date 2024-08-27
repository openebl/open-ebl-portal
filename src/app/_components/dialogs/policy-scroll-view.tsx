"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import AutoResizeIFrame from "../common/auto-resize-iframe";

interface PolicyInfo {
  service: string;
  name: string;
  version: number;
  content: string;
}

export const PolicyScrollView = ({
  info,
  wasRead,
  onRead,
}: {
  info: PolicyInfo;
  wasRead: boolean;
  onRead: () => void;
}) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current && !isScrolledToBottom) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollContainerRef.current;
        const isAtBottom =
          Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
        setIsScrolledToBottom(isAtBottom);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isScrolledToBottom]);

  return (
    <div className="flex h-full w-full flex-col items-center rounded-r-lg bg-white px-[3.125rem] pt-[3.125rem]">
      <div
        className="h-full w-full overflow-y-scroll bg-background"
        ref={scrollContainerRef}
      >
        <AutoResizeIFrame
          className="w-full overflow-hidden"
          content={info.content || ""}
        />
      </div>
      {wasRead ? (
        <div className="mb-[1.875rem] mt-5 h-[2.75rem] w-fit font-content text-sm text-main">
          You have read the agreement.
        </div>
      ) : (
        <Button
          className="mb-[1.875rem] mt-5 w-[11.25rem]"
          disabled={!isScrolledToBottom}
          onClick={onRead}
        >
          I’ve read the agreement
        </Button>
      )}
    </div>
  );
};
