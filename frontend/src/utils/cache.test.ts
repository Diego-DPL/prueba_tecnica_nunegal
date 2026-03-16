import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getCached, setCache } from './cache';

describe('cache', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for a missing key', () => {
    expect(getCached('nonexistent')).toBeNull();
  });

  it('stores and retrieves data correctly', () => {
    const data = [{ id: '1', brand: 'Apple', model: 'iPhone 15', price: '999', imgUrl: '' }];
    setCache('phones_list', data);
    expect(getCached('phones_list')).toEqual(data);
  });

  it('returns null for an expired entry', () => {
    vi.useFakeTimers();
    setCache('test_key', { value: 'hello' }, 1000);
    vi.advanceTimersByTime(1001);
    expect(getCached('test_key')).toBeNull();
  });

  it('returns data for a non-expired entry', () => {
    vi.useFakeTimers();
    const data = { value: 'hello' };
    setCache('test_key', data, 5000);
    vi.advanceTimersByTime(4999);
    expect(getCached('test_key')).toEqual(data);
  });

  it('removes expired entry from sessionStorage', () => {
    vi.useFakeTimers();
    setCache('expired_key', { x: 1 }, 100);
    vi.advanceTimersByTime(200);
    getCached('expired_key');
    expect(sessionStorage.getItem('phone_cache_expired_key')).toBeNull();
  });

  it('handles corrupted sessionStorage data gracefully', () => {
    sessionStorage.setItem('phone_cache_bad_key', 'not-valid-json{{{');
    expect(getCached('bad_key')).toBeNull();
  });

  it('uses 1 hour TTL by default', () => {
    vi.useFakeTimers();
    setCache('default_ttl', { value: 42 });
    vi.advanceTimersByTime(60 * 60 * 1000 - 1);
    expect(getCached('default_ttl')).toEqual({ value: 42 });
    vi.advanceTimersByTime(2);
    expect(getCached('default_ttl')).toBeNull();
  });
});
