import dynamic from 'next/dynamic';

// Lazy loading de componentes pesados
export const LazyFeaturesSection = dynamic(
  () => import('../features/landing/components/FeaturesSection').then(mod => ({ default: mod.FeaturesSection })),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-slate-800/50 rounded-xl mx-4 my-8" />
    ),
    ssr: false,
  }
);

export const LazyCTASection = dynamic(
  () => import('../features/landing/components/CTASection').then(mod => ({ default: mod.CTASection })),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-slate-800/50 rounded-xl mx-4 my-8" />
    ),
    ssr: false,
  }
);