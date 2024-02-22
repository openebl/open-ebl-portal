import { cn } from "@/lib/utils";

const Badge = ({ title, className }: { title: string; className: string }) => (
  <div
    className={cn(
      "flex h-6 items-center justify-center whitespace-nowrap rounded-2xl px-2.5 text-[.625rem] leading-4",
      className,
    )}
  >
    {title}
  </div>
);

const HblNonNegotiableBadge = () => (
  <Badge
    title="HBL NON-NEGOTIABLE"
    className="bg-[#039912] font-semibold text-white"
  />
);

const FourPBadge = ({ title }: { title: string }) => (
  <Badge
    title={title}
    className="border border-solid border-border-dark bg-white font-normal text-main"
  />
);

export { HblNonNegotiableBadge, FourPBadge };
