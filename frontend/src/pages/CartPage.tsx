import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import Breadcrumbs from '../components/Breadcrumbs';

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const key = `${item.phoneId}-${item.colorCode}-${item.storageCode}`;
            const unitPrice = parseFloat(item.price) || 0;

            return (
              <div key={key} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4">
                <img
                  src={item.imgUrl}
                  alt={`${item.brand} ${item.model}`}
                  className="w-20 h-20 object-contain rounded-lg bg-gray-50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-indigo-600 uppercase">{item.brand}</p>
                  <p className="font-medium text-gray-900 truncate">{item.model}</p>
                  <p className="text-sm text-gray-500">
                    {item.colorName && `Color: ${item.colorName}`}
                    {item.colorName && item.storageName && ' · '}
                    {item.storageName && `Storage: ${item.storageName}`}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <button
                    onClick={() => removeItem(item.phoneId, item.colorCode, item.storageCode)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.phoneId, item.colorCode, item.storageCode, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.phoneId, item.colorCode, item.storageCode, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {unitPrice > 0 ? `${(unitPrice * item.quantity).toFixed(0)} EUR` : '-'}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">{totalPrice.toFixed(0)} EUR</span>
          </div>
        </div>
      )}
    </div>
  );
}
