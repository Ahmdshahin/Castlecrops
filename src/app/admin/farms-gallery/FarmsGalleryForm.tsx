'use client';

import { useState } from 'react';
import { updateFarmsGallery, uploadFarmsGalleryImage } from './actions';
import { getGalleryImages } from '../../../utils/upload';
import { useAdminT } from '../../../components/admin/AdminLangProvider';
import Image from 'next/image';

export type GalleryItemType = 'image' | 'video';

export type GalleryItem = {
  id: string;
  type: GalleryItemType;
  url: string;
  isFeatured: boolean;
};

export const FarmsGalleryForm = ({ initialData }: { initialData: GalleryItem[] }) => {
  const [items, setItems] = useState<GalleryItem[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showGalleryFor, setShowGalleryFor] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<{name: string, url: string}[]>([]);
  const { t } = useAdminT();

  const loadGallery = async (id: string) => {
    setShowGalleryFor(id);
    if (galleryImages.length === 0) {
      const imgs = await getGalleryImages();
      setGalleryImages(imgs);
    }
  };

  const handleAddItem = (type: GalleryItemType) => {
    setItems([...items, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      url: '',
      isFeatured: false
    }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleChange = (id: string, field: keyof GalleryItem, value: string | boolean) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field === 'isFeatured' && value === true) {
          // If this is set to featured, unset others (only one featured item allowed)
          return { ...item, [field]: value };
        }
        return { ...item, [field]: value };
      } else {
        if (field === 'isFeatured' && value === true) {
          return { ...item, isFeatured: false };
        }
        return item;
      }
    }));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    const result = await updateFarmsGallery(JSON.stringify(items));
    
    if (result.success) {
      setMessage(t.common.settingsSaved || 'Saved');
    } else {
      setMessage(`${t.common.error}: ${result.error}`);
    }
    
    setIsSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="flex gap-4">
        <button type="button" onClick={() => handleAddItem('image')} className="btn-admin-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t.common.image}
        </button>
        <button type="button" onClick={() => handleAddItem('video')} className="btn-admin-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {t.common.video}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center border border-gold-dim border-dashed text-cream-dim rounded-2xl">
          {t.common.noImages || 'No items yet'}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-black-soft border border-gold-dim p-4 rounded-2xl flex items-start gap-4">
              <div className="flex flex-col gap-2 pt-2">
                <button type="button" onClick={() => moveItem(index, 'up')} disabled={index === 0} className="text-gold-dim hover:text-gold disabled:opacity-30">▲</button>
                <button type="button" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="text-gold-dim hover:text-gold disabled:opacity-30">▼</button>
              </div>
              
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gold-bright font-serif-latin font-bold">{item.type === 'image' ? t.common.image : t.common.video}</span>
                  <label className="flex items-center gap-2 text-sm text-cream cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={item.isFeatured} 
                      onChange={(e) => handleChange(item.id, 'isFeatured', e.target.checked)} 
                      className="accent-gold w-4 h-4"
                    />
                    {t.common.featuredItem}
                  </label>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-cream-dim">{item.type === 'video' ? t.common.videoUrl : t.common.image + ' URL (/images/... or uploaded URL)'}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={item.url}
                      onChange={(e) => handleChange(item.id, 'url', e.target.value)}
                      placeholder={item.type === 'video' ? 'https://www.youtube.com/embed/...' : '/images/farms/farm_scene.jpg'}
                      className="bg-black-matte border border-gold-dim p-2 flex-1 text-cream font-mono text-sm rounded-xl focus:border-gold outline-none"
                    />
                  </div>
                  
                  {item.type === 'image' && (
                    <div className="flex gap-2 mt-2">
                      <label className="cursor-pointer btn-admin-secondary text-xs px-3 py-1.5 h-full rounded-xl">
                        <span>Upload File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 1.5 * 1024 * 1024) {
                              alert('Image size must be less than 1.5 MB.');
                              return;
                            }
                            const formData = new FormData();
                            formData.append('file', file);
                            const res = await uploadFarmsGalleryImage(formData);
                            if (res.url) {
                              handleChange(item.id, 'url', res.url);
                            } else {
                              alert(res.error);
                            }
                          }}
                        />
                      </label>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (showGalleryFor === item.id) setShowGalleryFor(null);
                          else loadGallery(item.id);
                        }}
                        className="btn-admin-secondary text-xs px-3 py-1.5 h-full rounded-xl"
                      >
                        Select from Gallery
                      </button>
                    </div>
                  )}

                  {showGalleryFor === item.id && (
                    <div className="mt-2 p-2 bg-black-matte border border-gold-dim/50 rounded-xl max-h-48 overflow-y-auto grid grid-cols-4 gap-2">
                      {galleryImages.length === 0 ? (
                        <p className="col-span-4 text-xs text-center text-cream-dim py-2">Loading or no images...</p>
                      ) : (
                        galleryImages.map(img => (
                          <div 
                            key={img.name} 
                            onClick={() => {
                              handleChange(item.id, 'url', img.url);
                              setShowGalleryFor(null);
                            }}
                            className="cursor-pointer border border-transparent hover:border-gold aspect-square relative"
                          >
                            <Image src={img.url} alt={img.name} fill className="object-cover rounded-xl" loading="lazy" />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => handleRemoveItem(item.id)}
                className="btn-admin-action-delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4">
        <button type="submit" disabled={isSaving} className="btn-admin-primary">
          {isSaving ? t.common.saving || 'Saving...' : t.common.saveSettings || 'Save'}
        </button>
        {message && <span className={message.includes('Error') ? 'text-red-400' : 'text-green-400'}>{message}</span>}
      </div>
    </form>
  );
};
