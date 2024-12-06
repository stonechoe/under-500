'use client';

import DragDrop from '@/components/DragDrop';
import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
const FileView = dynamic(() => import('@/components/FileView'), { ssr: false });
import { newUniqueFile } from '@/utils/unique';
import type { UniqueFile } from '@/types/UniqueFile';
import AddImageFilesButton from '@/components/AddImageFilesButton';

export default function Home() {
  // const [targetSize, setTargetSize] = useState(10);
  const targetSize = 0.5;
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
          <h1 className="text-4xl font-extrabold inline-flex flex-row items-center gap-2">Under 500KB</h1>

          <p>이미지를 500KB 밑으로 압축하세요. 드래그 앤 드랍 하거나 <AddImageFilesButton onFiles={handleFiles} className='before:content-["📁"] before:hover:content-["📂"] p-2 border border-base-100 rounded-lg transition-colors hover:bg-base-100 underline text-base-900'> 파일 추가</AddImageFilesButton>.</p>

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
