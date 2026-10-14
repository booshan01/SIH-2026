import { useState, useEffect } from 'react';

export interface LiveCctvTime {
  /** e.g. "2026/10/12 15:56:02" */
  fullTimestamp: string;
  /** e.g. "15:56:02" */
  timeString: string;
  /** e.g. "2026-10-12" */
  dateString: string;
  /** Milliseconds / frame counter for authentic high-speed CCTV OSD e.g. "482" */
  millis: string;
  /** Complete CCTV string with timezone e.g. "2026/10/12 15:56:02 IST (LIVE)" */
  cctvOsdString: string;
  /** Native Date object */
  date: Date;
}

export function formatCctvTime(now: Date = new Date()): LiveCctvTime {
  const yr = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const da = String(now.getDate()).padStart(2, '0');
  const ho = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const se = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');

  const fullTimestamp = `${yr}/${mo}/${da} ${ho}:${mi}:${se}`;
  const timeString = `${ho}:${mi}:${se}`;
  const dateString = `${yr}-${mo}-${da}`;

  return {
    fullTimestamp,
    timeString,
    dateString,
    millis: ms,
    cctvOsdString: `${fullTimestamp} IST (LIVE)`,
    date: now,
  };
}

/**
 * Custom React hook that ticks synchronously every second (or sub-second)
 * matching the user's exact current local machine time.
 */
export function useLiveCctvClock(updateIntervalMs: number = 1000): LiveCctvTime {
  const [clock, setClock] = useState<LiveCctvTime>(() => formatCctvTime());

  useEffect(() => {
    // Initial immediate tick
    setClock(formatCctvTime());

    const timer = setInterval(() => {
      setClock(formatCctvTime());
    }, updateIntervalMs);

    return () => clearInterval(timer);
  }, [updateIntervalMs]);

  return clock;
}
