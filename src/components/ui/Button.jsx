import { forwardRef, useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Loader2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Advanced Polymorphic Button Component with Magnetic, Ripple, Shimmer, and 3D Press Effects
 */
export const Button = forwardRef(function Button(
  {
    children,
    as,
    to,
    href,
    variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'outline' | 'icon' | 'cart'
    size = 'md', // 'sm' | 'md' | 'lg'
    magnetic = false,
    magneticStrength = 8,
    showArrow = false,
    glowing = false,
    shimmer = false,
    loading = false,
    success = false,
    successText = 'Done',
    disabled = false,
    className = '',
    onClick,
    icon: IconComp,
    ...props
  },
  ref
) {
  const buttonRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);
  const [ripples, setRipples] = useState([]);

  // Detect touch device to disable cursor magnetism
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  // Magnetic spring physics
  const isMagneticActive = magnetic && !isTouch && !shouldReduceMotion && !disabled;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 280, damping: 20 });
  const y = useSpring(rawY, { stiffness: 280, damping: 20 });

  const handleMouseMove = (e) => {
    if (!isMagneticActive) return;
    const target = buttonRef.current || e.currentTarget;
    const rect = target.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    rawX.set(dx * magneticStrength);
    rawY.set(dy * magneticStrength);
  };

  const handleMouseLeave = () => {
    if (isMagneticActive) {
      rawX.set(0);
      rawY.set(0);
    }
  };

  // Click ripple effect
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    if (!isTouch && !shouldReduceMotion) {
      const target = buttonRef.current || e.currentTarget;
      const rect = target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const newRipple = { id: Date.now() + Math.random(), x: clickX, y: clickY };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.(e);
  };

  // Base sizing
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs min-h-[36px]',
    md: 'px-6 py-3 text-xs sm:text-sm min-h-[46px]',
    lg: 'px-8 py-4 text-sm sm:text-base min-h-[54px]',
  }[size] || 'px-6 py-3 text-xs sm:text-sm min-h-[46px]';

  // Variant styling
  const variantClasses = {
    // PRIMARY: Midnight Navy (#101B2B) background, white text, cyan border accent, 3D press
    primary:
      'bg-[#101B2B] text-white border border-[#00C8E8]/40 shadow-[0_4px_20px_rgba(0,200,232,0.18)] hover:bg-[#162438] hover:border-[#00C8E8] hover:shadow-[0_0_28px_rgba(0,200,232,0.4)]',
    // SECONDARY: Pure White (#FFFFFF) background, Navy (#101B2B) text, fine border (#AAB7C6)
    secondary:
      'bg-white text-[#101B2B] border border-[#AAB7C6] shadow-sm hover:border-[#101B2B] hover:shadow-md hover:bg-[#F5F8FC]',
    // ACCENT: Electric Cyan (#00C8E8) background, dark navy (#080F1B) text, subtle glow
    accent:
      'bg-[#00C8E8] text-[#080F1B] font-extrabold border border-transparent shadow-[0_0_24px_rgba(0,200,232,0.4)] hover:brightness-105 hover:shadow-[0_0_35px_rgba(0,200,232,0.6)]',
    // OUTLINE: Transparent background, titanium border, smooth fill on hover
    outline:
      'bg-transparent text-[#F5F8FC] border border-[#AAB7C6]/30 hover:border-[#00C8E8] hover:bg-white/[0.08] hover:text-[#00C8E8]',
    // ICON: Rounded or circular shape with smooth scale
    icon:
      'p-2.5 rounded-full bg-[#101B2B] text-[#F5F8FC] border border-[#AAB7C6]/25 hover:border-[#00C8E8] hover:text-[#00C8E8] hover:scale-105 shadow-sm',
    // CART: High-contrast add-to-cart style
    cart:
      'bg-[#00C8E8] text-[#080F1B] font-bold border border-transparent shadow-[0_0_20px_rgba(0,200,232,0.35)] hover:brightness-110 active:scale-95',
  }[variant];

  const glowingBorderClass = glowing
    ? 'ring-2 ring-[#00C8E8]/50 shadow-[0_0_30px_rgba(0,200,232,0.5)]'
    : '';

  const shimmerClass = shimmer ? 'btn-shimmer' : '';

  const commonClasses = `
    group relative inline-flex items-center justify-center gap-2 rounded-xl
    font-display uppercase tracking-wider font-bold select-none overflow-hidden
    transition-all duration-200 outline-none active:translate-y-[2px] active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${variant !== 'icon' ? sizeClasses : ''}
    ${variantClasses}
    ${glowingBorderClass}
    ${shimmerClass}
    ${className}
  `.trim();

  // Internal Content
  const content = (
    <>
      {/* Click ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-cyan-400/25"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      {/* Loading Spinner */}
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-current" />
          <span>Processing...</span>
        </span>
      ) : success ? (
        <span className="flex items-center gap-2 text-emerald-400">
          <Check className="h-4 w-4" />
          <span>{successText}</span>
        </span>
      ) : (
        <>
          {IconComp && (
            <IconComp className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          )}
          <span>{children}</span>
          {showArrow && (
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          )}
        </>
      )}
    </>
  );

  // Polymorphic Router Link or standard tag
  const Element = to ? Link : href ? 'a' : 'button';
  const elementProps = to
    ? { to, onClick: handleClick, ...props }
    : href
    ? { href, onClick: handleClick, ...props }
    : { type: props.type || 'button', disabled: disabled || loading, onClick: handleClick, ...props };

  // If magnetic, wrap in motion.div or render motion element
  if (isMagneticActive) {
    return (
      <motion.div
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        <Element ref={ref || buttonRef} className={commonClasses} {...elementProps}>
          {content}
        </Element>
      </motion.div>
    );
  }

  return (
    <Element ref={ref || buttonRef} className={commonClasses} {...elementProps}>
      {content}
    </Element>
  );
});

// Dedicated Semantic Helpers
export function PrimaryButton(props) {
  return <Button variant="primary" magnetic showArrow shimmer {...props} />;
}

export function SecondaryButton(props) {
  return <Button variant="secondary" magnetic {...props} />;
}

export function AccentButton(props) {
  return <Button variant="accent" glowing magnetic {...props} />;
}

export function OutlineButton(props) {
  return <Button variant="outline" magnetic {...props} />;
}

export function AnimatedIconButton({ icon: Icon, label, ...props }) {
  return (
    <Button variant="icon" aria-label={label} title={label} icon={Icon} {...props} />
  );
}

export function CartButton({ inCart = false, ...props }) {
  return (
    <Button
      variant="cart"
      icon={ShoppingBag}
      success={inCart}
      successText="Added to Fleet"
      {...props}
    />
  );
}

export default Button;
