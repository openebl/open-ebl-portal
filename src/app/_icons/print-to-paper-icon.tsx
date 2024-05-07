const PrintToPaperIcon = ({ className }: { className?: string }) => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...{ className }}>
    <g filter="url(#filter0_d_2118_6344)">
      <path d="M18 76H63C65.2091 76 67 74.2091 67 72V15.2857L56.4545 4H18C15.7909 4 14 5.79086 14 8V72C14 74.2091 15.7909 76 18 76Z" fill="url(#paint0_linear_2118_6344)" />
    </g>
    <rect opacity="0.6" x="26" y="22" width="29" height="2" rx="1" fill="white" />
    <rect opacity="0.6" x="26" y="30" width="29" height="2" rx="1" fill="white" />
    <rect opacity="0.6" x="26" y="38" width="29" height="2" rx="1" fill="white" />
    <rect opacity="0.6" x="26" y="46" width="29" height="2" rx="1" fill="white" />
    <rect opacity="0.6" x="26" y="54" width="29" height="2" rx="1" fill="white" />
    <rect opacity="0.6" x="26" y="62" width="29" height="2" rx="1" fill="white" />
    <path fillRule="evenodd" clipRule="evenodd" d="M67 17H60C57.7909 17 56 15.2091 56 13V5H56.4545L67 16.2857V17Z" fill="#2F7DA9" />
    <path fillRule="evenodd" clipRule="evenodd" d="M67 16H60C57.7909 16 56 14.2091 56 12V4H56.4545L67 15.2857V16Z" fill="#F1FAFF" />
    <defs>
      <filter id="filter0_d_2118_6344" x="14" y="4" width="54" height="74" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dx="1" dy="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.601985 0 0 0 0 0.760539 0 0 0 0 0.845915 0 0 0 1 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2118_6344" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2118_6344" result="shape" />
      </filter>
      <linearGradient id="paint0_linear_2118_6344" x1="40.5" y1="4" x2="40.5" y2="76" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E3F4FE" />
        <stop offset="1" stopColor="#C6E1EF" />
      </linearGradient>
    </defs>
  </svg>
);

export default PrintToPaperIcon;
