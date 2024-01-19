const MailIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <path
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.24a2.25 2.25 0 0 1-1.07 1.92l-7.5 4.61a2.25 2.25 0 0 1-2.36 0l-7.5-4.61a2.25 2.25 0 0 1-1.07-1.92v-.24"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default MailIcon;
