'use client';

import type { RuntimeUniqueKey } from "@/types/RuntimeUniqueKey";
import type { UniqueFile } from "@/types/UniqueFile";

let key = 0;

export function newUniqueKey() {
  return key++ as RuntimeUniqueKey;
}

export function newUniqueFile(file: File, targetSize: number): UniqueFile {
  return {
    file,
    targetSize,
    unique: newUniqueKey()
  } satisfies UniqueFile;
}