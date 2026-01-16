import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useContents } from '../../hooks/useContents';
import { contentService } from '../../services/contentService';
import { Toast } from '../../services/toast/toastActions';

const ContentCard = React.lazy(() => import('../../components/content/ContentCard'));
import { GlassCard } from '../../components/ui/GlassCard';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Button } from '../../components/ui/Button';
import SkeletonCard from '../../components/ui/skeletons/SkeletonCard';
import {
  Search, X, ChevronLeft, Gamepad2,
  ChevronRight, Filter, Layers
} from 'lucide-react';

export default function Catalog() {
  const { t } = useTranslation();
  const { contents, loading, fetchContents, pagination } = useContents();

  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [genreId, setGenreId] = useState('');
  const [platformId, setPlatformId] = useState('');
  const [sort, setSort] = useState('recent');


  useEffect(() => {
    contentService.getOptions()
      .then(opts => {
        setGenres(opts.genres || []);
        setPlatforms(opts.platforms || []);
      })
      .catch(() => Toast.error(t('notifications.error.options_load')));
  }, [t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContents({
        search,
        type: type || null,
        genre_id: genreId || null,
        platform_id: platformId || null,
        sort,
        page
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, type, genreId, platformId, sort, page, fetchContents]);

  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [search, type, genreId, sort]);

  const getSafeKey = (item, index) =>
    item.id?.toString() || `item-${index}`;

  return (
    <main className="min-h-screen bg-elarx-black pt-32 pb-20 px-6">
      <div className="max-w-[1800px] mx-auto">
        <header className="mb-12">
          <SectionTitle
            id="catalog-title"
            subtitle={t('catalog.explorer_subtitle')}
            title={<span>{t('catalog.title_1')} <span className="text-elarx-gold">{t('catalog.title_2')}</span></span>}
          />
        </header>

        <GlassCard className="mb-16 border-white/5 overflow-visible">
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-6 p-4 lg:p-6">

            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-elarx-gold transition-colors" />
              <input
                type="text"
                placeholder={t('catalog.search_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/5 hover:border-white/10 focus:border-elarx-gold/40 p-4 pl-12 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white outline-none transition-all placeholder:text-gray-700 shadow-inner"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="relative min-w-[140px] flex-1">
              <select
                className="w-full appearance-none bg-white/[0.03] border border-white/5 text-white pl-4 pr-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-elarx-gold/30 cursor-pointer"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="" className="bg-[#0a0a0a]">{t('catalog.type_all')}</option>
                <option value="movie" className="bg-[#0a0a0a]">{t('catalog.type_movie')}</option>
                <option value="series" className="bg-[#0a0a0a]">{t('catalog.type_series')}</option>
                <option value="game" className="bg-[#0a0a0a]">{t('catalog.type_games')}</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" size={12} />
            </div>

            <div className="relative min-w-[160px] flex-1">
              <select
                className="w-full appearance-none bg-white/[0.03] border border-white/5 text-white pl-4 pr-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-elarx-gold/30 cursor-pointer"
                value={genreId}
                onChange={e => setGenreId(e.target.value)}
              >
                <option value="" className="bg-[#0a0a0a]">{t('catalog.genre_all')}</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id} className="bg-[#0a0a0a]">{g.name}</option>
                ))}
              </select>
              <Layers className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" size={12} />
            </div>

            <div className="relative min-w-[160px] flex-1">
              <select
                className="w-full appearance-none bg-white/[0.03] border border-white/5 text-white pl-4 pr-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-elarx-gold/30 cursor-pointer"
                value={platformId}
                onChange={e => setPlatformId(e.target.value)}
              >
                <option value="" className="bg-[#0a0a0a]">{t('catalog.platform_all') || 'PLATFORMS'}</option>
                {platforms.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#0a0a0a]">{p.name}</option>
                ))}
              </select>
              <Gamepad2 className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" size={12} />
            </div>
          </div>

          <div className="flex justify-between items-center px-8 py-4 bg-white/[0.01] border-t border-white/5">
            <div className="flex items-center gap-6">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-600">
                {t('catalog.sort_label')}
              </span>
              <div className="flex gap-4">
                {['recent', 'top'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${sort === s
                      ? 'text-elarx-gold after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-elarx-gold'
                      : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {t(`catalog.sort_${s}`)}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[8px] font-medium text-gray-700 tracking-widest uppercase">
              {contents.length} {t('catalog.results_found')}
            </span>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 min-h-[600px]">
          {loading ? (
            Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : contents.length > 0 ? (
            <React.Suspense fallback={<SkeletonCard />}>
              {contents.map((item, index) => (
                <ContentCard key={getSafeKey(item, index)} item={item} />
              ))}
            </React.Suspense>
          ) : (
            <div className="col-span-full py-40 text-center opacity-30 flex flex-col items-center justify-center">
              <Filter size={48} className="mb-6 stroke-[1px]" />
              <p className="font-black uppercase tracking-[0.4em] text-sm">
                {t('catalog.no_results')}
              </p>
            </div>
          )}
        </div>

        {contents.length > 0 && !loading && (
          <nav className="flex justify-center items-center gap-16 mt-32">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="rounded-full border-white/10 hover:border-elarx-gold/50"
            >
              <ChevronLeft size={20} />
            </Button>

            <div className="text-center">
              <span className="block text-5xl font-black text-white italic leading-none">
                {page}
              </span>
              <span className="text-[8px] text-elarx-gold font-black uppercase tracking-[0.3em] mt-4 block">
                {t('common.page')} {page} / {pagination.last}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={page >= pagination.last}
              onClick={() => setPage(p => p + 1)}
              className="rounded-full border-white/10 hover:border-elarx-gold/50"
            >
              <ChevronRight size={20} />
            </Button>
          </nav>
        )}
      </div>
    </main>
  );
}