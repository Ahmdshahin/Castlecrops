'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { supabase } from '../services/supabase';

import { Turnstile } from '@marsidev/react-turnstile';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export const RfqForm = () => {
  const t = useTranslations('contact.form');
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [categories, setCategories] = useState<{id: string, name: Record<string, string>}[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('id, name').order('sort_order');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => {
      const newSelection = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      if (newSelection.length > 0) clearError('product');
      return newSelection;
    });
  };

  const hasTurnstile = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (hasTurnstile && !turnstileToken) {
      setTurnstileError(true);
      return;
    }
    setTurnstileError(false);
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Validations
    const newErrors: Record<string, string> = {};
    
    // next-intl throws if key is missing; gracefully fallback
    const tSafe = (key: any, fallback: string) => {
      try { return t(key) || fallback; } catch { return fallback; }
    };
    
    if (!data.name || (data.name as string).trim().length < 2) {
      newErrors.name = tSafe('errName', 'Name must be at least 2 characters long');
    }
    
    if (!phone) {
      newErrors.phone = tSafe('errPhoneReq', 'Phone number is required');
    } else if (isValidPhoneNumber && !isValidPhoneNumber(phone)) {
      newErrors.phone = tSafe('errPhoneInv', 'Invalid phone number format');
    }
    
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email as string)) {
      newErrors.email = tSafe('errEmail', 'Please enter a valid email address');
    }
    
    if (selectedProducts.length === 0) {
      newErrors.product = tSafe('errProduct', 'Please select at least one product');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    setErrors({});
    
    const productNames = selectedProducts.map(id => {
      const cat = categories.find(c => c.id === id);
      return cat ? (cat.name[locale] || cat.name.en || id) : id;
    }).join(', ');

    const payload = { ...data, product: productNames, turnstileToken };
    
    console.log('Submitting Payload:', payload);
    
    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        setSuccess(true);
      } else {
        const errData = await response.json();
        console.error('Submission failed', errData);
        alert(errData.error || t('submissionFailed') || 'Failed to submit form');
      }
    } catch (error) {
      console.error(error);
      alert(t('submissionFailed') || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-mid/20 border border-gold p-6 text-center">
        <h3 className="text-xl text-gold font-serif-latin mb-2">{t('successAlert')}</h3>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-field !mb-0">
            <label htmlFor="name">{t('name')} *</label>
            <input required type="text" id="name" name="name" className={errors.name ? 'border-red-500 hover:border-red-500 focus:border-red-500' : ''} onChange={() => clearError('name')} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="form-field !mb-0">
            <label htmlFor="company">{t('company')}</label>
            <input type="text" id="company" name="company" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-field !mb-0">
            <label htmlFor="email">{t('email')}</label>
            <input type="email" id="email" name="email" className={errors.email ? 'border-red-500 hover:border-red-500 focus:border-red-500' : ''} onChange={() => clearError('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="form-field !mb-0">
            <label htmlFor="phone">{t('phone')} *</label>
            <div dir="ltr">
              <PhoneInput
                international
                defaultCountry="SA"
                value={phone}
                onChange={(val) => {
                  setPhone(val || '');
                  clearError('phone');
                }}
                className={`rfq-phone-input text-left ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {/* We need a hidden input since PhoneInput doesn't native pass name */}
            <input type="hidden" name="phone" value={phone || ''} required />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

      <div className="form-field relative">
        <label>{t('product')} *</label>
        <div 
          className={`bg-black-soft border text-cream px-[15px] py-[13px] w-full flex justify-between items-center cursor-pointer transition-colors text-[14.5px] ${errors.product ? 'border-red-500' : isDropdownOpen ? 'border-gold' : 'border-cream-line hover:border-gold'}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className={selectedProducts.length === 0 ? "text-cream/50" : "text-cream truncate pr-4"}>
            {selectedProducts.length === 0 
              ? t('productSelect') 
              : selectedProducts.map(id => {
                  const cat = categories.find(c => c.id === id);
                  return cat ? (cat.name[locale] || cat.name.en || id) : id;
                }).join(', ')}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" className={`transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
        
        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
            <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-black-soft border border-gold max-h-60 overflow-y-auto shadow-2xl">
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => toggleProduct(cat.id)}
                  className="!flex items-center justify-start gap-4 px-[15px] py-3.5 min-h-[48px] hover:bg-gold/10 cursor-pointer border-b border-cream-line/30 last:border-0 transition-colors m-0 group"
                >
                  <div className={`w-5 h-5 shrink-0 rounded-sm border flex items-center justify-center transition-colors duration-200 ${selectedProducts.includes(cat.id) ? 'bg-gold border-gold' : 'border-cream-line bg-black-soft group-hover:border-gold/50'}`}>
                    {selectedProducts.includes(cat.id) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <span className="text-cream text-[14.5px] leading-none m-0 p-0 select-none">{cat.name[locale] || cat.name.en}</span>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="p-3 text-cream-dim text-sm text-center">...</div>
              )}
            </div>
          </>
        )}
        {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="quantity">{t('quantity')}</label>
        <input type="text" id="quantity" name="quantity" placeholder={t('quantityPlaceholder')} />
      </div>

      <div className="form-field">
        <label htmlFor="message">{t('message')}</label>
        <textarea id="message" name="message" rows={4}></textarea>
      </div>

      {hasTurnstile && (
        <div className="form-field my-4">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => {
              setTurnstileToken(token);
              setTurnstileError(false);
            }}
            onError={() => setTurnstileError(true)}
            onExpire={() => setTurnstileToken(null)}
            options={{
              theme: 'auto',
            }}
          />
          {turnstileError && (
            <p className="text-red-500 text-sm mt-1">{t('turnstileError') || 'Please complete the security check.'}</p>
          )}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn btn-solid w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{isSubmitting ? '...' : t('submit')}</span>
      </button>
    </form>
  );
};
