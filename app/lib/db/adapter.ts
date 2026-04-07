// /lib/db/adapter.ts

import { Capacitor } from "@capacitor/core/types/global";

export const isNative = () => {
  return Capacitor.getPlatform() !== 'web';
};