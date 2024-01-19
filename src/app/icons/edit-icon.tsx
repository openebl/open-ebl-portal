const EditIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <path
      d="m16.86 4.49 1.69-1.7a1.88 1.88 0 0 1 2.65 2.66L10.58 16.07a4.5 4.5 0 0 1-1.9 1.13L6 18l.8-2.69a4.5 4.5 0 0 1 1.13-1.9l8.93-8.92Zm0 0 2.64 2.63M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default EditIcon;
