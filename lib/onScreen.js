import { useState, useEffect } from "react";

export default function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  let observer = null;

  if (process.browser) {
    observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
  }

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
      // Remove the observer as soon as the component is unmounted
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return isIntersecting;
}
