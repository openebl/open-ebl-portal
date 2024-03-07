"use client";

import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type ComboBoxItemType = {
  value: string;
  label: string;
};

type ComboboxProps = {
  value?: string;
  onSelect: (value: string | undefined) => void;
  items: ComboBoxItemType[];
  searchPlaceholder?: string;
  noResultsMsg?: string;
  placeholder?: string;
  className?: string;
  unselect?: boolean;
  unselectMsg?: string;
  loading?: boolean;
  onSearchChange?: (keyword: string) => void;
  onValueChange?: (value: string) => void;
};

const popOverStyles = {
  width: "var(--radix-popover-trigger-width)",
};

export function Combobox({
  value,
  onSelect,
  items,
  searchPlaceholder = "Search...",
  noResultsMsg = "No results found",
  placeholder = "Select",
  className,
  loading = false,
  unselect = false,
  unselectMsg = "Nenhum",
  onSearchChange,
  onValueChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (onValueChange && value) onValueChange(value);
  }, [onValueChange, value]);

  const handleOnSearchChange = useDebouncedCallback((e: string) => {
    if (e === "") {
      return;
    }

    if (onSearchChange) {
      onSearchChange(e);
    }
  }, 300);

  const handleOnOpenChange = (v: boolean) => {
    if (onSearchChange) {
      onSearchChange("");
    }
    setOpen(v);
  };

  return (
    <Popover open={open} onOpenChange={handleOnOpenChange} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex items-center justify-between rounded-lg border border-border-dark bg-background py-2 pl-3 pr-0 text-[0.8125rem] font-normal leading-[1.125rem] text-main shadow-inner ring-offset-white hover:text-main focus:outline-none focus:ring-2 focus:ring-secondary1 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span>
            {value
              ? items.find((item) => item.value === value)?.label
              : placeholder}
          </span>
          <div className="flex h-10 w-10 items-center justify-center border-l border-border-dark">
            <ChevronDown className="h-6 w-6 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={popOverStyles}
        className="popover-content-width-same-as-its-trigger p-0 font-content"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleOnSearchChange}
          />
          {loading ? (
            <CommandItem
              key="loading"
              className="flex items-center justify-center"
            >
              Loading...
            </CommandItem>
          ) : (
            buildScrollableContent(
              noResultsMsg,
              unselect,
              onSelect,
              setOpen,
              value,
              unselectMsg,
              items,
            )
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// TODO: virtualized list to improve rendering, maybe use react-window (TBD)
function buildScrollableContent(
  noResultsMsg: string,
  unselect: boolean,
  onSelect: (value: string | undefined) => void,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  value: string | undefined,
  unselectMsg: string,
  items: ComboBoxItemType[],
) {
  return (
    <ScrollArea className="max-h-[220px] overflow-auto">
      <CommandEmpty>{noResultsMsg}</CommandEmpty>
      <CommandGroup>
        {unselect && (
          <CommandItem
            key="unselect"
            value=""
            onSelect={() => {
              onSelect("");
              setOpen(false);
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                value === "" ? "opacity-100" : "opacity-0",
              )}
            />
            {unselectMsg}
          </CommandItem>
        )}
        {items.map((item) => (
          <CommandItem
            key={item.value}
            value={item.label}
            onSelect={(currentValue) => {
              onSelect(
                currentValue === item.label.toLowerCase() ? item.value : "",
              );
              setOpen(false);
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                value === item.value ? "opacity-100" : "opacity-0",
              )}
            />
            {item.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </ScrollArea>
  );
}
