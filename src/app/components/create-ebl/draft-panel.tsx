"use client";

import DetailPanel from "./detail-panel";
import PreviewPanel from "./preview-panel";

const DraftPanel = () => {
  return (
    <div className="flex h-[48.125rem] items-stretch">
      <PreviewPanel images={[]} />
      <DetailPanel />
    </div>
  );
};

export default DraftPanel;