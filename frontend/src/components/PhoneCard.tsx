import { Link } from 'react-router-dom';
import type { PhoneListItem } from '../types';

interface PhoneCardProps {
  phone: PhoneListItem;
}

export default function PhoneCard({ phone }: PhoneCardProps) {
  const hasPrice = phone.price && phone.price.trim() !== '';

  return (
    <Link
      to={`/phone/${phone.id}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
    >
      <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
        <img
          src={phone.imgUrl}
          alt={`${phone.brand} ${phone.model}`}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
          {phone.brand}
        </p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {phone.model}
        </h3>
        <p className="text-lg font-bold text-gray-900">
          {hasPrice ? `${phone.price} EUR` : 'Price on request'}
        </p>
      </div>
    </Link>
  );
}
