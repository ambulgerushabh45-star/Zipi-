import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';
import Footer from '@/components/layout/Footer';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useShop();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'po' | 'wire'>('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    notes: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const shippingCost = cartTotal > 5000 || shippingMethod === 'standard' ? 0 : 250;
  const estimatedTax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + shippingCost + estimatedTax;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Realistic processing
    setTimeout(() => {
      const orderId = `ZIPI-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      setIsSubmitting(false);
      setOrderComplete(orderId);
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-20 px-5 sm:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full rounded-3xl border border-cyan-500/40 bg-neutral-900 p-8 sm:p-12 text-center shadow-2xl"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-950/60 border border-cyan-400 text-cyan-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <span className="mt-6 inline-block font-mono text-xs text-cyan-400 uppercase tracking-widest">
            ORDER CONFIRMED // LOGISTICS DISPATCH QUEUED
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold">Thank You for Your Order</h2>
          <p className="mt-3 text-sm text-zinc-300">
            Order Reference: <strong className="text-white font-mono">{orderComplete}</strong>
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            A confirmation dossier with tracking telemetry and inspection manifests has been dispatched to{' '}
            <strong className="text-white">{formData.email || 'your email'}</strong>.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/products"
              className="rounded-full bg-cyan-400 px-7 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300 transition"
            >
              Return to Catalog
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-20 px-5 sm:px-8 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-neutral-900 p-8 sm:p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-zinc-600" />
          <h2 className="mt-4 font-display text-2xl font-bold">Your Cart is Empty</h2>
          <p className="mt-2 text-sm text-zinc-400">Add an aircraft system to your cart before proceeding to checkout.</p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-full bg-cyan-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-300"
          >
            Explore Systems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/products" className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Fleet</span>
          </Link>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Secure Aerospace Checkout
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Encrypted procurement transaction protected by 256-bit security protocols.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN: CUSTOMER & SHIPPING INFORMATION */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact & Organization */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
              <h2 className="text-lg font-bold font-display text-white border-b border-white/10 pb-3 mb-5">
                1. Operator &amp; Organization Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-400 mb-1">First Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Marcus"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Last Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Vance"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Organization / Agency / Farm Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Aerial Defense Solutions LLC / GreenValley Farms"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Official Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="operator@organization.com"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
              <h2 className="text-lg font-bold font-display text-white border-b border-white/10 pb-3 mb-5">
                2. Shipping &amp; Depot Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Street Address *</label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="1000 Hangar Bay Road, Suite 4"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">City *</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="San Diego"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">State / Province / Region *</label>
                  <input
                    required
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="California"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Postal Code *</label>
                  <input
                    required
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="92101"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Country *</label>
                  <input
                    required
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs uppercase text-zinc-400 font-mono mb-3">Freight Dispatch Option</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${shippingMethod === 'standard'
                        ? 'border-cyan-400 bg-cyan-950/30 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-400'
                      }`}
                  >
                    <div>
                      <p className="font-bold text-white">Insured Freight Ground</p>
                      <p className="text-[11px] text-zinc-400">3-5 business days</p>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold">FREE</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${shippingMethod === 'express'
                        ? 'border-cyan-400 bg-cyan-950/30 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-400'
                      }`}
                  >
                    <div>
                      <p className="font-bold text-white">Tactical Air Priority</p>
                      <p className="text-[11px] text-zinc-400">Next-day flight courier</p>
                    </div>
                    <span className="font-mono text-white font-bold">{cartTotal > 5000 ? 'FREE' : '$250'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
              <h2 className="text-lg font-bold font-display text-white border-b border-white/10 pb-3 mb-5">
                3. Payment Protocol
              </h2>
              <div className="grid grid-cols-3 gap-3 text-xs mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${paymentMethod === 'card'
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('po')}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${paymentMethod === 'po'
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                >
                  <Building className="h-5 w-5" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">Purchase Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wire')}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${paymentMethod === 'wire'
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                >
                  <Lock className="h-5 w-5" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">Wire Transfer</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-zinc-400 mb-1">Card Number</label>
                    <input
                      required
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1">Expiration (MM/YY)</label>
                      <input
                        required
                        type="text"
                        placeholder="12/28"
                        className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">CVC Security Code</label>
                      <input
                        required
                        type="text"
                        placeholder="842"
                        className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'po' && (
                <div className="space-y-3 text-xs font-mono">
                  <label className="block text-zinc-400">PO Number / Defense Requisition Code</label>
                  <input
                    required
                    type="text"
                    placeholder="PO-2026-USAF-9981"
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-zinc-500">Invoice Net 30 will be issued upon shipment clearance.</p>
                </div>
              )}

              {paymentMethod === 'wire' && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs font-mono space-y-2 text-zinc-300">
                  <p className="font-bold text-cyan-400">Direct Aerospace Escrow Wire Details:</p>
                  <p>Bank: J.P. Morgan Aerospace Division</p>
                  <p>Routing (ABA): 122000496</p>
                  <p>Account: 4892019984</p>
                  <p>Swift / BIC: CHASUS33XXX</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY & SUBMIT */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold font-display text-white border-b border-white/10 pb-4">
                Order Manifest ({cart.length} Models)
              </h2>

              <ul className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {cart.map((item) => {
                  const product = getProduct(item.productId);
                  if (!product) return null;
                  return (
                    <li key={`${item.productId}-${item.color}`} className="flex gap-3 text-xs">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 rounded-lg object-cover bg-black border border-white/10 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-white leading-tight">{product.name}</p>
                        <p className="text-zinc-400 font-mono text-[11px]">
                          Qty: {item.quantity} × {formatPrice(product.price)}
                        </p>
                        <span className="text-[10px] text-cyan-400 font-mono">{item.color}</span>
                      </div>
                      <span className="font-bold font-mono text-white">
                        {formatPrice(product.price * item.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Price Calculations */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Hardware Subtotal:</span>
                  <span className="text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Insured Transport:</span>
                  <span className="text-cyan-400">{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated Tax / Duty:</span>
                  <span className="text-white">{formatPrice(estimatedTax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-3">
                  <span>Total Amount Due:</span>
                  <span className="font-display text-xl text-cyan-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Security Seal */}
              <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-[11px] text-zinc-400 font-mono">
                <ShieldCheck className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                <span>2-Year Manufacturer Warranty &amp; RTK Factory Flight Calibration Included.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-cyan-400 py-4 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_24px_rgba(0,229,255,0.6)] hover:bg-cyan-300 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" />
                <span>{isSubmitting ? 'Authenticating Order...' : `Authorize Order (${formatPrice(grandTotal)})`}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
