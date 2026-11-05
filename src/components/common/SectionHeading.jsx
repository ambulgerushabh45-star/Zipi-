import { motion } from 'framer-motion';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-4 ${
        align === 'center' ? 'items-center' : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className={`flex flex-col gap-3 ${alignment}`}>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#00C8FF]">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F8FC]">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-base leading-relaxed text-[#AAB7C7] font-normal">
            {description}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
