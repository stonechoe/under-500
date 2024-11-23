'use client';

import DragDrop from '@/components/DragDrop';
import { useCallback, useState } from 'react';
import Slider from '@/components/Slider';
import dynamic from 'next/dynamic';
const FileView = dynamic(() => import('@/components/FileView'), { ssr: false });
import { newUniqueFile } from '@/utils/unique';
import type { UniqueFile } from '@/types/UniqueFile';
import AddVideoFilesButton from '@/components/AddVideoFilesButton';
import VideoIcon from '~/video.svg';

export default function Home() {
  const [targetSize, setTargetSize] = useState(10);
  const [files, setFiles] = useState<UniqueFile[]>([]);

  const handleFiles = useCallback((files: FileList) => { 
    setFiles((fs) => [
      ...Array.from(files, (file) =>
        newUniqueFile(file, targetSize),
      ),
      ...fs,
    ]);
  }, []);

  return (
    <DragDrop onFiles={handleFiles}>
      <div className="row-start-2 flex h-full w-full grow flex-col items-center gap-8 p-16 sm:items-start">
        <main className="flex grow flex-col gap-4 font-[family-name:var(--font-geist-mono)] text-base-600">
          <h1 className="text-4xl font-extrabold inline-flex flex-row items-center gap-2"><VideoIcon />Instant Video Compression</h1>

          <p>Compress your video to a specific size. Drag and drop or <AddVideoFilesButton onFiles={handleFiles} className='before:content-["📁"] before:hover:content-["📂"] p-2 border border-base-100 rounded-lg transition-colors hover:bg-base-100 underline text-base-900'> add files</AddVideoFilesButton> to get started.</p>

          <p className="text-base-500">
            Files are not uploaded to
            the server. Everything is done in your browser using WebAssembly.
          </p>

          <div className="flex flex-col gap-4 rounded-lg border border-base-100 p-4">
            <Slider value={targetSize} setValue={setTargetSize} />

            <div className="flex flex-row flex-wrap gap-4">
              <h3 className="text-base-500">Presets</h3>
              <button className='rounded-lg p-2 border border-base-100 hover:bg-base-100 transition-colors' onClick={() => setTargetSize(10)}>GitHub (10MB)</button>
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
