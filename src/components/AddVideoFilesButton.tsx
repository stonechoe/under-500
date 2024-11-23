'use client';

import { type HTMLProps, useCallback, useRef } from 'react';

interface Props extends HTMLProps<HTMLButtonElement> {
  onFiles: (files: FileList) => void;
  type?: 'button' | 'submit' | 'reset';
  onClick?: never;
}

export default function AddVideoFilesButton({ onFiles, children, ...rest }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const openDialog = useCallback(() => {
    ref.current?.click();
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        onFiles(files);
      }
    },
    [],
  );

  return (
    <>
      <input
        ref={ref}
        className="hidden"
        onChange={handleChange}
        type="file"
        accept="video/*"
        multiple
      />
      <button
        {...rest}
        onClick={openDialog}
      >
        {children}
      </button>
    </>
  );
}
