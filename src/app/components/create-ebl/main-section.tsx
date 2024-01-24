import { Button } from "@/components/ui/button";
import UploadPanel from "./upload-panel";
import ProcessingPanel from "./processing-panel";

const MainSection = () => {
  let status = 'new';
  status = 'processing';
  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">New eB/L</div>

      <div className="border-bolder-light mt-[1.875rem] flex h-[53.5rem] flex-col justify-between rounded-lg border border-solid bg-white shadow-lg">
        { status === 'new' && <UploadPanel /> }
        { status === 'uploading' && <div>Uploading...</div> }
        { status === 'processing' && <ProcessingPanel /> }
        <div className="flex items-center justify-start h-[5.25rem] w-full border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
          <Button variant="outline" size="lg">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
