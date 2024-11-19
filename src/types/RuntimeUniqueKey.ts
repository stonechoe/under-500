'use client';

const UNIQUE_KEY: unique symbol = Symbol();
type UNIQUE_KEY = typeof UNIQUE_KEY;

export type RuntimeUniqueKey = number & {
  [UNIQUE_KEY]: UNIQUE_KEY;
};
