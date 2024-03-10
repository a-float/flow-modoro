import { useState, useRef } from "react";

const useStopwatch = (initialState = 0) => {
  const [elapsedTime, setElapsedTime] = useState(initialState);
  const [isRunning, setIsRunning] = useState(false);
  const countRef = useRef<number | null>(null);

  const start = () => {
    const startTime = Date.now() - elapsedTime;
    countRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 10);
    setIsRunning(true);
  };

  const pause = () => {
    countRef.current && clearInterval(countRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    countRef.current && clearInterval(countRef.current);
    setIsRunning(false);
    setElapsedTime(0);
  };

  return { elapsedTime, isRunning, start, pause, reset };
};

export default useStopwatch;
