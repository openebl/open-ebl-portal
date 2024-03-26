const ThreeDotIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...{ className }}
  >
    <path
      fillRule="evenodd"
      d="M10 3a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z"
      clipRule="evenodd"
    />
  </svg>
);

export default ThreeDotIcon;
