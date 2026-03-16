import { useState, useMemo } from 'react';
import { usePhones } from '../hooks/usePhones';
import SearchBar from '../components/SearchBar';
import PhoneCard from '../components/PhoneCard';
import Breadcrumbs from '../components/Breadcrumbs';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

const PAGE_SIZE = 16;

export default function ProductListPage() {
  const { phones, loading, error } = usePhones();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (!search.trim()) return phones;
    const q = search.toLowerCase();
    return phones.filter(
      (p) =>
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q),
    );
  }, [phones, search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  };

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          All Phones
        </h1>
        <SearchBar value={search} onChange={handleSearchChange} resultCount={filtered.length} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No phones found for "{search}"</p>
          <button onClick={() => setSearch('')} className="mt-3 text-indigo-600 hover:text-indigo-700 font-medium">
            Clear search
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((phone) => (
              <PhoneCard key={phone.id} phone={phone} />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-400">
              Showing {visible.length} of {filtered.length} phones
            </p>
            {hasMore && (
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-8 py-3 rounded-xl border border-indigo-200 bg-white text-indigo-600 font-semibold hover:bg-indigo-50 hover:border-indigo-400 active:scale-[0.98] transition-all"
              >
                Load more
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
