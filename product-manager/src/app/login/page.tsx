'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, ArrowRight, Eye, EyeOff, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [role, setRole] = useState<'admin' | 'worker'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    if (role === 'admin') {
      setUser({ id: 'U-001', name: 'Tushar Makwana', role: 'admin', avatar: 'T', email: email || 'tushar@anticbuddy.com' });
      router.push('/admin');
    } else {
      setUser({ id: 'U-002', name: 'Worker', role: 'worker', avatar: 'W', email: email || 'worker@anticbuddy.com' });
      router.push('/worker');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

      {/* Left Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'white' }}>A</div>
            <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>AnticBuddy</span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.1 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 36 }}>
            Sign in to access the product management system.
          </p>

          {/* Role Selector */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            {[
              { key: 'admin' as const, icon: Shield, label: 'Admin Panel', sub: 'Full access · Tushar' },
              { key: 'worker' as const, icon: Users, label: 'Worker Panel', sub: 'View & scan only' },
            ].map((r) => (
              <motion.button key={r.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setRole(r.key)}
                style={{
                  flex: 1, padding: 20, borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  background: role === r.key ? 'var(--accent-subtle)' : 'var(--bg-glass)',
                  border: `1px solid ${role === r.key ? 'rgba(99,102,241,0.3)' : 'var(--surface-border)'}`,
                  textAlign: 'left', color: 'var(--text-primary)', transition: 'all 0.2s',
                }}>
                <r.icon size={22} color={role === r.key ? '#818cf8' : 'var(--text-muted)'} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{r.sub}</div>
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleLogin}>
            <div className="float-label" style={{ marginBottom: 16 }}>
              <label>Email</label>
              <input className="input-field" type="email" placeholder={role === 'admin' ? 'tushar@anticbuddy.com' : 'worker@anticbuddy.com'}
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="float-label" style={{ marginBottom: 24 }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" className="btn-primary" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              disabled={loading}
              style={{ width: '100%', padding: '14px 24px', fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Authenticating...
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Sign In as {role === 'admin' ? 'Admin' : 'Worker'} <ArrowRight size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
            Demo mode — enter any credentials to proceed
          </p>
        </motion.div>
      </div>

      {/* Right Panel — Visual */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '100vh' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 40 }}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 200, height: 200, borderRadius: 'var(--radius-xl)', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 20px 60px rgba(99,102,241,0.3)' }}>
            <Zap size={80} color="white" strokeWidth={1.5} />
          </motion.div>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Product Intelligence</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 300, margin: '0 auto', lineHeight: 1.6 }}>
            AI-powered recognition, real-time analytics, and enterprise-grade product management — all in one platform.
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div:first-child > div:last-child { display: none !important; }
          div:first-child > div:first-child { padding: 40px 24px !important; }
        }
      `}</style>
    </div>
  );
}
