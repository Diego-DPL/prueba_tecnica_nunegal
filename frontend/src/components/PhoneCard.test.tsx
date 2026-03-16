import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PhoneCard from './PhoneCard';
import type { PhoneListItem } from '../types';

const mockPhone: PhoneListItem = {
  id: '1',
  brand: 'Apple',
  model: 'iPhone 15',
  price: '999',
  imgUrl: 'https://example.com/iphone.jpg',
};

function renderCard(phone: PhoneListItem = mockPhone) {
  return render(
    <MemoryRouter>
      <PhoneCard phone={phone} />
    </MemoryRouter>,
  );
}

describe('PhoneCard', () => {
  it('renders brand, model and price', () => {
    renderCard();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('999 EUR')).toBeInTheDocument();
  });

  it('renders "Price on request" when price is empty', () => {
    renderCard({ ...mockPhone, price: '' });
    expect(screen.getByText('Price on request')).toBeInTheDocument();
  });

  it('links to the correct product detail route', () => {
    renderCard();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/phone/1');
  });

  it('renders product image with correct alt text', () => {
    renderCard();
    expect(screen.getByAltText('Apple iPhone 15')).toBeInTheDocument();
  });

  it('applies lazy loading to the image', () => {
    renderCard();
    expect(screen.getByAltText('Apple iPhone 15')).toHaveAttribute('loading', 'lazy');
  });
});
