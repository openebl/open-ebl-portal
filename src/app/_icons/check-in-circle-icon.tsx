const CircleInCheckIcon = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <path
      d="M2.25 9a6.75 6.75 0 1 0 13.5 0 6.75 6.75 0 0 0-13.5 0Z"
      fill="currentColor"
    />
    <path
      d="m7.65 12.36-.01-.02-.02.02-2.95-2.95 1.05-1.04 1.92 1.92 4.64-4.65 1.05 1.05-5.68 5.67Z"
      fill="#fff"
    />
  </svg>
);

export default CircleInCheckIcon;
