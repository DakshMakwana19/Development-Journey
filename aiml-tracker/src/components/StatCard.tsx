'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * StatCard — Animated statistics display card
 * Used on the Dashboard to show key metrics with icons and trends.
 */

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'var(--accent-blue)',
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card flex flex-col"
      style={{ padding: '24px' }}
    >
      {/* Header: icon + title */}
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <div
          className="rounded-xl flex items-center justify-center"
          style={{ width: '44px', height: '44px', background: `${color}15`, color }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              color: trend.isPositive ? 'var(--success)' : 'var(--error)',
              background: trend.isPositive ? 'rgba(126,231,135,0.1)' : 'rgba(242,122,142,0.1)',
            }}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p
          className="font-bold"
          style={{ color: 'var(--text-primary)', fontSize: '1.75rem', lineHeight: 1.2 }}
        >
          {value}
        </p>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            marginTop: '6px',
          }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            style={{
              color: 'var(--text-tertiary)',
              fontSize: '0.78rem',
              marginTop: '4px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
