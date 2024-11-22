'use client';

import DragDrop from '@/components/DragDrop';
import { useCallback, useState } from 'react';
import Slider from '@/components/Slider';
import dynamic from 'next/dynamic';
const FileView = dynamic(() => import('@/components/FileView'), { ssr: false });
import { newUniqueFile } from '@/utils/unique';
import type { UniqueFile } from '@/types/UniqueFile';

import { type DragEvent, type DragEventHandler } from 'react';

export default function Home() {
  const [targetSize, setTargetSize] = useState(10);
  const [files, setFiles] = useState<UniqueFile[]>([]);

  const handleDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (e: DragEvent) => {
      if (e.dataTransfer?.files) {
        setFiles((fs) => [
          ...Array.from(e.dataTransfer.files, (file) =>
            newUniqueFile(file, targetSize),
          ),
          ...fs,
        ]);
      }
    },
    [targetSize],
  );

  return (
    <DragDrop onDrop={handleDrop}>
      <div className="row-start-2 flex h-full w-full grow flex-col items-center gap-8 p-16 sm:items-start">
        <main className="flex grow flex-col gap-4 font-[family-name:var(--font-geist-mono)]">
          <h1 className="text-4xl font-extrabold">Instant Video Compression</h1>

          <p>
            Drag and drop to get started. Compress your video to a specific
            size. Files are not uploaded to the server. Everything is done in
            your browser using WebAssembly.
          </p>

          <div className="flex flex-col gap-4 rounded-lg border border-base-100 p-4">
            <Slider value={targetSize} setValue={setTargetSize} />

            <div className="flex flex-row flex-wrap gap-4">
              <h3 className="text-base-300">Presets</h3>
              <button onClick={() => setTargetSize(10)}>GitHub</button>
            </div>
          </div>

          <div className="flex flex-row flex-wrap gap-4">
            {files.map((file) => (
              <FileView key={file.unique} uniqueFile={file} />
            ))}
          </div>
        </main>
      </div>
    </DragDrop>
  );
}

// import tw from 'tailwind-styled-components';
// const Button = tw.button`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`;
