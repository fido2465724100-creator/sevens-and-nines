import { registerPlugin } from '@capacitor/core';

interface OrientationPluginInterface {
  lockLandscape(): Promise<{ locked: boolean; orientation: string }>;
  unlockOrientation(): Promise<{ locked: boolean; orientation: string }>;
}

const OrientationNative = registerPlugin<OrientationPluginInterface>('OrientationPlugin');

const STORAGE_KEY_LOCK_LANDSCAPE = 'nines_lock_landscape';

/**
 * Checks if the platform is Android via Capacitor
 */
function isAndroid(): boolean {
  return typeof (window as any).Capacitor !== 'undefined'
    && (window as any).Capacitor.getPlatform?.() === 'android';
}

/**
 * Returns whether landscape orientation lock is enabled in settings.
 * Defaults to true for optimal card game experience.
 */
export function isLandscapeLocked(): boolean {
  const saved = localStorage.getItem(STORAGE_KEY_LOCK_LANDSCAPE);
  return saved === null ? true : saved === 'true';
}

/**
 * Applies the orientation lock setting on device.
 */
export async function setLandscapeLocked(locked: boolean): Promise<void> {
  localStorage.setItem(STORAGE_KEY_LOCK_LANDSCAPE, locked ? 'true' : 'false');
  if (!isAndroid()) return;

  try {
    if (locked) {
      await OrientationNative.lockLandscape();
    } else {
      await OrientationNative.unlockOrientation();
    }
  } catch (err) {
    console.warn('Orientation plugin call failed:', err);
  }
}

/**
 * Initializes orientation lock on app launch.
 */
export async function initOrientationLock(): Promise<void> {
  const locked = isLandscapeLocked();
  await setLandscapeLocked(locked);
}
