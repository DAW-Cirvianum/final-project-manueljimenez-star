export const Badge = ({ children, variant = 'gold', className = "" }) => {
      const styles = {
            gold: "bg-elarx-gold/10 text-elarx-gold border-elarx-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]",
            glass: "bg-white/5 text-gray-400 border-white/10 backdrop-blur-md",
            premium: "bg-gradient-to-r from-elarx-gold to-yellow-600 text-black font-black"
      };

      return (
            <span
                  className={`
                        px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter border 
                        ${styles[variant] || styles.gold} ${className}
                  `}
            >
                  {children}
            </span>
      );
};
