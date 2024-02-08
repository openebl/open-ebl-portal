import type React from "react";

type TFormItemProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

type TFormItemType = React.ComponentType<TFormItemProps>;
type TFormItemBuilder = () => TFormItemType;

export type { TFormItemProps, TFormItemType, TFormItemBuilder };
