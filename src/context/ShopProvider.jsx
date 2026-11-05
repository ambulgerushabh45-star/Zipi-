import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PRODUCTS, getProduct } from '@/data/products';
import { ShopContext } from './shop-context';
const STORAGE_KEY = 'zipi.shop.v1';
const MAX_COMPARE = 3;
const MAX_QTY = 10;
const EMPTY = { cart: [], wishlist: [], compare: [] };
const isKnownProduct = (id) => typeof id === 'string' && PRODUCTS.some((p) => p.id === id);
function loadState() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return EMPTY;
        const parsed = JSON.parse(raw);
        const cart = Array.isArray(parsed.cart)
            ? parsed.cart.filter((item) => isKnownProduct(item?.productId) &&
                typeof item.color === 'string' &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0 &&
                item.quantity <= MAX_QTY)
            : [];
        const wishlist = Array.isArray(parsed.wishlist) ? parsed.wishlist.filter(isKnownProduct) : [];
        const compare = Array.isArray(parsed.compare)
            ? parsed.compare.filter(isKnownProduct).slice(0, MAX_COMPARE)
            : [];
        return { cart, wishlist: [...new Set(wishlist)], compare: [...new Set(compare)] };
    }
    catch {
        return EMPTY;
    }
}
export function ShopProvider({ children }) {
    const [persisted, setPersisted] = useState(loadState);
    const [toasts, setToasts] = useState([]);
    const toastId = useRef(0);
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
        }
        catch {
            /* storage can be unavailable in private mode; the session still works */
        }
    }, [persisted]);
    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const notify = useCallback((message, tone = 'success') => {
        toastId.current += 1;
        const id = toastId.current;
        setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
        window.setTimeout(() => dismissToast(id), 3200);
    }, [dismissToast]);
    const addToCart = useCallback((productId, color, quantity = 1) => {
        const product = getProduct(productId);
        if (!product)
            return;
        setPersisted((prev) => {
            const existing = prev.cart.find((i) => i.productId === productId && i.color === color);
            const cart = existing
                ? prev.cart.map((i) => i === existing ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i)
                : [...prev.cart, { productId, color, quantity: Math.min(MAX_QTY, quantity) }];
            return { ...prev, cart };
        });
        notify(`${product.name} added to your cart`);
    }, [notify]);
    const removeFromCart = useCallback((productId, color) => {
        setPersisted((prev) => ({
            ...prev,
            cart: prev.cart.filter((i) => !(i.productId === productId && i.color === color)),
        }));
    }, []);
    const updateQuantity = useCallback((productId, color, quantity) => {
        const next = Math.max(1, Math.min(MAX_QTY, Math.round(quantity)));
        setPersisted((prev) => ({
            ...prev,
            cart: prev.cart.map((i) => i.productId === productId && i.color === color ? { ...i, quantity: next } : i),
        }));
    }, []);
    const clearCart = useCallback(() => {
        setPersisted((prev) => ({ ...prev, cart: [] }));
    }, []);
    const toggleWishlist = useCallback((productId) => {
        const product = getProduct(productId);
        const saved = persisted.wishlist.includes(productId);
        setPersisted((prev) => ({
            ...prev,
            wishlist: saved
                ? prev.wishlist.filter((id) => id !== productId)
                : [...prev.wishlist, productId],
        }));
        if (product) {
            notify(saved ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`, saved ? 'info' : 'success');
        }
    }, [persisted.wishlist, notify]);
    const removeFromCompare = useCallback((productId) => {
        setPersisted((prev) => ({ ...prev, compare: prev.compare.filter((id) => id !== productId) }));
    }, []);
    const toggleCompare = useCallback((productId) => {
        const product = getProduct(productId);
        if (!product)
            return false;
        if (persisted.compare.includes(productId)) {
            removeFromCompare(productId);
            notify(`${product.name} removed from comparison`, 'info');
            return true;
        }
        if (persisted.compare.length >= MAX_COMPARE) {
            notify(`You can compare up to ${MAX_COMPARE} drones. Remove one first.`, 'error');
            return false;
        }
        setPersisted((prev) => ({ ...prev, compare: [...prev.compare, productId] }));
        notify(`${product.name} added to comparison`);
        return true;
    }, [persisted.compare, removeFromCompare, notify]);
    const cartCount = useMemo(() => persisted.cart.reduce((sum, i) => sum + i.quantity, 0), [persisted.cart]);
    const cartTotal = useMemo(() => persisted.cart.reduce((sum, i) => {
        const product = getProduct(i.productId);
        return sum + (product ? product.price * i.quantity : 0);
    }, 0), [persisted.cart]);
    const value = useMemo(() => ({
        cart: persisted.cart,
        cartCount,
        cartTotal,
        wishlist: persisted.wishlist,
        compare: persisted.compare,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        toggleCompare,
        removeFromCompare,
        notify,
        dismissToast,
    }), [
        persisted,
        cartCount,
        cartTotal,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        toggleCompare,
        removeFromCompare,
        notify,
        dismissToast,
    ]);
    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
