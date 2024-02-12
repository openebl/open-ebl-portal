import { type EBlDraftType } from "@/types/ebl";
import FileDetails from "./file-details";
import HistoryList from "./history-list";
import ShippingProgress from "./shipping-progress";

const MainSection = ({ ebl }: { ebl: EBlDraftType }) => {
  const history = [
    {
      id: ebl.id,
      actor: "Issuing Agent",
      actedBy: "John Wu",
      actedAt: "Jan 14, 2024 at 09:21 AM",
      action: "Uploaded eB/L to the system.",
      target: "",
      targetedAt: "",
      notes: "",
      notesAltered: false,
    },
    {
      actor: "Issuing Agent",
      actedBy: "John Wu",
      actedAt: "Jan 14, 2024 at 10:31 AM",
      action: "Transfer of document.",
      target: "Shipper",
      targetedAt: "Jan 14, 2024 at 10:32 AM",
      notes: "The booking No. is BK5093828 for your reference.",
      notesAltered: false,
    },
    {
      actor: "Shipper",
      actedBy: "Kevin Houston",
      actedAt: "Jan 14, 2024 at 03:01 PM",
      action: "Request of amendment.",
      target: "Issuing Agent",
      targetedAt: "Jan 14, 2024 at 03:02 PM",
      notes:
        "The telephone of consignee is (+1)483 4728893, please correct it. Thanks.",
      notesAltered: true,
    }
  ]

  return (
    <div className="flex flex-col gap-y-5 mt-[1.875rem]">
      <FileDetails />
      <ShippingProgress />
      <HistoryList history={history}/>
    </div>
  );
};

export default MainSection;
