'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuickCreateFormProps {
  onSubmit: (data: { url: string; customAlias: string; expirationDate: string }) => void;
}

export default function QuickCreateForm({ onSubmit }: QuickCreateFormProps) {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [urlError, setUrlError] = useState('');
  const [aliasError, setAliasError] = useState('');

  const validateUrl = (value: string): boolean => {
    if (!value) {
      setUrlError('URL is required');
      return false;
    }
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(value)) {
      setUrlError('Please enter a valid URL');
      return false;
    }
    
    setUrlError('');
    return true;
  };

  const validateAlias = (value: string): boolean => {
    if (value && !/^[a-zA-Z0-9-_]+$/.test(value)) {
      setAliasError('Alias can only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    
    if (value && value.length < 3) {
      setAliasError('Alias must be at least 3 characters');
      return false;
    }
    
    setAliasError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isUrlValid = validateUrl(url);
    const isAliasValid = validateAlias(customAlias);
    
    if (isUrlValid && isAliasValid) {
      onSubmit({ url, customAlias, expirationDate });
      setUrl('');
      setCustomAlias('');
      setExpirationDate('');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="PlusCircleIcon" size={24} variant="solid" className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Quick Create Link</h2>
          <p className="text-sm text-muted-foreground">Shorten a new URL instantly</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
            Original URL <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) validateUrl(e.target.value);
              }}
              onBlur={(e) => validateUrl(e.target.value)}
              placeholder="https://example.com/your-long-url"
              className={`w-full px-4 py-3 pr-10 bg-background border ${
                urlError ? 'border-error' : 'border-input'
              } rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-250`}
            />
            <Icon 
              name="LinkIcon" 
              size={20} 
              variant="outline" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          {urlError && (
            <p className="mt-1 text-sm text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
              {urlError}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customAlias" className="block text-sm font-medium text-foreground mb-2">
              Custom Alias (Optional)
            </label>
            <input
              type="text"
              id="customAlias"
              value={customAlias}
              onChange={(e) => {
                setCustomAlias(e.target.value);
                if (aliasError) validateAlias(e.target.value);
              }}
              onBlur={(e) => validateAlias(e.target.value)}
              placeholder="my-custom-link"
              className={`w-full px-4 py-3 bg-background border ${
                aliasError ? 'border-error' : 'border-input'
              } rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-250`}
            />
            {aliasError && (
              <p className="mt-1 text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
                {aliasError}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-foreground mb-2">
              Expiration Date (Optional)
            </label>
            <input
              type="date"
              id="expirationDate"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-250"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-[0.97] flex items-center justify-center gap-2"
        >
          <Icon name="PlusCircleIcon" size={20} variant="solid" />
          Create Short Link
        </button>
      </form>
    </div>
  );
}