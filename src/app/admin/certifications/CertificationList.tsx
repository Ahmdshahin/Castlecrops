'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { createCertification, deleteCertification, updateCertification } from './actions';
import Image from 'next/image';
import { Database } from '../../../types/supabase';
import { ImagePicker } from '../../../components/admin/ImagePicker';
import { useDialog } from '../../../components/admin/CustomDialog';
import { useAdminT } from '../../../components/admin/AdminLangProvider';
import { AdminTranslation } from '../../../lib/admin-i18n';

export type CertificationRow = Database['public']['Tables']['certifications']['Row'];

const parseLocalizedData = (data: unknown): Record<string, string> => {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data as Record<string, string>;
};

const CertificationItem = memo(({
  cert,
  onEdit,
  onDelete,
  t
}: {
  cert: CertificationRow;
  onEdit: (c: CertificationRow) => void;
  onDelete: (id: string) => void;
  t: AdminTranslation;
}) => {
  return (
    <div className="border border-gold-dim p-4 bg-black-matte rounded-2xl flex flex-col h-full text-center items-center">
      {cert.image_url && (
        <div className="relative w-24 h-24 mb-4">
          <Image src={cert.image_url} alt={parseLocalizedData(cert.name)?.en || 'Certification'} fill className="object-contain" />
        </div>
      )}
      <h3 className="text-gold text-lg font-serif-latin mb-2">{parseLocalizedData(cert.name)?.en || 'Unnamed'}</h3>
      <span className="bg-gold-dim/20 text-gold text-xs px-2 py-1 uppercase tracking-wider rounded-xl mb-4">
        {t.common.sortOrderColon} {cert.sort_order}
      </span>
      
      <div className="flex-grow"></div>

      <div className="flex gap-4 border-t border-gold-dim/50 pt-4 mt-auto w-full justify-center">
        <button onClick={() => onEdit(cert)} className="btn-admin-action-edit">{t.common.edit}</button>
        <button onClick={() => onDelete(cert.id)} className="btn-admin-action-delete">{t.common.delete}</button>
      </div>
    </div>
  );
});
CertificationItem.displayName = 'CertificationItem';

export const CertificationList = ({ initialCertifications }: { initialCertifications: CertificationRow[] }) => {
  const [certifications, setCertifications] = useState(initialCertifications);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationRow | null>(null);
  const { showAlert, showConfirm } = useDialog();
  const router = useRouter();
  const { t } = useAdminT();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCertifications(initialCertifications);
  }, [initialCertifications]);

  const handleEdit = (cert: CertificationRow) => {
    setEditingItem(cert);
    setIsAdding(true);
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = editingItem 
      ? await updateCertification(editingItem.id, formData)
      : await createCertification(formData);
    
    if (result.success) {
      setIsAdding(false);
      setEditingItem(null);
      router.refresh();
    } else {
      await showAlert(`${t.common.error}: ${result.error}`, t.common.error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(t.common.confirmDeleteCertification, t.common.confirmDeletion);
    if (!confirmed) return;

    const result = await deleteCertification(id);
    if (result.success) {
      setCertifications(certifications.filter(c => c.id !== id));
    } else {
      await showAlert(`${t.common.error}: ${result.error}`, t.common.error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center bg-black-soft p-4 border border-gold-dim rounded-2xl">
        <h2 className="text-xl text-cream font-serif-latin hidden md:block">{t.common.existingCertifications}</h2>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <button 
            onClick={isAdding ? handleCancel : () => { setEditingItem(null); setIsAdding(true); }}
            className={isAdding ? "btn-admin-secondary whitespace-nowrap" : "btn-admin-primary whitespace-nowrap"}
          >
            {isAdding ? t.common.cancel : t.common.addNewCertification}
          </button>
        </div>
      </div>

      {isAdding && (
        <form key={editingItem?.id || 'new'} onSubmit={handleSubmit} className="bg-black-soft border border-gold-dim p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
          <h3 className="text-gold text-lg mb-4">{editingItem ? t.common.editCertification : t.common.addNewCertification}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
              <ImagePicker 
                defaultImageUrl={editingItem?.image_url} 
                recommendedText="(Recommended 1:1 ratio, Square, Transparent PNG/SVG)" 
              />
            </div>

            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`name${lang}`} className="flex flex-col gap-1">
                <label className="text-sm text-gold">{t.common.name} ({lang}) <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.localizedTitle}</span></label>
                <input required name={`name${lang}`} defaultValue={parseLocalizedData(editingItem?.name)?.[lang.toLowerCase()] || ''} className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
              </div>
            ))}

            <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
              <label className="text-sm text-cream-dim">{t.common.sortOrder} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.lowerNumbersFirst}</span></label>
              <input required type="number" name="sort_order" defaultValue={editingItem?.sort_order || 0} className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors w-full md:w-1/2" />
            </div>
          </div>
          
          <button type="submit" className="btn-admin-primary mt-8 w-full">
            {editingItem ? t.common.updateCertification : t.common.addCertification}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {certifications.length === 0 ? (
          <p className="text-cream-dim col-span-full text-center py-8 bg-black-soft border border-gold-dim/30 rounded-2xl">{t.common.noCertifications}</p>
        ) : (
          certifications.map(cert => (
            <CertificationItem 
              key={cert.id} 
              cert={cert} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              t={t} 
            />
          ))
        )}
      </div>
    </div>
  );
};
