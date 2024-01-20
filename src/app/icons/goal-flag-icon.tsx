const GoalFlagIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...{ className }}
  >
    <path
      d="M3 3v1.5m0 0 2.77-.7a9 9 0 0 1 6.2.69l.12.05a9 9 0 0 0 6.08.71l3.11-.73a48.52 48.52 0 0 0 0 10.5l-3.1.73a9 9 0 0 1-6.1-.7l-.1-.06a9 9 0 0 0-6.21-.68L3 15M3 4.5V15m0 6v-6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default GoalFlagIcon;
