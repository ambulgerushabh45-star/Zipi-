import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Package,
  Pencil,
  Send,
  Shield,
  Sprout,
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { PRODUCTS, getProduct } from '@/data/products';
import { submitInquiry } from '@/lib/api';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import ContactSuccess from '@/components/contact/ContactSuccess';
import FloatingField from '@/components/contact/FloatingField';
import QuantityStepper from '@/components/contact/QuantityStepper';
import RadarPanel from '@/components/contact/RadarPanel';
import {
  INTEREST_CATEGORIES,
  REQUEST_TYPES,
  STEP_LABELS,
  TIMELINE_OPTIONS,
  countDigits,
  getProductDefaults,
  isValidEmail,
  validateStep1,
  validateStep2,
} from '@/components/contact/ContactConstants';

const VALID_TYPE_IDS = REQUEST_TYPES.map((t) => t.id);

function createInitialForm(searchParams) {
  const rawType = searchParams.get('type');
  const initialType = VALID_TYPE_IDS.includes(rawType) ? rawType : 'order';

  const rawProductId = searchParams.get('product') || '';
  const matchedProduct = rawProductId ? getProduct(rawProductId) : null;
  const defaults = getProductDefaults(matchedProduct, initialType);

  return {
    type: initialType,
    name: '',
    email: '',
    phone: '',
    company: '',
    region: '',
    interests: defaults ? [defaults.interest] : [],
    sector: defaults ? defaults.sector : 'defence',
    quantity: 1,
    timeline: 'Within 1 month',
    product: matchedProduct ? matchedProduct.id : '',
    message: defaults ? defaults.starterMessage : '',
    consent: false,
    website: '', // hidden honeypot
  };
}

function displayValue(val) {
  if (val === undefined || val === null) return 'Not provided';
  const str = String(val).trim();
  return str.length > 0 ? str : 'Not provided';
}

