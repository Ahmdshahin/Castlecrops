'use client';

import { useState } from 'react';
import { saveUser, deleteUser } from './actions';
import { useDialog } from '../../../components/admin/CustomDialog';
import { useAdminT } from '../../../components/admin/AdminLangProvider';
import { Pagination } from '../../../components/admin/Pagination';
import { useRouter, usePathname } from 'next/navigation';

const AVAILABLE_ROLES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'categories', label: 'Categories' },
  { id: 'products', label: 'Products' },
  { id: 'blog', label: 'Blog Posts' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'rfq', label: 'RFQ Inbox' },
  { id: 'gallery', label: 'Media Gallery' },
  { id: 'farmsGallery', label: 'Farms Gallery' },
  { id: 'languages', label: 'Languages' },
  { id: 'settings', label: 'Settings' },
  { id: 'users', label: 'Users' },
  { id: 'admin', label: 'Full Admin (All Access)' }
];

export type AdminUser = {
  id: string;
  email: string;
  roles: string[];
  created_at: string;
  password?: string;
};

export const UserList = ({ 
  initialUsers,
  totalCount,
  currentPage,
  pageSize,
  searchQuery
}: { 
  initialUsers: AdminUser[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}) => {
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { showAlert, showConfirm } = useDialog();
  const { t } = useAdminT();
  const router = useRouter();
  const pathname = usePathname();

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingUser({ id: '', email: '', password: '', roles: [] });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, email: string) => {
    if (email === 'admin@admin.castlecrops.local' || email === 'admin@castlecrops.local' || email === 'admin') {
      await showAlert(t.common.cannotDeletePrimaryAdmin, t.common.forbidden);
      return;
    }
    const confirmed = await showConfirm(t.common.confirmDeleteUser + email + '?', t.common.confirmDeleteTitle);
    if (confirmed) {
      const res = await deleteUser(id);
      if (res.success) {
        setSelectedIds(prev => prev.filter(i => i !== id));
        router.refresh();
      } else {
        await showAlert(res.error || t.common.failedToDeleteUser, t.common.error);
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(initialUsers.map(l => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    // ensure admin is not deleted
    const usersToDelete = initialUsers.filter(u => selectedIds.includes(u.id));
    const hasPrimaryAdmin = usersToDelete.some(u => 
      u.email === 'admin@admin.castlecrops.local' || 
      u.email === 'admin@castlecrops.local' || 
      u.email === 'admin'
    );
    if (hasPrimaryAdmin) {
      await showAlert(t.common.cannotDeletePrimaryAdmin, t.common.forbidden);
      return;
    }

    const confirmed = await showConfirm(`Are you sure you want to delete ${selectedIds.length} users?`, t.common.confirmDeleteTitle);
    if (confirmed) {
      let errors = 0;
      for (const id of selectedIds) {
        const res = await deleteUser(id);
        if (!res.success) errors++;
      }
      setSelectedIds([]);
      if (errors > 0) {
        await showAlert(`Failed to delete ${errors} users`, t.common.error);
      }
      router.refresh();
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedRoles = AVAILABLE_ROLES.filter(r => formData.get('role_' + r.id)).map(r => r.id);
    formData.set('roles', JSON.stringify(selectedRoles));

    const res = await saveUser(formData);
    if (res.success) {
      setIsModalOpen(false);
      window.location.reload(); 
    } else {
      await showAlert(res.error || t.common.failedToSaveUser, t.common.error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center bg-black-soft p-4 border border-gold-dim rounded-2xl gap-4 mb-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
          <input 
            type="text" 
            name="search" 
            defaultValue={searchQuery}
            placeholder="Search by email..."
            className="bg-black-matte border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none w-full"
          />
          <button type="submit" className="btn-admin-secondary hidden sm:block">Search</button>
        </form>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} className="btn-admin-action-delete whitespace-nowrap">
              Delete ({selectedIds.length})
            </button>
          )}
          <button onClick={handleCreate} className="btn-admin-primary whitespace-nowrap">{t.common.addUser}</button>
        </div>
      </div>

      <div className="bg-black-soft border border-gold-dim overflow-hidden rounded-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gold-dim bg-black-matte rounded-2xl">
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll} 
                  checked={initialUsers.length > 0 && selectedIds.length === initialUsers.length}
                  className="w-4 h-4 accent-gold bg-black-matte border-gold-dim rounded cursor-pointer"
                />
              </th>
              <th className="p-4 text-cream-dim text-sm uppercase font-semibold">{t.common.email}</th>
              <th className="p-4 text-cream-dim text-sm uppercase font-semibold">{t.common.roles}</th>
              <th className="p-4 text-cream-dim text-sm uppercase font-semibold">{t.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-cream-dim">No users found.</td>
              </tr>
            ) : (
              initialUsers.map(user => (
                <tr key={user.id} className="border-b border-gold-dim/30 hover:bg-black-matte/50 rounded-2xl">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleSelect(user.id)}
                      className="w-4 h-4 accent-gold bg-black-matte border-gold-dim rounded cursor-pointer"
                    />
                  </td>
                  <td className="p-4 text-gold">{user.email}</td>
                <td className="p-4 text-sm text-cream-dim">{(user.roles || []).join(', ')}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(user)} className="btn-admin-action-edit">{t.common.edit}</button>
                  {user.email !== 'admin@admin.castlecrops.local' && user.email !== 'admin@castlecrops.local' && (
                    <button onClick={() => handleDelete(user.id, user.email)} className="btn-admin-action-delete">{t.common.delete}</button>
                  )}
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        searchQuery={searchQuery}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-black-matte border border-gold shadow-2xl p-6 w-full max-w-xl rounded-2xl">
            <h2 className="text-2xl font-serif-latin text-gold mb-4">{editingUser?.id ? t.common.editUser : t.common.newUser}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={editingUser?.id || ''} />
              
              <div className="form-field">
                <label>{t.common.email}</label>
                <input type="email" name="email" defaultValue={editingUser?.email} required />
              </div>
              
              <div className="form-field">
                <label>{editingUser?.id ? t.common.passwordLeaveBlank : t.common.password}</label>
                <input type="password" name="password" required={!editingUser?.id} />
              </div>

              <div>
                <label className="text-sm text-cream-dim mb-2 block">{t.common.roles}</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_ROLES.map(role => (
                    <label key={role.id} className="flex items-center gap-2 text-sm text-cream cursor-pointer">
                      <input 
                        type="checkbox" 
                        name={'role_' + role.id} 
                        defaultChecked={editingUser?.roles?.includes(role.id)}
                        className="accent-gold"
                      />
                      {role.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 border-t border-gold-dim pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-admin-secondary">{t.common.cancel}</button>
                <button type="submit" className="btn-admin-primary">{t.common.saveUser}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
