"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AutoResizeIFrame from "../common/auto-resize-iframe";

interface PolicyInfo {
  service: string;
  name: string;
  version: number;
  content: string;
}

export const PolicyScrollView = ({
  info,
  canAccept,
  onAgreed,
}: {
  info: PolicyInfo;
  canAccept: boolean;
  onAgreed: () => void;
}) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const acceptMutation = api.user.acceptAgreement.useMutation({
    onError: (error) => {
      setAccepting(false);
      toast.error(`Failed to send invitation: ${error.message}`);
    },
    onSuccess: () => {
      setAccepting(false);
      onAgreed();
    },
  });

  const onAcceptClick = () => {
    setAccepting(true);
    acceptMutation.mutate({
      ...info,
      acceptedAt: Date.now(),
    });
  };

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
      <Button
        loading={accepting}
        className="mb-[1.875rem] mt-5 w-fit"
        disabled={!isScrolledToBottom || !canAccept}
        onClick={onAcceptClick}
      >
        I’ve read the agreement
      </Button>
    </div>
  );
};
