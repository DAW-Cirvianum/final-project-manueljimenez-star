import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useContents } from '../../hooks/useContents';

import HeroBanner from '../../components/content/HeroBanner';
import ContentRow from '../../components/content/ContentRow';
import SkeletonRow from '../../components/ui/skeletons/SkeletonRow';
import { GlassCard } from '../../components/ui/GlassCard';
import { Toast } from '../../services/toast/toastActions';

export default function Home() {
  const { t } = useTranslation();
  const { loading: authLoading } = useAuth();
  const { contents, loading, fetchContents } = useContents();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!authLoading && contents.length === 0) {
          fetchContents({ limit: 40, sort: 'rating' });
        }
      } catch (err) {
        Toast.error(t('common.errors.fetch_failed'));
      }
    };
    loadData();
  }, [authLoading, fetchContents, contents.length]);

  const categorizedData = useMemo(() => {
    const safeContents = Array.isArray(contents) ? contents : [];

    const topRated = [...safeContents].sort((a, b) => {
      const rA = parseFloat(a.rating_avg) || 0;
      const rB = parseFloat(b.rating_avg) || 0;

      if (rB !== rA) return rB - rA;
    });
    

    return {
      featured: topRated.slice(0, 6),
      movies: contents.filter(c => c.type === 'movie'),
      series: contents.filter(c => c.type === 'series'),
      games: contents.filter(c => c.type === 'game'),
      recent: [...contents].sort((a, b) => b.id - a.id).slice(0, 10)
    };
  }, [contents]);

  if (authLoading || (loading && contents.length === 0)) {
    return (
      <div className="min-h-screen bg-elarx-black pt-32 px-6 flex flex-col gap-16">
        <div className="h-[60vh] w-full bg-white/[0.02] rounded-[4rem] animate-pulse border border-white/5" />
        <div className="max-w-[1800px] mx-auto w-full space-y-20">
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-elarx-black relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] pointer-events-none z-[50]" />

      <section className="relative z-10 pt-10">
        <div className="px-4 md:px-5 max-w-[1920px] mx-auto">
          <HeroBanner contents={categorizedData.featured} />
        </div>
      </section>

      <div className="relative z-20 -mt-20 md:-mt-22 pb-40 max-w-[1800px] mx-auto flex flex-col gap-12 md:gap-20 px-4 md:px-6">
        {renderSection(t('home.featured_movies'), categorizedData.movies)}
        {renderSection(t('home.trending_series'), categorizedData.series)}
        {renderSection(t('home.games'), categorizedData.games)}
        {renderSection(t('home.recently_added'), categorizedData.recent)}
      </div>
    </main>
  );
}

function renderSection(title, items) {
  if (!items || items.length === 0) return null;
  return (
    <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <GlassCard className="py-10 px-0 md:px-2 rounded-[3.5rem] border-white/5 hover:border-white/10 transition-all duration-700 overflow-hidden">
        <div className="px-8 mb-2">
          <ContentRow title={title} items={items} />
        </div>
      </GlassCard>
    </section>
  );
}