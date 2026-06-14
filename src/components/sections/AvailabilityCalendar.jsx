import { useMemo, useState } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const weekDayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const fullDayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const dummyAvailability = {
  '2026-06-14': {
    status: 'limited',
    label: 'Terbatas',
    note: 'Trial design',
    slots: ['13:00', '16:00'],
  },
  '2026-06-15': {
    status: 'booked',
    label: 'Penuh',
    note: 'Bridal henna',
    slots: ['09:00', '13:00'],
  },
  '2026-06-17': {
    status: 'available',
    label: 'Tersedia',
    note: 'Studio session',
    slots: ['10:00', '13:00', '16:00'],
  },
  '2026-06-20': {
    status: 'booked',
    label: 'Penuh',
    note: 'Wedding event',
    slots: ['Full day'],
  },
  '2026-06-23': {
    status: 'limited',
    label: 'Terbatas',
    note: 'Party henna',
    slots: ['15:30'],
  },
  '2026-06-26': {
    status: 'available',
    label: 'Tersedia',
    note: 'Home service',
    slots: ['11:00', '14:00', '17:00'],
  },
  '2026-06-28': {
    status: 'off',
    label: 'Libur',
    note: 'Studio tutup',
    slots: [],
  },
  '2026-07-02': {
    status: 'available',
    label: 'Tersedia',
    note: 'Bridal trial',
    slots: ['10:00', '12:30', '15:00'],
  },
  '2026-07-04': {
    status: 'booked',
    label: 'Penuh',
    note: 'Event booth',
    slots: ['Full day'],
  },
  '2026-07-08': {
    status: 'limited',
    label: 'Terbatas',
    note: 'Last slot',
    slots: ['16:30'],
  },
  '2026-07-12': {
    status: 'off',
    label: 'Libur',
    note: 'Maintenance',
    slots: [],
  },
};

