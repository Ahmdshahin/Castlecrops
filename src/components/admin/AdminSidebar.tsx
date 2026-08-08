'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminT } from './AdminLangProvider';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderTree, 
  Box, 
  FileText, 
  Award, 
  MessageSquare, 
  Image as ImageIcon, 
  Map, 
  Settings, 
  Users,
  ChevronDown,
  History
} from 'lucide-react';

type SubmenuItem = {
  href: string;
  label: string;
};

type LinkItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  submenus?: SubmenuItem[];
};

export const AdminSidebar = ({ roles = [], isPinned = true }: { roles?: string[], isPinned?: boolean }) => {
  const pathname = usePathname();
  const { t, lang } = useAdminT();
  const isRtl = lang === 'ar';
  
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const links: LinkItem[] = [
    { href: '/admin', label: t.sidebar.dashboard, icon: LayoutDashboard, exact: true },
    { href: '/admin/categories', label: t.sidebar.categories, icon: FolderTree },
    { href: '/admin/products', label: t.sidebar.products, icon: Box },
    { href: '/admin/blog', label: t.sidebar.blog, icon: FileText },
    { href: '/admin/certifications', label: t.sidebar.certifications, icon: Award },
    { href: '/admin/rfq', label: t.sidebar.rfq, icon: MessageSquare },
    { href: '/admin/gallery', label: t.sidebar.gallery, icon: ImageIcon },
    { href: '/admin/farms-gallery', label: t.sidebar.farmsGallery, icon: Map },
    { href: '/admin/settings', label: t.sidebar.settings, icon: Settings },
    { href: '/admin/audit-logs', label: t.sidebar.auditLogs, icon: History },
    { href: '/admin/users', label: t.sidebar.users, icon: Users },
  ];

  return (
    <nav className="flex flex-col gap-2 w-full">
      {links.map((link) => {
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href);
        
        let requiredRole = link.href.split('/').pop();
        if (requiredRole === 'farms-gallery') requiredRole = 'farmsGallery';
        
        if (roles && !roles.includes('admin') && requiredRole !== 'admin') {
           if (!roles.includes(requiredRole as string) && requiredRole) return null;
        }

        const Icon = link.icon;
        const hasSubmenus = !!link.submenus && link.submenus.length > 0;
        const isMenuOpen = openMenu === link.href;

        return (
          <div key={link.href} className="relative group/navitem w-full">
            <Link 
              href={link.href}
              onClick={(e) => {
                if (hasSubmenus) {
                  e.preventDefault();
                  setOpenMenu(isMenuOpen ? null : link.href);
                }
              }}
              className={`flex items-center gap-3 py-2 text-sm transition-colors rounded-lg w-full ${isPinned ? 'px-4' : 'justify-center'} ${
                isActive 
                  ? 'bg-gold text-black-matte font-semibold' 
                  : 'text-cream-dim hover:text-gold hover:bg-black-matte'
              }`}
              aria-label={!isPinned ? link.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              
              <span 
                className={`whitespace-nowrap transition-all duration-300 flex-1 flex items-center justify-between ${
                  isPinned ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden hidden'
                }`}
              >
                {link.label}
                {hasSubmenus && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                )}
              </span>
            </Link>

            {/* Submenus (if any) */}
            {hasSubmenus && isMenuOpen && isPinned && (
              <div className="flex flex-col gap-1 mt-1 pl-12 pr-4 border-l-2 border-gold-dim/20 ml-6">
                {link.submenus && link.submenus.map(sub => (
                  <Link 
                    key={sub.href} 
                    href={sub.href}
                    className="text-sm text-cream-dim hover:text-gold py-1"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Tooltip or Floating Submenu when unpinned */}
            {!isPinned && (
              <div 
                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-full mr-2' : 'left-full ml-2'} 
                  bg-black-matte border border-gold-dim/20 shadow-lg rounded-md
                  opacity-0 group-hover/navitem:opacity-100 transition-opacity pointer-events-none z-50 overflow-hidden flex flex-col`}
              >
                <div className="px-3 py-2 text-cream text-xs font-semibold whitespace-nowrap bg-black-soft/50">
                  {link.label}
                </div>
                {hasSubmenus && (
                  <div className="flex flex-col text-xs text-cream-dim">
                    {link.submenus && link.submenus.map(sub => (
                      <span key={sub.href} className="px-3 py-1.5 hover:bg-gold hover:text-black-matte transition-colors">
                        {sub.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
