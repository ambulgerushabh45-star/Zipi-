import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  Check,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { submitOrder } from '@/lib/api';
import Footer from '@/components/layout/Footer';

const CHECKOUT_STEPS = [
    { id: 1, label: '1. Shipping & Depot' },
    { id: 2, label: '2. Payment Protocol' },
    { id: 3, label: '3. Confirm Order' },
];

export default function CheckoutPage() {
    useDocumentTitle('Checkout');
    const { cart, cartTotal, clearCart } = useShop();
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [stepError, setStepError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [poNumber, setPoNumber] = useState('');
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
        consent: false,
        website: '', // honeypot
    });
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(null);
    const shippingCost = cartTotal > 5000 || shippingMethod === 'standard' ? 0 : 250;
    const estimatedTax = Math.round(cartTotal * 0.05);
    const grandTotal = cartTotal + shippingCost + estimatedTax;

    const goToStep = (nextStep) => {
        setStepError('');
        setSubmitError('');
        if (nextStep > 1 && step === 1) {
            const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country'];
            const missing = required.some((k) => !formData[k]?.trim());
            if (missing) {
                setStepError('Please complete all required operator and depot address fields before continuing.');
                return;
            }
        }
        if (nextStep > 2 && step === 2) {
            if (paymentMethod === 'card' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim())) {
                setStepError('Please fill in your card number, expiration date, and CVC code.');
                return;
            }
            if (paymentMethod === 'po' && !poNumber.trim()) {
                setStepError('Please provide a Purchase Order or Requisition number.');
                return;
            }
        }
        setDirection(nextStep >= step ? 1 : -1);
        setStep(nextStep);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStepError('');
        setSubmitError('');

        if (step < 3) {
            goToStep(step + 1);
            return;
        }

        if (!formData.consent) {
            setSubmitError('Please confirm the consent authorization checkbox before transmitting your order.');
            return;
        }

        setIsSubmitting(true);
        try {
            const items = cart.map((item) => {
                const product = getProduct(item.productId);
                return {
                    productId: item.productId,
                    name: product ? product.name : item.productId,
                    unitPrice: product ? product.price : 0,
                    quantity: item.quantity,
                    color: item.color || '',
                };
            });

            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            const payload = {
                name: fullName,
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                company: formData.organization.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                postalCode: formData.postalCode.trim(),
                country: formData.country.trim() || 'United States',
                notes: formData.notes.trim(),
                items,
                claimedTotal: grandTotal,
                consent: Boolean(formData.consent),
                website: formData.website || '',
            };

            const data = await submitOrder(payload);

            if (!data?.ref) {
                throw new Error('Server did not return an order reference.');
            }

            // Clear cart ONLY AFTER server returns a valid ref
            clearCart();
            setOrderComplete(data.ref);
        } catch (err) {
            console.error('Checkout submission error:', err);
            setSubmitError(
                err?.message || 'Unable to transmit order to mission supervisor. Please verify connection and try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderComplete) {
        return (<div className="min-h-screen bg-[#050b14] text-[#f1f5f9] pt-28 pb-20 px-5 sm:px-8 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full rounded-3xl border border-cyan-400/40 bg-[#0b1a2c] p-8 sm:p-12 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-400 text-cyan-400">
            <CheckCircle2 className="h-8 w-8"/>
          </div>
          <span className="mt-6 inline-block font-mono text-xs text-cyan-400 uppercase tracking-widest">
            ORDER CONFIRMED // LOGISTICS DISPATCH QUEUED
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-[#f1f5f9]">Thank You for Your Order</h2>
          <p className="mt-3 text-sm text-[#94a3b8]">
            Order Reference: <strong className="text-[#f1f5f9] font-mono">{orderComplete}</strong>
          </p>
          <p className="mt-2 text-xs text-[#94a3b8]">
            A confirmation dossier with tracking telemetry and inspection manifests has been dispatched to{' '}
            <strong className="text-[#f1f5f9]">{formData.email || 'your email'}</strong>.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/products" className="rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#031018] hover:brightness-110 transition">
              Return to Catalog
            </Link>
          </div>
        </motion.div>
      </div>);
    }

    if (cart.length === 0) {
        return (<div className="min-h-screen bg-[#050b14] text-[#f1f5f9] pt-28 pb-20 px-5 sm:px-8 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-[#0b1a2c] p-8 sm:p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-600"/>
          <h2 className="mt-4 font-display text-2xl font-bold text-[#f1f5f9]">Your Cart is Empty</h2>
          <p className="mt-2 text-sm text-[#94a3b8]">Add an autonomous system or controller to your cart before proceeding to checkout.</p>
          <Link to="/products" className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#031018] hover:brightness-110 transition">
            Explore Systems
          </Link>
        </div>
      </div>);
    }

    return (<div className="min-h-screen bg-[#050b14] text-[#f1f5f9] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/products" className="flex items-center gap-1 text-xs font-mono text-[#94a3b8] hover:text-white transition">
            <ArrowLeft className="h-4 w-4"/>
            <span>Return to Fleet</span>
          </Link>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#f1f5f9]">
          Secure Fleet Checkout
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">
          Encrypted ZIPI Drones &amp; Controls procurement protected by 256-bit security protocols.
        </p>

        {/* Horizontal Step Progress Bar */}
        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 rounded-2xl border border-white/10 bg-[#08121f] p-2">
          {CHECKOUT_STEPS.map((s) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => (s.id <= step ? goToStep(s.id) : null)}
                className={`relative rounded-xl px-3 py-2.5 text-left font-mono text-[11px] sm:text-xs font-semibold transition ${
                  active ? 'text-[#031018] font-bold' : done ? 'text-cyan-300 cursor-pointer' : 'text-[#94a3b8] cursor-default'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="checkout-step-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9]"
                  />
                )}
                <span className="relative z-10 flex items-center justify-between gap-2">
                  <span className="truncate">{s.label}</span>
                  {done && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                </span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-12 items-start">
          {/* Honeypot field (hidden from genuine users) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="checkout-website">Leave blank</label>
            <input
              id="checkout-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          {/* LEFT COLUMN: SLIDING CHECKOUT STEPS */}
          <div className="lg:col-span-7 overflow-hidden">
            {stepError && (
              <div className="mb-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-xs font-mono text-red-300">
                {stepError}
              </div>
            )}

            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Contact & Organization */}
                  <div className="rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-8">
                    <h2 className="text-lg font-bold font-display text-[#f1f5f9] border-b border-white/10 pb-3 mb-5">
                      1. Operator &amp; Organization Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <label className="block text-[#94a3b8] mb-1">First Name *</label>
                        <input required type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="e.g. Marcus"/>
                      </div>
                      <div>
                        <label className="block text-[#94a3b8] mb-1">Last Name *</label>
                        <input required type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="e.g. Vance"/>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[#94a3b8] mb-1">Organization / Agency / Farm Name (Optional)</label>
                        <input type="text" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="e.g. Horizon ISR Services / GreenValley Farms"/>
                      </div>
                      <div>
                        <label className="block text-[#94a3b8] mb-1">Official Email Address *</label>
                        <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="operator@organization.com"/>
                      </div>
                      <div>
                        <label className="block text-[#94a3b8] mb-1">Phone Number *</label>
                        <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="+1 (555) 019-2834"/>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Destination */}
                  <div className="rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-8">
                    <h2 className="text-lg font-bold font-display text-[#f1f5f9] border-b border-white/10 pb-3 mb-5">
                      2. Shipping &amp; Depot Address
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="sm:col-span-2">
                        <label className="block text-[#94a3b8] mb-1">Street Address *</label>
                        <input required type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="1000 Hangar Bay Road, Suite 4"/>
                      </div>
                      <div>
                        <label className="block text-[#94a3b8] mb-1">City *</label>
                        <input required type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="San Diego"/>
                      </div>
                      <div>
                        <label className="block text-[#94a3b8] mb-1">State / Province / Region *</label>
                        <input required type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="California"/>
                      </div>
                      <div>
                        <label className="block text-[#94a3b8] mb-1">Postal Code *</label>
                        <input required type="text" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="92101"/>
                      </div>
                      <div>
                        <label className="block text-[#94a3b8] mb-1">Country *</label>
                        <input required type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400"/>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[#94a3b8] mb-1">Depot Delivery Notes / Special Instructions (Optional)</label>
                        <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400" placeholder="e.g. Forklift on site, notify receiving depot 2 hours prior to delivery..."/>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="mt-6 pt-5 border-t border-white/10">
                      <p className="text-xs uppercase text-[#94a3b8] font-mono mb-3">Freight Dispatch Option</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <label onClick={() => setShippingMethod('standard')} className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${shippingMethod === 'standard'
                            ? 'border-cyan-400 bg-cyan-500/10 text-[#f1f5f9]'
                            : 'border-white/10 bg-[#08121f] text-[#94a3b8]'}`}>
                          <div>
                            <p className="font-bold text-[#f1f5f9]">Insured Freight Ground</p>
                            <p className="text-[11px] text-[#94a3b8]">3-5 business days</p>
                          </div>
                          <span className="font-mono text-cyan-400 font-bold">FREE</span>
                        </label>

                        <label onClick={() => setShippingMethod('express')} className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${shippingMethod === 'express'
                            ? 'border-cyan-400 bg-cyan-500/10 text-[#f1f5f9]'
                            : 'border-white/10 bg-[#08121f] text-[#94a3b8]'}`}>
                          <div>
                            <p className="font-bold text-[#f1f5f9]">Tactical Air Priority</p>
                            <p className="text-[11px] text-[#94a3b8]">Next-day flight courier</p>
                          </div>
                          <span className="font-mono text-[#f1f5f9] font-bold">{cartTotal > 5000 ? 'FREE' : '$250'}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#031018] shadow-[0_0_24px_rgba(34,211,238,0.4)] hover:brightness-110 transition"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Payment Method Selector */}
                  <div className="rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-8">
                    <h2 className="text-lg font-bold font-display text-[#f1f5f9] border-b border-white/10 pb-3 mb-5">
                      3. Payment Protocol
                    </h2>
                    <div className="grid grid-cols-3 gap-3 text-xs mb-6">
                      <button type="button" onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${paymentMethod === 'card'
                          ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                          : 'border-white/10 bg-[#08121f] text-[#94a3b8] hover:text-white'}`}>
                        <CreditCard className="h-5 w-5"/>
                        <span className="font-bold uppercase tracking-wider text-[11px]">Credit Card</span>
                      </button>

                      <button type="button" onClick={() => setPaymentMethod('po')} className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${paymentMethod === 'po'
                          ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                          : 'border-white/10 bg-[#08121f] text-[#94a3b8] hover:text-white'}`}>
                        <Building className="h-5 w-5"/>
                        <span className="font-bold uppercase tracking-wider text-[11px]">Purchase Order</span>
                      </button>

                      <button type="button" onClick={() => setPaymentMethod('wire')} className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${paymentMethod === 'wire'
                          ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                          : 'border-white/10 bg-[#08121f] text-[#94a3b8] hover:text-white'}`}>
                        <Lock className="h-5 w-5"/>
                        <span className="font-bold uppercase tracking-wider text-[11px]">Wire Transfer</span>
                      </button>
                    </div>

                    {paymentMethod === 'card' && (<div className="space-y-4 text-xs font-mono">
                        <div>
                          <label className="block text-[#94a3b8] mb-1">Card Number *</label>
                          <input required type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4000 1234 5678 9010" className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400 font-mono"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#94a3b8] mb-1">Expiration (MM/YY) *</label>
                            <input required type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="12/28" className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400 font-mono"/>
                          </div>
                          <div>
                            <label className="block text-[#94a3b8] mb-1">CVC Security Code *</label>
                            <input required type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="842" className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400 font-mono"/>
                          </div>
                        </div>
                      </div>)}

                    {paymentMethod === 'po' && (<div className="space-y-3 text-xs font-mono">
                        <label className="block text-[#94a3b8]">PO Number / Enterprise Requisition Code *</label>
                        <input required type="text" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="PO-2026-ZIPI-9981" className="w-full rounded-xl border border-white/15 bg-[#08121f] p-3 text-[#f1f5f9] focus:outline-none focus:border-cyan-400"/>
                        <p className="text-[11px] text-[#94a3b8]">Invoice Net 30 will be issued upon shipment clearance.</p>
                      </div>)}

                    {paymentMethod === 'wire' && (<div className="rounded-xl border border-white/10 bg-[#08121f] p-4 text-xs font-mono space-y-2 text-[#94a3b8]">
                        <p className="font-bold text-cyan-400">Direct Escrow Wire Details:</p>
                        <p>Bank: J.P. Morgan Commercial Robotics Division</p>
                        <p>Routing (ABA): 122000496</p>
                        <p>Account: 4892019984</p>
                        <p>Swift / BIC: CHASUS33XXX</p>
                      </div>)}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={() => goToStep(1)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#f1f5f9] hover:border-white/30 transition">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Shipping</span>
                    </button>
                    <button type="button" onClick={() => goToStep(3)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#031018] shadow-[0_0_24px_rgba(34,211,238,0.4)] hover:brightness-110 transition">
                      <span>Review &amp; Confirm</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="rounded-3xl border border-cyan-400/30 bg-[#0b1a2c] p-6 sm:p-8 space-y-5">
                    <h2 className="text-lg font-bold font-display text-[#f1f5f9] border-b border-white/10 pb-3">
                      Final Manifest Verification
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 text-xs font-mono">
                      <div className="rounded-2xl border border-white/10 bg-[#08121f] p-4 space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-cyan-400">Operator &amp; Depot</span>
                        <p className="text-sm font-bold text-[#f1f5f9]">{formData.firstName} {formData.lastName}</p>
                        {formData.organization && <p className="text-[#94a3b8]">{formData.organization}</p>}
                        <p className="text-[#94a3b8]">{formData.email} · {formData.phone}</p>
                        <p className="text-[#94a3b8] pt-1">{formData.address}, {formData.city}, {formData.state} {formData.postalCode}, {formData.country}</p>
                        {formData.notes && (
                          <div className="pt-2 border-t border-white/10 mt-2 text-[#94a3b8]">
                            <span className="text-[10px] text-cyan-400 block uppercase">Depot Instructions:</span>
                            <p className="italic text-[#cbd5e1]">{formData.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-[#08121f] p-4 space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-cyan-400">Logistics &amp; Settlement</span>
                        <p className="text-sm font-bold text-[#f1f5f9]">{shippingMethod === 'express' ? 'Tactical Air Priority' : 'Insured Freight Ground'}</p>
                        <p className="text-[#94a3b8]">Method: {paymentMethod === 'card' ? 'Corporate / Credit Card' : paymentMethod === 'po' ? `Purchase Order (${poNumber})` : 'Escrow Wire Transfer'}</p>
                      </div>
                    </div>

                    {/* Consent Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group select-none rounded-2xl border border-white/10 bg-[#08121f] p-4 transition hover:border-cyan-400/40">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="sr-only"
                      />
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          formData.consent
                            ? 'border-cyan-400 bg-cyan-500 text-[#031018]'
                            : 'border-white/20 bg-black/40 group-hover:border-white/40'
                        }`}
                      >
                        {formData.consent && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <div className="text-xs text-[#94a3b8]">
                        <span className="font-semibold text-[#f1f5f9]">Authorize Mission Order Dispatch</span>
                        <p className="mt-0.5 text-[11px] leading-relaxed">
                          I confirm this procurement is for non-weaponized commercial or civil flight operations, and authorize ZIPI mission logistics to process this requisition with our designated depot.
                        </p>
                      </div>
                    </label>

                    {/* Submission Error Banner */}
                    {submitError && (
                      <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-xs font-mono text-red-300 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-bold">Transmission Failed</p>
                          <p className="mt-0.5">{submitError}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={() => goToStep(2)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#f1f5f9] hover:border-white/30 transition">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Payment</span>
                    </button>
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#031018] shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:brightness-110 transition disabled:opacity-50">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                      <span>{isSubmitting ? 'Authenticating Order...' : `Authorize Order (${formatPrice(grandTotal)})`}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY & SUBMIT */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-[#0b1a2c] p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold font-display text-[#f1f5f9] border-b border-white/10 pb-4">
                Order Manifest ({cart.length} Models)
              </h2>

              <ul className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {cart.map((item) => {
            const product = getProduct(item.productId);
            if (!product)
                return null;
            return (<li key={`${item.productId}-${item.color}`} className="flex gap-3 text-xs">
                      <img src={product.image} alt={product.name} loading="lazy" className="h-14 w-14 rounded-lg object-cover bg-[#050b14] border border-white/10 flex-shrink-0"/>
                      <div className="flex-1">
                        <p className="font-bold text-[#f1f5f9] leading-tight">{product.name}</p>
                        <p className="text-[#94a3b8] font-mono text-[11px]">
                          Qty: {item.quantity} × {formatPrice(product.price)}
                        </p>
                        <span className="text-[10px] text-cyan-400 font-mono">{item.color}</span>
                      </div>
                      <span className="font-bold font-mono text-[#f1f5f9]">
                        {formatPrice(product.price * item.quantity)}
                      </span>
                    </li>);
        })}
              </ul>

              {/* Price Calculations */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Hardware Subtotal:</span>
                  <span className="text-[#f1f5f9]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Insured Transport:</span>
                  <span className="text-cyan-400">{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Estimated Tax / Duty:</span>
                  <span className="text-[#f1f5f9]">{formatPrice(estimatedTax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#f1f5f9] border-t border-white/10 pt-3">
                  <span>Total Amount Due:</span>
                  <span className="font-display text-xl text-cyan-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Security Seal */}
              <div className="flex items-center gap-2 rounded-xl bg-[#08121f] border border-white/5 p-3 text-[11px] text-[#94a3b8] font-mono">
                <ShieldCheck className="h-4 w-4 text-cyan-400 flex-shrink-0"/>
                <span>2-Year Manufacturer Warranty &amp; RTK Factory Flight Calibration Included.</span>
              </div>

              {submitError && step === 3 && (
                <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-[11px] font-mono text-red-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <span className="truncate">{submitError}</span>
                </div>
              )}

              {step === 3 ? (
                <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-gradient-to-r from-[#22d3ee] to-[#0ea5e9] py-4 text-xs font-bold uppercase tracking-wider text-[#031018] shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:brightness-110 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4"/>}
                  <span>{isSubmitting ? 'Authenticating Order...' : `Authorize Order (${formatPrice(grandTotal)})`}</span>
                </button>
              ) : (
                <button type="button" onClick={() => goToStep(step + 1)} className="w-full rounded-full border border-cyan-400/40 bg-cyan-400/10 py-3.5 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-400 hover:text-[#031018] transition flex items-center justify-center gap-2">
                  <span>{step === 1 ? 'Next: Payment Protocol' : 'Next: Confirm Order'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>);
}
