import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent, UIEvent } from "react";
import { CalendarDays } from "lucide-react";

type DateParts = {
  day: number;
  month: number;
  year: number;
};

type WheelDatePickerProps = {
  name: string;
  value: string;
  min?: string;
  max?: string;
  placeholder: string;
  initialYear?: number;
  onChange: (name: string, value: string) => void;
};

const pad = (value: number) => String(value).padStart(2, "0");

const parseDateValue = (value?: string): DateParts | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");

  if (!match) return null;

  const [, year, month, day] = match;
  return {
    day: Number(day),
    month: Number(month),
    year: Number(year),
  };
};

const toDateValue = ({ day, month, year }: DateParts) =>
  `${year}-${pad(month)}-${pad(day)}`;

const toDateNumber = (date: DateParts) =>
  date.year * 10000 + date.month * 100 + date.day;

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

const getTodayParts = (): DateParts => {
  const today = new Date();

  return {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  };
};

const clampDate = (
  date: DateParts,
  minDate: DateParts | null,
  maxDate: DateParts | null
) => {
  const normalized = {
    ...date,
    day: Math.min(date.day, getDaysInMonth(date.year, date.month)),
  };

  if (minDate && toDateNumber(normalized) < toDateNumber(minDate)) {
    return minDate;
  }

  if (maxDate && toDateNumber(normalized) > toDateNumber(maxDate)) {
    return maxDate;
  }

  return normalized;
};

const formatDisplayDate = (value: string) => {
  const date = parseDateValue(value);

  if (!date) return "";

  return `${pad(date.day)}/${pad(date.month)}/${date.year}`;
};

const getYearRange = (minDate: DateParts | null, maxDate: DateParts | null) => {
  const currentYear = new Date().getFullYear();
  const startYear = minDate?.year || 1900;
  const endYear = maxDate?.year || currentYear + 20;
  const years: number[] = [];

  for (let year = startYear; year <= endYear; year += 1) {
    years.push(year);
  }

  return years;
};

const WheelColumn = ({
  label,
  values,
  value,
  format,
  onSelect,
}: {
  label: string;
  values: number[];
  value: number;
  format: (value: number) => string;
  onSelect: (value: number) => void;
}) => {
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      block: "center",
    });
  }, [value, values.length]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const itemHeight = 44;
    const selectedIndex = Math.min(
      values.length - 1,
      Math.max(0, Math.round(event.currentTarget.scrollTop / itemHeight))
    );
    const nextValue = values[selectedIndex];

    if (nextValue !== undefined && nextValue !== value) {
      onSelect(nextValue);
    }
  };

  return (
    <div className="alc-date-wheel-column">
      <span>{label}</span>
      <div
        className="alc-date-wheel-list"
        role="listbox"
        aria-label={label}
        onScroll={handleScroll}
      >
        {values.map((item) => (
          <button
            key={item}
            ref={item === value ? selectedRef : null}
            type="button"
            className={item === value ? "is-selected" : ""}
            onClick={() => onSelect(item)}
            role="option"
            aria-selected={item === value}
          >
            {format(item)}
          </button>
        ))}
      </div>
    </div>
  );
};

const WheelDatePicker = ({
  name,
  value,
  min,
  max,
  placeholder,
  initialYear,
  onChange,
}: WheelDatePickerProps) => {
  const minDate = useMemo(() => parseDateValue(min), [min]);
  const maxDate = useMemo(() => parseDateValue(max), [max]);
  const years = useMemo(() => getYearRange(minDate, maxDate), [minDate, maxDate]);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DateParts>(() => {
    const parsedValue = parseDateValue(value);

    if (parsedValue) return parsedValue;

    const fallback = getTodayParts();
    const fallbackYear = initialYear || fallback.year;
    const defaultDate = {
      day: fallback.day,
      month: fallback.month,
      year: Math.min(Math.max(fallbackYear, years[0]), years[years.length - 1]),
    };

    return clampDate(defaultDate, minDate, maxDate);
  });

  const days = useMemo(
    () =>
      Array.from(
        { length: getDaysInMonth(draft.year, draft.month) },
        (_, index) => index + 1
      ),
    [draft.month, draft.year]
  );

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, index) => index + 1),
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    const parsedValue = parseDateValue(value);

    if (parsedValue) {
      setDraft(clampDate(parsedValue, minDate, maxDate));
    }
  }, [isOpen, maxDate, minDate, value]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const updateDraft = (next: Partial<DateParts>) => {
    setDraft((previous) => {
      const merged = {
        ...previous,
        ...next,
      };

      return clampDate(merged, minDate, maxDate);
    });
  };

  const handleConfirm = () => {
    onChange(name, toDateValue(draft));
    setIsOpen(false);
  };

  const closePicker = () => {
    setIsOpen(false);
  };

  const handleExitPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    closePicker();
  };

  return (
    <>
      <button
        type="button"
        className={`alc-date-trigger${value ? "" : " is-empty"}`}
        onClick={() => setIsOpen(true)}
      >
        <span>{value ? formatDisplayDate(value) : placeholder}</span>
        <CalendarDays size={17} />
      </button>

      {isOpen && (
        <div
          className="alc-date-picker-backdrop"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              closePicker();
            }
          }}
        >
          <div className="alc-date-picker-panel" role="dialog" aria-modal="true">
            <div className="alc-date-picker-header">
              <div>
                <span>Chọn ngày / Select date</span>
                <strong>{placeholder}</strong>
              </div>
            </div>

            <div className="alc-date-wheel-wrap">
              <div className="alc-date-wheel-highlight" />
              <WheelColumn
                label="Ngày / Day"
                values={days}
                value={draft.day}
                format={(item) => pad(item)}
                onSelect={(day) => updateDraft({ day })}
              />
              <WheelColumn
                label="Tháng / Month"
                values={months}
                value={draft.month}
                format={(item) => pad(item)}
                onSelect={(month) => updateDraft({ month })}
              />
              <WheelColumn
                label="Năm / Year"
                values={years}
                value={draft.year}
                format={(item) => String(item)}
                onSelect={(year) => updateDraft({ year })}
              />
            </div>

            <div className="alc-date-picker-actions">
              <button
                type="button"
                className="alc-date-clear"
                onPointerDown={handleExitPointerDown}
                onClick={closePicker}
              >
                Thoát / Exit
              </button>
              <button type="button" className="alc-date-confirm" onClick={handleConfirm}>
                Chọn / Select
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WheelDatePicker;
