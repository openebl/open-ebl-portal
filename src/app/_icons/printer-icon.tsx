const PrinterIcon = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <rect
      x="5.5"
      y="2.5"
      width="7"
      height="4"
      rx=".5"
      fill="#fff"
      stroke="#18335E"
    />
    <rect x="2" y="5" width="14" height="8" rx="1" fill="#18335E" />
    <rect
      x="4.5"
      y="10.5"
      width="9"
      height="5"
      rx=".5"
      fill="#fff"
      stroke="#18335E"
    />
  </svg>
);

export default PrinterIcon;
