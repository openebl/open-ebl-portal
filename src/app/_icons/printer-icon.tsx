const PrinterIcon = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <rect x="5.5" y="2.5" width="7" height="4" rx="0.5" stroke="#18335E" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3 5C2.44772 5 2 5.44772 2 6V12C2 12.5523 2.44772 13 3 13H4V11C4 10.4477 4.44772 10 5 10H13C13.5523 10 14 10.4477 14 11V13H15C15.5523 13 16 12.5523 16 12V6C16 5.44772 15.5523 5 15 5H3Z" fill="#18335E" />
    <rect x="4.5" y="10.5" width="9" height="5" rx="0.5" stroke="#18335E" />
  </svg>
);

export default PrinterIcon;
