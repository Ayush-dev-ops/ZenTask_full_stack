import React from 'react';

/**
 * Reusable GlassCard component that applies the glassmorphism design system.
 */
export default function GlassCard({ children, className = '', style = {} }) {
  return (
    <div className={`glass ${className}`} style={style}>
      {children}
    </div>
  );
}
