const PrintedIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <path
      d="M6.7 13.8 6 14m.7 0c3.5-.5 7-.5 10.6 0m-10.6 0L6.3 18m11-4.2.7.1m-.7 0 .4 4.1.2 2.5a1.1 1.1 0 0 1-1.1 1.3H7.2c-.6 0-1.1-.6-1-1.3l.1-2.5m0 0h-1A2.3 2.3 0 0 1 3 15.7V9.6c0-1.1.8-2 1.8-2.2a48 48 0 0 1 2-.3m10.9 11h1a2.3 2.3 0 0 0 2.3-2.3V9.6c0-1.1-.8-2-1.8-2.2a48 48 0 0 0-2-.3m0 0c-3.4-.3-7-.3-10.4 0m10.4 0V3.4c0-.6-.5-1.1-1-1.1H7.8c-.6 0-1.2.5-1.2 1V7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PrintedIcon;
