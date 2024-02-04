const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <path
      d="M15.25 7.75c0 5.952-6.25 9.375-6.25 9.375S2.75 13.702 2.75 7.75a6.25 6.25 0 0 1 12.5 0Z"
      fill="#99AED2"
    />
    <path d="M11.5 7.75a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" fill="#fff" />
  </svg>
);

export default LocationIcon;
