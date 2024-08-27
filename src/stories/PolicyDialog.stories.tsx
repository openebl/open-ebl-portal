import { PolicyDialog } from "@/app/_components/dialogs/policy-dialog";
import { type Meta, type StoryObj } from "@storybook/react";

const meta: Meta<typeof PolicyDialog> = {
  title: "Components/PolicyDialog",
  component: PolicyDialog,
  argTypes: {
    // You can add argTypes here if needed
  },
};

export default meta;

type Story = StoryObj<typeof PolicyDialog>;

const getManifests = async () => {
  const contents = await Promise.all([
    (await fetch("https://dev.bluex.trade/ebl-agreement/raw/")).text(),
    (await fetch("https://dev.bluex.trade/cookie-policy/raw/")).text(),
  ]);
  return [
    {
      title: "Terms of Service",
      content: contents[0],
    },
    {
      title: "Privacy Policy",
      content: contents[1],
    },
  ];
};

export const Default: Story = {
  args: {
    manifests: [],
  },

  loaders: [
    async () => ({
      manifests: await getManifests(),
    }),
  ],

  render: (args, { loaded }) => <PolicyDialog {...args} {...loaded} />,
};
