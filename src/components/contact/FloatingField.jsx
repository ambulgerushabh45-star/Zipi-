import { useEffect, useState } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

export default function FloatingField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  as = 'input',
  rows = 4,
  maxLength,
  required = false,
  error = '',
  isValid = false,
  touched = false,
  autoComplete,
  placeholderHint = '',
  shakeSignal = 0,
  rightMeta = null,
}) {
  const [focused, setFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const shakeControls = useAnimationControls();

  const hasValue = String(value ?? '').length > 0;
  const isFloating = focused || hasValue;
  const showError = Boolean(error) && (touched || shakeSignal > 0);
  const showValid = Boolean(isValid) && !showError && hasValue;

  useEffect(() => {
    if (shakeSignal > 0 && showError && !shouldReduceMotion) {
      shakeControls.start({
        x: [0, -6, 6, -4, 4, 0],
        transition: { duration: 0.32, ease: 'easeInOut' },
      });
    }
  }, [shakeSignal, showError, shouldReduceMotion, shakeControls]);

  const baseInputClass =
    'peer w-full bg-transparent px-4 pt-6 pb-2.5 text-sm text-slate-50 placeholder-transparent outline-none transition-colors disabled:opacity-60';

  return (
    <div className="space-y-1.5">
      <motion.div
        animate={shakeControls}
        className={`relative rounded-xl border bg-white/[0.04] backdrop-blur-md transition-all duration-200 ${
          showError
            ? 'border-red-500/70 focus-within:ring-2 focus-within:ring-red-400/40'
            : focused
              ? 'border-cyan-400/60 shadow-[0_0_24px_rgba(34,211,238,0.18)] focus-within:ring-2 focus-within:ring-cyan-400/40'
              : 'border-white/10 hover:border-white/20'
        }`}
      >
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all duration-200 ${
            isFloating
              ? `top-2 text-[10px] font-mono uppercase tracking-[0.18em] ${
                  showError
                    ? 'text-red-400'
                    : focused
                      ? 'text-cyan-300'
                      : 'text-slate-400'
                }`
              : 'top-4 text-sm text-slate-400'
          }`}
        >
          {label}
          {required && <span className="ml-1 text-cyan-400">*</span>}
        </label>

        {as === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? `${id}-error` : undefined}
            placeholder={focused && placeholderHint ? placeholderHint : label}
            className={`${baseInputClass} resize-y min-h-[116px] pr-10 ${
              focused && placeholderHint ? 'placeholder:text-slate-400/80' : ''
            }`}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            maxLength={maxLength}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? `${id}-error` : undefined}
            placeholder={focused && placeholderHint ? placeholderHint : label}
            className={`${baseInputClass} pr-10 ${
              focused && placeholderHint ? 'placeholder:text-slate-400/80' : ''
            }`}
          />
        )}

        {/* Right status icon */}
        <div className="pointer-events-none absolute right-3.5 top-4 flex items-center gap-1.5">
          {showValid && (
            <motion.span
              initial={shouldReduceMotion ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40"
              aria-hidden="true"
            >
              <Check className="h-3 w-3" />
            </motion.span>
          )}
          {showError && (
            <span className="flex h-5 w-5 items-center justify-center text-red-400" aria-hidden="true">
              <AlertCircle className="h-4 w-4" />
            </span>
          )}
        </div>

        {/* Glowing cyan focus underline sweep */}
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
          style={{ originX: 0 }}
          className={`pointer-events-none absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-gradient-to-r ${
            showError
              ? 'from-red-400 to-rose-500 shadow-[0_0_12px_rgba(248,113,113,0.7)]'
              : 'from-cyan-400 to-sky-500 shadow-[0_0_14px_rgba(34,211,238,0.8)]'
          }`}
        />
      </motion.div>

      {(showError || rightMeta) && (
        <div className="flex items-start justify-between gap-2 px-1 text-xs">
          {showError ? (
            <p id={`${id}-error`} role="alert" className="text-red-400 font-medium">
              {error}
            </p>
          ) : (
            <span />
          )}
          {rightMeta}
        </div>
      )}
    </div>
  );
}
