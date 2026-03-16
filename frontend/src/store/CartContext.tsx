import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import type { CartItem } from '../types';

const STORAGE_KEY = 'phone_shop_cart';
const CART_COUNT_KEY = 'phone_cart_count';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { phoneId: string; colorCode: number; storageCode: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { phoneId: string; colorCode: number; storageCode: number; quantity: number } }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.findIndex(
        (i) =>
          i.phoneId === action.payload.phoneId &&
          i.colorCode === action.payload.colorCode &&
          i.storageCode === action.payload.storageCode,
      );
      if (existing >= 0) {
        const updated = [...state.items];
        updated[existing] = {
          ...updated[existing],
          quantity: updated[existing].quantity + action.payload.quantity,
        };
        return { items: updated };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter(
          (i) =>
            !(
              i.phoneId === action.payload.phoneId &&
              i.colorCode === action.payload.colorCode &&
              i.storageCode === action.payload.storageCode
            ),
        ),
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(
            (i) =>
              !(
                i.phoneId === action.payload.phoneId &&
                i.colorCode === action.payload.colorCode &&
                i.storageCode === action.payload.storageCode
              ),
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          i.phoneId === action.payload.phoneId &&
          i.colorCode === action.payload.colorCode &&
          i.storageCode === action.payload.storageCode
            ? { ...i, quantity: action.payload.quantity }
            : i,
        ),
      };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data
  }
  return { items: [] };
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  cartCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (phoneId: string, colorCode: number, storageCode: number) => void;
  updateQuantity: (phoneId: string, colorCode: number, storageCode: number, quantity: number) => void;
  clearCart: () => void;
  setCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCartCount(): number {
  try {
    const raw = localStorage.getItem(CART_COUNT_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [cartCount, setCartCountState] = useState<number>(loadCartCount);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => {
    const price = parseFloat(i.price) || 0;
    return sum + price * i.quantity;
  }, 0);

  const setCartCount = (count: number) => {
    setCartCountState(count);
    try {
      localStorage.setItem(CART_COUNT_KEY, String(count));
    } catch {
      // ignore
    }
  };

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (phoneId: string, colorCode: number, storageCode: number) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { phoneId, colorCode, storageCode } });
  const updateQuantity = (phoneId: string, colorCode: number, storageCode: number, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { phoneId, colorCode, storageCode, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, totalPrice, cartCount, addItem, removeItem, updateQuantity, clearCart, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
