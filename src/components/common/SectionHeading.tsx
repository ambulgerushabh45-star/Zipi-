import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
};

export default function SectionHeading({ eyebrow, title, description, align = 'left', action }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-4 ${align === 'center' ? 'items-center' : 'md:flex-row md:items-end md:justify-between'}`}
    >
      <div className={`flex flex-col gap-3 ${alignment}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="text-4xl font-bold sm:text-5xl">{title}</h2>
        {description && <p className="max-w-xl text-base leading-relaxed text-ink-600">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
