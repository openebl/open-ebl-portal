const DocIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none" {...{ className }}>
    <path
      d="M.5 2C.5 1.17 1.17.5 2 .5h7.86l3.64 3.72V16c0 .83-.67 1.5-1.5 1.5H2A1.5 1.5 0 0 1 .5 16V2Z"
      fill="#fff"
      stroke="#18335E"
    />
    <mask id="a" fill="#fff">
      <path fillRule="evenodd" clipRule="evenodd" d="M14 5v-.98L10.07 0H9v3c0 1.1.9 2 2 2h3Z" />
    </mask>
    <path
      d="M14 4.02h1V3.6l-.29-.3-.71.7ZM14 5v1h1V5h-1Zm-3.93-5 .72-.7-.3-.3h-.42v1ZM9 0v-1H8v1h1Zm4 4.02V5h2v-.98h-2ZM9.36.7l3.93 4.01 1.42-1.4-3.92-4L9.36.7ZM9 1h1.07v-2H9v2Zm1 2V0H8v3h2Zm1 1a1 1 0 0 1-1-1H8a3 3 0 0 0 3 3V4Zm3 0h-3v2h3V4Z"
      fill="#18335E"
      mask="url(#a)"
    />
    <path d="M4 7.5h4M4 10.5h6M4 13.5h6" stroke="#18335E" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default DocIcon;
