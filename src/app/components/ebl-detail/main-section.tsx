import { type EBlType } from "@/types/ebl";
import FileDetails from "./file-details";
import ShippingProgress from "./shipping-progress";

const MainSection = ({ ebl }: { ebl: EBlType }) => {
  return (
    <div className="flex flex-col gap-y-5 mt-[1.875rem]">
      <FileDetails />
      <ShippingProgress />
    </div>
  );
};

export default MainSection;
