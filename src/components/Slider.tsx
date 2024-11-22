'use cient';

import type { Dispatch, SetStateAction } from 'react';

interface Props {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}

export default function Slider({ value, setValue }: Props) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="default-range"
        className="mb-2 block font-medium text-gray-900 dark:text-white"
      >
        Target Size: {value}MB
      </label>
      <input
        id="default-range"
        type="range"
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
        min="1"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}