export default function ContactPage() {
  useDocumentTitle('Contact Us');
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const productParam = searchParams.get('product') || '';
  const typeParam = searchParams.get('type') || '';
  const hasProductParam = Boolean(productParam);

  const [formData, setFormData] = useState(() => createInitialForm(searchParams));
  const [showProductPicker, setShowProductPicker] = useState(hasProductParam);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [touched, setTouched] = useState({});
  const [shakeSignal, setShakeSignal] = useState(0);
  const [stepErrors, setStepErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');

  // Sync deep-link query params (?type=dealer&product=<id>)
  useEffect(() => {
    const matchedType = VALID_TYPE_IDS.includes(typeParam) ? typeParam : null;
    const matchedProduct = productParam ? getProduct(productParam) : null;

    if (!matchedType && !productParam) return;

    setShowProductPicker(Boolean(productParam));
    setFormData((prev) => {
      const nextType = matchedType || prev.type;
      const defaults = getProductDefaults(matchedProduct, nextType);
      const currentInterests = Array.isArray(prev.interests) ? prev.interests : [];
      return {
        ...prev,
        type: nextType,
        product: matchedProduct ? matchedProduct.id : prev.product,
        interests: defaults
          ? [...new Set([...currentInterests, defaults.interest])]
          : currentInterests,
        sector: defaults ? defaults.sector : prev.sector,
        message:
          defaults && (!prev.message || prev.message.trim().length < 5)
            ? defaults.starterMessage
            : prev.message,
      };
    });
  }, [typeParam, productParam]);

  const activeRequestType = useMemo(
    () => REQUEST_TYPES.find((item) => item.id === formData?.type) || REQUEST_TYPES[0],
    [formData?.type]
  );

  const selectedProductObj = useMemo(
    () => (formData?.product ? getProduct(formData.product) : null),
    [formData?.product]
  );

  const liveStep1Errors = useMemo(() => validateStep1(formData), [formData]);
  const liveStep2Errors = useMemo(() => validateStep2(formData), [formData]);

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStepErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (submitError) setSubmitError('');
  };

  const handleRequestTypeChange = (nextType) => {
    setFormData((prev) => ({
      ...prev,
      type: nextType,
    }));
    setStepErrors({});
    setSubmitError('');
  };

  const toggleInterest = (interestId) => {
    setFormData((prev) => {
      const list = Array.isArray(prev.interests) ? prev.interests : [];
      const exists = list.includes(interestId);
      const next = exists ? list.filter((id) => id !== interestId) : [...list, interestId];
      return { ...prev, interests: next };
    });
    setStepErrors((prev) => {
      if (!prev.interests) return prev;
      const next = { ...prev };
      delete next.interests;
      return next;
    });
  };

  const handleProductPickerChange = (newProductId) => {
    const product = newProductId ? getProduct(newProductId) : null;
    const defaults = getProductDefaults(product, formData.type);
    setFormData((prev) => {
      const list = Array.isArray(prev.interests) ? prev.interests : [];
      return {
        ...prev,
        product: newProductId,
        interests: defaults ? [...new Set([...list, defaults.interest])] : list,
        sector: defaults ? defaults.sector : prev.sector,
      };
    });
  };

  const goToStep = (targetStep) => {
    if (targetStep === step) return;
    if (targetStep < step) {
      setDirection(-1);
      setStep(targetStep);
      setStepErrors({});
      setSubmitError('');
      return;
    }

    if (step === 1) {
      const errs = validateStep1(formData);
      if (Object.keys(errs).length > 0) {
        setTouched((prev) => ({
          ...prev,
          name: true,
          email: true,
          phone: true,
          company: true,
        }));
        setStepErrors(errs);
        setShakeSignal((n) => n + 1);
        return;
      }
      if (targetStep === 3) {
        const errs2 = validateStep2(formData);
        if (Object.keys(errs2).length > 0) {
          setTouched((prev) => ({ ...prev, interests: true, message: true }));
          setStepErrors(errs2);
          setDirection(1);
          setStep(2);
          return;
        }
      }
    }

    if (step === 2 && targetStep > 2) {
      const errs = validateStep2(formData);
      if (Object.keys(errs).length > 0) {
        setTouched((prev) => ({ ...prev, interests: true, message: true }));
        setStepErrors(errs);
        setShakeSignal((n) => n + 1);
        return;
      }
    }

    setStepErrors({});
    setDirection(1);
    setStep(targetStep);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const errs1 = validateStep1(formData);
    if (Object.keys(errs1).length > 0) {
      setDirection(-1);
      setStep(1);
      setStepErrors(errs1);
      setShakeSignal((n) => n + 1);
      return;
    }

    const errs2 = validateStep2(formData);
    if (Object.keys(errs2).length > 0) {
      setDirection(-1);
      setStep(2);
      setStepErrors(errs2);
      setShakeSignal((n) => n + 1);
      return;
    }

    if (!formData.consent) {
      setStepErrors({ consent: 'Please confirm consent before transmitting to a supervisor.' });
      setShakeSignal((n) => n + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const safeInterests = Array.isArray(formData.interests) ? formData.interests : [];
      const payload = {
        type: formData.type,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        region: formData.region.trim(),
        interests: formData.type === 'support' ? [] : safeInterests,
        quantity: formData.type === 'support' ? 1 : Number(formData.quantity || 1),
        sector: formData.sector || 'defence',
        timeline: formData.type === 'support' ? '' : formData.timeline || '',
        product: formData.product || '',
        message: formData.message.trim(),
        consent: Boolean(formData.consent),
        website: formData.website || '',
      };

      const data = await submitInquiry(payload);
      if (!data?.ref) {
        throw new Error('Server did not return a valid enquiry reference ID.');
      }
      setSubmittedRef(data.ref);
    } catch (err) {
      setSubmitError(err?.message || 'Submission failed. Please verify your inputs and try again.');
      if (err?.fields) {
        setStepErrors(err.fields);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRef('');
    setSubmitError('');
    setStepErrors({});
    setTouched({});
    setShowProductPicker(false);
    setDirection(-1);
    setStep(1);
    setFormData(createInitialForm(new URLSearchParams()));
    if (searchParams.toString()) {
      setSearchParams({});
    }
  };

  const progressWidth = submittedRef ? '100%' : `${(step / 3) * 100}%`;

  const reviewSections = useMemo(() => {
    const safeInterests = Array.isArray(formData?.interests) ? formData.interests : [];
    const categoryNames = INTEREST_CATEGORIES.filter((c) => safeInterests.includes(c.id))
      .map((c) => c.label)
      .join(', ');

    const isSupport = formData?.type === 'support';

    return [
      {
        id: 'request',
        title: 'Request',
        editStep: 1,
        rows: [
          { label: 'Request Type', value: activeRequestType.label },
        ],
      },
      {
        id: 'contact',
        title: 'Contact',
        editStep: 1,
        rows: [
          { label: 'Full Name', value: displayValue(formData?.name) },
          { label: 'Email', value: displayValue(formData?.email) },
          { label: 'Phone / WhatsApp', value: displayValue(formData?.phone) },
          { label: 'Company', value: displayValue(formData?.company) },
        ],
      },
      {
        id: 'location',
        title: 'Location / Territory',
        editStep: 1,
        rows: [
          {
            label: formData?.type === 'dealer' ? 'Territory Covered' : 'City / State / Region',
            value: displayValue(formData?.region),
          },
        ],
      },
      {
        id: 'requirement',
        title: 'Requirement',
        editStep: 2,
        rows: isSupport
          ? [
              { label: 'Support Scope', value: 'Technical Support & Telemetry Assistance' },
              {
                label: 'Hardware System',
                value: selectedProductObj
                  ? `${selectedProductObj.name} (${selectedProductObj.id.toUpperCase()})`
                  : displayValue(formData?.product),
              },
            ]
          : [
              { label: 'Categories', value: displayValue(categoryNames) },
              {
                label: 'Product',
                value: selectedProductObj
                  ? `${selectedProductObj.name} (${selectedProductObj.id.toUpperCase()})`
                  : displayValue(formData?.product),
              },
              {
                label: 'Sector',
                value:
                  formData?.sector === 'agriculture'
                    ? 'Precision Agriculture'
                    : 'Defence & Security ISR',
              },
              { label: 'Quantity', value: String(formData?.quantity || 1) },
              { label: 'Timeline', value: displayValue(formData?.timeline) },
            ],
      },
      {
        id: 'message',
        title: 'Message',
        editStep: 2,
        rows: [
          { label: 'Enquiry Details', value: displayValue(formData?.message), multiline: true },
        ],
      },
    ];
  }, [activeRequestType.label, formData, selectedProductObj]);

  const hasValidReviewState =
    Boolean(formData) &&
    Object.keys(liveStep1Errors).length === 0 &&
    Object.keys(liveStep2Errors).length === 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050b14] text-slate-50 pt-24 sm:pt-28 pb-16">
      {/* Subtle Mission Control Grid & Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[72rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400/10 via-sky-500/10 to-transparent blur-3xl"
      />

      <main className="relative mx-auto max-w-7xl px-4 sm:px-8 py-6 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Mission Control Intro, Radar & Direct Channels */}
          <div className="lg:col-span-5">
            <RadarPanel />
          </div>

          {/* Right Column: 3-Step Animated Form Card */}
          <div className="lg:col-span-7">
            <section
              aria-label="Mission Control Enquiry Form"
              className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-8 backdrop-blur-xl shadow-2xl"
            >
              {submittedRef ? (
                <ContactSuccess referenceId={submittedRef} onReset={handleReset} />
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Hidden Bot Honeypot */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none fixed -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                  >
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={(e) => updateField('website', e.target.value)}
                    />
                  </div>

                  {/* 1. 4-Way Segmented Request Type Selector */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        Request Channel
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        {activeRequestType.badge}
                      </span>
                    </div>

                    <div
                      role="radiogroup"
                      aria-label="Request type"
                      className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-2xl border border-white/10 bg-[#050b14]/75 p-1.5"
                    >
                      {REQUEST_TYPES.map((item) => {
                        const selected = formData.type === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => handleRequestTypeChange(item.id)}
                            className={`relative rounded-xl px-2.5 py-2.5 text-center text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                              selected
                                ? 'text-[#050b14] font-bold'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            {selected && (
                              <motion.span
                                layoutId="requestTypePill"
                                transition={
                                  shouldReduceMotion
                                    ? { duration: 0 }
                                    : { type: 'spring', stiffness: 380, damping: 32 }
                                }
                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                              />
                            )}
                            <span className="relative z-10 block leading-tight">
                              {item.shortLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-xs text-slate-300 px-0.5">{activeRequestType.description}</p>
                  </div>

                  {/* 2. Progress Bar & Step Labels */}
                  <div className="space-y-3 border-y border-white/10 py-4">
                    <div className="grid grid-cols-3 gap-2">
                      {STEP_LABELS.map((item) => {
                        const isActive = step === item.step;
                        const isCompleted = step > item.step;
                        return (
                          <button
                            key={item.step}
                            type="button"
                            onClick={() => goToStep(item.step)}
                            className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                              isActive
                                ? 'text-cyan-300'
                                : isCompleted
                                  ? 'text-slate-200 hover:text-cyan-300'
                                  : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold border transition-colors ${
                                isCompleted
                                  ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-300'
                                  : isActive
                                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                                    : 'border-white/15 bg-white/5 text-slate-400'
                              }`}
                            >
                              {isCompleted ? <Check className="h-3.5 w-3.5" /> : item.step}
                            </span>
                            <span className="font-mono text-[11px] sm:text-xs font-medium truncate">
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={false}
                        animate={{ width: progressWidth }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                      />
                    </div>
                  </div>

                  {/*
                    Note on step rendering (root cause of prior blank Step 3 bug):
                    Avoid wrapping steps in <AnimatePresence mode="wait"> or starting Step 3 at opacity: 0.
                    Step 2 contains nested <AnimatePresence mode="popLayout"> (QuantityStepper) and layoutId
                    pills, which can stall mode="wait" onExitComplete and prevent Step 3 from ever mounting
                    or becoming visible. Rendering the active step directly with opacity: 1 guarantees
                    the Review step and submit controls are always visible.
                  */}
                  <div className="relative">
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        initial={shouldReduceMotion ? false : { x: direction > 0 ? 18 : -18 }}
                        animate={{ x: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FloatingField
                            id="contact-name"
                            name="name"
                            label="Full Name"
                            required
                            autoComplete="name"
                            placeholderHint="Elena Rostova"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            onBlur={() => markTouched('name')}
                            touched={touched.name}
                            shakeSignal={shakeSignal}
                            error={stepErrors.name || liveStep1Errors.name || ''}
                            isValid={formData.name.trim().length >= 2}
                          />

                          <FloatingField
                            id="contact-email"
                            name="email"
                            type="email"
                            label="Work / Official Email"
                            required
                            autoComplete="email"
                            placeholderHint="elena@organization.com"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            onBlur={() => markTouched('email')}
                            touched={touched.email}
                            shakeSignal={shakeSignal}
                            error={stepErrors.email || liveStep1Errors.email || ''}
                            isValid={isValidEmail(formData.email)}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FloatingField
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            label="Phone / WhatsApp"
                            required
                            autoComplete="tel"
                            placeholderHint="+1 619 555 0142"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            onBlur={() => markTouched('phone')}
                            touched={touched.phone}
                            shakeSignal={shakeSignal}
                            error={stepErrors.phone || liveStep1Errors.phone || ''}
                            isValid={countDigits(formData.phone) >= 8}
                          />

                          <FloatingField
                            id="contact-company"
                            name="company"
                            label="Company / Organization"
                            required={activeRequestType.companyRequired}
                            autoComplete="organization"
                            placeholderHint="Enterprise / Agri Entity"
                            value={formData.company}
                            onChange={(e) => updateField('company', e.target.value)}
                            onBlur={() => markTouched('company')}
                            touched={touched.company}
                            shakeSignal={shakeSignal}
                            error={stepErrors.company || liveStep1Errors.company || ''}
                            isValid={
                              formData.company.trim().length >= 2 ||
                              (!activeRequestType.companyRequired &&
                                formData.company.trim().length > 0)
                            }
                          />
                        </div>

                        <FloatingField
                          id="contact-region"
                          name="region"
                          label={
                            formData.type === 'dealer'
                              ? 'Territory Covered'
                              : 'City / State / Region'
                          }
                          placeholderHint={
                            formData.type === 'dealer'
                              ? 'e.g. Pacific Northwest, Western Europe'
                              : 'e.g. Austin, Texas'
                          }
                          value={formData.region}
                          onChange={(e) => updateField('region', e.target.value)}
                          onBlur={() => markTouched('region')}
                          touched={touched.region}
                          isValid={formData.region.trim().length >= 2}
                        />

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => goToStep(2)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#050b14] shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:brightness-110 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                          >
                            <span>Next: Your Need</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        initial={shouldReduceMotion ? false : { x: direction > 0 ? 18 : -18 }}
                        animate={{ x: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                        className="space-y-5"
                      >
                        {formData.type !== 'support' ? (
                          <>
                            {showProductPicker && (
                              <div className="space-y-1.5">
                                <label
                                  htmlFor="contact-product"
                                  className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300"
                                >
                                  <Package className="h-3.5 w-3.5" />
                                  <span>Selected Hardware Platform</span>
                                </label>
                                <select
                                  id="contact-product"
                                  value={formData.product}
                                  onChange={(e) => handleProductPickerChange(e.target.value)}
                                  className="w-full rounded-xl border border-white/15 bg-[#0a1322] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
                                >
                                  <option value="">Any / Multiple Hardware Systems</option>
                                  {PRODUCTS.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name} ({item.id.toUpperCase()})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Multi-select Product Category Chips */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300">
                                  Hardware Categories <span className="text-cyan-400">*</span>
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  Select one or more
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {INTEREST_CATEGORIES.map((cat) => {
                                  const Icon = cat.icon;
                                  const active = formData.interests.includes(cat.id);
                                  return (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      aria-pressed={active}
                                      onClick={() => toggleInterest(cat.id)}
                                      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                                        active
                                          ? 'border-cyan-400/70 bg-cyan-400/15 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.2)]'
                                          : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:text-white'
                                      }`}
                                    >
                                      <Icon
                                        className={`h-3.5 w-3.5 ${
                                          active ? 'text-cyan-300' : 'text-slate-400'
                                        }`}
                                      />
                                      <span>{cat.label}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {(stepErrors.interests ||
                                (touched.interests && liveStep2Errors.interests)) && (
                                <p role="alert" className="text-xs font-medium text-red-400">
                                  {stepErrors.interests || liveStep2Errors.interests}
                                </p>
                              )}
                            </div>

                            {/* Defence / Agriculture Sector Toggle + Animated Quantity Stepper */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                              <div className="space-y-2">
                                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300">
                                  Operational Sector
                                </span>
                                <div
                                  role="radiogroup"
                                  aria-label="Operational sector"
                                  className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#050b14]/75 p-1"
                                >
                                  {[
                                    { id: 'defence', label: 'Defence ISR', icon: Shield },
                                    { id: 'agriculture', label: 'Agriculture', icon: Sprout },
                                  ].map((sec) => {
                                    const SecIcon = sec.icon;
                                    const selected = formData.sector === sec.id;
                                    return (
                                      <button
                                        key={sec.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        onClick={() => updateField('sector', sec.id)}
                                        className={`relative flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                                          selected
                                            ? 'text-[#050b14] font-bold'
                                            : 'text-slate-300 hover:text-white'
                                        }`}
                                      >
                                        {selected && (
                                          <motion.span
                                            layoutId="sectorTogglePill"
                                            transition={
                                              shouldReduceMotion
                                                ? { duration: 0 }
                                                : { type: 'spring', stiffness: 400, damping: 30 }
                                            }
                                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500"
                                          />
                                        )}
                                        <SecIcon className="relative z-10 h-3.5 w-3.5" />
                                        <span className="relative z-10">{sec.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300">
                                  Fleet Quantity (1–999)
                                </span>
                                <QuantityStepper
                                  value={formData.quantity}
                                  onChange={(qty) => updateField('quantity', qty)}
                                />
                              </div>
                            </div>

                            {/* Timeline Chips */}
                            <div className="space-y-2">
                              <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300">
                                Deployment Timeline
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {TIMELINE_OPTIONS.map((option) => {
                                  const active = formData.timeline === option;
                                  return (
                                    <button
                                      key={option}
                                      type="button"
                                      aria-pressed={active}
                                      onClick={() => updateField('timeline', option)}
                                      className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                                        active
                                          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200 font-bold'
                                          : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:text-white'
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-4 text-xs text-slate-200">
                            <span className="font-mono font-bold uppercase tracking-wider text-cyan-300 block mb-1">
                              Technical Support Mode
                            </span>
                            Share your airframe model, controller firmware, or telemetry log summary below for direct engineering assistance.
                          </div>
                        )}

                        {/* Message Box + Counter */}
                        <FloatingField
                          id="contact-message"
                          name="message"
                          as="textarea"
                          rows={4}
                          maxLength={600}
                          required
                          label={
                            formData.type === 'support'
                              ? 'Describe Your Support Issue'
                              : 'Mission Requirements & Details'
                          }
                          placeholderHint="Outline coverage area, payload needs, or technical questions..."
                          value={formData.message}
                          onChange={(e) => updateField('message', e.target.value)}
                          onBlur={() => markTouched('message')}
                          touched={touched.message}
                          shakeSignal={shakeSignal}
                          error={stepErrors.message || liveStep2Errors.message || ''}
                          isValid={
                            formData.message.trim().length >= 10 &&
                            formData.message.trim().length <= 600
                          }
                          rightMeta={
                            <span
                              className={`font-mono text-[11px] ${
                                formData.message.length >= 580
                                  ? 'text-amber-300'
                                  : 'text-slate-400'
                              }`}
                            >
                              {formData.message.length} / 600
                            </span>
                          }
                        />

                        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => goToStep(1)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:bg-white/10 transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => goToStep(3)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#050b14] shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:brightness-110 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                          >
                            <span>Review Enquiry</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step-3"
                        initial={shouldReduceMotion ? false : { x: direction > 0 ? 18 : -18 }}
                        animate={{ x: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                        className="space-y-5"
                      >
                        {!hasValidReviewState ? (
                          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 text-sm text-amber-100 space-y-3">
                            <p className="font-semibold">
                              Some required enquiry details are incomplete or invalid.
                            </p>
                            <button
                              type="button"
                              onClick={() => goToStep(Object.keys(liveStep1Errors).length > 0 ? 1 : 2)}
                              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/50 bg-amber-400/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-100 hover:bg-amber-400/30 transition"
                            >
                              <ArrowLeft className="h-3.5 w-3.5" />
                              <span>Go back</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <div>
                                <h2 className="font-display text-lg font-bold text-slate-50">
                                  Enquiry Summary
                                </h2>
                                <p className="text-xs text-slate-300">
                                  Verify all contact and mission details before dispatching to our supervisor.
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {reviewSections.map((section) => (
                                <div
                                  key={section.id}
                                  className="rounded-2xl border border-white/10 bg-[#050b14]/70 overflow-hidden"
                                >
                                  <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                                      {section.title}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => goToStep(section.editStep)}
                                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[11px] font-semibold text-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-200 transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                                    >
                                      <Pencil className="h-3 w-3" />
                                      <span>Edit</span>
                                    </button>
                                  </div>

                                  <div className="divide-y divide-white/10">
                                    {section.rows.map((row) => (
                                      <div
                                        key={row.label}
                                        className={`px-4 py-2.5 text-xs ${
                                          row.multiline
                                            ? 'space-y-1.5'
                                            : 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1'
                                        }`}
                                      >
                                        <span className="font-mono uppercase tracking-wider text-slate-400">
                                          {row.label}
                                        </span>
                                        <span
                                          className={`font-medium ${
                                            row.value === 'Not provided'
                                              ? 'text-slate-400 italic'
                                              : 'text-slate-100'
                                          } ${
                                            row.multiline
                                              ? 'block whitespace-pre-wrap leading-relaxed'
                                              : 'sm:text-right break-words'
                                          }`}
                                        >
                                          {row.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Sticky Footer inside the Form Card */}
                        <div className="sticky bottom-0 z-10 -mx-4 sm:-mx-8 px-4 sm:px-8 pt-4 pb-2 border-t border-white/10 bg-[#081221]/95 backdrop-blur-md rounded-b-3xl space-y-4">
                          {/* Animated Consent Checkbox */}
                          <div className="space-y-1.5">
                            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 cursor-pointer hover:border-white/20 transition">
                              <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={formData.consent}
                                  onChange={(e) => updateField('consent', e.target.checked)}
                                  className="peer sr-only"
                                />
                                <span
                                  className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-400 ${
                                    formData.consent
                                      ? 'border-cyan-400 bg-gradient-to-r from-cyan-400 to-sky-500 text-[#050b14] shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                                      : 'border-white/25 bg-[#050b14]'
                                  }`}
                                >
                                  {formData.consent && (
                                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                                  )}
                                </span>
                              </span>
                              <span className="text-xs leading-relaxed text-[#f1f5f9]">
                                I authorize ZIPI Drones &amp; Controls supervisors to review this non-weaponized UAV enquiry and contact me via email or phone.
                              </span>
                            </label>

                            {stepErrors.consent && (
                              <p role="alert" className="px-1 text-xs font-medium text-red-400">
                                {stepErrors.consent}
                              </p>
                            )}
                          </div>

                          {/* Inline Error Banner Above Action Buttons */}
                          {submitError && (
                            <div
                              role="alert"
                              className="flex items-start gap-2.5 rounded-xl border border-red-500/50 bg-red-500/10 p-3.5 text-xs text-red-200"
                            >
                              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                              <span>{submitError}</span>
                            </div>
                          )}

                          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => goToStep(2)}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:bg-white/10 disabled:opacity-50 transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              <span>Back</span>
                            </button>

                            <button
                              type="submit"
                              disabled={isSubmitting || !hasValidReviewState}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#050b14] shadow-[0_0_28px_rgba(34,211,238,0.45)] transition hover:brightness-110 disabled:opacity-65 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Transmitting...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4" />
                                  <span>Send to supervisor</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
