import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Film, Plus, Search, Edit3, Trash2, X, ChevronDown } from 'lucide-react';

import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { BadgeSelector } from '../../components/ui/BadgeSelector';
import { Toast } from '../../services/toast/toastActions';
import { useContents } from '../../hooks/useContents';
import { contentService } from '../../services/contentService';
import { ImageUploader } from '../../components/ui/ImageUploader';

const initialFormState = {
      title: '',
      description: '',
      type: 'movie',
      release_year: new Date().getFullYear(),
      duration: '',
      genres: [],
      platforms: []
};

export default function ContentManager() {
      const { t } = useTranslation();
      const { contents, fetchContents, pagination } = useContents();
      const [options, setOptions] = useState({ genres: [], platforms: [] });
      const [files, setFiles] = useState({ banner: null, cover: null });
      const [searchTerm, setSearchTerm] = useState('');
      const [errors, setErrors] = useState({});
      const [isEditing, setIsEditing] = useState(false);
      const [currentId, setCurrentId] = useState(null);
      const [formData, setFormData] = useState(initialFormState);
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
            const fetchOptions = async () => {
                  try {
                        const data = await contentService.getOptions();
                        setOptions(data);
                  } catch {
                        Toast.error(t('notifications.error.load_options'));
                  }
            };
            fetchOptions();
      }, [t]);

      useEffect(() => {
            const timer = setTimeout(() => fetchContents({ page: 1, search: searchTerm }), 400);
            return () => clearTimeout(timer);
      }, [searchTerm, fetchContents]);

      const handleFormUpdate = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
      };

      const clearForm = () => {
            setFormData(initialFormState);
            setFiles({ banner: null, cover: null });
            setIsEditing(false);
            setCurrentId(null);
            setErrors({});
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setIsLoading(true);
            setErrors({});

            const data = new FormData();

            ['title', 'description', 'type', 'release_year', 'duration'].forEach(key => {
                  if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
                        data.append(key, formData[key]);
                  }
            });

            if (formData.genres && formData.genres.length > 0) {
                  formData.genres.forEach(id => data.append('genres[]', id));
            }
            if (formData.platforms && formData.platforms.length > 0) {
                  formData.platforms.forEach(id => data.append('platforms[]', id));
            }

            if (files.banner instanceof File) {
                  data.append('banner_image', files.banner);
            }
            if (files.cover instanceof File) {
                  data.append('cover_image', files.cover);
            }

            if (isEditing) {
                  data.append('_method', 'PUT');
            }

            try {
                  if (isEditing) {
                        await contentService.update(currentId, data);
                        Toast.success(t('notifications.success.updated'));
                  } else {
                        for (let [key, value] of data.entries()) {
                              console.log(`${key}:`, value);
                        }
                        await contentService.create(data);
                        Toast.success(t('notifications.success.saved'));
                  }
                  clearForm();
                  fetchContents({ page: pagination.current });
            } catch (err) {
                  if (err.response?.status === 422) {
                        setErrors(err.response.data.errors);
                        Toast.error(t('notifications.error.validation'));
                  } else {
                        Toast.error(t('notifications.error.server'));
                  }
            } finally {
                  setIsLoading(false);
            }
      };

      const handleDelete = (id) => {
            Toast.confirm(
                  () => executeDeletion(id),
                  {
                        title: t('content_manager.confirm_delete_title'),
                        sub: t('content_manager.confirm_delete_warning'),
                        confirmText: t('common.delete'),
                        cancelText: t('common.cancel'),
                        type: 'danger'
                  }
            );
      };

      const executeDeletion = async (id) => {
            const toastId = Toast.loading(t('notifications.deleting'));

            try {
                  await contentService.remove(id);

                  Toast.success(t('notifications.success.deleted'), { id: toastId });

                  fetchContents({ page: pagination.current });
            } catch (error) {
                  Toast.error(t('notifications.error.delete_failed'), { id: toastId });
            }
      };

      function editItem(item) {
            setIsEditing(true);
            setCurrentId(item.id);
            setFormData({
                  ...item,
                  genres: item.genres?.map(g => g.id || g) || [],
                  platforms: item.platforms?.map(p => p.id || p) || []
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      return (
            <div className="animate-in fade-in duration-700 space-y-12 max-w-7xl mx-auto px-6 pb-20 pt-10">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-b border-white/5 pb-12">
                        <SimpleMetric label={t('content_manager.stats.total')} value={contents.length} icon={<Film />} />
                        <SimpleMetric
                              label={t('content_manager.stats.page')}
                              value={`${pagination?.current || 0}/${pagination?.last || 0}`}
                              icon={<Search />}
                        />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <section className="lg:col-span-7 space-y-10">
                              <header className="flex flex-col gap-2">
                                    <span className="text-elarx-gold font-black text-[10px] uppercase tracking-[0.5em]">
                                          {isEditing ? t('admin.editing_mode') : t('admin.creation_mode')}
                                    </span>
                                    <h1 className="text-white font-black text-4xl uppercase italic tracking-tighter">
                                          {isEditing ? t('content_manager.form.title_edit') : t('content_manager.form.title_new')}
                                    </h1>
                              </header>

                              <fieldset disabled={isLoading} className="space-y-10">
                                    <form onSubmit={handleSubmit} className="space-y-10 bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                                          {Object.keys(errors).length > 0 && (
                                                <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl animate-pulse">
                                                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                                                            {t('notifications.error.validation_summary')}
                                                      </p>
                                                </div>
                                          )}
                                          <div className="space-y-6">
                                                <FormSectionHeader title={t('content_manager.sections.identity')} />
                                                <Input label={t('fields.title')} value={formData.title} onChange={e => handleFormUpdate('title', e.target.value)} error={errors.title?.[0]} placeholder="INTERSTELLAR" />
                                                <TextArea label={t('content_manager.form.label_description')} value={formData.description} onChange={e => handleFormUpdate('description', e.target.value)} error={errors.description?.[0]} maxLength={500} />
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-8 border-y border-white/[0.03]">
                                                <div className="space-y-8">
                                                      <BadgeSelector label={t('fields.genres')} items={options.genres} selected={formData.genres} onChange={val => handleFormUpdate('genres', val)} error={errors.genres?.[0]} />
                                                      <BadgeSelector label={t('fields.platforms')} items={options.platforms} selected={formData.platforms} onChange={val => handleFormUpdate('platforms', val)} error={errors.platforms?.[0]} />
                                                </div>

                                                <div className="space-y-6">
                                                      <div className="grid grid-cols-2 gap-4">
                                                            <Input type="number" label={t('content_manager.form.label_release')} value={formData.release_year} onChange={e => handleFormUpdate('release_year', e.target.value)} error={errors.release_year?.[0]} />
                                                            <Input label={t('content_manager.form.label_duration')} value={formData.duration} onChange={e => handleFormUpdate('duration', e.target.value)} error={errors.duration?.[0]} placeholder="124 min" />
                                                      </div>
                                                      <div className="space-y-3">
                                                            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t('content_manager.form.label_format')}</label>
                                                            <div className="relative">
                                                                  <select className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-elarx-gold/50 font-bold appearance-none cursor-pointer" value={formData.type} onChange={e => handleFormUpdate('type', e.target.value)}>
                                                                        <option value="movie">{t('content_manager.form.formats.movie')}</option>
                                                                        <option value="series">{t('content_manager.form.formats.series')}</option>
                                                                        <option value="game">{t('content_manager.form.formats.game')}</option>
                                                                  </select>
                                                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" size={16} />
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>

                                          <div className="space-y-6">
                                                <FormSectionHeader title={t('content_manager.sections.media')} />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                      <ImageUploader
                                                            label={t('fields.banner_image')}
                                                            preview={files.banner || formData.banner_image}
                                                            onSelect={file => setFiles(prev => ({ ...prev, banner: file }))}
                                                            onClear={() => setFiles(prev => ({ ...prev, banner: null }))}
                                                            error={errors.banner_image}
                                                      />

                                                      <ImageUploader
                                                            label={t('fields.cover_image')}
                                                            preview={files.cover || formData.cover_image}
                                                            onSelect={file => setFiles(prev => ({ ...prev, cover: file }))}
                                                            onClear={() => setFiles(prev => ({ ...prev, cover: null }))}
                                                            error={errors.cover_image}
                                                      />

                                                </div>
                                          </div>

                                          <div className="flex flex-col md:flex-row gap-4 pt-10">
                                                <Button type="submit" variant="primary" loading={isLoading} icon={isEditing ? Edit3 : Plus} className="flex-1 py-6">{isEditing ? t('content_manager.form.btn_update') : t('content_manager.form.btn_publish')}</Button>
                                                {isEditing && <Button type="button" variant="outline" onClick={clearForm} icon={X} className="py-6">{t('common.cancel')}</Button>}
                                          </div>
                                    </form>
                              </fieldset>
                        </section>

                        <aside className="lg:col-span-5 space-y-8">
                              <div className="sticky top-8">
                                    <header className="flex justify-between items-center mb-8">
                                          <h2 className="text-white font-black text-xl uppercase italic tracking-tighter">{t('content_manager.library.title')}</h2>
                                          <div className="relative w-48">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                                <input className="w-full bg-white/[0.03] border border-white/5 p-2 pl-9 rounded-lg text-[10px] text-white outline-none focus:border-elarx-gold/30 uppercase tracking-widest font-bold transition-all"
                                                      placeholder={t('content_manager.library.filter_placeholder')}
                                                      value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                          </div>
                                    </header>
                                    <div className="space-y-1 max-h-[700px] overflow-y-auto custom-scrollbar pr-4">
                                          {contents.map(item => (
                                                <ContentItem key={item.id} item={item} onEdit={() => editItem(item)} onDelete={() => handleDelete(item.id)} t={t} />
                                          ))}
                                    </div>
                              </div>
                        </aside>
                  </div>
            </div >
      );
}

