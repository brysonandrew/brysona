import type { FC, ReactNode } from 'react';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import type {
  TGenerateEmailResponse,
  TToastState,
  TToastType,
} from './types';
import type { TBusiness } from './business-search-panel';
import type { TSearchTown } from './timezone-timeline/types';
import { createCopy } from './copy-helpers';
import { generateEmail } from './generate-email';
import { createKeyboardShortcutHandler } from './keyboard-shortcuts';

type TGenerateButtonProps = {
  handleGenerate: () => void;
  isLoading: boolean;
  disabled?: boolean;
};

type TTownSearchResults = {
  towns: TSearchTown[];
  isLoading: boolean;
  statusMessage: string | null;
};

type TBusinessSearchResults = {
  businesses: TBusiness[];
  isLoading: boolean;
  statusMessage: string | null;
};

type TOutreacherContextValue = {
  // URL Form state
  urls: string[];
  setUrls: (urls: string[] | ((prev: string[]) => string[])) => void;
  setUrl: (url: string) => void; // Helper to add a single URL to the array
  loading: boolean;
  error: string | null;
  result: TGenerateEmailResponse | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setUrlInputRef: (ref: React.RefObject<HTMLInputElement>) => void;
  scrollToUrlInput: () => void;

  // Email preview state
  emailPreviewSubject: string;
  emailPreviewBody: string;
  setEmailPreviewSubject: (value: string) => void;
  setEmailPreviewBody: (value: string) => void;
  primaryEmail: string;
  mailtoHref: string;

  // Toast state
  toast: TToastState;
  showToast: (message: string, type?: TToastType, via?: string) => void;

  // Copy function
  copy: ReturnType<typeof createCopy>;

  // Business finder state
  businessFinderLocation: string;
  setBusinessFinderLocation: (location: string) => void;
  businessIndustry: string;
  setBusinessIndustry: (industry: string) => void;
  businessLocations: string[];
  setBusinessLocations: (locations: string[] | ((prev: string[]) => string[])) => void;
  businessGenerateButtonProps: TGenerateButtonProps | null;
  businessSearchResults: TBusinessSearchResults | null;
  businessLastQuerySummary: string | null;
  businessError: string | null;
  handleBusinessSearch: (industry?: string, locations?: string[]) => Promise<void>;

  // Timezone timeline state
  selectedTimezones: Set<number>;
  setSelectedTimezones: (timezones: Set<number> | ((prev: Set<number>) => Set<number>)) => void;
  timezoneGenerateButtonProps: TGenerateButtonProps | null;
  townSearchResults: TTownSearchResults | null;
  setTownSearchResults: (results: TTownSearchResults | null) => void;
  setTimezoneGenerateButtonProps: (props: TGenerateButtonProps | null) => void;
};

const OutreacherContext = createContext<
  TOutreacherContextValue | undefined
>(undefined);

export const useOutreacher = () => {
  const context = useContext(OutreacherContext);
  if (!context) {
    throw new Error('useOutreacher must be used within OutreacherProvider');
  }
  return context;
};

type TOutreacherProviderProps = {
  children: ReactNode;
};

