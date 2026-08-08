'use client';

import { useState } from 'react';
import { updateSettings } from './actions';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useAdminT } from '../../../components/admin/AdminLangProvider';

import { AdminTranslation } from '../../../lib/admin-i18n';

const supportedLanguages = [
  { code: 'en', name: 'English (Default)', required: true },
  { code: 'ar', name: 'Arabic', required: false },
  { code: 'fr', name: 'French', required: false },
  { code: 'pl', name: 'Polish', required: false },
  { code: 'tr', name: 'Turkish', required: false },
];

export const DynamicFieldList = ({ name, label, initialValue, placeholder, t }: { name: string, label: React.ReactNode, initialValue: string, placeholder?: string, t: AdminTranslation }) => {
  const [items, setItems] = useState<string[]>(initialValue && initialValue.trim() !== '' ? initialValue.split('\n') : ['']);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-cream-dim">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            name={name}
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const newItems = [...items];
              newItems[index] = e.target.value;
              setItems(newItems);
            }}
            className="bg-transparent border border-gold-dim p-2 text-cream flex-1 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => {
              const newItems = [...items];
              newItems.splice(index, 1);
              if (newItems.length === 0) newItems.push('');
              setItems(newItems);
            }}
            className="border border-red-900 text-red-500 px-3 hover:bg-red-900/20 transition-colors"
          >
            -
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, ''])}
        className="self-start text-xs border border-gold-dim px-3 py-1 text-gold hover:bg-gold/10 transition-colors mt-1"
      >
        {t.common.addAnother}
      </button>
    </div>
  );
};

export const DynamicPhoneList = ({ name, label, initialValue, placeholder, t }: { name: string, label: React.ReactNode, initialValue: string, placeholder?: string, t: AdminTranslation }) => {
  const [items, setItems] = useState<string[]>(initialValue && initialValue.trim() !== '' ? initialValue.split('\n') : ['']);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-cream-dim">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <div className="bg-transparent border border-gold-dim p-2 flex-1 relative flex items-center">
            <PhoneInput
              international
              defaultCountry="EG"
              value={item ? item.replace(/[^\d+]/g, '') : ''}
              onChange={(val) => {
                const newItems = [...items];
                newItems[index] = val || '';
                setItems(newItems);
              }}
              className="w-full font-mono text-sm text-black"
              placeholder={placeholder}
            />
            <input type="hidden" name={name} value={item || ''} />
          </div>
          <button
            type="button"
            onClick={() => {
              const newItems = [...items];
              newItems.splice(index, 1);
              if (newItems.length === 0) newItems.push('');
              setItems(newItems);
            }}
            className="border border-red-900 text-red-500 px-3 py-2 hover:bg-red-900/20 transition-colors"
          >
            -
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, ''])}
        className="self-start text-xs border border-gold-dim px-3 py-1 text-gold hover:bg-gold/10 transition-colors mt-1"
      >
        {t.common.addAnother}
      </button>
    </div>
  );
};

const SettingPanel = ({ title, children, formType, t }: { title: string, children: React.ReactNode, formType?: string, t: AdminTranslation }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    const formData = new FormData(e.currentTarget);
    if (formType === 'languages') {
      supportedLanguages.forEach(lang => {
        const isChecked = formData.get(`lang_${lang.code}_enabled`) === 'on' || lang.required;
        formData.set(`lang_${lang.code}_enabled`, isChecked ? 'true' : 'false');
      });
    }

    const result = await updateSettings(formData);
    
    if (result.success) {
      setMessage(t.common.settingsSaved);
    } else {
      setMessage(`${t.common.error}: ${result.error}`);
    }
    
    setIsSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black-soft border border-gold-dim p-6 rounded-2xl flex flex-col h-full">
      <h2 className="text-xl text-gold font-serif-latin mb-6">{title}</h2>
      <div className="flex-1 mb-8 flex flex-col gap-4">
        {children}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gold-dim/20 mt-auto">
        {message && <span className={`text-sm ${message.includes(t.common.error) ? 'text-red-400' : 'text-green-400'}`}>{message}</span>}
        <button type="submit" disabled={isSaving} className="btn-admin-primary ml-auto">
          {isSaving ? t.common.saving : t.common.saveSettings}
        </button>
      </div>
    </form>
  );
};

