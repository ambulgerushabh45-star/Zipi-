import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProduct } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import SectionHeading from './SectionHeading';

type ProductRowProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  productIds: string[];
  viewAllHref?: string;
};

export default function ProductRow({ id, eyebrow, title, description, productIds, viewAllHref = '/shop' }: ProductRowProps) {
  const products = productIds.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <Link to={viewAllHref} className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-900">
            View all
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        }
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
