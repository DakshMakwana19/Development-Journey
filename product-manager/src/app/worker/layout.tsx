'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Home, Camera, Grid3X3, LogOut, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/worker', label: 'Home', icon: Home },
  { href: '/worker/scan', label: 'Scan', icon: Camera },
  { href: '/worker/catalog', label: 'Products', icon: Grid3X3 },
];

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, theme } = useAppStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }} data-theme={theme}>
      {/* Header */}
      <header style={{ height: 60, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'white' }}>A</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>AnticBuddy</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Worker</span>
        </div>
        <button onClick={() => { setUser(null); router.push('/login'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--bg-glass)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
          <LogOut size={14} /> Logout
        </button>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: '24px 20px 100px', maxWidth: 600, margin: '0 auto', width: '100%' }}>
        <div className="page-enter">{children}</div>
      </main>

      {/* Bottom Nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 72, background: 'var(--bg-secondary)', borderTop: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 20px', zIndex: 40 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 0',
                borderRadius: 'var(--radius-md)', textDecoration: 'none',
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                color: isActive ? 'var(--accent-hover)' : 'var(--text-muted)',
                transition: 'all 0.2s', cursor: 'pointer', maxWidth: 120,
              }}>
              <item.icon size={22} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
