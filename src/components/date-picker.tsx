import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import { IconButton } from "./button";
import { Popover } from "./popover";

export interface DatePickerProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  locale?: string;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

const DAY_MS = 86_400_000;

function parseIsoDate(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parts = value.split("-").map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  if (year === undefined || month === undefined || day === undefined) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  return formatIsoDate(date) === value ? date : null;
}

function formatIsoDate(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function addDays(date: Date, amount: number) {
  return new Date(date.getTime() + amount * DAY_MS);
}

function addMonths(date: Date, amount: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));
}

function addCalendarMonths(date: Date, amount: number) {
  const first = addMonths(date, amount);
  const lastDay = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(date.getUTCDate(), lastDay)),
  );
}

function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function clampDate(date: Date, min: Date | null, max: Date | null) {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

function utcToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function DatePicker({
  className = "",
  label,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  min: minValue,
  max: maxValue,
  locale,
  disabled = false,
  name,
  placeholder = "Choose date",
  weekStartsOn = 0,
  ...props
}: DatePickerProps) {
  const labelId = useId();
  const valueId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = valueProp ?? uncontrolledValue;
  const selectedDate = parseIsoDate(value);
  const min = parseIsoDate(minValue);
  const max = parseIsoDate(maxValue);
  const initialDate = clampDate(selectedDate ?? min ?? utcToday(), min, max);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(initialDate));
  const [focusedDate, setFocusedDate] = useState(initialDate);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }),
    [locale],
  );
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }),
    [locale],
  );
  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" }),
    [locale],
  );
  const weekdayLabelFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }),
    [locale],
  );
  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date(Date.UTC(2024, 0, 7 + ((weekStartsOn + index) % 7)));
        return {
          key: formatIsoDate(date),
          label: weekdayFormatter.format(date),
          accessibleLabel: weekdayLabelFormatter.format(date),
        };
      }),
    [weekdayFormatter, weekdayLabelFormatter, weekStartsOn],
  );

  const gridDates = useMemo(() => {
    const first = startOfMonth(visibleMonth);
    const leadingDays = (first.getUTCDay() - weekStartsOn + 7) % 7;
    const gridStart = addDays(first, -leadingDays);
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  }, [visibleMonth, weekStartsOn]);

  useEffect(() => {
    if (!open) return;
    dayRefs.current.get(formatIsoDate(focusedDate))?.focus();
  }, [focusedDate, open]);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      const nextDate = clampDate(selectedDate ?? focusedDate, min, max);
      setFocusedDate(nextDate);
      setVisibleMonth(startOfMonth(nextDate));
    }
    setOpen(nextOpen);
  }

  function commit(date: Date) {
    const nextValue = formatIsoDate(date);
    if (valueProp === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
    setFocusedDate(date);
    setVisibleMonth(startOfMonth(date));
    setOpen(false);
  }

  function moveFocus(date: Date) {
    const nextDate = clampDate(date, min, max);
    setFocusedDate(nextDate);
    setVisibleMonth(startOfMonth(nextDate));
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let nextDate: Date | null = null;
    switch (event.key) {
      case "ArrowLeft":
        nextDate = addDays(focusedDate, -1);
        break;
      case "ArrowRight":
        nextDate = addDays(focusedDate, 1);
        break;
      case "ArrowUp":
        nextDate = addDays(focusedDate, -7);
        break;
      case "ArrowDown":
        nextDate = addDays(focusedDate, 7);
        break;
      case "Home":
        nextDate = addDays(focusedDate, -((focusedDate.getUTCDay() - weekStartsOn + 7) % 7));
        break;
      case "End":
        nextDate = addDays(focusedDate, 6 - ((focusedDate.getUTCDay() - weekStartsOn + 7) % 7));
        break;
      case "PageUp":
        nextDate = addCalendarMonths(focusedDate, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        nextDate = addCalendarMonths(focusedDate, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(nextDate);
  }

  function monthCanContain(date: Date) {
    const first = startOfMonth(date);
    const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0));
    return (!min || last >= min) && (!max || first <= max);
  }

  const previousMonth = addMonths(visibleMonth, -1);
  const nextMonth = addMonths(visibleMonth, 1);
  const today = formatIsoDate(utcToday());

  return (
    <div
      data-greyui-component="date-picker"
      className={`greyui-date-picker ${className}`.trim()}
      {...props}
    >
      <span id={labelId} className="greyui-date-picker-label">
        {label}
      </span>
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger
          disabled={disabled}
          aria-labelledby={`${labelId} ${valueId}`}
          className="greyui-date-picker-trigger"
        >
          <span id={valueId}>
            {selectedDate ? dateFormatter.format(selectedDate) : placeholder}
          </span>
          <span className="greyui-date-picker-trigger-icon" aria-hidden="true" />
        </Popover.Trigger>
        <Popover.Popup
          className="greyui-date-picker-popup"
          positionerProps={{
            align: "start",
            collisionPadding: 8,
            positionMethod: "fixed",
          }}
        >
          <div className="greyui-date-picker-header">
            <IconButton
              size="sm"
              label="Previous month"
              disabled={!monthCanContain(previousMonth)}
              onClick={() => {
                setVisibleMonth(previousMonth);
                moveFocus(clampDate(previousMonth, min, max));
              }}
            >
              ‹
            </IconButton>
            <strong aria-live="polite">{monthFormatter.format(visibleMonth)}</strong>
            <IconButton
              size="sm"
              label="Next month"
              disabled={!monthCanContain(nextMonth)}
              onClick={() => {
                setVisibleMonth(nextMonth);
                moveFocus(clampDate(nextMonth, min, max));
              }}
            >
              ›
            </IconButton>
          </div>
          <div role="grid" aria-labelledby={labelId} className="greyui-date-picker-grid">
            <div role="row" className="greyui-date-picker-weekdays">
              {weekdays.map((weekday) => (
                <span role="columnheader" aria-label={weekday.accessibleLabel} key={weekday.key}>
                  {weekday.label}
                </span>
              ))}
            </div>
            <div role="rowgroup" className="greyui-date-picker-days">
              {Array.from({ length: 6 }, (_, weekIndex) => (
                <div
                  role="row"
                  className="greyui-date-picker-week"
                  key={formatIsoDate(gridDates[weekIndex * 7]!)}
                >
                  {gridDates.slice(weekIndex * 7, weekIndex * 7 + 7).map((date) => {
                    const isoDate = formatIsoDate(date);
                    const unavailable = Boolean((min && date < min) || (max && date > max));
                    const outsideMonth = date.getUTCMonth() !== visibleMonth.getUTCMonth();
                    return (
                      <button
                        key={isoDate}
                        ref={(node) => {
                          if (node) dayRefs.current.set(isoDate, node);
                          else dayRefs.current.delete(isoDate);
                        }}
                        type="button"
                        role="gridcell"
                        aria-label={dateFormatter.format(date)}
                        aria-selected={isoDate === value}
                        aria-current={isoDate === today ? "date" : undefined}
                        disabled={unavailable}
                        data-outside-month={outsideMonth ? "true" : undefined}
                        tabIndex={isoDate === formatIsoDate(focusedDate) ? 0 : -1}
                        className="greyui-date-picker-day"
                        onFocus={() => setFocusedDate(date)}
                        onKeyDown={handleDayKeyDown}
                        onClick={() => commit(date)}
                      >
                        {date.getUTCDate()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Popover.Popup>
      </Popover.Root>
      {name ? <input type="hidden" name={name} value={value} disabled={disabled} /> : null}
    </div>
  );
}
