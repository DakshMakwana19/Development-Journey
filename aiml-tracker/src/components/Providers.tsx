'use client';

import { ReactNode } from 'react';
import { RewardProvider } from '@/components/RewardPopup';

/**
 * Providers — Client-side provider wrapper
 * Wraps the app with RewardProvider for gamification popups.
 */

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RewardProvider>
      {children}
    </RewardProvider>
  );
}
