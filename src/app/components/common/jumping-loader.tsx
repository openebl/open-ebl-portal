import { cn } from "@/lib/utils";

const JumpingLoader = ({ className }: { className?: string }) => {
  return (
    <div className="flex h-16">
      <span
        className={cn(
          "relative -left-10 box-border inline-block h-[3.5rem] w-[0.5rem] animate-[jumping-animation_0.8s_linear_infinite] rounded-lg",
          className,
        )}
      ></span>
    </div>
  );
};

export default JumpingLoader;
