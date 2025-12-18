import { LeadPanel } from '@pages/_dev/outreacher/lead-panel';
import { FormEvent, FC, useRef, useEffect, useCallback, useState } from 'react';
import { useOutreacher } from './context';

type UrlInputProps = {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  normalizedUrl?: string;
  onCopy: (text: string, label: string) => void;
};

const UrlInput: FC<UrlInputProps> = ({
  index,
  value,
  onChange,
  onRemove,
  canRemove,
  normalizedUrl,
  onCopy,
}) => {
  const showRemoveButton = value.trim().length > 0;
  const displayUrl = normalizedUrl || value;

  return (
    <div className="relative flex items-center gap-2">
      <input
        type="url"
        id={`url-input-${index}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example-agency.com"
        className="h-9 flex-1 rounded-xl border border-white-02 bg-black-2 px-3.5 py-2.5 pr-20 text-sm text-white-9 placeholder:text-white-06 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary-06"
      />
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {displayUrl && (
          <button
            type="button"
            onClick={() => onCopy(displayUrl, 'URL')}
            className="rounded-lg border border-white-02 bg-black-2 px-2 py-1 text-[11px] font-medium text-white-09 hover:bg-black-3 transition-colors"
          >
            Copy
          </button>
        )}
        {showRemoveButton && (
          <button
            type="button"
            onClick={() => {
              if (canRemove) {
                onRemove();
              } else {
                onChange('');
              }
            }}
            className="flex items-center justify-center w-5 h-5 rounded text-white-06 hover:text-white-09 hover:bg-black-3 transition-colors"
            title={canRemove ? 'Remove URL' : 'Clear URL'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export const UrlForm: FC = () => {
  const {
    urls,
    setUrls,
    loading,
    error,
    result,
    handleSubmit,
    copy,
    setUrlInputRef,
  } = useOutreacher();
  
  const normalizedUrl = result?.normalizedUrl;
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [localUrls, setLocalUrls] = useState<string[]>(
    urls.length > 0 ? urls : ['']
  );

  useEffect(() => {
    if (setUrlInputRef) {
      setUrlInputRef(urlInputRef);
    }
  }, [setUrlInputRef]);

  // Sync local URLs with context
  useEffect(() => {
    if (urls.length > 0 && JSON.stringify(urls) !== JSON.stringify(localUrls)) {
      setLocalUrls(urls);
    }
  }, [urls]);

  const handleUrlChange = useCallback((index: number, value: string) => {
    setLocalUrls((prev) => {
      const newUrls = [...prev];
      newUrls[index] = value;
      return newUrls;
    });
    setUrls((prev) => {
      const newUrls = [...prev];
      newUrls[index] = value;
      return newUrls;
    });
  }, [setUrls]);

  const handleUrlRemove = useCallback((index: number) => {
    setLocalUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      return newUrls.length === 0 ? [''] : newUrls;
    });
    setUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      return newUrls.length === 0 ? [''] : newUrls;
    });
  }, [setUrls]);

  const handleAddUrl = useCallback(() => {
    setLocalUrls((prev) => [...prev, '']);
    setUrls((prev) => [...prev, '']);
  }, [setUrls]);

  return (
    <div className="rounded-2xl border border-white-02 bg-dark-07 shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-4 md:p-6 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        {/* <div className="inline-flex items-center gap-2 rounded-full border border-white-02 bg-black-2 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white-06">
          <span className="h-1.5 w-1.5 rounded-full bg-plus shadow-[0_0_0_4px_rgba(74,222,128,0.35)]" />
          Outreacher • Email generator
        </div> */}

        <h2 className="text-white-09 text-sm font-semibold">
          Lead Qualifier and Email Generator{' '}
        </h2>
        <p className="text-sm text-white-07">
          Paste an agency URL. Get a tailored subject, body,
          lead score, insights, and follow-ups.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="url-input-0" className="text-xs font-medium uppercase tracking-[0.16em] text-white-06">
              Agency / studio website URL{localUrls.length > 1 ? 's' : ''}
            </label>
            <button
              type="button"
              onClick={handleAddUrl}
              className="text-[11px] text-primary hover:text-primary-08 transition-colors"
            >
              + Add URL
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {localUrls.map((url, index) => (
              <UrlInput
                key={index}
                index={index}
                value={url}
                onChange={(value) => handleUrlChange(index, value)}
                onRemove={() => handleUrlRemove(index)}
                canRemove={localUrls.length > 1}
                normalizedUrl={index === 0 ? normalizedUrl : undefined}
                onCopy={copy}
              />
            ))}
          </div>

          {normalizedUrl && localUrls[0] && (
            <p className="text-xs text-white-06">
              Normalized URL:{' '}
              <a
                href={normalizedUrl}
                target="_blank"
                className="font-mono underline text-primary hover:text-primary-08"
                rel="noreferrer"
              >
                {normalizedUrl}
              </a>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-primary-08 disabled:opacity-60 disabled:cursor-default"
          >
            {loading
              ? 'Generating…'
              : 'Generate email & insights'}
          </button>

          <p className="text-xs text-white-06 hidden md:block">
            Quick copy:{' '}
            <span className="font-mono">⌘1–⌘4</span>
          </p>
        </div>
      </form>

      {error && (
        <div className="rounded-xl border border-red/40 bg-red/10 px-3.5 py-2.5 text-sm text-white">
          {error}
        </div>
      )}

      {result && <LeadPanel data={result} />}
    </div>
  );
};