const FormSectionHeader = ({ title }) => (
      <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-4 bg-elarx-gold rounded-full" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">{title}</h3>
      </div>
);

function SimpleMetric({ label, value, icon }) {
      return (
            <div className="group">
                  <div className="flex items-center gap-3 mb-2 opacity-30 group-hover:opacity-100 transition-all">
                        <span className="scale-75 text-elarx-gold">{icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">{label}</span>
                  </div>
                  <div className="text-5xl font-black italic tracking-tighter text-white">{value}</div>
                  <div className="h-[2px] w-6 bg-elarx-gold/20 mt-4 group-hover:w-12 group-hover:bg-elarx-gold transition-all duration-500" />
            </div>
      );
}

function ContentItem({ item, onEdit, onDelete, t }) {
      return (
            <div className="group relative">
                  <div className="flex items-center justify-between p-4 hover:bg-white/[0.03] rounded-2xl transition-all border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-4">
                              <img src={item.cover_image} alt="" className="w-10 h-14 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                              <div>
                                    <h4 className="text-[11px] font-black text-gray-300 uppercase tracking-tight group-hover:text-elarx-gold transition-colors line-clamp-1">{item.title}</h4>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{item.release_year} • {item.type}</p>
                              </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                              <button onClick={onEdit} className="p-2 hover:text-white text-gray-500 transition-colors"><Edit3 size={16} /></button>
                              <button onClick={onDelete} className="p-2 hover:text-red-500 text-gray-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                  </div>
                  <div className="h-[1px] w-full bg-white/5" />
            </div>
      );
}