export const OutreacherProvider: FC<TOutreacherProviderProps> = ({
  children,
}) => {
  // URL Form state
  const [urls, setUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] =
    useState<TGenerateEmailResponse | null>(null);

  // Email preview state
  const [emailPreviewSubject, setEmailPreviewSubject] =
    useState<string>('');
  const [emailPreviewBody, setEmailPreviewBody] = useState<string>('');

  // Toast state
  const [toast, setToast] = useState<TToastState>(null);

  // Business finder state
  const [businessFinderLocation, setBusinessFinderLocation] =
    useState<string>('');
  const [businessIndustry, setBusinessIndustry] = useState<string>(
    'web developer',
  );
  const [businessLocations, setBusinessLocations] = useState<string[]>([
    '',
  ]);
  const [businessGenerateButtonProps, setBusinessGenerateButtonProps] =
    useState<TGenerateButtonProps | null>(null);
  const [businessSearchResults, setBusinessSearchResults] =
    useState<TBusinessSearchResults | null>(null);
  const [businessLastQuerySummary, setBusinessLastQuerySummary] =
    useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(
    null);
  const [businessLoading, setBusinessLoading] = useState(false);

  // Timezone timeline state
  const [selectedTimezones, setSelectedTimezones] = useState<
    Set<number>
  >(new Set());
  const [timezoneGenerateButtonProps, setTimezoneGenerateButtonProps] =
    useState<TGenerateButtonProps | null>(null);
  const [townSearchResults, setTownSearchResultsState] =
    useState<TTownSearchResults | null>(null);
  const [townSearchLoading, setTownSearchLoading] = useState(false);

  // URL input ref for scrolling
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  const setUrlInputRef = useCallback((ref: React.RefObject<HTMLInputElement>) => {
    urlInputRef.current = ref.current;
  }, []);

  const scrollToUrlInput = useCallback(() => {
    if (urlInputRef.current) {
      urlInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      // Optionally focus the input after scrolling
      setTimeout(() => {
        urlInputRef.current?.focus();
      }, 300);
    }
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: TToastType = 'info',
      via?: string,
    ) => {
      setToast({ message, type, via });
      setTimeout(() => setToast(null), 1800);
    },
    [],
  );

  // Helper function to add a single URL to the URLs array
  const setUrl = useCallback((url: string) => {
    if (!url.trim()) return;
    setUrls((prev) => {
      // Don't add duplicates
      if (prev.includes(url.trim())) {
        showToast('URL already added', 'info', 'setUrl');
        return prev;
      }
      // If the first URL is empty, replace it; otherwise append
      if (prev.length === 1 && !prev[0].trim()) {
        return [url.trim()];
      }
      showToast('URL added', 'info', 'setUrl');
      return [...prev, url.trim()];
    });
  }, [setUrls, showToast]);

  const copy = useMemo(() => createCopy(showToast), [showToast]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setResult(null);

      const validUrls = urls.filter((url) => url.trim());
      if (validUrls.length === 0) {
        setError('Please enter at least one website URL.');
        return;
      }

      setLoading(true);

      try {
        // For now, use the first URL. In the future, this could be extended to handle multiple URLs
        const data = await generateEmail(validUrls[0]);
        setResult(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong',
        );
      } finally {
        setLoading(false);
      }
    },
    [urls],
  );

  // Sync preview subject/body when a new result arrives
  useEffect(() => {
    if (result) {
      setEmailPreviewSubject(result.subject ?? '');
      setEmailPreviewBody(result.body ?? '');
    } else {
      setEmailPreviewSubject('');
      setEmailPreviewBody('');
    }
  }, [result]);

  // Pick primary email from contactEmails, ignore .webp etc.
  const primaryEmail = useMemo(
    () =>
      result?.contactEmails?.find((value) => value.includes('@')) ??
      '',
    [result],
  );

  const mailtoAddress = primaryEmail || 'hello@agency.com';

  const mailtoHref = useMemo(
    () =>
      mailtoAddress || emailPreviewSubject || emailPreviewBody
        ? `mailto:${encodeURIComponent(
            mailtoAddress,
          )}?subject=${encodeURIComponent(
            emailPreviewSubject || '',
          )}&body=${encodeURIComponent(emailPreviewBody || '')}`
        : '',
    [mailtoAddress, emailPreviewSubject, emailPreviewBody],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = createKeyboardShortcutHandler({
      url: urls[0] || '',
      result,
      copy,
    });

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [urls, result, copy]);

  // Update business locations when external location changes
  useEffect(() => {
    if (businessFinderLocation && !businessLocations.includes(businessFinderLocation)) {
      setBusinessLocations((prev) => {
        // If first location is empty, replace it; otherwise add
        if (prev.length === 1 && !prev[0].trim()) {
          return [businessFinderLocation];
        }
        return [...prev, businessFinderLocation];
      });
    }
  }, [businessFinderLocation, businessLocations]);

  const handleBusinessSearch = useCallback(async (industryOverride?: string, locationsOverride?: string[]) => {
    setBusinessError(null);

    const trimmedIndustry = (industryOverride || businessIndustry).trim();
    const locationsToUse = locationsOverride || businessLocations;
    const validLocations = locationsToUse.filter((loc) => loc.trim());

    if (!trimmedIndustry || validLocations.length === 0) {
      setBusinessError(
        'Please enter both an industry and at least one location.',
      );
      setBusinessSearchResults({
        businesses: [],
        isLoading: false,
        statusMessage:
          'Please enter both an industry and at least one location.',
      });
      return;
    }

    setBusinessLoading(true);
    setBusinessSearchResults({
      businesses: [],
      isLoading: true,
      statusMessage: 'Searching businesses…',
    });

    try {
      // Search for all locations and combine results
      const allResults: TBusiness[] = [];
      
      for (const location of validLocations) {
        const response = await fetch(
          'http://localhost:4000/api/businesses/search',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              businessType: trimmedIndustry,
              location: location.trim(),
              limit: 30,
            }),
          },
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Request failed with status ${response.status}: ${text}`,
          );
        }

        const data = await response.json();
        const results: TBusiness[] = data.businesses ?? [];
        allResults.push(...results);
      }

      // Remove duplicates based on business ID
      const uniqueResults = Array.from(
        new Map(allResults.map((b) => [b.id, b])).values()
      );

      const locationSummary = validLocations.length === 1
        ? validLocations[0]
        : `${validLocations.length} locations`;

      setBusinessLastQuerySummary(
        `${trimmedIndustry} in ${locationSummary} (${uniqueResults.length} found)`,
      );

      setBusinessSearchResults({
        businesses: uniqueResults,
        isLoading: false,
        statusMessage: null,
      });
    } catch (err: any) {
      console.error('Business search failed:', err);
      const errorMessage =
        err?.message ||
        'Something went wrong while searching for businesses.';
      setBusinessError(errorMessage);

      setBusinessSearchResults({
        businesses: [],
        isLoading: false,
        statusMessage: errorMessage,
      });
    } finally {
      setBusinessLoading(false);
    }
  }, [businessIndustry, businessLocations]);
  
  // Also update context state if overrides were provided
  const handleBusinessSearchWithState = useCallback(async (industry?: string, locations?: string[]) => {
    if (industry) setBusinessIndustry(industry);
    if (locations) setBusinessLocations(locations);
    await handleBusinessSearch(industry, locations);
  }, [handleBusinessSearch, setBusinessIndustry, setBusinessLocations]);

  // Expose business generate button props
  useEffect(() => {
    const trimmedIndustry = businessIndustry.trim();
    const validLocations = businessLocations.filter((loc) => loc.trim());
    const isDisabled = !trimmedIndustry || validLocations.length === 0;

    setBusinessGenerateButtonProps({
      handleGenerate: () => handleBusinessSearchWithState(),
      isLoading: businessLoading,
      disabled: isDisabled,
    });
  }, [
    businessIndustry,
    businessLocations,
    handleBusinessSearchWithState,
    businessLoading,
  ]);

  const handleTownSearch = useCallback(async () => {
    // This will be called from TimezoneTimelineSearch component
    // The actual implementation stays in that component
  }, []);

  // Expose setters for town search
  const setTownSearchResults = useCallback(
    (results: TTownSearchResults | null) => {
      setTownSearchResultsState(results);
    },
    [],
  );

  const setTimezoneGenerateButtonPropsContext = useCallback(
    (props: TGenerateButtonProps | null) => {
      setTimezoneGenerateButtonProps(props);
    },
    [],
  );

  const value: TOutreacherContextValue = {
    // URL Form state
    urls,
    setUrls,
    setUrl,
    loading,
    error,
    result,
    handleSubmit,
    setUrlInputRef,
    scrollToUrlInput,

    // Email preview state
    emailPreviewSubject,
    emailPreviewBody,
    setEmailPreviewSubject,
    setEmailPreviewBody,
    primaryEmail,
    mailtoHref,

    // Toast state
    toast,
    showToast,

    // Copy function
    copy,

    // Business finder state
    businessFinderLocation,
    setBusinessFinderLocation,
    businessIndustry,
    setBusinessIndustry,
    businessLocations,
    setBusinessLocations,
    businessGenerateButtonProps,
    businessSearchResults,
    businessLastQuerySummary,
    businessError,
    handleBusinessSearch: handleBusinessSearchWithState,

    // Timezone timeline state
    selectedTimezones,
    setSelectedTimezones,
    timezoneGenerateButtonProps,
    townSearchResults,
    setTownSearchResults,
    setTimezoneGenerateButtonProps: setTimezoneGenerateButtonPropsContext,
  };

  return (
    <OutreacherContext.Provider value={value}>
      {children}
    </OutreacherContext.Provider>
  );
};
