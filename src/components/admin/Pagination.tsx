import Link from 'next/link';

export const Pagination = ({ 
  currentPage, 
  totalCount, 
  pageSize, 
  searchQuery 
}: { 
  currentPage: number; 
  totalCount: number; 
  pageSize: number; 
  searchQuery?: string 
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (searchQuery) params.set('search', searchQuery);
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)} className="px-4 py-2 bg-black-matte border border-gold-dim rounded-xl text-cream hover:border-gold transition-colors">
          Previous
        </Link>
      ) : (
        <span className="px-4 py-2 bg-black-matte/50 border border-gold-dim/30 rounded-xl text-cream-dim cursor-not-allowed">
          Previous
        </span>
      )}
      
      <span className="text-cream text-sm">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)} className="px-4 py-2 bg-black-matte border border-gold-dim rounded-xl text-cream hover:border-gold transition-colors">
          Next
        </Link>
      ) : (
        <span className="px-4 py-2 bg-black-matte/50 border border-gold-dim/30 rounded-xl text-cream-dim cursor-not-allowed">
          Next
        </span>
      )}
    </div>
  );
};
