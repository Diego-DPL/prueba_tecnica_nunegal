import axios from 'axios';
import type { PhoneListItem, PhoneDetail } from '../types';
import { getCached, setCache } from '../utils/cache';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

export async function fetchPhones(): Promise<PhoneListItem[]> {
  const cacheKey = 'phones_list';
  const cached = getCached<PhoneListItem[]>(cacheKey);
  if (cached) return cached;

  const { data } = await api.get<PhoneListItem[]>('/phones');
  setCache(cacheKey, data);
  return data;
}

export async function fetchPhoneDetail(id: string): Promise<PhoneDetail> {
  const cacheKey = `phone_detail_${id}`;
  const cached = getCached<PhoneDetail>(cacheKey);
  if (cached) return cached;

  const { data } = await api.get<PhoneDetail>(`/phones/${id}`);
  setCache(cacheKey, data);
  return data;
}

export async function addToCart(
  id: string,
  colorCode: number,
  storageCode: number,
): Promise<{ count: number }> {
  const { data } = await api.post<{ count: number }>('/cart', {
    id,
    colorCode,
    storageCode,
  });
  return data;
}
