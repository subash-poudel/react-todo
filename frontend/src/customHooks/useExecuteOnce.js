import { useEffect, useRef, useState } from "react";

export default function useExecuteOnce(callback) {
  const callbackRef = useRef();
  callbackRef.current = callback;

  const [data, setData] = useState({});

  useEffect(() => {
    const data = callbackRef.current();
    setData(data);
  }, [callbackRef]);

  return data;
}
