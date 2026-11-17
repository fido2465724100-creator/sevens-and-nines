import { registerPlugin } from '@capacitor/core';

/**
 * Trial & Billing system for Sevens & Nines
 * 
 * Flow:
 * 1. On first launch, stores the install date in localStorage
 * 2. For 30 days the app is fully free (trial period)
 * 3. After 30 days, shows a paywall prompting the user to subscribe
 * 4. If user subscribes via Google Play, the app is unlocked permanently
 *    (as long as subscription is active)
 * 5. On web/desktop platforms, trial check is skipped (free forever)
 */

// ─── Native Plugin Interface ────────────────────────────────────────────

interface BillingPluginInterface {
  purchaseSubscription(): Promise<{ success: boolean }>;
  checkSubscription(): Promise<{ isSubscribed: boolean; error?: string }>;
  getSubscriptionInfo(): Promise<{
    available: boolean;
    name?: string;
    description?: string;
    price?: string;
    billingPeriod?: string;
    trialPeriod?: string;
  }>;
  addListener(
    eventName: 'purchaseCompleted',
    listenerFunc: (data: { purchased: boolean }) => void
  ): Promise<{ remove: () => void }>;
}

// Register the native plugin (will be undefined on web/desktop)
const BillingPluginNative = registerPlugin<BillingPluginInterface>('BillingPlugin');

// ─── Constants ──────────────────────────────────────────────────────────

const TRIAL_DAYS = 30;
const STORAGE_KEY_INSTALL_DATE = 'nines_install_date';
const STORAGE_KEY_SUBSCRIBED = 'nines_subscribed';

// ─── Platform Detection ────────────────────────────────────────────────

function isAndroid(): boolean {
  return typeof (window as any).Capacitor !== 'undefined'
    && (window as any).Capacitor.getPlatform?.() === 'android';
}

// ─── Trial Period Logic ─────────────────────────────────────────────────

/**
 * Records the install date if not already saved.
 * Should be called on every app launch.
 */
export function recordInstallDate(): void {
  const existing = localStorage.getItem(STORAGE_KEY_INSTALL_DATE);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY_INSTALL_DATE, new Date().toISOString());
  }
}

/**
 * Returns how many days have passed since the app was first launched.
 */
export function getDaysSinceInstall(): number {
  const installDateStr = localStorage.getItem(STORAGE_KEY_INSTALL_DATE);
  if (!installDateStr) return 0;

  const installDate = new Date(installDateStr);
  const now = new Date();
  const diffMs = now.getTime() - installDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns the number of trial days remaining.
 */
export function getTrialDaysRemaining(): number {
  return Math.max(0, TRIAL_DAYS - getDaysSinceInstall());
}

/**
 * Returns true if the trial period has expired.
 * On non-Android platforms, always returns false (no trial).
 */
export function isTrialExpired(): boolean {
  if (!isAndroid()) return false;
  return getDaysSinceInstall() >= TRIAL_DAYS;
}

// ─── Subscription Logic ────────────────────────────────────────────────

/**
 * Check if the user has an active subscription.
 * First checks local cache, then queries Google Play if on Android.
 */
export async function checkIsSubscribed(): Promise<boolean> {
  // Quick local check
  if (localStorage.getItem(STORAGE_KEY_SUBSCRIBED) === 'true') {
    return true;
  }

  // On non-Android, no billing — always unlocked
  if (!isAndroid()) return true;

  try {
    const result = await BillingPluginNative.checkSubscription();
    if (result.isSubscribed) {
      localStorage.setItem(STORAGE_KEY_SUBSCRIBED, 'true');
      return true;
    }
  } catch (e) {
    console.warn('Billing check failed:', e);
  }

  return false;
}

/**
 * Launch the Google Play subscription purchase flow.
 * Returns true if purchase was successful.
 */
export async function purchaseSubscription(): Promise<boolean> {
  if (!isAndroid()) {
    console.warn('Purchasing is only available on Android');
    return false;
  }

  try {
    const result = await BillingPluginNative.purchaseSubscription();
    if (result.success) {
      localStorage.setItem(STORAGE_KEY_SUBSCRIBED, 'true');
      return true;
    }
  } catch (e) {
    console.warn('Purchase failed or cancelled:', e);
  }

  return false;
}

/**
 * Get info about the subscription product (name, price, trial period).
 */
export async function getSubscriptionInfo() {
  if (!isAndroid()) {
    return { available: false };
  }

  try {
    return await BillingPluginNative.getSubscriptionInfo();
  } catch (e) {
    console.warn('Failed to get subscription info:', e);
    return { available: false };
  }
}

/**
 * Listen for purchase completion events from the native layer.
 */
export function onPurchaseCompleted(callback: () => void): () => void {
  if (!isAndroid()) return () => {};

  let removeFunc: (() => void) | null = null;

  BillingPluginNative.addListener('purchaseCompleted', (data) => {
    if (data.purchased) {
      localStorage.setItem(STORAGE_KEY_SUBSCRIBED, 'true');
      callback();
    }
  }).then((handle) => {
    removeFunc = handle.remove;
  });

  return () => {
    if (removeFunc) removeFunc();
  };
}

/**
 * Master check: should the paywall be shown?
 * Returns true if:
 * - Platform is Android
 * - Trial has expired
 * - User is NOT subscribed
 */
export async function shouldShowPaywall(): Promise<boolean> {
  if (!isAndroid()) return false;
  if (!isTrialExpired()) return false;
  const subscribed = await checkIsSubscribed();
  return !subscribed;
}
