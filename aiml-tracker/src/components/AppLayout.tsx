'use client';

import { ReactNode, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'react-hot-toast';

/**
 * AppLayout — Dashboard shell with responsive sidebar + main content area.
 * Main content margin adjusts dynamically when sidebar collapses/expands.
 * On mobile, content is full-width with top padding for the mobile header.
 */

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(260);

  const handleWidthChange = useCallback((w: number) => {
    setSidebarWidth(w);
  }, []);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient background glow */}
      <div className="ambient-glow" />

      {/* Sidebar navigation */}
      <Sidebar onWidthChange={handleWidthChange} />

      {/* Main content area — dynamically offset by sidebar width */}
      <main
        className="flex-1 relative z-10 transition-all duration-300"
        style={{
          minHeight: '100vh',
        }}
      >
        {/* Mobile top spacer */}
        <div className="lg:hidden h-16" />

        <div
          className="max-w-[1200px] mx-auto"
          style={{
            padding: '40px 48px',
          }}
        >
          {children}
        </div>
      </main>

      {/* Desktop margin pusher — uses CSS for the sidebar offset */}
      <style>{`
        @media (min-width: 1024px) {
          main {
            margin-left: ${sidebarWidth}px !important;
          }
        }
        @media (max-width: 1023px) {
          main > div:last-of-type {
            padding: 24px 20px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          main > div:last-of-type {
            padding: 32px 32px !important;
          }
        }
      `}
      </style>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
          },
        }}
      />
    </div>
  );
}
