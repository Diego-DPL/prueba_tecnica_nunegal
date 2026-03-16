import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePhoneDetail } from '../hooks/usePhones';
import { useCart } from '../store/CartContext';
import { addToCart } from '../api/phoneApi';
import Breadcrumbs from '../components/Breadcrumbs';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { phone, loading, error } = usePhoneDetail(id!);
  const { addItem, setCartCount } = useCart();

  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const colors = phone?.options?.colors ?? [];
  const storages = phone?.options?.storages ?? [];

  // Auto-select when there is only one option available
  useEffect(() => {
    if (!phone) return;
    if (colors.length === 1) setSelectedColor(colors[0].code);
    if (storages.length === 1) setSelectedStorage(storages[0].code);
  }, [phone]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Spinner />;
  if (error || !phone) return <ErrorMessage message={error || 'Phone not found'} />;
  const hasPrice = phone.price && phone.price.trim() !== '';

  const canAdd =
    (colors.length === 0 || selectedColor !== null) &&
    (storages.length === 0 || selectedStorage !== null);

  const handleAddToCart = async () => {
    if (!canAdd) return;
    setAdding(true);
    setAddSuccess(false);

    const colorCode = selectedColor ?? colors[0]?.code ?? 0;
    const storageCode = selectedStorage ?? storages[0]?.code ?? 0;
    const colorName = colors.find((c) => c.code === colorCode)?.name ?? '';
    const storageName = storages.find((s) => s.code === storageCode)?.name ?? '';

    try {
      const result = await addToCart(phone.id, colorCode, storageCode);
      setCartCount(result.count);
      addItem({
        phoneId: phone.id,
        brand: phone.brand,
        model: phone.model,
        price: phone.price,
        imgUrl: phone.imgUrl,
        colorCode,
        colorName,
        storageCode,
        storageName,
        quantity: 1,
      });
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    } catch {
      // Cart API may fail but local state is still updated
      addItem({
        phoneId: phone.id,
        brand: phone.brand,
        model: phone.model,
        price: phone.price,
        imgUrl: phone.imgUrl,
        colorCode,
        colorName,
        storageCode,
        storageName,
        quantity: 1,
      });
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  const specs = [
    { label: 'Brand', value: phone.brand },
    { label: 'Model', value: phone.model },
    { label: 'Price', value: hasPrice ? `${phone.price} EUR` : 'Price on request' },
    { label: 'CPU', value: phone.cpu },
    { label: 'RAM', value: phone.ram },
    { label: 'OS', value: phone.os },
    { label: 'Screen resolution', value: phone.displayResolution },
    { label: 'Battery', value: phone.battery },
    { label: 'Primary camera', value: phone.primaryCamera?.join(', ') },
    { label: 'Secondary camera', value: phone.secondaryCmera?.join(', ') },
    { label: 'Dimensions', value: phone.dimentions },
    { label: 'Weight', value: phone.weight ? `${phone.weight} g` : '' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: `${phone.brand} ${phone.model}` },
        ]}
      />

      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to list
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center">
          <img
            src={phone.imgUrl}
            alt={`${phone.brand} ${phone.model}`}
            className="max-w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Details + Actions */}
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-1">
              {phone.brand}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{phone.model}</h1>
            <p className="text-2xl font-bold text-gray-900">
              {hasPrice ? `${phone.price} EUR` : 'Price on request'}
            </p>
          </div>

          {/* Specs */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
            <dl className="space-y-3">
              {specs.map(
                (spec) =>
                  spec.value && (
                    <div key={spec.label} className="flex justify-between items-start gap-4">
                      <dt className="text-sm text-gray-500 shrink-0">{spec.label}</dt>
                      <dd className="text-sm text-gray-900 text-right">{spec.value}</dd>
                    </div>
                  ),
              )}
            </dl>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            {/* Storage selector */}
            {storages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage
                </label>
                <div className="flex flex-wrap gap-2">
                  {storages.map((s) => (
                    <button
                      key={s.code}
                      onClick={() => setSelectedStorage(s.code)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedStorage === s.code
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setSelectedColor(c.code)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedColor === c.code
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!canAdd || adding}
              className={`w-full py-3 rounded-xl text-white font-semibold text-base transition-all ${
                addSuccess
                  ? 'bg-green-600'
                  : canAdd && !adding
                    ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                    : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {adding ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </span>
              ) : addSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added to cart!
                </span>
              ) : (
                'Add to cart'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
