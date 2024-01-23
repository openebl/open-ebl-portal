import { cn } from "@/lib/utils";

type TrackerPosition = "first" | "middle" | "last";

const TrackerPositionClipPath = {
  first:
    "polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)",
  middle:
    "polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%, 12px 50%)",
  last: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 12px 50%)",
};
const ProgressTracker = ({
  title,
  name,
  className,
  position,
}: {
  title: string;
  name: string;
  className: string;
  position: TrackerPosition;
}) => {
  position;
  return (
    <div
      className={cn(
        "flex flex-col min-w-0 flex-auto items-start justify-center bg-[#004DE3] py-[1.0625rem] pl-[1.875rem] pr-8",
        className,
        position === "first" ? "pl-[1.875rem]" : "-ml-[10px] pl-9",
      )}
      style={{
        clipPath: TrackerPositionClipPath[position],
      }}
    >
      <div className="text-xs font-semibold whitespace-nowrap leading-[1.125rem] text-[#86A1BC]">{title}</div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold leading-7 text-white max-w-full">
        {name}
      </div>
    </div>
  );
};
const ShippingProgress = () => {
  return (
    <section className="border-bolder-light w-full flex flex-col items-start rounded-lg border border-solid bg-white shadow-lg">
      <header className="m-[1.875rem] whitespace-nowrap text-[1.375rem] font-semibold leading-8 text-main">
        Progress
      </header>

      <div className="flex w-full max-w-full justify-evenly">
        <ProgressTracker
          title="Issuing Agent"
          name="ABC Freight Forwarder Forwarder Forwarder"
          className="bg-[#004DE3]"
          position="first"
        />
        <ProgressTracker
          title="Shipper"
          name="Foxconn Inc. Forwarder Forwarder Forwarder"
          className="bg-[#0D447A]"
          position="middle"
        />
        <ProgressTracker
          title="Consignee"
          name="Samsung"
          className="bg-[#0D447A]"
          position="middle"
        />
        <ProgressTracker
          title="Release Agent"
          name="DEF Freight Forwarder"
          className="bg-[#0D447A]"
          position="last"
        />
      </div>
      <div className="mt-8 flex w-full flex-col items-start self-stretch px-8 max-md:max-w-full max-md:px-5">
        <div className="flex w-[628px] max-w-full items-stretch justify-between gap-5 pb-5 pt-1 max-md:flex-wrap">
          <div className="flex grow basis-[0%] flex-col items-stretch self-start">
            <div className="text-xs leading-5 text-slate-500">Last Update</div>
            <div className="mt-2.5 whitespace-nowrap text-base font-semibold leading-6 text-main">
              Jan 14, 2024 at 09:23 AM
            </div>
          </div>
          <div className="flex grow basis-[0%] flex-col items-stretch self-start">
            <div className="text-xs leading-5 text-slate-500">
              Current Owner
            </div>
            <div className="mt-3 whitespace-nowrap text-base font-semibold leading-5 text-slate-400">
              ABC Freight Forwarder{" "}
              <span className="text-xs leading-5 text-slate-400">(You)</span>
            </div>
          </div>
          <div className="flex grow basis-[0%] flex-col items-stretch">
            <div className="text-xs leading-5 text-slate-500">Next Owner</div>
            <div className="mt-1.5 whitespace-nowrap text-base font-semibold leading-6 text-main">
              Foxconn Inc.
            </div>
          </div>
        </div>
        <div className="mt-8 items-stretch justify-center self-stretch rounded-lg border border-solid border-[color:var(--bolder\_dark,#738DBC)] bg-slate-50 px-4 pb-24 pt-3 text-sm leading-4 text-slate-400 shadow-sm max-md:max-w-full max-md:pb-10">
          Leave notes
        </div>
      </div>
      <div className="mr-8 mt-8 flex w-60 max-w-full items-stretch gap-0 self-end max-md:mr-2.5">
        <div className="flex grow basis-[0%] flex-col items-start justify-center rounded-lg bg-orange-500 py-3 pl-5 pr-16 max-md:pr-5">
          <span className="flex items-start gap-2.5">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d57d697d0ba2ae8d5e1bad2785f445ce07ecc683de17e89a681ac00fd27f005?apiKey=3c2ca1c9a64a4ea5b842b26888049467&"
              className="aspect-square w-[18px] max-w-full shrink-0 overflow-hidden object-contain object-center"
              alt="Transfer"
            />
            <div className="self-stretch text-sm font-semibold leading-5 text-white">
              Transfer
            </div>
          </span>
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/823563fabb88f240d7dbeb0a6541f44f9904dfd3395fdb08a73a2c4ae2dc8c37?apiKey=3c2ca1c9a64a4ea5b842b26888049467&"
          className="aspect-[0.91] w-10 max-w-full shrink-0 overflow-hidden object-contain object-center"
          alt="Image"
        />
      </div>
    </section>
  );
};

export default ShippingProgress;
