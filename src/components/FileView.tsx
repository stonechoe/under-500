'use client';

import { memo, useEffect, useRef, useState } from 'react';
import type { UniqueFile } from '@/types/UniqueFile';
import { useQuery } from '@tanstack/react-query';
import tw from 'tailwind-styled-components';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import mediaInfoFactory, { type MediaInfoResult } from 'mediainfo.js';

interface Props {
  uniqueFile: UniqueFile;
}

////////////////////////////////////////////////////////////////////////

async function analyzeFile(file: UniqueFile): Promise<MediaInfoResult> {
  const info = await mediaInfoFactory({
    format: 'object',
    locateFile: (path, prefix) => {
      if (path.endsWith('.wasm')) {
        return `/MediaInfoModule.wasm`; // 파일 이름 수정
      }
      return prefix + path;
    },
  });
  const buffff = new Uint8Array(await file.file.arrayBuffer());
  const finfo = await info.analyzeData(
    buffff.length,
    (size: number, offset: number) => buffff.slice(offset, offset + size),
  );
  info.close();

  return finfo;
}

async function getVideoBitRate(finfo: MediaInfoResult): Promise<number> {
  return (
    finfo.media?.track.reduce((prev, track) => {
      if (track['@type'] === 'Video') {
        return prev + (track.BitRate || 0);
      }
      return prev;
    }, 0) || 0
  );
}

async function getAudioBitRate(finfo: MediaInfoResult): Promise<number> {
  return (
    finfo.media?.track.reduce((prev, track) => {
      if (track['@type'] === 'Audio') {
        return prev + (track.BitRate || 0);
      }
      return prev;
    }, 0) || 0
  );
}

async function getLength(finfo: MediaInfoResult): Promise<number> {
  return (
    finfo.media?.track.reduce((prev, track) => {
      if (track['@type'] === 'General') {
        return prev + (track.Duration || 0);
      }
      return prev;
    }, 0) || 0
  );
}

////////////////////////////////////////////////////////////////////////

async function compressFile(file: UniqueFile, onLog: (_: string) => void) {
  const finfo = await analyzeFile(file);

  console.log('video bitrate', await getVideoBitRate(finfo));
  console.log('audio bitrate', await getAudioBitRate(finfo));
  console.log('length', await getLength(finfo));

  const ffmpeg = new FFmpeg();

  ffmpeg.on('log', (log) => onLog(log.message));

  await ffmpeg.load().catch((e) => {
    console.error(e);
    return Promise.reject(e);
  });

  // fail if not video

  // fail if no walker

  const target_size_mb = file.targetSize; // 목표 크기 (25MB)
  const target_size = target_size_mb * 1000 * 1000 * 8; // 목표 크기 (25MB -> 25 * 1000 * 1000 * 8 bit)
  // const length = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`
  const length_round_up = Math.ceil(await getLength(finfo));
  const total_bitrate = Math.ceil(target_size / length_round_up);
  const audio_bitrate = await getAudioBitRate(finfo); // (( 128 * 1000 )) //# 128kbps 오디오
  const target_video_bitrate = total_bitrate - audio_bitrate;
  const command = `ffmpeg -i "${file}" -b:v ${target_video_bitrate} -maxrate:v ${target_video_bitrate} -bufsize:v ${target_size / 20} -b:a ${audio_bitrate} "${file}-${target_size_mb}mb.mp4"`;
  console.log(command);

  const buf = new Uint8Array(await file.file.arrayBuffer());
  await ffmpeg.writeFile('input', buf).catch((e) => {
    console.error(e);
    return Promise.reject(e);
  });
  await ffmpeg
    .exec([
      '-i',
      'input',
      '-b:v',
      String(target_video_bitrate),
      '-maxrate:v',
      String(target_video_bitrate),
      '-bufsize:v',
      String(target_size / 20),
      '-b:a',
      String(audio_bitrate),
      'output.mp4',
    ])
    .catch((e) => {
      console.error(e);
      return Promise.reject(e);
    });
  const data = await ffmpeg.readFile('output.mp4').catch((e) => {
    console.error(e);
    return Promise.reject(e);
  });

  return data;
}

const ViewLayout = tw.a`flex flex-col border border-base-200 p-4 gap-2 w-fit h-fit rounded-xl bg-base-000 hover:bg-base-100 transition-all cursor-pointer overflow-hidden`;
const Terminal = tw.pre`text-sm text-base-300 rounded-lg p-4 bg-base-100 break-all whitespace-break-spaces before:content-[">"] before:inline before:text-base-900 before:pr-4 before:mr-4`;
const FileName = tw.div`text-lg text-base-900 line-clamp-1`;
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

      a .href = url;
      a .download = uniqueFile.file.name;
      a .click();
    }
  }, [isSuccess, data]);

  if (error)
    return (
      <ViewLayout ref={ref} className='cursor-not-allowed'>
        <FileName>{uniqueFile.file.name}</FileName>
        <div className="flex flex-row p-2">
          <Chip>to {uniqueFile.targetSize}MB</Chip>
          <Chip className="bg-red-500">Error</Chip>
        </div>
        <Terminal>{log}</Terminal>
      </ViewLayout>
    );

  if (isPending)
    return (
      <ViewLayout ref={ref} className='cursor-progress'>
        <FileName>{uniqueFile.file.name}</FileName>
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
      <ViewLayout ref={ref} className='cursor-not-allowed'>
        <FileName>{uniqueFile.file.name}</FileName>
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
      <FileName>{uniqueFile.file.name}</FileName>
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
