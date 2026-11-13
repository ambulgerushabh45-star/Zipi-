import { Link } from 'react-router-dom';
import { getProduct } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import SectionHeading from './SectionHeading';
import { Carousel } from '@/components/motion';

export default function ProductRow({
  id,
  eyebrow,
  title,
  description,
  productIds,
  viewAllHref = '/products',
}) {
  const products = productIds.map(getProduct).filter(Boolean);

  return (
    <section
      id={id}
      className="mx-auto max-w-7xl scroll-mt-24 border-t border-white/10 px-5 py-20 sm:px-8"
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <Link
            to={viewAllHref}
            className="inline-flex min-h-[44px] items-center font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 hover:text-sky-300 transition-colors"
          >
            View Complete Fleet
          </Link>
        }
      />

      <div className="mt-10">
        <Carousel
          items={products}
          label="Featured drone systems"
          renderItem={(product, i) => <ProductCard product={product} index={i} />}
        />
      </div>
    </section>
  );
}
