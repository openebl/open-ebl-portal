const EllipsisIcon = ({ className }: { className?: string }) => (
  <svg
    width="15"
    height="15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <path
      d="M3.6 7.5a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Zm5 0a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Zm3.9 1.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);
export default EllipsisIcon;
