"use client";

import { Button } from "@/components/ui/button";
import AutoResizeIFrame from "../common/auto-resize-iframe";
import { useEffect, useRef, useState } from "react";

export const PolicyScrollView = ({ content ,onAgreed}: { content: string, onAgreed: () => void }) => {
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
    <div className="flex h-full w-full flex-col items-center bg-white px-[3.125rem] pt-[3.125rem]">
      <div
        className="h-full w-full overflow-y-scroll bg-background"
        ref={scrollContainerRef}
      >
        <AutoResizeIFrame
          className="w-full overflow-hidden"
          content={content || ""}
        />
      </div>
      <Button
        className="mb-[1.875rem] mt-5 w-fit"
        disabled={!isScrolledToBottom}
        onClick={onAgreed}
      >
        I’ve read the agreement
      </Button>
    </div>
  );
};
