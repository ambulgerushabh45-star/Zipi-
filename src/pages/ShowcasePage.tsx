import { useParams, useNavigate } from 'react-router-dom';
import CinematicShowcase from '@/components/showcase/CinematicShowcase';

export default function ShowcasePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-black">
      <CinematicShowcase
        productId={id || 'aegis-mk4'}
        onClose={() => navigate('/products')}
        isStandalonePage={true}
      />
    </main>
  );
}

