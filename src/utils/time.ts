import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInMinutes from "date-fns/differenceInMinutes";
import differenceInMonths from "date-fns/differenceInMonths";
import differenceInWeeks from "date-fns/differenceInWeeks";
import differenceInYears from "date-fns/differenceInYears";

export function formatRelativeTime(date: Date): string {
  const now = Date.now();

  const minutes = differenceInMinutes(now, date);
  const days = differenceInCalendarDays(now, date);
  const weeks = differenceInWeeks(now, date);
  const months = differenceInMonths(now, date);
  const years = differenceInYears(now, date);

  if (years > 0) {
    return `${years}y`;
  }
  if (months > 0) {
    return `${months}mo`;
  }
  if (weeks > 0) {
    return `${weeks}w`;
  }
  if (days > 0) {
    return `${days}d`;
  }
  if (minutes >= 60) {
    return `${Math.floor(minutes / 60)}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return "now";
}

export function formatTimestamp(ms: number, showHighPrecision = false) {
  const seconds = showHighPrecision
    ? Math.floor(ms / 1000)
    : Math.round(ms / 1000.0);
  const minutesString = Math.floor(seconds / 60);
  const secondsString = String(seconds % 60).padStart(2, "0");
  if (showHighPrecision) {
    const millisecondsString = `${Math.round(ms) % 1000}`.padStart(3, "0");
    return `${minutesString}:${secondsString}.${millisecondsString}`;
  } else {
    return `${minutesString}:${secondsString}`;
  }
}
