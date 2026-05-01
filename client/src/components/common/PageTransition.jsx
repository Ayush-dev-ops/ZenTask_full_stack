import React, { useEffect, useState } from 'react';

/**
 * Wraps page content to apply a fade-up entrance animation.
 */
export default function PageTransition({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 400ms ease, transform 400ms ease',
      }}
      className="w-full h-full"
    >
      {children}
    </div>
  );
}
