export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          slug: string
          category: string
          name: Json
          description: Json
          image_url: string | null
          packaging_options: Json
          is_featured: boolean
          sort_order: number
          qr_code_url: string | null
          scan_page_slug: string | null
          created_at: string
          updated_at: string
          meta_title: Json | null
          meta_description: Json | null
          og_image_url: string | null
        }
        Insert: {
          id?: string
          slug: string
          category: string
          name?: Json
          description?: Json
          image_url?: string | null
          packaging_options?: Json
          is_featured?: boolean
          sort_order?: number
          qr_code_url?: string | null
          scan_page_slug?: string | null
          created_at?: string
          updated_at?: string
          meta_title?: Json | null
          meta_description?: Json | null
          og_image_url?: string | null
        }
        Update: {
          id?: string
          slug?: string
          category?: string
          name?: Json
          description?: Json
          image_url?: string | null
          packaging_options?: Json
          is_featured?: boolean
          sort_order?: number
          qr_code_url?: string | null
          scan_page_slug?: string | null
          created_at?: string
          updated_at?: string
          meta_title?: Json | null
          meta_description?: Json | null
          og_image_url?: string | null
        }
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: Json
          excerpt: Json
          body: Json
          cover_image_url: string | null
          published_at: string | null
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          is_featured?: boolean
          meta_title: Json | null
          meta_description: Json | null
          og_image_url: string | null
        }
        Insert: {
          id?: string
          slug: string
          title?: Json
          excerpt?: Json
          body?: Json
          cover_image_url?: string | null
          published_at?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          is_featured?: boolean
          meta_title?: Json | null
          meta_description?: Json | null
          og_image_url?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: Json
          excerpt?: Json
          body?: Json
          cover_image_url?: string | null
          published_at?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          is_featured?: boolean
          meta_title?: Json | null
          meta_description?: Json | null
          og_image_url?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: Json
          description: Json
          image_url: string | null
          is_featured: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name?: Json
          description?: Json
          image_url?: string | null
          is_featured?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: Json
          description?: Json
          image_url?: string | null
          is_featured?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          name: Json
          image_url: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: Json
          image_url?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Json
          image_url?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      company_stats: {
        Row: {
          id: string
          founding_year: number
          standout_metric_value: string
          standout_metric_label: Json
          updated_at: string
        }
        Insert: {
          id?: string
          founding_year: number
          standout_metric_value: string
          standout_metric_label?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          founding_year?: number
          standout_metric_value?: string
          standout_metric_label?: Json
          updated_at?: string
        }
      }
      contact_info: {
        Row: {
          id: string
          branch_phones: Json
          official_email: string | null
          map_lat: number | null
          map_lng: number | null
          address: Json
          updated_at: string
        }
        Insert: {
          id?: string
          branch_phones?: Json
          official_email?: string | null
          map_lat?: number | null
          map_lng?: number | null
          address?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          branch_phones?: Json
          official_email?: string | null
          map_lat?: number | null
          map_lng?: number | null
          address?: Json
          updated_at?: string
        }
      }
      rfq_submissions: {
        Row: {
          id: string
          name: string
          company: string | null
          phone: string
          email: string | null
          product: string | null
          quantity: string | null
          message: string | null
          locale: string | null
          status: 'new' | 'contacted' | 'resolved'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          company?: string | null
          phone: string
          email?: string | null
          product?: string | null
          quantity?: string | null
          message?: string | null
          locale?: string | null
          status?: 'new' | 'contacted' | 'resolved'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string | null
          phone?: string
          email?: string | null
          product?: string | null
          quantity?: string | null
          message?: string | null
          locale?: string | null
          status?: 'new' | 'contacted' | 'resolved'
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          value: string | null
          updated_at: string
        }
        Insert: {
          id: string
          value?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          value?: string | null
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          platform: string
          url: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          url: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          url?: string
          updated_at?: string
        }
      }
    }
  }
}
