'use client';
import { type PropsWithChildren, type DragEventHandler, useCallback, useState } from 'react';

interface Props extends PropsWithChildren {
  onFiles: (files: FileList) => void;
}

export default function DragDrop({ onFiles, children }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDrop : DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.dataTransfer?.files) {
        onFiles(e.dataTransfer.files);
      }
    },
    [],
  );

  return (
    <div
      onDragOver={(e) => {
        setDragging(true);
        e.preventDefault();
      }}
      onDragEnter={(e) => {
        setDragging(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setDragging(false);
        e.preventDefault();
      }}
      onDrop={(e) => {
        setDragging(false);
        e.preventDefault();
        handleDrop(e);
      }}
      className="relative flex h-full w-full flex-col"
    >
      {children}
      {dragging && (
        <div className="absolute z-10 h-full w-full p-16">
          <div className="h-full w-full overflow-hidden rounded-3xl backdrop-blur-xl">
            <div className="h-full w-full animate-pulse bg-blue-500 bg-opacity-50">
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-2xl font-semibold"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
