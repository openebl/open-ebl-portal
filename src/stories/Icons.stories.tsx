import AccomplishDialogIcon from "@/app/_icons/accomplish-dialog-icon.svg";
import AccomplishIcon from "@/app/_icons/accomplish-icon.svg";
import CircleInCheckIcon from "@/app/_icons/check-in-circle-icon.svg";
import { type Meta, type StoryObj } from "@storybook/react";

const meta: Meta<typeof AccomplishIcon> = {
  title: "Components/AccomplishIcon",
  argTypes: {
    // You can add argTypes here if needed
  },
};

export default meta;

type Story = StoryObj<typeof AccomplishIcon>;

export const AccomplishIconPage: Story = {
  render: (_args) => <AccomplishIcon />,
};

export const CircleInCheckIconPage: Story = {
  render: (_args) => <CircleInCheckIcon />,
};

export const AccomplishDialogIconPage: Story = {
  render: (_args) => <AccomplishDialogIcon />,
};
