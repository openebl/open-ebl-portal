const EmptyFolderIcon = ({ className }: { className?: string }) => (
  <svg width="106" height="80" fill="none" xmlns="http://www.w3.org/2000/svg" {...{ className }}>
    <path
      d="M40.96 4.97c-1.08 0-2.1-.49-2.79-1.32A10 10 0 0 0 30.44 0h-18.7a6.65 6.65 0 0 0-6.66 6.65v19.92h94.84V9.25a4.28 4.28 0 0 0-4.28-4.28H40.96Z"
      fill="#EBEBEB"
    />
    <path
      d="M12.04 7.78h80.92a2.99 2.99 0 0 1 2.98 2.99v15.76H9.06V10.77a2.99 2.99 0 0 1 2.98-2.99Z"
      fill="#D5D5D5"
    />
    <path
      d="M12.23 8.73h80.54c1.16 0 2.1.95 2.1 2.11v16.18H10.13V10.84c0-1.16.94-2.1 2.1-2.1Z"
      fill="#fff"
    />
    <path
      d="M26.27 26.16H3.66c-2.27 0-3.9 1.75-3.63 3.91l5.43 45.06c.26 2.17 2.09 3.92 4.07 3.92h84.35c1.99 0 3.81-1.75 4.08-3.92l5.9-48.97 1.11-9.26c.27-2.16-1.41-3.92-3.75-3.92 0 0-52.04-.26-56.5 0-3.56.21-5.36 3.3-9.31 6.6-3.97 3.28-5.9 6.54-9.14 6.58Z"
      fill="url(#a)"
    />
    <path
      d="M94.39 75.73H9c-1.62 0-3.14-1.16-3.8-2.76l.26 2.16c.26 2.17 2.09 3.92 4.07 3.92h84.35c1.99 0 3.81-1.75 4.07-3.92.1-.74.18-1.49.27-2.23-.64 1.64-2.18 2.83-3.83 2.83Z"
      fill="#F2F2F2"
      style={{ mixBlendMode: "multiply" }}
    />
    <defs>
      <linearGradient
        id="a"
        x1="52.5"
        y1="12.87"
        x2="52.5"
        y2="79.05"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F0F0F0" />
        <stop offset="1" stopColor="#FBFBFB" />
      </linearGradient>
    </defs>
  </svg>
);

export default EmptyFolderIcon;
