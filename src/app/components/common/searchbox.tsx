import { Input } from "@/components/ui/input";

const SearchBox = () => {
  return (
    <div className="relative w-[23.5rem]">
      <svg
        className="absolute top-0 bottom-0 w-6 h-6 my-auto left-3"
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11 18a7 7 0 1 1 5.44-2.6l3.15 3.16a.73.73 0 1 1-1.03 1.03l-3.15-3.15A6.97 6.97 0 0 1 11 18Zm5.5-7a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
          fill="#C9CFDA"
        />
      </svg>
      <Input
        type="text"
        placeholder="Search..."
        className="border-border-light w-full pl-12"
      />
    </div>
  );
};

export default SearchBox;