export const SettingsForm = ({ initialSettings }: { initialSettings: Record<string, string> }) => {
  const { t } = useAdminT();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
      <SettingPanel title={t.common.contactInfo} t={t}>
        <DynamicFieldList 
          t={t}
          name="contact_email" 
          label={<>{t.common.emailAddresses} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.whereInquiriesSent}</span></>} 
          initialValue={initialSettings['contact_email'] || ''} 
          placeholder="e.g. sales@castlecrops.com"
        />
        <DynamicPhoneList 
          t={t}
          name="contact_phone" 
          label={<>{t.common.phoneNumbers} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.displayedOnContact}</span></>} 
          initialValue={initialSettings['contact_phone'] || ''} 
          placeholder="e.g. +20 123 456 789"
        />
        <DynamicFieldList 
          t={t}
          name="contact_address" 
          label={<>{t.common.physicalAddresses} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.companyHqLocations}</span></>} 
          initialValue={initialSettings['contact_address'] || ''} 
          placeholder="e.g. Cairo, Egypt"
        />
      </SettingPanel>

      <SettingPanel title={t.common.smtpConfig} t={t}>
        <p className="text-sm text-cream-dim mb-2">{t.common.smtpDesc}</p>
        <div className="flex flex-col gap-1 mb-6 border-b border-gold-dim/20 pb-6">
          <label className="text-sm text-cream-dim">RFQ Delivery Email Address <span className="text-sm text-cream-dim/70 ml-2 font-light">Where you receive RFQ alerts</span></label>
          <input name="rfq_receive_email" defaultValue={initialSettings['rfq_receive_email'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="e.g. personal@gmail.com (defaults to contact email if empty)" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cream-dim">{t.common.smtpHost} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.outgoingMailServer}</span></label>
            <input name="smtp_host" defaultValue={initialSettings['smtp_host'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="e.g. smtp.gmail.com" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cream-dim">{t.common.smtpPort} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.usually587}</span></label>
            <input name="smtp_port" type="number" defaultValue={initialSettings['smtp_port'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="e.g. 587 or 465" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cream-dim">{t.common.smtpUsername} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.loginEmail}</span></label>
            <input name="smtp_user" defaultValue={initialSettings['smtp_user'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="e.g. alerts@castlecrops.com" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cream-dim">{t.common.smtpPassword} <span className="text-sm text-cream-dim/70 ml-2 font-light">{t.common.secureToken}</span></label>
            <input name="smtp_pass" type="password" defaultValue={initialSettings['smtp_pass'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="••••••••" />
          </div>
        </div>
      </SettingPanel>

      <SettingPanel title={t.common.socialMediaLinks} t={t}>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cream-dim">Facebook URL</label>
          <input name="facebook_url" type="url" defaultValue={initialSettings['facebook_url'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="https://..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cream-dim">Instagram URL</label>
          <input name="instagram_url" type="url" defaultValue={initialSettings['instagram_url'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="https://..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cream-dim">LinkedIn URL</label>
          <input name="linkedin_url" type="url" defaultValue={initialSettings['linkedin_url'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="https://..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cream-dim">Twitter/X URL</label>
          <input name="twitter_url" type="url" defaultValue={initialSettings['twitter_url'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="https://..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cream-dim">TikTok URL</label>
          <input name="tiktok_url" type="url" defaultValue={initialSettings['tiktok_url'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="https://..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cream-dim">Threads URL</label>
          <input name="threads_url" type="url" defaultValue={initialSettings['threads_url'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="https://..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cream-dim">YouTube URL</label>
          <input name="youtube_url" type="url" defaultValue={initialSettings['youtube_url'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="https://..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-cream-dim">WhatsApp Link (wa.me/...)</label>
          <input name="whatsapp_url" defaultValue={initialSettings['whatsapp_url'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream" />
        </div>
      </SettingPanel>

      <SettingPanel title={t.common.locationGoogleMaps} t={t}>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm text-cream-dim">{t.common.googleMapsIframe}</label>
          <textarea name="google_maps_iframe" defaultValue={initialSettings['google_maps_iframe'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm flex-1 min-h-[200px]" placeholder="<iframe src=..." />
          <p className="text-xs text-cream-dim/50 mt-1">{t.common.googleMapsDesc}</p>
        </div>
      </SettingPanel>

      <SettingPanel title="Downloads & Assets" t={t}>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-cream-dim">Product Catalog PDF</label>
          <div className="flex flex-col gap-2">
            <input name="catalog_pdf_file" type="file" accept="application/pdf" className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" />
            <div className="text-xs text-cream-dim/50 text-center uppercase tracking-widest">- OR paste URL directly -</div>
            <input name="catalog_pdf_url" type="url" defaultValue={initialSettings['catalog_pdf_url'] || ''} className="bg-transparent border border-gold-dim p-2 text-cream font-mono text-sm" placeholder="https://..." />
          </div>
          <p className="text-xs text-cream-dim/50 mt-1">Upload a PDF file (max 15MB) or paste an external link. A download button will automatically appear on the Products page.</p>
        </div>
      </SettingPanel>

      <SettingPanel title={t.common.aboutPageVision} t={t}>
        <p className="text-sm text-cream-dim mb-2">{t.common.aboutPageVisionDesc}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`vision_title_${lang}`} className="flex flex-col gap-1">
                <label className="text-sm text-cream-dim">{t.common.titleHeading} ({lang})</label>
                <input name={`vision_title_${lang.toLowerCase()}`} defaultValue={initialSettings[`vision_title_${lang.toLowerCase()}`] || ''} className="bg-transparent border border-gold-dim p-2 text-cream" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
              </div>
            ))}
            {['En', 'Ar', 'Fr', 'Pl', 'Tr'].map(lang => (
              <div key={`vision_desc_${lang}`} className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <label className="text-sm text-cream-dim">{t.common.descriptionMainText} ({lang})</label>
                <textarea name={`vision_desc_${lang.toLowerCase()}`} defaultValue={initialSettings[`vision_desc_${lang.toLowerCase()}`] || ''} className="bg-transparent border border-gold-dim p-2 text-cream h-24" dir={lang === 'Ar' ? 'rtl' : 'ltr'} />
              </div>
            ))}
        </div>
      </SettingPanel>

      <SettingPanel title="Language Visibility" formType="languages" t={t}>
        <div className="bg-blue-900/20 border border-blue-500/30 p-4 mb-2 text-cream-dim text-sm">
          <strong>Technical Note:</strong> Adding completely new languages requires a code deployment for SEO and routing performance. However, you can toggle the visibility of the currently supported 5 languages below.
        </div>
        <div className="flex flex-col gap-4">
          {supportedLanguages.map(lang => {
            const settingKey = `lang_${lang.code}_enabled`;
            const isEnabled = initialSettings[settingKey] !== 'false';
            
            return (
              <div key={lang.code} className="flex items-center justify-between p-4 border border-gold-dim/30 bg-black">
                <div>
                  <h3 className="text-cream text-lg">{lang.name}</h3>
                  <p className="text-xs text-cream-dim uppercase tracking-widest mt-1">Locale: /{lang.code}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name={settingKey} 
                    defaultChecked={isEnabled}
                    disabled={lang.required}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-black-matte border border-gold-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-cream after:border-gold-dim after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  <span className="ms-3 text-sm font-medium text-cream-dim">
                    {lang.required ? '(Always On)' : 'Enabled'}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </SettingPanel>
    </div>
  );
};
