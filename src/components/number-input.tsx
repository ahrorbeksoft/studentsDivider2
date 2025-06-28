"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/extendui/button";
import { Input } from "@/components/extendui/input";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

export const NumberInput = ({ min = 0, max = 100, step = 1, value, setValue }: Props) => {
  // const [value, setValue] = React.useState(min);

  const decrease = () => {
    setValue((prevValue) => Math.max(min, prevValue - step));
  };

  const increase = () => {
    setValue((prevValue) => Math.min(max, prevValue + step));
  };

  return (
    <div className="flex items-center">
      <Button onClick={decrease} size="icon" variant="outline" className="w-10 rounded-r-none border-r-0 shadow-none">
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        className="h-9 w-12 rounded-none border-x-0 p-0 text-center focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0 pointer-events-none
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
        value={value}
        readOnly
        min={min}
        max={max}
        step={step}
      />
      <Button onClick={increase} size="icon" variant="outline" className="w-10 rounded-l-none border-l-0 shadow-none">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
