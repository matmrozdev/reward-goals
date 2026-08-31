import { getDashboardRequest } from './get-dashboard-request';

describe('getDashboardRequest', () => {
  it('returns the calendar date in the supplied IANA time zone', () => {
    const now = new Date('2026-08-30T22:30:00.000Z');

    expect(getDashboardRequest(now, 'Europe/Warsaw')).toEqual({
      date: '2026-08-31',
      timeZone: 'Europe/Warsaw',
    });
    expect(getDashboardRequest(now, 'America/New_York')).toEqual({
      date: '2026-08-30',
      timeZone: 'America/New_York',
    });
  });
});
