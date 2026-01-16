export const TextArea = ({ label, value, error, onChange, maxLength, placeholder, className = "", ...props }) => (
      <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && (
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                        {label}
                  </label>
            )}
            {maxLength && (
                  <span className={`text-[9px] font-bold ${value?.length > maxLength * 0.9 ? 'text-elarx-gold' : 'text-gray-600'}`}>
                        {value?.length ?? 0} / {maxLength}
                  </span>
            )}
            <textarea
                  value={value ?? ""}
                  onChange={onChange}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  {...props}
                  className={`
                        w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'}
                        p-5 rounded-2xl text-white outline-none focus:border-elarx-gold/50 font-medium
                        text-sm min-h-[140px] transition-all resize-none custom-scrollbar shadow-inner
                  `}
            />
            {error && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight animate-in slide-in-from-left-1">
                        {error}
                  </p>
            )}
      </div>
);
