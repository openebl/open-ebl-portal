'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const addOverflowHidden = (content: string) => {
  return content.replace(/<body([^>]*)>/i, '<body$1 style="overflow:hidden">');
};

//
// A simple iframe that adjusts its height to fit its content and hides overflow
//
const AutoResizeIFrame = ({
  className,
  content,
}: {
  className?: string;
  content: string;
}) => {
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);
  const [frameHeight, setFrameHeight] = useState(3000);
  const frameHeightRef = useRef(0);
  const [contentWithOverflowHidden] = useState(addOverflowHidden(content));

  const setiFrameHeight = useCallback(() => {
    const height =
      iframeRef?.contentWindow?.document.body.parentElement?.scrollHeight;
    if (height) {
      if (
        Math.abs(
          iframeRef?.contentWindow?.document.body.scrollHeight -
            frameHeightRef.current,
        ) > 200
      ) {
        setFrameHeight(iframeRef?.contentWindow?.document.body.scrollHeight);
      } else {
        setFrameHeight(height);
      }
    }
  }, [iframeRef]);

  useEffect(() => {
    frameHeightRef.current = frameHeight;
    if (iframeRef?.contentWindow)
      iframeRef.contentWindow.document.body.style.overflow = 'hidden';
    const tid = setInterval(setiFrameHeight, 500);
    return () => {
      clearInterval(tid);
    };
  }, [frameHeight, setiFrameHeight, iframeRef]);

  return (
    <iframe
      style={{ height: `${frameHeight}px` }}
      className={className}
      srcDoc={contentWithOverflowHidden}
      ref={(ref) => setIframeRef(ref)}
    />
  );
};

export default AutoResizeIFrame;
