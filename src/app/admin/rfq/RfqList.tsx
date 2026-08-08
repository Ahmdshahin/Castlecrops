'use client';

import { useState } from 'react';
import { updateRfqStatus, deleteRfq } from './actions';
import { useDialog } from '../../../components/admin/CustomDialog';
import { Database } from '../../../types/supabase';
import { useAdminT } from '../../../components/admin/AdminLangProvider';
import { Pagination } from '../../../components/admin/Pagination';
import { useRouter, usePathname } from 'next/navigation';

type RfqRow = Database['public']['Tables']['rfq_submissions']['Row'];

export const RfqList = ({ 
  initialRfqs,
  totalCount,
  currentPage,
  pageSize,
  searchQuery
}: { 
  initialRfqs: RfqRow[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { showAlert, showConfirm } = useDialog();
  const { t } = useAdminT();
  const router = useRouter();
  const pathname = usePathname();

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'resolved') => {
    const result = await updateRfqStatus(id, newStatus);
    if (result.success) {
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(t.common.confirmDeleteRfq, t.common.confirmDeletion);
    if (confirmed) {
      const result = await deleteRfq(id);
      if (result.success) {
        setSelectedIds(selectedIds.filter(selId => selId !== id));
        router.refresh();
      } else {
        await showAlert(`${t.common.deleteFailed}${result.error}`, t.common.error);
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === initialRfqs.length && initialRfqs.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialRfqs.map(r => r.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = await showConfirm(`Are you sure you want to delete ${selectedIds.length} RFQs?`, t.common.confirmDeletion);
    if (confirmed) {
      let errors = 0;
      for (const id of selectedIds) {
        const res = await deleteRfq(id);
        if (!res.success) errors++;
      }
      setSelectedIds([]);
      if (errors > 0) {
        await showAlert(`Failed to delete ${errors} RFQs`, t.common.error);
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

  const exportToCsv = () => {
    const itemsToExport = selectedIds.length > 0 ? initialRfqs.filter(r => selectedIds.includes(r.id)) : initialRfqs;
    if (itemsToExport.length === 0) return;

    const headers = ['ID', 'Name', 'Company', 'Phone', 'Email', 'Product', 'Quantity', 'Status', 'Message', 'Created At'];
    const csvRows = [headers.join(',')];
    
    for (const rfq of itemsToExport) {
      const row = [
        rfq.id,
        `"${(rfq.name || '').replace(/"/g, '""')}"`,
        `"${(rfq.company || '').replace(/"/g, '""')}"`,
        `"${(rfq.phone || '').replace(/"/g, '""')}"`,
        `"${(rfq.email || '').replace(/"/g, '""')}"`,
        `"${(rfq.product || '').replace(/"/g, '""')}"`,
        `"${(rfq.quantity || '').replace(/"/g, '""')}"`,
        rfq.status,
        `"${(rfq.message || '').replace(/"/g, '""')}"`,
        rfq.created_at
      ];
      csvRows.push(row.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rfqs_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center bg-black-soft p-4 border border-gold-dim rounded-2xl gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
          <input 
            type="text" 
            name="search" 
            defaultValue={searchQuery}
            placeholder="Search name, email, company..."
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
          <div className="flex items-center gap-3 bg-black-matte border border-gold-dim px-4 py-2 rounded-2xl">
            <input 
              type="checkbox" 
              checked={initialRfqs.length > 0 && selectedIds.length === initialRfqs.length}
              onChange={toggleAll}
              className="w-4 h-4 accent-gold cursor-pointer"
            />
            <span className="text-cream-dim text-sm cursor-pointer whitespace-nowrap" onClick={toggleAll}>{t.common.selectAll}</span>
          </div>
          <button 
            onClick={exportToCsv}
            disabled={initialRfqs.length === 0}
            className="btn-admin-primary whitespace-nowrap"
          >
            {selectedIds.length > 0 ? `${t.common.downloadToExcel} (${selectedIds.length})` : t.common.downloadAllToExcel}
          </button>
        </div>
      </div>

      {initialRfqs.length === 0 ? (
        <p className="text-cream-dim text-center py-8">{t.common.noRfqs}</p>
      ) : (
        initialRfqs.map(rfq => (
          <div key={rfq.id} className={`border border-gold-dim p-4 bg-black-matte rounded-2xl transition-colors ${selectedIds.includes(rfq.id) ? 'border-gold bg-gold/5' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(rfq.id)}
                  onChange={() => toggleSelection(rfq.id)}
                  className="w-4 h-4 mt-1 accent-gold cursor-pointer"
                />
                <div>
                  <h3 className="text-gold text-lg font-serif-latin">{rfq.name} <span className="text-cream-dim text-sm">({rfq.company || 'N/A'})</span></h3>
                  <p className="text-cream-dim text-sm">{new Date(rfq.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  value={rfq.status} 
                  onChange={(e) => handleStatusChange(rfq.id, e.target.value as RfqRow['status'])}
                  className={`text-xs px-2 py-1 rounded-2xl border ${rfq.status === 'new' ? 'bg-gold/20 text-gold border-gold' : rfq.status === 'contacted' ? 'bg-blue-900/40 text-blue-400 border-blue-400' : 'bg-green-900/40 text-green-400 border-green-400'} appearance-none outline-none`}
                >
                  <option value="new">{t.common.statusNew}</option>
                  <option value="contacted">{t.common.statusContacted}</option>
                  <option value="resolved">{t.common.statusResolved}</option>
                </select>
                <button 
                  onClick={() => setExpandedId(expandedId === rfq.id ? null : rfq.id)}
                  className="btn-admin-action-edit"
                >
                  {expandedId === rfq.id ? t.common.hideDetails : t.common.viewDetails}
                </button>
              </div>
            </div>
            
            {expandedId === rfq.id && (
              <div className="border-t border-gold-dim pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm ml-8">
                <div>
                  <p className="text-cream-dim mb-1">{t.common.contact}</p>
                  <p className="text-cream"><span className="text-gold">{t.common.phone}:</span> {rfq.phone}</p>
                  <p className="text-cream"><span className="text-gold">{t.common.email}:</span> {rfq.email || 'N/A'}</p>
                  <p className="text-cream"><span className="text-gold">{t.common.locale}:</span> {rfq.locale || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-cream-dim mb-1">{t.common.productRequest}</p>
                  <p className="text-cream"><span className="text-gold">{t.common.product}:</span> {rfq.product}</p>
                  <p className="text-cream"><span className="text-gold">{t.common.quantity}:</span> {rfq.quantity || 'N/A'}</p>
                </div>
                <div className="md:col-span-2 bg-black-soft p-4 border border-gold-dim/50 rounded-2xl">
                  <p className="text-cream-dim mb-2">{t.common.message}:</p>
                  <p className="text-cream whitespace-pre-wrap">{rfq.message || t.common.noMessage}</p>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button onClick={() => handleDelete(rfq.id)} className="btn-admin-action-delete">{t.common.deleteRfq}</button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <Pagination 
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        searchQuery={searchQuery}
      />
    </div>
  );
};
