import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContents } from '../../hooks/useContents';
import { Toast } from '../../services/toast/toastActions';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';

export default function SearchModal({ isOpen, onClose }) {
      const navigate = useNavigate();
      const [query, setQuery] = useState('');

      const { contents, fetchContents, loading } = useContents();

      useEffect(() => {
            if (!isOpen) return;

            const handler = setTimeout(async () => {
                  if (query.length > 2) {
                        try {
                              await fetchContents({ search: query, limit: 10 });
                        } catch (error) {
                              Toast.error("Error al sincronizar con el catálogo de Elarx");
                        }
                  }
            }, 400);

            return () => clearTimeout(handler);
      }, [query, isOpen, fetchContents]);

      if (!isOpen) return null;

      return (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                  <div className="absolute inset-0 bg-elarx-black/90 backdrop-blur-xl" onClick={onClose} />

                  <div className="relative w-full max-w-2xl bg-elarx-card border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                        <div className="flex items-center p-6 border-b border-white/5 bg-white/[0.02]">
                              {loading ? (
                                    <Loader2 className="text-elarx-gold animate-spin mr-4" size={24} />
                              ) : (
                                    <Search className="text-elarx-gold mr-4" size={24} />
                              )}

                              <input
                                    autoFocus
                                    className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-white placeholder:text-gray-600 italic"
                                    placeholder="Escribe para buscar..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                              />

                              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                                    <X size={20} />
                              </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-4">
                              {contents.length > 0 ? (
                                    <div className="grid gap-2">
                                          {contents.map((item) => (
                                                <button
                                                      key={item.id}
                                                      onClick={() => {
                                                            navigate(`/contents/${item.id}`);
                                                            onClose();
                                                      }}
                                                      className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                                                >
                                                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                                            <img
                                                                  src={item.cover_image || item.poster_path}
                                                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                  alt=""
                                                            />
                                                      </div>

                                                      <div className="flex flex-col text-left flex-1 truncate">
                                                            <span className="text-white font-bold group-hover:text-elarx-gold transition-colors truncate">
                                                                  {item.title}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500 uppercase font-black italic">
                                                                  {item.type} • {item.release_year}
                                                            </span>
                                                      </div>

                                                      <ArrowRight size={18} className="text-gray-800 group-hover:text-elarx-gold transition-all" />
                                                </button>
                                          ))}
                                    </div>
                              ) : query.length > 2 && !loading ? (
                                    <div className="p-12 text-center text-gray-500 italic">
                                          No hay coincidencias en el radar de Elarx.
                                    </div>
                              ) : (
                                    <div className="p-12 text-center text-gray-600 text-xs uppercase tracking-[0.2em] font-black opacity-50">
                                          Ingresa al menos 3 caracteres
                                    </div>
                              )}
                        </div>
                  </div>
            </div>
      );
}