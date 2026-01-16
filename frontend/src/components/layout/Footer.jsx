import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export default function Footer() {
      const { t } = useTranslation();
      const currentYear = new Date().getFullYear();


      return (
            <footer className="relative bg-elarx-black pt-24 pb-12 px-6 md:px-12 border-t border-white/5 overflow-hidden">

                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-elarx-gold/30 to-transparent" aria-hidden="true" />

                  <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-elarx-gold/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

                  <div className="max-w-[1800px] mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-12">

                              <div className="flex flex-col items-center md:items-start gap-6">
                                    <Link to="/" className="flex items-center gap-3 group" aria-label="Elarx Home">
                                          <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center font-black text-elarx-gold text-xs group-hover:bg-elarx-gold group-hover:text-black transition-all duration-luxury">
                                                E
                                          </div>
                                          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                                                Elarx<span className="text-elarx-gold">.</span>
                                          </span>
                                    </Link>

                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em] max-w-[300px] leading-loose text-center md:text-left">
                                          © {currentYear} Elarx - Manuel Jimenez
                                    </p>
                              </div>

                        </div>

                        {/* FRASE FINAL */}
                        <div className="mt-20 pt-8 border-t border-white/5 flex justify-center">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-[1.2em] italic text-center">
                                    {t('footer.tagline') || "The Art of High-End Cinema"}
                              </span>
                        </div>
                  </div>
            </footer>
      );
}