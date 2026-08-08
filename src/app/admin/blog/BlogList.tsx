'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { createBlogPost, deleteBlogPost, updateBlogPost } from './actions';
import { Database } from '../../../types/supabase';
import { ImagePicker } from '../../../components/admin/ImagePicker';
import { useRouter } from 'next/navigation';
import { useDialog } from '../../../components/admin/CustomDialog';
import { useAdminT } from '../../../components/admin/AdminLangProvider';
import { blogSchema } from '../../../lib/validations';

type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];

export const BlogList = ({ initialPosts }: { initialPosts: BlogPostRow[] }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPostRow | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { showAlert, showConfirm } = useDialog();
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(t.common.confirmDeletePost, t.common.confirmDeletion);
    if (confirmed) {
      const result = await deleteBlogPost(id);
      if (result.success) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        await showAlert(`${t.common.deleteFailed}${result.error}`, t.common.error);
      }
    }
  };

  const handleEdit = (post: BlogPostRow) => {
    setEditingItem(post);
    setIsAdding(true);
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
    const parseResult = blogSchema.safeParse(formValues);
    
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
      ? await updateBlogPost(editingItem.id, formData)
      : await createBlogPost(formData);
      
    if (result.success) {
      setIsAdding(false);
      setEditingItem(null);
      setIsDirty(false);
      setValidationErrors({});
      router.refresh();
    } else {
      await showAlert(`${t.common.error}: ${result.error}`, t.common.error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center bg-black-soft p-4 border border-gold-dim rounded-2xl">
        <h2 className="text-xl text-cream font-serif-latin">{t.common.managePosts}</h2>
        <button 
          onClick={isAdding ? handleCancel : () => { setEditingItem(null); setIsAdding(true); }}
          className={isAdding ? "btn-admin-secondary whitespace-nowrap" : "btn-admin-primary whitespace-nowrap"}
        >
          {isAdding ? t.common.cancel : t.common.newPost}
        </button>
      </div>

      {isAdding && (
        <form key={editingItem?.id || 'new'} onSubmit={handleAddSubmit} onChange={() => setIsDirty(true)} className="bg-black-soft border border-gold-dim p-6 flex flex-col gap-4 rounded-2xl">
          <h3 className="text-gold text-lg mb-4">{editingItem ? t.common.editBlogPost : t.common.newBlogPost}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cream-dim">{t.common.slug} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.urlFriendlyIdentifier}</span></label>
              <input name="slug" defaultValue={editingItem?.slug || ''} className="bg-transparent border border-gold-dim p-2 text-cream" />
              {validationErrors.slug && <span className="text-red-500 text-xs mt-1">{validationErrors.slug}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-cream-dim">{t.common.status} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.visibilityState}</span></label>
              <select required name="status" defaultValue={editingItem?.status || 'draft'} className="bg-black-matte border border-gold-dim p-2 text-cream rounded-2xl">
                <option value="draft">{t.common.draft}</option>
                <option value="published">{t.common.published}</option>
                <option value="archived">{t.common.archived}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-cream-dim">
                <input 
                  type="checkbox" 
                  name="is_featured" 
                  defaultChecked={editingItem?.is_featured || false}
                  className="w-4 h-4 accent-gold bg-black-matte border-gold-dim rounded-2xl"
                />
                {t.common.featureOnHomepage} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.showInMainNews}</span>
              </label>
            </div>
            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`title${lang}`} className="flex flex-col gap-1">
                <label className="text-sm text-cream-dim">{t.common.title} ({lang}) <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.headline}</span></label>
                <input name={`title${lang}`} defaultValue={(editingItem?.title as Record<string, string> | undefined)?.[lang.toLowerCase()] || ''} className="bg-transparent border border-gold-dim p-2 text-cream" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
                {validationErrors[`title${lang}`] && <span className="text-red-500 text-xs mt-1">{validationErrors[`title${lang}`]}</span>}
              </div>
            ))}
            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`excerpt${lang}`} className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <label className="text-sm text-cream-dim">{t.common.excerpt} ({lang}) <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.shortPreviewSummary}</span></label>
                <textarea required name={`excerpt${lang}`} defaultValue={(editingItem?.excerpt as Record<string, string> | undefined)?.[lang.toLowerCase()] || ''} className="bg-transparent border border-gold-dim p-2 text-cream h-24" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
              </div>
            ))}
            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`body${lang}`} className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <label className="text-sm text-cream-dim">{t.common.body} ({lang}) <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.fullArticleContent}</span></label>
                <textarea name={`body${lang}`} defaultValue={(editingItem?.body as Record<string, string> | undefined)?.[lang.toLowerCase()] || ''} className="bg-transparent border border-gold-dim p-2 text-cream h-48" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
                {validationErrors[`body${lang}`] && <span className="text-red-500 text-xs mt-1">{validationErrors[`body${lang}`]}</span>}
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

            <div className="flex flex-col gap-1 col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gold-dim/30">
              <ImagePicker 
                inputName="cover_image_url"
                defaultImageUrl={editingItem?.cover_image_url} 
                recommendedText="(Recommended 16:9 ratio, Landscape)" 
              />
            </div>
          </div>
          <button type="submit" className="btn-admin-primary mt-4 w-full md:w-auto">
            {editingItem ? t.common.updatePost : t.common.savePost}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="text-cream-dim text-center py-8">{t.common.noPosts}</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="border border-gold-dim p-4 bg-black-matte rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-gold text-lg font-serif-latin">{(post.title as Record<string, string>)?.en || 'Untitled'}</h3>
                <span className={`text-xs px-2 py-1 uppercase tracking-wider ${post.status === 'published' ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                  {post.status}
                </span>
              </div>
              <p className="text-sm text-cream-dim mb-4">{(post.excerpt as Record<string, string>)?.en}</p>
              <div className="flex gap-4 border-t border-gold-dim/50 pt-4 text-sm">
                <button onClick={() => handleEdit(post)} className="btn-admin-action-edit">{t.common.edit}</button>
                <button onClick={() => handleDelete(post.id)} className="btn-admin-action-delete">{t.common.delete}</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
