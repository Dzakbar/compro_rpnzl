// src/hooks/useCalendar.js
import { useState } from 'react';

const UNAVAIL = {
  '2026-6': [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,20,27],
  '2026-7': [4,5,11,12,18,19,25,26],
  '2026-8': [1,8,9,15,22,23],
};

export function useCalendar() {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());   // 0-indexed
  const [selected,  setSelected]  = useState(null);             // { d, m, y }

  const isUnavailable = (y, m, d) =>
    (UNAVAIL[`${y}-${m + 1}`] || []).includes(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const pickDate = (d) => setSelected({ d, m: viewMonth, y: viewYear });

  return { viewYear, viewMonth, selected, isUnavailable, prevMonth, nextMonth, pickDate };
}
