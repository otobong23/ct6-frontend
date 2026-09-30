"use client";

import { useEffect, useState } from "react";

export function useCountdown(startSeconds: number) {
  const [seconds, setSeconds] = useState(startSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  function reset() {
    setSeconds(startSeconds);
  }

  return { seconds, reset };
}