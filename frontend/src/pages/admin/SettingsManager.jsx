import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Gamepad2, Layers, Loader2 } from 'lucide-react';

import { Toast } from '../../services/toast/toastActions';
import { contentService } from '../../services/contentService';

const ConfigCard = ({ title, icon: Icon, placeholder, value, onChange, onAdd, items, type, isLoading, onDelete, t }) => (
      <div className="bg-[#050505] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col transition-all hover:border-white/10 group/card">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                        <div className="p-3 bg-elarx-gold/10 rounded-xl">
                              <Icon className="w-5 h-5 text-elarx-gold" />
                        </div>
                        <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em] italic">{title}</h3>
                  </div>
                  {isLoading && <Loader2 className="w-4 h-4 text-elarx-gold animate-spin" />}
            </div>

            <div className="p-8 flex flex-col flex-1">
                  <div className="flex gap-3 mb-8">
                        <input
                              type="text"
                              value={value}
                              onChange={(e) => onChange(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && onAdd()}
                              placeholder={placeholder}
                              className="bg-black border border-white/10 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white flex-1 outline-none focus:border-elarx-gold/40 transition-all placeholder:text-gray-700"
                        />
                        <button
                              onClick={onAdd}
                              disabled={isLoading || !value.trim()}
                              className="bg-elarx-gold hover:bg-yellow-500 disabled:opacity-50 text-black px-6 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-elarx-gold/20"
                        >
                              <Plus className="w-5 h-5" />
                        </button>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {items.length === 0 && !isLoading ? (
                              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[2rem]">
                                    <p className="opacity-20 italic text-[10px] font-black uppercase tracking-widest">
                                          {t('settings.common.empty_list')}
                                    </p>
                              </div>
                        ) : (
                              items.map(item => (
                                    <div
                                          key={item.id}
                                          className="flex justify-between items-center bg-white/[0.03] hover:bg-white/[0.07] p-4 px-6 rounded-2xl border border-white/5 group transition-all"
                                    >
                                          <span className="text-gray-300 text-[11px] font-black uppercase tracking-wider">{item.name}</span>
                                          <button
                                                onClick={() => onDelete(type, item)}
                                                className="text-gray-600 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                          >
                                                <Trash2 className="w-4 h-4" />
                                          </button>
                                    </div>
                              ))
                        )}
                  </div>
            </div>
      </div>
);

export default function SettingsManager() {
      const { t } = useTranslation();
      const [genres, setGenres] = useState([]);
      const [platforms, setPlatforms] = useState([]);
      const [newGenre, setNewGenre] = useState('');
      const [newPlatform, setNewPlatform] = useState('');
      const [isLoading, setIsLoading] = useState(false);

      const fetchData = async () => {
            setIsLoading(true);
            try {
                  const g = await contentService.getGenres();
                  const p = await contentService.getPlatforms();
                  setGenres(g);
                  setPlatforms(p);
            } catch (error) {
                  console.error("Error al cargar configuración:", error);
                  Toast.error(t('settings.common.error_loading'));
            } finally {
                  setIsLoading(false);
            }
      };

      useEffect(() => {
            fetchData();
      }, []);

      const handleAdd = async (type, value, setter) => {
            const cleanValue = value.trim();
            if (!cleanValue) return;

            const loadId = Toast.loading(t('settings.common.adding'));
            try {
                  if (type === 'genres') await contentService.addGenre(cleanValue);
                  if (type === 'platforms') await contentService.addPlatform(cleanValue);

                  setter('');
                  await fetchData();
                  Toast.success(t(`settings.${type}.added_success`), { id: loadId });
            } catch (error) {
                  console.error("Add error:", error);
                  const isDuplicate = error.response?.status === 422;
                  Toast.error(
                        isDuplicate ? t('settings.common.error_duplicate') : t('settings.common.error_process'),
                        { id: loadId }
                  );
            }
      };

      const confirmDelete = (type, item) => {
            Toast.confirm(
                  async () => {
                        const loadId = Toast.loading(t('settings.common.deleting'));
                        try {
                              if (type === 'genres') await contentService.deleteGenre(item.id);
                              if (type === 'platforms') await contentService.deletePlatform(item.id);

                              await fetchData();
                              Toast.success(t(`settings.${type}.deleted_success`), { id: loadId });
                        } catch (error) {
                              Toast.error(t('settings.common.error_linked_data'), { id: loadId });
                        }
                  },
                  {
                        title: t('settings.common.confirm_delete_title'),
                        sub: t('settings.common.confirm_delete_sub', { name: item.name }),
                        confirmText: t('common.delete'),
                        cancelText: t('common.cancel'),
                        type: 'danger'
                  }
            );
      };

      return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <ConfigCard
                        title={t('settings.genres.title')}
                        icon={Layers}
                        placeholder={t('settings.genres.placeholder')}
                        value={newGenre}
                        onChange={setNewGenre}
                        onAdd={() => handleAdd('genres', newGenre, setNewGenre)}
                        items={genres}
                        type="genres"
                        isLoading={isLoading}
                        onDelete={confirmDelete}
                        t={t}
                  />

                  <ConfigCard
                        title={t('settings.platforms.title')}
                        icon={Gamepad2}
                        placeholder={t('settings.platforms.placeholder')}
                        value={newPlatform}
                        onChange={setNewPlatform}
                        onAdd={() => handleAdd('platforms', newPlatform, setNewPlatform)}
                        items={platforms}
                        type="platforms"
                        isLoading={isLoading}
                        onDelete={confirmDelete}
                        t={t}
                  />
            </div>
      );
}