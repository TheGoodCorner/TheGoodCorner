import { useEffect, useRef } from 'react';

export function useClickOutside(callback) {
  const ref = useRef(null);

  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  return { ref, handleClick };
}
