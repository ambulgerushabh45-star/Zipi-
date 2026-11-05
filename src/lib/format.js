export function formatPrice(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(amount);
}
export function discountPercent(price, originalPrice) {
    if (!originalPrice || originalPrice <= price)
        return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
}
