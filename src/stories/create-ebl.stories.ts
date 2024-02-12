import MainSection from '@/app/_components/edit-ebl/main-section';
import { defaultEBl } from '@/types/ebl';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'View/CreateEbl',
  component: MainSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof MainSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    ebl: defaultEBl
  },
};
