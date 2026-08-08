'use client';

import React, { useState, useEffect, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createProduct, deleteProduct, updateProduct } from './actions';
import { Database } from '../../../types/supabase';
import { ImagePicker } from '../../../components/admin/ImagePicker';
import { useDialog } from '../../../components/admin/CustomDialog';
import { useAdminT } from '../../../components/admin/AdminLangProvider';
import { AdminTranslation } from '../../../lib/admin-i18n';
import Image from 'next/image';
import { productSchema } from '../../../lib/validations';
import { z } from 'zod';

import { CategoryRow } from '../categories/CategoryList';
import { Pagination } from '../../../components/admin/Pagination';

type ProductRow = Database['public']['Tables']['products']['Row'];

const ProductItem = memo(({ 
  product, 
  onEdit, 
  onDelete, 
  t,
  isSelected,
  onSelect
}: { 
  product: ProductRow; 
  onEdit: (p: ProductRow) => void; 
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  t: AdminTranslation;
}) => {
  return (
    <div className={`border p-4 bg-black-matte rounded-2xl flex flex-col h-full relative transition-colors ${isSelected ? 'border-gold shadow-[0_0_15px_rgba(198,168,124,0.3)]' : 'border-gold-dim'}`}>
      <div className="absolute top-4 left-4 z-10">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => onSelect(product.id)}
          className="w-5 h-5 accent-gold bg-black-matte border-gold-dim rounded cursor-pointer"
        />
      </div>
      <div className="flex justify-between items-start mb-2 pl-8">
        <h3 className="text-gold text-lg font-serif-latin">{(product.name as Record<string, string>)?.en || 'Unnamed'}</h3>
        <span className="bg-gold-dim/20 text-gold text-xs px-2 py-1 uppercase tracking-wider rounded-xl">{product.category}</span>
      </div>
      <p className="text-sm text-cream-dim mb-4 truncate">{(product.description as Record<string, string>)?.en}</p>
      
      <div className="flex-grow"></div>

      {product.qr_code_url && (
        <div className="mb-4 bg-black-soft p-3 flex items-center gap-4 border border-gold-dim/30 rounded-2xl">
          <div className="relative w-16 h-16 shrink-0 border border-gold-dim bg-white p-1 rounded-xl">
            <Image src={product.qr_code_url} alt="QR Code" fill sizes="64px" className="object-contain" loading="lazy" />
          </div>
          <div className="flex flex-col gap-1 overflow-hidden">
            <span className="text-xs text-cream-dim truncate">{t.common.scanUrl} {product.scan_page_slug}</span>
            <a 
              href={product.qr_code_url} 
              download={`QR_${product.slug}.png`}
              className="text-gold text-sm hover:text-gold-bright underline"
            >
              {t.common.downloadQrCode}
            </a>
          </div>
        </div>
      )}

      <div className="flex gap-4 border-t border-gold-dim/50 pt-4 mt-auto">
        <button onClick={() => onEdit(product)} className="btn-admin-action-edit">{t.common.edit}</button>
        <button onClick={() => onDelete(product.id)} className="btn-admin-action-delete">{t.common.delete}</button>
      </div>
    </div>
  );
});
ProductItem.displayName = 'ProductItem';

