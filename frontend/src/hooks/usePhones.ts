import { useState, useEffect } from 'react';
import type { PhoneListItem, PhoneDetail } from '../types';
import { fetchPhones, fetchPhoneDetail } from '../api/phoneApi';

export function usePhones() {
  const [phones, setPhones] = useState<PhoneListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPhones();
        if (!cancelled) setPhones(data);
      } catch {
        if (!cancelled) setError('Error loading phones. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { phones, loading, error };
}

export function usePhoneDetail(id: string) {
  const [phone, setPhone] = useState<PhoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPhoneDetail(id);
        if (!cancelled) setPhone(data);
      } catch {
        if (!cancelled) setError('Error loading phone details. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  return { phone, loading, error };
}
