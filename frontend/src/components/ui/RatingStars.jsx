import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, size = 20, maxStars = 5 }) => {
      return (
            <div className="flex items-center gap-1">
                  {[...Array(maxStars)].map((_, index) => {
                        const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;

                        return (
                              <div key={index} className="relative" style={{ width: size, height: size }}>
                                    
                                    <Star
                                          size={size}
                                          className="text-white/10 absolute inset-0"
                                          fill="none"
                                    />

                                    <div
                                          className="absolute inset-0 overflow-hidden transition-all duration-1000"
                                          style={{ width: `${fillPercentage}%` }}
                                    >
                                          <Star
                                                size={size}
                                                className="text-elarx-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                                                fill="currentColor"
                                          />
                                    </div>
                              </div>
                        );
                  })}
            </div>
      );
};
