import { useState, useEffect } from 'react';

/**
 * Hook to animate a number from 0 to target over a specified duration.
 * @param {number} target - The final number to count up to.
 * @param {number} duration - The duration of the animation in ms (default 1000).
 * @returns {number} The current animated value.
 */
export default function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) return;

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const current = Math.min(Math.floor((progress / duration) * end), end);
      
      setCount(current);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);

    return () => {
      // Note: cleanup could cancel animation frame, but typically simple enough to leave
    };
  }, [target, duration]);

  return count;
}
