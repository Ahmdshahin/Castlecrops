'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory, deleteCategory, updateCategory } from './actions';
import { Database } from '../../../types/supabase';
import { ImagePicker } from '../../../components/admin/ImagePicker';
import { useDialog } from '../../../components/admin/CustomDialog';
import { useAdminT } from '../../../components/admin/AdminLangProvider';
import { AdminTranslation } from '../../../lib/admin-i18n';

export type CategoryRow = Database['public']['Tables']['categories']['Row'];

const CategoryItem = memo(({
  category,
  onEdit,
  onDelete,
  t
}: {
  category: CategoryRow;
  onEdit: (c: CategoryRow) => void;
  onDelete: (id: string) => void;
  t: AdminTranslation;
}) => {
  return (
    <div className="border border-gold-dim p-4 bg-black-matte rounded-2xl flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gold text-lg font-serif-latin">{(category.name as Record<string, string>)?.en || 'Unnamed'}</h3>
        <span className="bg-gold-dim/20 text-gold text-xs px-2 py-1 uppercase tracking-wider rounded-xl">{category.slug}</span>
      </div>
      <p className="text-sm text-cream-dim mb-4 truncate">{(category.description as Record<string, string>)?.en}</p>
      
      <div className="flex-grow"></div>

      <div className="flex gap-4 border-t border-gold-dim/50 pt-4 mt-auto">
        <button onClick={() => onEdit(category)} className="btn-admin-action-edit">{t.common.edit}</button>
        <button onClick={() => onDelete(category.id)} className="btn-admin-action-delete">{t.common.delete}</button>
      </div>
    </div>
  );
});
CategoryItem.displayName = 'CategoryItem';

export const CategoryList = ({ initialCategories }: { initialCategories: CategoryRow[] }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryRow | null>(null);
  const { showAlert, showConfirm } = useDialog();
  const router = useRouter();
  const { t } = useAdminT();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleEdit = (category: CategoryRow) => {
    setEditingItem(category);
    setIsAdding(true);
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = editingItem 
      ? await updateCategory(editingItem.id, formData)
      : await createCategory(formData);
      
    if (result.success) {
      setIsAdding(false);
      setEditingItem(null);
      router.refresh();
    } else {
      await showAlert(`Error: ${result.error}`, 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(t.common.confirmDeleteCategory, t.common.confirmDeletion);
    if (!confirmed) return;

    const result = await deleteCategory(id);
    if (result.success) {
      setCategories(prev => prev.filter(c => c.id !== id));
    } else {
      await showAlert(`${t.common.error}: ${result.error}`, t.common.error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center bg-black-soft p-4 border border-gold-dim rounded-2xl">
        <h2 className="text-xl text-cream font-serif-latin hidden md:block">{t.common.existingCategories}</h2>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <button 
            onClick={isAdding ? handleCancel : () => { setEditingItem(null); setIsAdding(true); }}
            className={isAdding ? "btn-admin-secondary whitespace-nowrap" : "btn-admin-primary whitespace-nowrap"}
          >
            {isAdding ? t.common.cancel : t.common.addNewCategory}
          </button>
        </div>
      </div>

      {isAdding && (
        <form key={editingItem?.id || 'new'} onSubmit={handleAddSubmit} className="bg-black-soft border border-gold-dim p-6 flex flex-col gap-4 rounded-2xl shadow-xl">
          <h3 className="text-gold text-lg mb-4">{editingItem ? t.common.editCategory : t.common.addNewCategory}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
              <ImagePicker 
                defaultImageUrl={editingItem?.image_url} 
                recommendedText="(Recommended 1:1 ratio, e.g. 800x800px)" 
              />
            </div>
            
            <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
              <label className="text-sm text-cream-dim">{t.common.slug} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.slugExample}</span></label>
              <input required name="slug" defaultValue={editingItem?.slug || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono rounded-xl focus:border-gold outline-none transition-colors" />
            </div>

            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`name${lang}`} className="flex flex-col gap-1">
                <label className="text-sm text-gold">{t.common.name} ({lang}) <span className="text-sm text-cream-dim/70 ml-2 font-light text-cream-dim">{t.common.localizedTitle}</span></label>
                <input required name={`name${lang}`} defaultValue={(editingItem?.name as Record<string, string> | undefined)?.[lang.toLowerCase()] || ''} className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
              </div>
            ))}

            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`desc${lang}`} className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <label className="text-sm text-gold">{t.common.description} ({lang}) <span className="text-sm text-cream-dim/70 ml-2 font-light text-cream-dim">{t.common.briefSummaryProductGrid}</span></label>
                <textarea required name={`desc${lang}`} defaultValue={(editingItem?.description as Record<string, string> | undefined)?.[lang.toLowerCase()] || ''} className="bg-transparent border border-gold-dim p-2 text-cream h-20 rounded-xl focus:border-gold outline-none transition-colors" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <label className="text-sm text-cream-dim">{t.common.sortOrder} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.lowerNumbersAppearFirst}</span></label>
              <input required type="number" name="sort_order" defaultValue={editingItem?.sort_order || 0} className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" name="is_featured" id="is_featured" defaultChecked={editingItem?.is_featured || false} className="w-4 h-4 accent-gold" />
              <label htmlFor="is_featured" className="text-cream text-sm cursor-pointer">{t.common.featureOnHomepage} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.showInProminentCategory}</span></label>
            </div>
          </div>
          
          <button type="submit" className="btn-admin-primary mt-8 w-full">
            {editingItem ? t.common.updateCategory : t.common.createCategory}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.length === 0 ? (
          <p className="text-cream-dim col-span-full text-center py-8 bg-black-soft border border-gold-dim/30 rounded-2xl">{t.common.noCategories}</p>
        ) : (
          categories.map(category => (
            <CategoryItem 
              key={category.id} 
              category={category} 
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
