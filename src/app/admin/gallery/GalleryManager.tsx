'use client';

import { useState, useEffect } from 'react';
import { uploadGalleryImage, deleteGalleryImage } from './actions';
import { useRouter } from 'next/navigation';
import { useDialog } from '../../../components/admin/CustomDialog';
import { useAdminT } from '../../../components/admin/AdminLangProvider';
import Image from 'next/image';

export type GalleryImage = {
  name: string;
  url: string;
  created_at: string | null;
};

export const GalleryManager = ({ initialImages }: { initialImages: GalleryImage[] }) => {
  const [images, setImages] = useState(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { showAlert, showConfirm } = useDialog();
  const { t } = useAdminT();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImages(initialImages);
  }, [initialImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const maxSize = 1.5 * 1024 * 1024; // 1.5 MB
    if (file.size > maxSize) {
      await showAlert(t.common.imageSizeError, t.common.sizeError);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image_file', file);
    
    const result = await uploadGalleryImage(formData);
    if (result.success) {
      router.refresh();
    } else {
      await showAlert(`${t.common.uploadFailed}${result.error}`, t.common.error);
    }
    setIsUploading(false);
  };

  const handleDelete = async (filename: string, url: string) => {
    const confirmed = await showConfirm(t.common.confirmDeleteImage, t.common.confirmDeletion);
    if (!confirmed) return;
    
    const result = await deleteGalleryImage(filename, url);
    if (result.success) {
      setImages(images.filter(img => img.name !== filename));
    } else if (result.inUse) {
      await showAlert(`${result.message}\n\nUsed in:\n${result.usages?.join('\n')}`, t.common.cannotDeleteImage);
    } else {
      await showAlert(`${t.common.deleteFailed}${result.message}`, t.common.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-black-soft border border-gold-dim p-6 flex flex-col gap-4 rounded-2xl">
        <h2 className="text-xl text-gold font-serif-latin">{t.common.uploadNewImage}</h2>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="bg-black-soft border border-gold-dim text-cream p-2 focus:outline-none focus:border-gold file:mr-4 file:py-2.5 file:px-6 file:border-0 file:rounded-xl file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-bright file:transition-all file:active:scale-95 file:cursor-pointer cursor-pointer rounded-2xl"
          />
          {isUploading && <span className="text-cream-dim text-sm">{t.common.uploading}</span>}
        </div>
        <p className="text-sm text-cream-dim/70">
          {t.common.imageSpecifications}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map(img => (
          <div key={img.name} className="relative group border border-gold-dim/30 bg-black-soft aspect-square overflow-hidden rounded-2xl">
            {img.name.toLowerCase().endsWith('.pdf') ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:opacity-75 transition-opacity text-gold">
                <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v6a1 1 0 001 1h6M9 13h6M9 17h6" /></svg>
                <span className="font-bold text-lg tracking-widest">PDF</span>
              </div>
            ) : (
              <Image 
                src={img.url} 
                alt={img.name} 
                fill
                sizes="250px"
                className="object-cover group-hover:opacity-75 transition-opacity" 
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
              <div className="flex justify-end">
                <button 
                  onClick={() => handleDelete(img.name, img.url)}
                  className="bg-red-600/80 hover:bg-red-500 text-white p-2 rounded-full shadow-lg"
                  title={t.common.deleteImage}
                  aria-label={t.common.deleteImage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-cream-dim truncate break-all bg-black/80 p-1 rounded-2xl">
                {img.name}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {images.length === 0 && (
        <div className="p-8 text-center border border-gold-dim border-dashed text-cream-dim">
          {t.common.noImages}
        </div>
      )}
    </div>
  );
};