const statusStyles = {
  available: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    cell: 'border-emerald-200 bg-emerald-50/80 hover:border-emerald-300',
  },
  limited: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    cell: 'border-amber-200 bg-amber-50/80 hover:border-amber-300',
  },
  booked: {
    dot: 'bg-[var(--p-deep)]',
    badge: 'bg-[var(--p-light)] text-[var(--p-mid)]',
    cell: 'border-[var(--p-border)] bg-[var(--p-avail-bg)] hover:border-[var(--p-deep)]',
  },
  off: {
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600',
    cell: 'border-slate-200 bg-slate-50 hover:border-slate-300',
  },
};

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, amount) {
  const next = normalizeDate(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function startOfWeek(date) {
  const normalized = normalizeDate(date);
  const day = normalized.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return addDays(normalized, mondayOffset);
}

function getWeekDays(date) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function getMonthGrid(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const start = startOfWeek(firstDay);
  const end = addDays(startOfWeek(lastDay), 6);
  const days = [];

  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    days.push(cursor);
  }

  return days;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getAvailability(date) {
  const dummy = dummyAvailability[formatDateKey(date)];

  if (dummy) {
    return dummy;
  }

  if (date.getDay() === 0) {
    return {
      status: 'off',
      label: 'Libur',
      note: 'Studio tutup',
      slots: [],
    };
  }

  if (date.getDay() === 6) {
    return {
      status: 'limited',
      label: 'Terbatas',
      note: 'Weekend slot',
      slots: ['11:00', '15:30'],
    };
  }

  return {
    status: 'available',
    label: 'Tersedia',
    note: 'Regular session',
    slots: ['10:00', '13:00', '16:00'],
  };
}

function formatSelectedDate(date) {
  return `${fullDayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function getPeriodTitle(viewMode, anchorDate) {
  if (viewMode === 'week') {
    const days = getWeekDays(anchorDate);
    const start = days[0];
    const end = days[days.length - 1];
    return `${start.getDate()} ${monthNames[start.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]} ${end.getFullYear()}`;
  }

  return `${monthNames[anchorDate.getMonth()]} ${anchorDate.getFullYear()}`;
}

export default function AvailabilityCalendar({ className = '' }) {
  const today = useMemo(() => normalizeDate(new Date()), []);
  const [viewMode, setViewMode] = useState('month');
  const [anchorDate, setAnchorDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);

  const visibleDays = useMemo(() => {
    if (viewMode === 'week') {
      return getWeekDays(anchorDate);
    }

    return getMonthGrid(anchorDate);
  }, [anchorDate, viewMode]);

  const yearOptions = useMemo(() => {
    const currentYear = anchorDate.getFullYear();
    return Array.from({ length: 5 }, (_, index) => currentYear - 1 + index);
  }, [anchorDate]);

  const selectedInfo = getAvailability(selectedDate);
  const selectedStyle = statusStyles[selectedInfo.status];

  const movePeriod = (direction) => {
    const nextDate = viewMode === 'week'
      ? addDays(anchorDate, direction * 7)
      : addMonths(anchorDate, direction);

    setAnchorDate(nextDate);
    setSelectedDate(nextDate);
  };

  const pickToday = () => {
    setAnchorDate(today);
    setSelectedDate(today);
  };

  const changeMonth = (month) => {
    const nextDate = new Date(anchorDate.getFullYear(), Number(month), 1);
    setAnchorDate(nextDate);
    setSelectedDate(nextDate);
  };

  const changeYear = (year) => {
    const nextDate = new Date(Number(year), anchorDate.getMonth(), 1);
    setAnchorDate(nextDate);
    setSelectedDate(nextDate);
  };

  const changeViewMode = (mode) => {
    setViewMode(mode);
    setAnchorDate(selectedDate);
  };

  return (
    <div className={`overflow-hidden rounded-[8px] border border-[var(--p-border)] bg-white shadow-sm ${className}`}>
      <div className="flex flex-col gap-4 border-b border-[var(--p-border)] p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => movePeriod(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--p-border)] text-[var(--p-mid)] transition hover:bg-[var(--p-ultra)]"
              aria-label="Periode sebelumnya"
              title="Periode sebelumnya"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => movePeriod(1)}
              className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--p-border)] text-[var(--p-mid)] transition hover:bg-[var(--p-ultra)]"
              aria-label="Periode berikutnya"
              title="Periode berikutnya"
            >
              <FiChevronRight size={16} />
            </button>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FiCalendar className="shrink-0 text-[var(--p)]" size={17} />
              <h3 className="truncate font-serif text-[21px] font-light text-[var(--p-mid)]">
                {getPeriodTitle(viewMode, anchorDate)}
              </h3>
            </div>
            <p className="mt-0.5 text-[10px] uppercase tracking-[1.5px] text-[var(--p-muted)]">
              Data dummy
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex h-10 overflow-hidden rounded-[6px] border border-[var(--p-border)] bg-[var(--p-ultra)] p-1">
            {[
              ['week', 'Minggu'],
              ['month', 'Bulan'],
            ].map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => changeViewMode(mode)}
                className={`rounded-[4px] px-3 text-[11px] font-medium uppercase tracking-[1px] transition ${
                  viewMode === mode
                    ? 'bg-white text-[var(--p-mid)] shadow-sm'
                    : 'text-[var(--p-muted)] hover:text-[var(--p-mid)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={anchorDate.getMonth()}
            onChange={(event) => changeMonth(event.target.value)}
            className="h-10 rounded-[6px] border border-[var(--p-border)] bg-white px-3 text-[12px] text-[var(--p-mid)] outline-none transition focus:border-[var(--p)]"
            aria-label="Pilih bulan"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={anchorDate.getFullYear()}
            onChange={(event) => changeYear(event.target.value)}
            className="h-10 rounded-[6px] border border-[var(--p-border)] bg-white px-3 text-[12px] text-[var(--p-mid)] outline-none transition focus:border-[var(--p)]"
            aria-label="Pilih tahun"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={pickToday}
            className="h-10 rounded-[6px] border border-[var(--p)] px-4 text-[11px] font-medium uppercase tracking-[1px] text-[var(--p-mid)] transition hover:bg-[var(--p-light)]"
          >
            Hari ini
          </button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="p-4">
          {viewMode === 'month' ? (
            <>
              <div className="mb-2 grid grid-cols-7 gap-1">
                {weekDayNames.map((day) => (
                  <div key={day} className="text-center text-[10px] font-medium uppercase tracking-[1px] text-[var(--p-muted)]">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {visibleDays.map((date) => {
                  const info = getAvailability(date);
                  const style = statusStyles[info.status];
                  const isSelected = isSameDate(date, selectedDate);
                  const isToday = isSameDate(date, today);
                  const isCurrentMonth = date.getMonth() === anchorDate.getMonth();

                  return (
                    <button
                      key={formatDateKey(date)}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`min-h-[54px] rounded-[6px] border p-1.5 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--p)] sm:min-h-[92px] sm:p-2 ${
                        style.cell
                      } ${isCurrentMonth ? '' : 'opacity-45'} ${
                        isSelected ? 'ring-2 ring-[var(--p)]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`flex h-6 min-w-6 items-center justify-center rounded-full text-[12px] font-medium ${
                            isToday ? 'bg-[var(--p-mid)] text-white' : 'text-[var(--p-dark)]'
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                      </div>
                      <div className="mt-2 hidden min-h-[32px] sm:block">
                        <p className="truncate text-[11px] font-medium text-[var(--p-dark)]">{info.label}</p>
                        <p className="mt-0.5 truncate text-[10px] text-[var(--p-muted)]">
                          {info.slots[0] || info.note}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="grid gap-3 md:grid-cols-7">
              {visibleDays.map((date) => {
                const info = getAvailability(date);
                const style = statusStyles[info.status];
                const isSelected = isSameDate(date, selectedDate);
                const isToday = isSameDate(date, today);

                return (
                  <button
                    key={formatDateKey(date)}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`min-h-[168px] rounded-[6px] border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--p)] ${
                      style.cell
                    } ${isSelected ? 'ring-2 ring-[var(--p)]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[1px] text-[var(--p-muted)]">
                          {fullDayNames[date.getDay()]}
                        </p>
                        <p className="mt-1 font-serif text-[24px] leading-none text-[var(--p-mid)]">
                          {date.getDate()}
                        </p>
                      </div>
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                    </div>
                    <span className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${style.badge}`}>
                      {isToday ? 'Hari ini' : info.label}
                    </span>
                    <div className="mt-3 space-y-1.5">
                      {(info.slots.length ? info.slots : [info.note]).slice(0, 3).map((slot) => (
                        <span
                          key={slot}
                          className="block truncate rounded-[4px] bg-white/80 px-2 py-1 text-[11px] text-[var(--p-dark)]"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="border-t border-[var(--p-border)] bg-[var(--p-ultra)] p-4 lg:border-l lg:border-t-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--p-muted)]">
                Detail jadwal
              </p>
              <h4 className="mt-1 font-serif text-[24px] font-light leading-tight text-[var(--p-mid)]">
                {formatSelectedDate(selectedDate)}
              </h4>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${selectedStyle.badge}`}>
              {selectedInfo.label}
            </span>
          </div>

          <p className="mt-3 text-[12px] leading-relaxed text-[var(--p-muted)]">
            {selectedInfo.note}
          </p>

          <div className="mt-5 space-y-2">
            {selectedInfo.slots.length > 0 ? (
              selectedInfo.slots.map((slot) => (
                <div
                  key={slot}
                  className="flex items-center gap-2 rounded-[6px] border border-[var(--p-border)] bg-white px-3 py-2 text-[12px] text-[var(--p-dark)]"
                >
                  <FiClock className="shrink-0 text-[var(--p)]" size={14} />
                  <span>{slot}</span>
                </div>
              ))
            ) : (
              <div className="rounded-[6px] border border-dashed border-[var(--p-border)] bg-white px-3 py-3 text-[12px] text-[var(--p-muted)]">
                Belum ada slot tersedia.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
