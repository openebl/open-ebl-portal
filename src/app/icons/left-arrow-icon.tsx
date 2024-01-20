const LeftArrowIcon = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <path
      d="M11 4 6 9l5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LeftArrowIcon;
