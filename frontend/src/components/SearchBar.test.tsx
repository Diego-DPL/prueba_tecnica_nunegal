import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders input with placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} resultCount={0} />);
    expect(screen.getByPlaceholderText('Search by brand or model...')).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} resultCount={0} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Samsung' } });
    expect(onChange).toHaveBeenCalledWith('Samsung');
  });

  it('shows result count when there is a search query', () => {
    render(<SearchBar value="Apple" onChange={() => {}} resultCount={3} />);
    expect(screen.getByText('3 results')).toBeInTheDocument();
  });

  it('does not show result count when query is empty', () => {
    render(<SearchBar value="" onChange={() => {}} resultCount={5} />);
    expect(screen.queryByText('5 results')).not.toBeInTheDocument();
  });

  it('shows clear button when there is a query', () => {
    render(<SearchBar value="test" onChange={() => {}} resultCount={1} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', () => {
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} resultCount={1} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
