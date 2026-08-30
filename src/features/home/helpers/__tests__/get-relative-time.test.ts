import { getRelativeTime } from '../get-relative-time';

/**
 * Constants
 */

const DAY_MS = 86_400_000;

/**
 * Tests
 */

describe('getRelativeTime', () => {
  it('should return "Added today" for the current date', () => {
    const now = new Date().toISOString();
    expect(getRelativeTime(now)).toBe('Added today');
  });

  it('should return "Added 1 day ago" for 1 day ago (singular)', () => {
    const iso = new Date(Date.now() - 1 * DAY_MS).toISOString();
    expect(getRelativeTime(iso)).toBe('Added 1 day ago');
  });

  it('should return "Added 5 days ago" for 5 days ago (plural)', () => {
    const iso = new Date(Date.now() - 5 * DAY_MS).toISOString();
    expect(getRelativeTime(iso)).toBe('Added 5 days ago');
  });

  it('should return "Added 1 month ago" for 30 days ago (singular)', () => {
    const iso = new Date(Date.now() - 30 * DAY_MS).toISOString();
    expect(getRelativeTime(iso)).toBe('Added 1 month ago');
  });

  it('should return "Added 2 months ago" for 60 days ago (plural)', () => {
    const iso = new Date(Date.now() - 60 * DAY_MS).toISOString();
    expect(getRelativeTime(iso)).toBe('Added 2 months ago');
  });

  it('should return "Added 1 year ago" for 365 days ago (singular)', () => {
    const iso = new Date(Date.now() - 365 * DAY_MS).toISOString();
    expect(getRelativeTime(iso)).toBe('Added 1 year ago');
  });

  it('should return "Added 2 years ago" for 800 days ago (plural)', () => {
    const iso = new Date(Date.now() - 800 * DAY_MS).toISOString();
    expect(getRelativeTime(iso)).toBe('Added 2 years ago');
  });
});