export const ProductList = ({ 
  initialProducts, 
  initialCategories,
  totalCount,
  currentPage,
  pageSize,
  searchQuery,
  categoryQuery
}: { 
  initialProducts: ProductRow[];
  initialCategories: CategoryRow[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  categoryQuery: string;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductRow | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { showAlert, showConfirm } = useDialog();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useAdminT();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(t.common.confirmDeleteProduct, t.common.confirmDeletion);
    if (confirmed) {
      const result = await deleteProduct(id);
      if (result.success) {
        setSelectedIds(prev => prev.filter(i => i !== id));
        router.refresh();
      } else {
        await showAlert(`${t.common.deleteFailed}${result.error}`, t.common.error);
      }
    }
  };

  const handleEdit = (product: ProductRow) => {
    setEditingItem(product);
    setIsAdding(true);
    setSelectedIds([]);
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    if (isDirty) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to discard them?")) return;
    }
    setIsAdding(false);
    setEditingItem(null);
    setIsDirty(false);
    setValidationErrors({});
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});
    const formData = new FormData(e.currentTarget);
    
    const formValues = Object.fromEntries(formData.entries());
    const parseResult = productSchema.safeParse(formValues);
    
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      parseResult.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setValidationErrors(errors);
      await showAlert("Please fix the validation errors before submitting.", t.common.error);
      return;
    }
    const result = editingItem 
      ? await updateProduct(editingItem.id, formData)
      : await createProduct(formData);
      
    if (result.success) {
      setIsAdding(false);
      setEditingItem(null);
      setIsDirty(false);
      setValidationErrors({});
      router.refresh();
    } else {
      await showAlert(result.error || 'An unknown error occurred.', t.common.error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryQuery !== 'all') params.set('category', categoryQuery);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (e.target.value !== 'all') params.set('category', e.target.value);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = await showConfirm(`Are you sure you want to delete ${selectedIds.length} products?`, "Confirm Deletion");
    if (confirmed) {
      // we need a bulk delete action or loop
      // for now, since we only have single deleteProduct, we'll loop
      let errors = 0;
      for (const id of selectedIds) {
        const res = await deleteProduct(id);
        if (!res.success) errors++;
      }
      setSelectedIds([]);
      if (errors > 0) {
        await showAlert(`Failed to delete ${errors} products`, t.common.error);
      }
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-black-soft p-4 border border-gold-dim rounded-2xl gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
          <input 
            type="text" 
            name="search" 
            defaultValue={searchQuery}
            placeholder="Search products..."
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
          <select 
            value={categoryQuery} 
            onChange={handleCategoryChange}
            className="bg-black-matte border border-gold-dim text-cream p-2 text-sm focus:outline-none w-32 md:w-auto rounded-2xl cursor-pointer hover:border-gold transition-colors"
          >
            <option value="all">{t.common.allCategories}</option>
            {initialCategories.map(cat => (
              <option key={`filter-${cat.slug}`} value={cat.slug}>{(cat.name as Record<string, string>)?.en || cat.slug}</option>
            ))}
          </select>
          <button 
            onClick={isAdding ? handleCancel : () => { setEditingItem(null); setIsAdding(true); }}
            className={isAdding ? "btn-admin-secondary whitespace-nowrap" : "btn-admin-primary whitespace-nowrap"}
          >
            {isAdding ? t.common.cancel : t.common.addProduct}
          </button>
        </div>
      </div>

      {isAdding && (
        <form key={editingItem?.id || 'new'} onSubmit={handleAddSubmit} onChange={() => setIsDirty(true)} className="bg-black-soft border border-gold-dim p-6 flex flex-col gap-4 rounded-2xl shadow-xl">
          <h3 className="text-gold text-lg mb-4">{editingItem ? t.common.editProduct : t.common.newProduct}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cream-dim">{t.common.slug} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.urlFriendlyIdentifier}</span></label>
              <input name="slug" defaultValue={editingItem?.slug || ''} className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" />
              {validationErrors.slug && <span className="text-red-500 text-xs mt-1">{validationErrors.slug}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cream-dim">{t.common.category} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.parentGroup}</span></label>
              <select name="category" defaultValue={editingItem?.category || (initialCategories[0]?.slug || 'dates')} className="bg-black-matte border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors cursor-pointer">
                {initialCategories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{(cat.name as Record<string, string>)?.en || cat.slug}</option>
                ))}
              </select>
              {validationErrors.category && <span className="text-red-500 text-xs mt-1">{validationErrors.category}</span>}
            </div>
            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`name${lang}`} className="flex flex-col gap-1">
                <label className="text-sm text-cream-dim">{t.common.name} ({lang}) <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.localizedTitle}</span></label>
                <input name={`name${lang}`} defaultValue={(editingItem?.name as Record<string, string> | undefined)?.[lang.toLowerCase()] || ''} className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
                {validationErrors[`name${lang}`] && <span className="text-red-500 text-xs mt-1">{validationErrors[`name${lang}`]}</span>}
              </div>
            ))}
            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`desc${lang}`} className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <label className="text-sm text-cream-dim">{t.common.description} ({lang}) <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.productDetails}</span></label>
                <textarea name={`desc${lang}`} defaultValue={(editingItem?.description as Record<string, string> | undefined)?.[lang.toLowerCase()] || ''} className="bg-transparent border border-gold-dim p-2 text-cream h-24 rounded-xl focus:border-gold outline-none transition-colors" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
                {validationErrors[`desc${lang}`] && <span className="text-red-500 text-xs mt-1">{validationErrors[`desc${lang}`]}</span>}
              </div>
            ))}
            
            <div className="flex flex-col gap-1 col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gold-dim/30">
              <h4 className="text-gold mb-2">SEO & Metadata</h4>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cream-dim">Meta Title (EN)</label>
              <input name="metaTitleEn" defaultValue={(editingItem?.meta_title as Record<string, string> | undefined)?.en || ''} className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cream-dim">OG Image URL</label>
              <input name="ogImageUrl" defaultValue={editingItem?.og_image_url || ''} placeholder="https://..." className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" />
              {validationErrors.ogImageUrl && <span className="text-red-500 text-xs mt-1">{validationErrors.ogImageUrl}</span>}
            </div>
            <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
              <label className="text-sm text-cream-dim">Meta Description (EN)</label>
              <textarea name="metaDescEn" defaultValue={(editingItem?.meta_description as Record<string, string> | undefined)?.en || ''} className="bg-transparent border border-gold-dim p-2 text-cream h-20 rounded-xl focus:border-gold outline-none transition-colors" />
            </div>
            
            <div className="flex flex-col col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gold-dim/30">
              <ImagePicker 
                defaultImageUrl={editingItem?.image_url} 
                recommendedText="(Recommended 4:5 ratio, Portrait)" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cream-dim">{t.common.packagingOptions} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.commaSeparated}</span></label>
              <input name="packaging_options" defaultValue={(editingItem?.packaging_options as string[] | undefined)?.join(', ') || ''} placeholder="e.g. 500g Box, 1kg Box" className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cream-dim">{t.common.sortOrder} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.lowerNumbersFirst}</span></label>
              <input type="number" name="sort_order" defaultValue={editingItem?.sort_order || 0} className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" />
            </div>
            <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
              <label className="text-sm text-cream-dim">{t.common.customQrScanLink} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.optionalUrlOverride}</span></label>
              <input name="scan_page_slug" defaultValue={editingItem?.scan_page_slug || ''} placeholder="Leave empty to use the default product page" className="bg-transparent border border-gold-dim p-2 text-cream rounded-xl focus:border-gold outline-none transition-colors" />
              <p className="text-xs text-cream-dim/70 mt-1">{t.common.qrDefaultNotice} https://castlecrops.com/en/products/[slug]</p>
            </div>
          </div>
          <button type="submit" className="btn-admin-primary mt-4">
            {editingItem ? t.common.updateProduct : t.common.saveProduct}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {initialProducts.length === 0 ? (
          <p className="text-cream-dim col-span-full text-center py-8 bg-black-soft border border-gold-dim/30 rounded-2xl">{t.common.noProducts}</p>
        ) : (
          initialProducts.map(product => (
            <ProductItem 
              key={product.id} 
              product={product} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onSelect={handleSelect}
              isSelected={selectedIds.includes(product.id)}
              t={t} 
            />
          ))
        )}
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
