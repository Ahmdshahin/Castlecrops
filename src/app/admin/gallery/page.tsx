import { getGalleryImages } from '../../../utils/upload';
import { GalleryManager } from './GalleryManager';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div>
      <h1 className="text-3xl font-serif-latin text-gold-bright mb-8">Media Gallery</h1>
      <GalleryManager initialImages={images} />
    </div>
  );
}
