export const Select = ({ label, options = [], value, onChange, error, placeholder = "Selecciona...", className = "", ...props }) => (
      <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && (
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                        {label}
                  </label>
            )}
            <select
                  value={value ?? ""}
                  onChange={onChange}
                  {...props}
                  className={`
                        w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'}
                        p-4 rounded-2xl text-white outline-none focus:border-elarx-gold/50 font-medium
                        text-sm transition-all
                  `}
            >
                  <option value="" disabled>{placeholder}</option>
                  {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
            </select>
            {error && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight mt-1">
                        {error}
                  </p>
            )}
      </div>
);
