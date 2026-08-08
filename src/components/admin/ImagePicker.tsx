'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getGalleryImages } from '../../utils/upload';
import { useDialog } from './CustomDialog';

type ImagePickerProps = {
  defaultImageUrl?: string | null;
  recommendedText?: string;
  inputName?: string;
};

type GalleryImage = {
  name: string;
  url: string;
  created_at: string | null;
};

export const ImagePicker = ({ defaultImageUrl, recommendedText, inputName = 'image_url' }: ImagePickerProps) => {
  const [activeTab, setActiveTab] = useState<'pc' | 'gallery'>('pc');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedGalleryUrl, setSelectedGalleryUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useDialog();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const maxSize = 1.5 * 1024 * 1024; // 1.5 MB
    if (file.size > maxSize) {
      await showAlert('Image size must be less than 1.5 MB.', 'Size Error');
      e.target.value = '';
    }
  };

  // If the user already has a default image, they might want to see it, 
  // but it's handled by a hidden input in the parent form or here.
  // Actually we can just output the hidden input for image_url based on selection.

  useEffect(() => {
    let mounted = true;
    const fetchGallery = async () => {
      setIsLoading(true);
      try {
        const images = await getGalleryImages();
        if (mounted) setGalleryImages(images);
      } catch (err) {
        console.error('Failed to load gallery', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (activeTab === 'gallery' && galleryImages.length === 0) {
      fetchGallery();
    }
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-2 border border-gold-dim/50 p-4 bg-black-matte rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-cream-dim font-serif-latin">
          Image <span className="text-gold">{recommendedText}</span>
        </label>
        
        <div className="flex bg-black-soft border border-gold-dim rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => {
              setActiveTab('pc');
              setSelectedGalleryUrl(null);
            }}
            className={`px-3 py-1 text-xs font-semibold transition-colors ${
              activeTab === 'pc' ? 'bg-gold text-black-matte' : 'text-cream-dim hover:text-cream'
            }`}
          >
            Upload PC
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1 text-xs font-semibold transition-colors ${
              activeTab === 'gallery' ? 'bg-gold text-black-matte' : 'text-cream-dim hover:text-cream'
            }`}
          >
            Gallery
          </button>
        </div>
      </div>

      {defaultImageUrl && !selectedGalleryUrl && activeTab === 'pc' && (
        <div className="mb-2 flex items-center gap-4 bg-black-soft p-2 border border-gold-dim/30 rounded-2xl">
          <Image src={defaultImageUrl} alt="Current" width={64} height={64} className="h-16 w-16 object-cover border border-gold-dim" />
          <span className="text-xs text-cream-dim">Current Image</span>
        </div>
      )}

      {/* Hidden input to preserve the current image URL or the newly selected gallery URL */}
      <input 
        type="hidden" 
        name={inputName} 
        value={selectedGalleryUrl || defaultImageUrl || ''} 
      />

      {activeTab === 'pc' && (
        <div>
          <input 
            type="file" 
            name="image_file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full bg-black-soft border border-gold-dim text-cream p-2 focus:outline-none focus:border-gold file:mr-4 file:py-2.5 file:px-6 file:border-0 file:rounded-xl file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-bright file:transition-all file:active:scale-95 file:cursor-pointer cursor-pointer rounded-2xl"
          />
          <p className="text-xs text-cream-dim/70 mt-1">Select a new file from your device. Specifications: Max 1.5 MB. Recommended formats: WebP, JPG, PNG.</p>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : galleryImages.length === 0 ? (
            <p className="text-xs text-cream-dim text-center py-4">No images found in the gallery.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 bg-black-soft border border-gold-dim/30 rounded-2xl">
              {galleryImages.map((img) => {
                const isSelected = selectedGalleryUrl === img.url || (!selectedGalleryUrl && defaultImageUrl === img.url);
                return (
                  <div 
                    key={img.name} 
                    onClick={() => setSelectedGalleryUrl(img.url)}
                    className={`relative cursor-pointer aspect-square border-2 transition-all ${
                      isSelected ? 'border-gold scale-95' : 'border-transparent hover:border-gold/50'
                    }`}
                  >
                    <Image 
                      src={img.url} 
                      alt={img.name} 
                      fill
                      sizes="150px"
                      className="object-cover" 
                      title={img.name}
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                        <div className="bg-gold text-black p-1 rounded-full shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-xs text-cream-dim/70 mt-1">Select an existing image to reuse it.</p>
        </div>
      )}
    </div>
  );
};
