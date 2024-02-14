"use client";

import JumpingLoader from "@/app/_components/common/jumping-loader";

const UploadingView = () => {
  return (
    <div className="flex h-[48.125rem] flex-col items-center justify-center p-[3.125rem] text-main">
      <JumpingLoader className="text-secondary1" />
      <p className="mt-10 text-base font-semibold">Uploading document...</p>
      <p className="my-2.5 whitespace-nowrap text-[0.75rem] font-normal leading-[1.125rem]">
        This may take a moment, thank you for your patience.
      </p>
    </div>
  );
};

export default UploadingView;
