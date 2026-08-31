import { BadRequestException } from '@nestjs/common';
import { Weekday } from '../generated/prisma/enums';
import { createDashboardDateWindow } from './dashboard-date';

describe('createDashboardDateWindow', () => {
  it('resolves an ordinary local day and weekday', () => {
    const result = createDashboardDateWindow('2026-08-31', 'Europe/Warsaw');

    expect(result).toEqual({
      date: '2026-08-31',
      start: new Date('2026-08-30T22:00:00.000Z'),
      end: new Date('2026-08-31T22:00:00.000Z'),
      weekday: Weekday.MONDAY,
    });
  });

  it('resolves the shorter daylight-saving transition day', () => {
    const result = createDashboardDateWindow('2026-03-29', 'Europe/Warsaw');

    expect(result.start).toEqual(new Date('2026-03-28T23:00:00.000Z'));
    expect(result.end).toEqual(new Date('2026-03-29T22:00:00.000Z'));
  });

  it('resolves the longer daylight-saving transition day', () => {
    const result = createDashboardDateWindow('2026-10-25', 'Europe/Warsaw');

    expect(result.start).toEqual(new Date('2026-10-24T22:00:00.000Z'));
    expect(result.end).toEqual(new Date('2026-10-25T23:00:00.000Z'));
  });

  it.each([
    ['invalid calendar date', '2026-02-30', 'Europe/Warsaw'],
    ['invalid format', '31-08-2026', 'Europe/Warsaw'],
    ['invalid time zone', '2026-08-31', 'Not/A_Time_Zone'],
  ])('rejects an %s', (_case, date, timeZone) => {
    expect(() => createDashboardDateWindow(date, timeZone)).toThrow(
      BadRequestException,
    );
  });
});
