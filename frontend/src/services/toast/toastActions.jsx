import toast from 'react-hot-toast';
import { Trash2, Loader2 } from 'lucide-react';

const commonStyle = {
      background: '#0a0a0a',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '1.5rem',
      fontSize: '10px',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      fontStyle: 'italic',
      padding: '16px 24px',
};

export const Toast = {
      success: (message) => toast.success(message, {
            style: { ...commonStyle, border: '1px solid rgba(212, 175, 55, 0.2)' },
            iconTheme: { primary: '#D4AF37', secondary: '#000' }
      }),

      error: (message) => toast.error(message, {
            style: { ...commonStyle, border: '1px solid rgba(239, 68, 68, 0.2)' },
            iconTheme: { primary: '#ef4444', secondary: '#fff' }
      }),

      loading: (message) => toast.loading(message, {
            style: { ...commonStyle, border: '1px solid rgba(212, 175, 55, 0.1)' },
            icon: <Loader2 size={16} className="text-elarx-gold animate-spin" />
      }),

      dismiss: (id) => toast.dismiss(id),
      
      confirm: (onConfirm, { title, sub, confirmText, cancelText } = {}) => {
            toast.custom((t_obj) => (
                  <div className={`${t_obj.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-[2rem] p-8 pointer-events-auto`}>
                        <div className="flex flex-col items-center text-center gap-4 mb-6">
                              <div className="p-4 bg-red-500/10 rounded-full">
                                    <Trash2 size={24} className="text-red-500" />
                              </div>
                              <div>
                                    <p className="text-white font-black italic text-xs uppercase tracking-[0.2em]">{title}</p>
                                    <p className="text-gray-500 text-[9px] font-bold uppercase mt-2 tracking-widest">{sub}</p>
                              </div>
                        </div>
                        <div className="flex gap-3">
                              <button
                                    onClick={() => { toast.dismiss(t_obj.id); onConfirm(); }}
                                    className="flex-1 bg-red-500 text-white text-[10px] font-black uppercase py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/20"
                              >
                                    {confirmText || 'Confirm'}
                              </button>
                              <button
                                    onClick={() => toast.dismiss(t_obj.id)}
                                    className="flex-1 bg-white/5 text-gray-400 text-[10px] font-black uppercase py-3 rounded-xl transition-all border border-white/5"
                              >
                                    {cancelText || 'Cancel'}
                              </button>
                        </div>
                  </div>
            ), { duration: 5000, position: 'bottom-center' });
      }
};