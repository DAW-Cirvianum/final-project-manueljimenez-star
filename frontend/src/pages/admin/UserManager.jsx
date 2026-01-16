import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, UserMinus, UserCheck, Star, ChevronLeft, ChevronRight, Mail } from 'lucide-react';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { GlassCard } from '../../components/ui/GlassCard';
import { SectionTitle } from '../../components/ui/SectionTitle';
import SkeletonTable from '../../components/ui/skeletons/SkeletonTable';
import { Toast } from '../../services/toast/toastActions';

import { useUsers } from '../../hooks/useUsers';
import { userService } from '../../services/userService';

export default function UserManager() {
      const { t } = useTranslation();
      const { users, pagination, fetchUsers } = useUsers();
      const [searchTerm, setSearchTerm] = useState('');
      const [isLoading, setIsLoading] = useState(false);

      const loadUsers = async (params) => {
            setIsLoading(true);
            try {
                  await fetchUsers(params);
            } finally {
                  setIsLoading(false);
            }
      };

      useEffect(() => {
            const timer = setTimeout(() => loadUsers({ page: 1, search: searchTerm }), 400);
            return () => clearTimeout(timer);
      }, [searchTerm]);

      const handleChangePage = async (newPage) => {
            loadUsers({ page: newPage, search: searchTerm });
      };

      const handleToggleStatus = (user) => {
            const isCurrentlyActive = user.is_active;

            Toast.confirm(
                  async () => {
                        const toastId = Toast.loading(t('notifications.processing'));

                        try {
                              await userService.toggleStatus(user.id);
                              await fetchUsers({ page: pagination?.current || 1, search: searchTerm });

                              Toast.success(
                                    isCurrentlyActive
                                          ? t('notifications.success.banned')
                                          : t('notifications.success.unbanned'),
                                    { id: toastId }
                              );
                        } catch (error) {
                              Toast.error(t('notifications.error.process'), { id: toastId });
                        }
                  },
                  {
                        title: isCurrentlyActive ? t('user_manager.confirm.ban_title') : t('user_manager.confirm.unban_title'),
                        sub: t('user_manager.confirm.sub', { name: user.name }),
                        confirmText: t('common.confirm'),
                        cancelText: t('common.cancel'),
                        type: isCurrentlyActive ? 'danger' : 'success'
                  }
            );
      };

      const handleChangeRole = async (userId, newRole) => {
            const toastId = Toast.loading(t('notifications.updating_role'));

            try {
                  await userService.changeRole(userId, newRole);

                  await fetchUsers({ page: pagination?.current || 1, search: searchTerm });

                  Toast.success(t('notifications.success.role_updated'), { id: toastId });
            } catch (error) {
                  console.error("Role change error:", error);
                  Toast.error(t('notifications.error.role_failed'), { id: toastId });
            }
      };

      return (
            <div className="animate-in fade-in duration-700 space-y-6">
                  <GlassCard className="overflow-hidden border-white/5">
                        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.01]">
                              <SectionTitle
                                    title={t('user_manager.header.title')}
                                    subtitle={t('user_manager.header.subtitle')}
                                    icon={<ShieldCheck className="text-elarx-gold w-6 h-6" />}
                              />
                              <div className="w-full md:w-96">
                                    <Input
                                          icon="search"
                                          placeholder={t('user_manager.header.search_placeholder')}
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                          className="bg-black/40 border-white/10 focus:border-elarx-gold/50"
                                    />
                              </div>
                        </div>

                        <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                    <thead className="bg-white/[0.02] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                          <tr>
                                                <th className="p-6 border-b border-white/5">{t('user_manager.table.identity')}</th>
                                                <th className="p-6 border-b border-white/5 text-center">{t('user_manager.table.reputation')}</th>
                                                <th className="p-6 border-b border-white/5">{t('user_manager.table.role')}</th>
                                                <th className="p-6 border-b border-white/5">{t('user_manager.table.status')}</th>
                                                <th className="p-6 border-b border-white/5 text-right">{t('user_manager.table.control')}</th>
                                          </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                          {isLoading ? (
                                                <SkeletonTable columns={5} rows={10} />
                                          ) : (
                                                users.map(user => (
                                                      <tr key={user.id} className="hover:bg-elarx-gold/[0.02] transition-colors group">
                                                            <td className="p-6">
                                                                  <div className="flex items-center gap-4">
                                                                        <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center text-elarx-gold font-black text-xl overflow-hidden shadow-2xl group-hover:border-elarx-gold/30 transition-all">
                                                                              {user.avatar ?
                                                                                    <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                                                                                    : user.name.charAt(0)
                                                                              }
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                              <span className="text-sm text-gray-200 font-black uppercase tracking-tight group-hover:text-white transition-colors">
                                                                                    {user.name}
                                                                              </span>
                                                                              <span className="text-[10px] text-gray-600 flex items-center gap-1 font-bold group-hover:text-gray-400 transition-colors">
                                                                                    <Mail className="w-3 h-3 text-elarx-gold/50" /> {user.email}
                                                                              </span>
                                                                        </div>
                                                                  </div>
                                                            </td>
                                                            <td className="p-6 text-center">
                                                                  <div className="inline-flex items-center gap-2 bg-elarx-gold/5 px-3 py-1.5 rounded-full text-elarx-gold font-black text-xs border border-elarx-gold/10">
                                                                        <Star className="w-3 h-3 fill-elarx-gold" /> {user.reputation_score || 0}
                                                                  </div>
                                                            </td>
                                                            <td className="p-6">
                                                                  <select
                                                                        value={user.role}
                                                                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                                                        className="bg-black border border-white/10 text-[10px] text-elarx-gold rounded-xl px-4 py-2 outline-none uppercase font-black cursor-pointer focus:border-elarx-gold/50 transition-all"
                                                                  >
                                                                        <option value="user">{t('common.roles.user')}</option>
                                                                        <option value="admin">{t('common.roles.admin')}</option>
                                                                  </select>
                                                            </td>
                                                            <td className="p-6">
                                                                  <Badge variant={user.is_active ? 'success' : 'danger'}>
                                                                        {user.is_active ? t('user_manager.table.active') : t('user_manager.table.banned')}
                                                                  </Badge>
                                                            </td>
                                                            <td className="p-6 text-right">
                                                                  <Button
                                                                        variant={user.is_active ? 'danger-ghost' : 'success-ghost'}
                                                                        size="sm"
                                                                        onClick={() => handleToggleStatus(user)}
                                                                  >
                                                                        {user.is_active ? <UserMinus size={18} /> : <UserCheck size={18} />}
                                                                  </Button>
                                                            </td>
                                                      </tr>
                                                ))
                                          )}
                                    </tbody>
                              </table>
                        </div>

                        <div className="p-8 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
                              <Button
                                    variant="secondary"
                                    disabled={pagination?.current === 1 || !pagination}
                                    onClick={() => handleChangePage((pagination?.current || 1) - 1)}
                              >
                                    <ChevronLeft size={20} />
                              </Button>

                              <span className="text-[10px] text-gray-500 font-black tracking-[0.4em] uppercase">
                                    {pagination?.current || 1}
                                    <span className="text-white mx-2">/</span>
                                    {pagination?.last || 1}
                              </span>

                              <Button
                                    variant="secondary"
                                    disabled={pagination?.current === pagination?.last || !pagination}
                                    onClick={() => handleChangePage((pagination?.current || 1) + 1)}
                              >
                                    <ChevronRight size={20} />
                              </Button>
                        </div>
                  </GlassCard>
            </div>
      );
}
