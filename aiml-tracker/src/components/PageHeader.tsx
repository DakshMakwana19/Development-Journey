'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * PageHeader — Consistent page title/subtitle header
 * Used at the top of every page for visual consistency.
 */

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between"
      style={{ marginBottom: '36px' }}
    >
      <div className="flex items-center" style={{ gap: '16px' }}>
        {icon && (
          <div
            className="rounded-xl flex items-center justify-center shrink-0"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <h1
            className="font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', fontSize: '1.6rem', lineHeight: 1.3 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginTop: '4px',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
