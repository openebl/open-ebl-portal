"use client";

import JumpingLoader from "../common/jumping-loader";

const ProcessingPanel = () => {
  return (
    <div className="flex h-[48.125rem] flex-col items-center justify-center p-[3.125rem] text-main">
      <JumpingLoader className="text-secondary1"/>
      <p className="text-base font-semibold mt-10">Scanning documents...</p>
      <p className="my-2.5 whitespace-nowrap text-[0.75rem] leading-[1.125rem] font-normal">
      This may take a moment, thank you for your patience.
      </p>
    </div>
  );
};

export default ProcessingPanel;
