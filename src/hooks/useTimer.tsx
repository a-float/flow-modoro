import React from "react";

const useTimer = (onExpire?: () => void) => {
  const timeoutRef = React.useRef<number | null>(null);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [overdue, setOverdue] = React.useState(0);
  const expiredRef = React.useRef(false);

  const checkTime = (endTime: number) => {
    const timeLeft = endTime - Date.now();
    if (timeLeft <= 0) {
      !expiredRef.current && onExpire?.();
      expiredRef.current = true;
      setTimeLeft(0);
      setOverdue(-timeLeft);
    } else {
      setTimeLeft(timeLeft);
    }
    timeoutRef.current = setTimeout(() => checkTime(endTime), 10);
  };

  const stop = () => timeoutRef.current && clearTimeout(timeoutRef.current);

  const reset = (expireTimeout: number) => {
    stop();
    expiredRef.current = false;
    setTimeLeft(expireTimeout);
    setOverdue(0);
    checkTime(Date.now() + expireTimeout);
  };

  return { timeLeft, overdue, reset, stop };
};

export default useTimer;
