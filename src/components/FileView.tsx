'use client';

import { memo, useEffect, useRef, useState } from 'react';
import type { UniqueFile } from '@/types/UniqueFile';
import { useQuery } from '@tanstack/react-query';
import tw from 'tailwind-styled-components';
import imageCompression from 'browser-image-compression';
import FileIcon from '~/file.svg';

interface Props {
  uniqueFile: UniqueFile;
}

////////////////////////////////////////////////////////////////////////

function roundAt2(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

async function compressFile(file: UniqueFile, onLog: (_: string) => void) {

  const data = await imageCompression(file.file, {
    initialQuality: 0.1,
    // useWebWorker: true,
    // use decimal scale to be safe (e.g. non windows)
    maxSizeMB: file.targetSize * (1000 / 1024 ) * (1000 * 1024),
    maxIteration: Number.POSITIVE_INFINITY,
    onProgress: (progress) => {
      onLog(`진행률: ${progress}%`);
    }
  })

  if (data.size >= file.targetSize * (1000 * 1000)) {
    onLog(`파일 크기를 더 이상 줄일 수 없습니다. ${roundAt2(data.size / 1000 / 1000)}KB 에서 종료합니다.`);
    return data;
  } else {

    onLog(`파일 크기를 ${roundAt2(data.size / 1000 / 1000)}KB 로 줄였습니다.`);
  }

  
  return data;
}

const ViewLayout = tw.a`flex flex-col border border-base-200 p-4 gap-2 w-96 rounded-xl bg-base-000 hover:bg-base-100 transition-all cursor-pointer overflow-hidden`;
const Terminal = tw.pre`text-sm text-base-600 rounded-lg p-4 bg-base-100 break-all whitespace-break-spaces before:content-[">"] before:inline before:text-base-900 before:pr-4 before:mr-4 line-clamp-3`;
const FileName = tw.div`text-lg text-base-900 line-clamp-1 flex flex-row gap-2 items-center`;
const Chip = tw.div`bg-base-100 text-base-900 rounded-full px-2 py-1 text-xs w-fit`;

function RawFileView({ uniqueFile }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [log, setLog] = useState<string>('');

  const { isPending, error, isSuccess, data } = useQuery({
    queryKey: ['compress', uniqueFile.unique],
    queryFn: async () => await compressFile(uniqueFile, setLog),
  });

  useEffect(() => {
    if (isSuccess) {
      // downaload the file : FileData
      const blob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);

      const a = ref.current ? ref.current : document.createElement('a');

      a.href = url;
      a.download = uniqueFile.file.name;
      a.click();
    }
  }, [isSuccess, data]);

  if (error)
    return (
      <ViewLayout ref={ref} className="cursor-not-allowed">
        <FileName><FileIcon />{uniqueFile.file.name}</FileName>
        <div className="flex flex-row p-2">
          <Chip>to {uniqueFile.targetSize}MB</Chip>
          <Chip className="bg-red-500">Error</Chip>
        </div>
        <Terminal>{log}</Terminal>
      </ViewLayout>
    );

  if (isPending)
    return (
      <ViewLayout ref={ref} className="cursor-progress">
        <FileName><FileIcon />{uniqueFile.file.name}</FileName>
        <div className="flex flex-row p-2">
          <Chip>
            {'->'} {uniqueFile.targetSize}MB
          </Chip>
          <Chip className="bg-blue-500">Compressing</Chip>
        </div>
        <Terminal>{log}</Terminal>
      </ViewLayout>
    );

  if (!data)
    return (
      <ViewLayout ref={ref} className="cursor-not-allowed">
        <FileName><FileIcon />{uniqueFile.file.name}</FileName>
        <div className="flex flex-row p-2">
          <Chip>
            {'->'} {uniqueFile.targetSize}MB
          </Chip>
          <Chip className="bg-red-500">Data Not Found</Chip>
        </div>
        <Terminal>{log}</Terminal>
      </ViewLayout>
    );

  return (
    <ViewLayout ref={ref}>
      <FileName><FileIcon />{uniqueFile.file.name}</FileName>
      <div className="flex flex-row p-2">
        <Chip>
          {'->'} {uniqueFile.targetSize}MB
        </Chip>
        <Chip className="bg-green-600">Compressed</Chip>
      </div>
      <Terminal>{log}</Terminal>
    </ViewLayout>
  );
}

const FileView = memo(
  RawFileView,
  (p, n) => p.uniqueFile.unique === n.uniqueFile.unique,
);

export default FileView;
