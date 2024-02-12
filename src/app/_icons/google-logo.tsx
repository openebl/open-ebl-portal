const AddIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <g clip-path="url(#a)">
      <path
        d="M20.3 10.23c0-.68-.05-1.36-.16-2.03H10.7v3.85h5.4a4.63 4.63 0 0 1-2 3.04v2.5h3.23c1.9-1.75 2.98-4.32 2.98-7.36Z"
        fill="#3F83F8"
      />
      <path
        d="M10.7 20c2.7 0 4.97-.88 6.63-2.41l-3.22-2.5c-.9.6-2.06.95-3.4.95a5.99 5.99 0 0 1-5.62-4.12H1.77v2.57A10 10 0 0 0 10.7 20Z"
        fill="#34A853"
      />
      <path
        d="M5.09 11.92a5.99 5.99 0 0 1 0-3.83V5.5H1.77a10 10 0 0 0 0 8.98l3.32-2.57Z"
        fill="#FBBC04"
      />
      <path
        d="M10.7 3.96c1.43-.02 2.8.51 3.84 1.5l2.85-2.86A10 10 0 0 0 1.76 5.51L5.1 8.1c.79-2.37 3-4.13 5.61-4.13Z"
        fill="#EA4335"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" transform="translate(.5)" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default AddIcon;
