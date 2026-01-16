export const Input = ({ label, icon: Icon, error, value, onChange, className = "", id, placeholder, ...props }) => (
      <div className={`flex flex-col gap-2 w-full group ${className}`}>
            {label && (
                  <label
                        htmlFor={id}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-elarx-gold transition-colors ml-1"
                  >
                        {label}
                  </label>
            )}
            <div className="relative">
                  {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-elarx-gold transition-colors">
                              <Icon size={18} />
                        </div>
                  )}
                  <input
                        id={id}
                        value={value ?? ""}
                        onChange={onChange}
                        placeholder={placeholder}
                        {...props}
                        className={`
                              w-full bg-white/[0.03] border border-white/5 py-4 rounded-2xl text-sm text-white outline-none
                              focus:border-elarx-gold/30 focus:bg-elarx-gold/[0.03] transition-all duration-500
                              placeholder:text-gray-700 placeholder:italic
                              ${Icon ? 'pl-12' : 'pl-5'} pr-5
                        `}
                  />
                  <div className="absolute inset-0 rounded-2xl pointer-events-none group-focus-within:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-500" />
            </div>
            {error && (
                  <p className="text-[9px] font-bold text-red-500 uppercase tracking-tighter mt-1 ml-1 animate-pulse">
                        {error}
                  </p>
            )}
      </div>
);
