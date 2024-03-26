import {
  BusinessInfoKeys,
  BusinessInfoTitleMapping,
  type BusinessInfoType,
} from "@/types/business-info";

const BusinessInfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="flex w-full flex-col pl-7 pr-3.5 pt-5">
    <div className="flex gap-5">
      <div className="w-[21rem]">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
    <div className="mt-5 h-px shrink-0 bg-zinc-200" />
  </div>
);

const BusinessInfoSection = ({ info }: { info?: BusinessInfoType | null }) => {
  return (
    <div className="mx-[3.125rem] my-[1.875rem] flex flex-col rounded-lg border border-solid border-border-light bg-white font-header text-main shadow-lg">
      <header className="w-full items-start justify-center px-8 py-7 text-lg font-semibold leading-7">
        Business Info
      </header>
      <main className="text-[0.8125rem] leading-[1.125rem]">
        {BusinessInfoKeys.map((key) => (
          <BusinessInfoItem
            key={key}
            label={BusinessInfoTitleMapping[key]}
            value={info?.[key]}
          />
        ))}
      </main>
    </div>
  );
};

export default BusinessInfoSection;
