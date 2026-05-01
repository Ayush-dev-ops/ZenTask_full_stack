import React from 'react';

/**
 * Renders a skeleton shimmer block.
 * Provide width, height, or className to size it.
 */
export default function ShimmerSkeleton({ className = '', style = {} }) {
  return (
    <div 
      className={`relative overflow-hidden rounded-xl bg-white/5 ${className}`}
      style={style}
    >
      <div 
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ animation: 'shimmer 1.5s infinite' }}
      />
    </div>
  );
}
