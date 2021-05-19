import { useEffect, useRef } from "react";

function useClickOutside(ref, callback) {
  // we need a reference because callback function changes every render
  const callbackRef = useRef();
  callbackRef.current = callback;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      // to prevent null/undefined function calls
      if (!ref.current || !callbackRef.current) {
        return;
      }
      if (!ref.current.contains(e.target)) {
        callbackRef.current(e);
      }
    };

    // add listener to dom
    document.addEventListener("click", handleOutsideClick, true);

    // cleanup listener
    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, [ref, callbackRef]);
}

export default useClickOutside;
