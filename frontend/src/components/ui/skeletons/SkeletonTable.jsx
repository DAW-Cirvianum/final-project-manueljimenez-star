import React from 'react';

export default function SkeletonTable({ columns = 5, rows = 5 }) {
      return (
            <>
                  {[...Array(rows)].map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-white/5 animate-pulse">
                              {[...Array(columns)].map((_, colIndex) => (
                                    <td key={colIndex} className="p-6">
                                          <div className="flex items-center gap-3">
                                                {colIndex === 0 && (
                                                      <div className="w-10 h-10 bg-white/10 rounded-xl flex-shrink-0" />
                                                )}
                                                <div
                                                      className={`h-3 bg-white/10 rounded-full transition-all ${colIndex === 0 ? 'w-24' : 'w-full'
                                                            }`}
                                                />
                                          </div>
                                    </td>
                              ))}
                        </tr>
                  ))}
            </>
      );
}
