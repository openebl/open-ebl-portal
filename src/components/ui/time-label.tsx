"use client"

import React from 'react';
import { format, isValid } from 'date-fns';

interface TimeLabelProps {
  time: string;
  formatStr: string;
}

const TimeLabel: React.FC<TimeLabelProps> = ({ time, formatStr }) => {
  let localTime = '';

  try {
    const date = new Date(time);
    if (isValid(date)) {
      localTime = format(date, formatStr);
    }
  } catch (error) {
    console.error('Error formatting time:', error);
  }

  return (
    <span className="font-semibold">
      {localTime}
    </span>
  );
};

export { TimeLabel };
