import { BadRequestException } from '@nestjs/common';
import { Weekday } from '../generated/prisma/enums';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const boundarySearchPaddingMs = 36 * 60 * 60 * 1000;

const weekdays = [
  Weekday.SUNDAY,
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
] as const;

export type DashboardDateWindow = {
  date: string;
  end: Date;
  start: Date;
  weekday: Weekday;
};

export function createDashboardDateWindow(
  date: string,
  timeZone: string,
): DashboardDateWindow {
  const parsedDate = parseLocalDate(date);
  const formatter = createDateFormatter(timeZone);
  const nextDate = formatUtcCalendarDate(
    new Date(Date.UTC(parsedDate.year, parsedDate.month, parsedDate.day + 1)),
  );
  const start = findDateBoundary(date, parsedDate.utcTimestamp, formatter);
  const end = findDateBoundary(
    nextDate,
    Date.UTC(parsedDate.year, parsedDate.month, parsedDate.day + 1),
    formatter,
  );

  return {
    date,
    end: new Date(end),
    start: new Date(start),
    weekday: weekdays[new Date(parsedDate.utcTimestamp).getUTCDay()],
  };
}

function parseLocalDate(date: string) {
  if (!datePattern.test(date)) {
    throw invalidDashboardDate();
  }

  const [year, monthNumber, day] = date.split('-').map(Number);
  const month = monthNumber - 1;
  const utcDate = new Date(Date.UTC(year, month, day));

  if (formatUtcCalendarDate(utcDate) !== date) {
    throw invalidDashboardDate();
  }

  return { day, month, utcTimestamp: utcDate.getTime(), year };
}

function createDateFormatter(timeZone: string): Intl.DateTimeFormat {
  try {
    return new Intl.DateTimeFormat('en-CA-u-ca-iso8601-nu-latn', {
      day: '2-digit',
      month: '2-digit',
      timeZone,
      year: 'numeric',
    });
  } catch {
    throw new BadRequestException('timeZone must be a valid IANA time zone');
  }
}

function findDateBoundary(
  targetDate: string,
  referenceTimestamp: number,
  formatter: Intl.DateTimeFormat,
): number {
  let lower = referenceTimestamp - boundarySearchPaddingMs;
  let upper = referenceTimestamp + boundarySearchPaddingMs;

  while (lower < upper) {
    const middle = Math.floor((lower + upper) / 2);

    if (formatZonedDate(middle, formatter) < targetDate) {
      lower = middle + 1;
    } else {
      upper = middle;
    }
  }

  if (formatZonedDate(lower, formatter) !== targetDate) {
    throw new BadRequestException(
      'date does not exist in the requested time zone',
    );
  }

  return lower;
}

function formatZonedDate(
  timestamp: number,
  formatter: Intl.DateTimeFormat,
): string {
  const parts = formatter.formatToParts(new Date(timestamp));
  const year = parts.find(({ type }) => type === 'year')?.value;
  const month = parts.find(({ type }) => type === 'month')?.value;
  const day = parts.find(({ type }) => type === 'day')?.value;

  if (!year || !month || !day) {
    throw new BadRequestException('Unable to resolve the requested local date');
  }

  return `${year}-${month}-${day}`;
}

function formatUtcCalendarDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function invalidDashboardDate(): BadRequestException {
  return new BadRequestException('date must be a valid YYYY-MM-DD value');
}
