'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDialog } from '../../../components/admin/CustomDialog';
import { clearAuditLogs, deleteAuditLogs } from './actions';
import { Pagination } from '../../../components/admin/Pagination';

export const AuditLogList = ({ 
  initialLogs, 
  totalCount,
  currentPage,
  pageSize,
  searchQuery
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialLogs: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { showAlert, showConfirm } = useDialog();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(initialLogs.map(l => l.id));
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
    const confirmed = await showConfirm(`Are you sure you want to delete ${selectedIds.length} logs?`, "Confirm Deletion");
    if (confirmed) {
      const result = await deleteAuditLogs(selectedIds);
      if (result.success) {
        setSelectedIds([]);
        router.refresh();
      } else {
        await showAlert(`Failed: ${result.error}`, "Error");
      }
    }
  };

  const handleClearAll = async () => {
    const confirmed = await showConfirm("Are you sure you want to CLEAR ALL audit logs? This action is irreversible.", "DANGER: Clear All Logs");
    if (confirmed) {
      const result = await clearAuditLogs();
      if (result.success) {
        setSelectedIds([]);
        router.push(pathname);
      } else {
        await showAlert(`Failed: ${result.error}`, "Error");
      }
    }
  };

  const formatDetails = (details: any) => {
    if (!details || typeof details !== 'object' || Object.keys(details).length === 0) return '-';
    
    return (
      <div className="flex flex-col gap-1">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="truncate">
            <span className="font-semibold text-gold-dim capitalize mr-2">{key.replace(/_/g, ' ')}:</span> 
            <span className="text-cream">{String(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-black-soft p-4 border border-gold-dim rounded-2xl gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            name="search" 
            defaultValue={searchQuery}
            placeholder="Search action..."
            className="bg-black-matte border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none w-full md:w-64"
          />
          <button type="submit" className="btn-admin-secondary">Search</button>
        </form>

        {/* Bulk Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} className="btn-admin-action-delete whitespace-nowrap">
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button onClick={handleClearAll} className="btn-admin-action-delete whitespace-nowrap bg-red-900/50">
            Clear All Logs
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-black-soft border border-gold-dim rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-black-matte border-b border-gold-dim">
            <tr>
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll} 
                  checked={initialLogs.length > 0 && selectedIds.length === initialLogs.length}
                  className="w-4 h-4 accent-gold bg-black-matte border-gold-dim rounded cursor-pointer"
                />
              </th>
              <th className="p-4 text-gold-dim font-medium">Date</th>
              <th className="p-4 text-gold-dim font-medium">Admin</th>
              <th className="p-4 text-gold-dim font-medium">Action</th>
              <th className="p-4 text-gold-dim font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {initialLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-cream-dim">No logs found.</td>
              </tr>
            ) : (
              initialLogs.map(log => (
                <tr key={log.id} className="border-b border-gold-dim/30 hover:bg-black-matte/50 transition-colors">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(log.id)}
                      onChange={() => handleSelect(log.id)}
                      className="w-4 h-4 accent-gold bg-black-matte border-gold-dim rounded cursor-pointer"
                    />
                  </td>
                  <td className="p-4 text-sm text-cream-dim whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-cream">{log.admin?.email || 'Unknown'}</td>
                  <td className="p-4 text-sm">
                    <span className="bg-gold-dim/20 text-gold px-2 py-1 rounded-xl text-xs uppercase tracking-wide">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-cream-dim max-w-xs" title={JSON.stringify(log.details, null, 2)}>
                    {formatDetails(log.details)}
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
    </div>
  );
};
