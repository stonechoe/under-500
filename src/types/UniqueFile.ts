'use client';

import type { RuntimeUniqueKey } from './RuntimeUniqueKey';

export interface UniqueFile {
  file: File;
  targetSize: number;
  unique: RuntimeUniqueKey;
}
