const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    width="14"
    height="15"
    fill="none"
    viewBox="0 0 14 15"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.03 1.48V.8a.68.68 0 0 1 1.35 0v.68h1.34c1.12 0 2.03.9 2.03 2.02v9.21c0 1.12-.9 2.03-2.03 2.03H2.28c-1.11 0-2.02-.91-2.02-2.03V3.5c0-1.12.9-2.02 2.02-2.02h1.35V.8a.68.68 0 0 1 1.35 0v.68h4.06ZM1.6 6.88v5.83c0 .37.3.68.67.68h9.45c.38 0 .68-.3.68-.68V6.87H1.6Zm10.8-1.35H1.6V3.5c0-.37.3-.67.67-.67h1.35v.67a.68.68 0 0 0 1.35 0v-.67h4.06v.67a.68.68 0 0 0 1.35 0v-.67h1.34c.38 0 .68.3.68.67v2.03Z"
      fill="currentColor"
    />
  </svg>
);

export default CalendarIcon;
