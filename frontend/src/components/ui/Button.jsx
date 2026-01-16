import { Loader2 } from 'lucide-react';

export const Button = ({
      children,
      variant = 'primary',
      loading = false,
      icon: Icon,
      className = '',
      ...props
}) => {
      const variants = {
            primary: "bg-elarx-gold text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]",
            outline: "border border-elarx-gold/50 text-elarx-gold hover:bg-elarx-gold/5",
            ghost: "text-gray-500 hover:text-white hover:bg-white/5",
            danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
      };

      return (
            <button
                  disabled={loading || props.disabled}
                  className={`
                        group relative flex items-center justify-center gap-2 
                        px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic
                        transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                        ${variants[variant]} ${className}
                  `}
                  {...props}
            >
                  {loading ? (
                        <Loader2 className="animate-spin" size={14} />
                  ) : (
                        <>
                              {Icon && <Icon size={14} className="transition-transform group-hover:-translate-y-0.5" />}
                              {children}
                        </>
                  )}
            </button>
      );
};
